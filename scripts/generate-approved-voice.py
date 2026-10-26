"""Stage the complete approved Adri voice. Does not switch live audio routes.

Resume state and reference metadata are private. A separate finalization step
connects the library only after all catalog entries have passed verification.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--reference-config", required=True)
parser.add_argument("--batch-size", type=int, default=4)
parser.add_argument("--threads", type=int, default=4)
parser.add_argument("--limit", type=int, help="Generate at most this many new unique texts")
parser.add_argument("--only-keys", help="Comma-separated keys for targeted retries")
parser.add_argument("--seed-offset", type=int, default=0)
parser.add_argument("--seed", type=int, help="Use an explicit sampling seed for targeted retries")
args = parser.parse_args()
if not 1 <= args.batch_size <= 8:
    raise ValueError("Batch size must be between one and eight")
os.environ.setdefault("HF_HOME", str(ROOT / ".voice-cache" / "huggingface"))
os.environ.setdefault("NUMBA_CACHE_DIR", str(ROOT / ".voice-cache" / "numba"))
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
from math import gcd
import torch
import imageio_ffmpeg
from qwen_tts import Qwen3TTSModel

torch.set_num_threads(args.threads)
torch.set_num_interop_threads(2)
try:
    import psutil
    psutil.Process().nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
except (ImportError, AttributeError, OSError):
    pass
private = ROOT / "tmp" / "approved-voice-job"
raw_dir = private / "raw"
output = ROOT / "public" / "audio" / "adri-local"
raw_dir.mkdir(parents=True, exist_ok=True)
output.mkdir(parents=True, exist_ok=True)
catalog = json.loads(subprocess.check_output(["node", "--input-type=module", "-e",
    "import {voiceCatalog} from './src/data/voiceCatalog.js'; console.log(JSON.stringify(voiceCatalog));"], cwd=ROOT, encoding="utf8"))
if len({line["key"] for line in catalog}) != len(catalog):
    raise ValueError("Duplicate audio key")
config = json.loads(Path(args.reference_config).read_text(encoding="utf-8-sig"))
source = Path(config["audio"])
reference_hash = hashlib.sha256(source.read_bytes()).hexdigest()
profile = {"referenceSha256": reference_hash, "startSeconds": config["startSeconds"],
    "endSeconds": config["endSeconds"], "referenceText": config["text"],
    "model": "Qwen3-TTS-12Hz-0.6B-Base", "nonStreaming": True,
    "tempo": 1.12, "openingTempo": 1.20, "version": "adri-v1"}
profile_hash = hashlib.sha256(json.dumps(profile,sort_keys=True).encode()).hexdigest()
state_path = private / "state.json"
if state_path.exists():
    state = json.loads(state_path.read_text(encoding="utf8"))
    if state["profileHash"] != profile_hash:
        raise ValueError("Reference or settings changed; use a separate voice version")
else:
    state = {"profileHash": profile_hash, "profile": profile, "files": {}, "failures": {}}

def save():
    temporary = state_path.with_suffix(".next.json")
    temporary.write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding="utf8")
    temporary.replace(state_path)

def valid_entry(line):
    entry = state["files"].get(line["key"])
    if not entry or entry["text"] != line["text"]:
        return False
    path = output / entry["filename"]
    return path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == entry["sha256"]

home = next(line for line in catalog if line["key"] == "home-welcome")
if not valid_entry(home):
    manifest = json.loads((output/"manifest.json").read_text(encoding="utf8"))
    chosen = next(line for line in manifest["files"] if line["key"] == "home-welcome")
    if chosen["text"] != home["text"] or chosen.get("referenceOrigin") != "user-approved-local-reference":
        raise ValueError("The approved home recording is missing or does not match")
    target = output / "adri-v1-home-welcome.wav"
    shutil.copyfile(output/chosen["filename"],target)
    state["files"][home["key"]] = {**chosen,"filename":target.name,
        "sha256":hashlib.sha256(target.read_bytes()).hexdigest(),"reusedApprovedHome":True}
    save()

priority_keys = ["screen-settings-sample","primary-intro","quest-lengua","quest-matematicas","quest-medio",
    "primary-choice","primary-complete","result-success","result-retry"]
def priority(line):
    key = line["key"]
    if key in priority_keys: return 0
    if not key.startswith("game-"): return 1
    return 2
pending = [line for line in catalog if not valid_entry(line)]
if args.only_keys:
    wanted = set(args.only_keys.split(","))
    pending = [line for line in catalog if line["key"] in wanted]
pending.sort(key=lambda line:(priority(line),len(line["text"].split()),line["key"]))
groups = {}
for line in pending:
    groups.setdefault(line["text"],[]).append(line)
texts = list(groups)
if args.limit:
    texts = texts[:args.limit]
save()
print(f"STAGED {len(state['files'])}/{len(catalog)}; {len(texts)} unique texts pending this run",flush=True)
if not texts:
    raise SystemExit(0)

reference, sr = sf.read(source)
if reference.ndim>1: reference=reference.mean(axis=1)
reference = reference[round(config["startSeconds"]*sr):round(config["endSeconds"]*sr)]
factor = gcd(sr,24000)
reference = resample_poly(reference,24000//factor,sr//factor)
reference *= min(1.,.95/float(np.max(np.abs(reference))))
reference_path = private/"reference.wav"
sf.write(reference_path,reference,24000)
print("Loading approved reference model in float32",flush=True)
model = Qwen3TTSModel.from_pretrained(str(ROOT/".voice-cache"/"models"/"qwen-0.6b"),
    device_map="cpu",dtype=torch.float32,attn_implementation="sdpa")
prompt = model.create_voice_clone_prompt(ref_audio=str(reference_path),ref_text=config["text"],x_vector_only_mode=False)
# The codec otherwise pads and decodes the whole batch at once. Decode each
# completed sequence separately to bound CPU RAM use without changing its codes.
decode_original = model.model.speech_tokenizer.decode
def decode_separately(encoded,*positional,**keyword):
    if not isinstance(encoded,list) or len(encoded)<=1:
        return decode_original(encoded,*positional,**keyword)
    waves=[]
    sample_rate=None
    for index,item in enumerate(encoded,1):
        print(f"DECODING {index}/{len(encoded)}",flush=True)
        decoded,rate=decode_original([item],*positional,**keyword)
        if sample_rate is not None and rate!=sample_rate:
            raise ValueError("Inconsistent decoder sample rate")
        sample_rate=rate
        waves.extend(decoded)
    return waves,sample_rate
model.model.speech_tokenizer.decode=decode_separately
generation_steps = 0
def generation_progress(module, inputs, outputs):
    global generation_steps
    generation_steps += 1
    if generation_steps % 48 == 0:
        print(f"SPEECH STEP {generation_steps}",flush=True)
model.model.talker.register_forward_hook(generation_progress)

def store_audio(line,wave,sample_rate,elapsed,limit):
    words = len(line["text"].split())
    duration = len(wave)/sample_rate
    if not np.isfinite(wave).all() or np.sqrt(np.mean(wave*wave)) < .002:
        raise ValueError("Silent or invalid waveform")
    if duration < .25 or duration > max(6.,words*1.5+3) or duration >= (limit-3)*.08:
        sf.write(raw_dir/f"{line['key']}.rejected.wav",wave,sample_rate)
        raise ValueError(f"Unexpected or truncated duration: {duration:.2f}s")
    wave = wave*min(1.,.95/float(np.max(np.abs(wave))))
    raw = raw_dir/f"{line['key']}.wav"
    sf.write(raw,wave,sample_rate)
    target = output/f"adri-v1-{line['key']}.wav"
    if words >= 8 and duration > 3:
        opening = min(2.,duration/3)
        filters = (f"[0:a]asplit=2[a][b];[a]atrim=end={opening},asetpts=PTS-STARTPTS,atempo=1.20[first];"
            f"[b]atrim=start={opening},asetpts=PTS-STARTPTS,atempo=1.12[rest];[first][rest]concat=n=2:v=0:a=1[out]")
        filter_args = ["-filter_complex",filters,"-map","[out]"]
    else:
        opening = 0
        filter_args = ["-af","atempo=1.12"]
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-nostdin","-hide_banner","-loglevel","error","-y",
        "-i",str(raw),*filter_args,"-c:a","pcm_s16le",str(target)],check=True,capture_output=True)
    final, fs = sf.read(target)
    entry = {"key":line["key"],"text":line["text"],"spokenText":spoken_text(line),"filename":target.name,
        "durationSeconds":len(final)/fs,"sampleRate":fs,"generationSeconds":elapsed,
        "referenceOrigin":"user-approved-local-reference","tempo":1.12,
        "openingTempo":1.20 if opening else 1.12,"openingSeconds":opening,
        "peak":float(np.max(np.abs(final))),"rms":float(np.sqrt(np.mean(final*final))),
        "sha256":hashlib.sha256(target.read_bytes()).hexdigest()}
    if not np.isfinite(final).all() or entry["peak"]>=.999:
        raise ValueError("Invalid or clipped final audio")
    state["files"][line["key"]] = entry
    state["failures"].pop(line["key"],None)
    save()

def spoken_text(line):
    if line["key"]=="game-letra-n-picture-word" and args.seed is not None and args.seed>=1000:
        # Try a grammatical noun phrase when the isolated ending is unstable.
        return line["text"].replace("Es nariz.","Es una nariz.")
    if line["key"].endswith("-letter"):
        names={"A":"a","B":"be","C":"sé","D":"de","E":"e","F":"efe","G":"ge","H":"hache","I":"i",
            "J":"jota","K":"ka","L":"ele","M":"eme","N":"ene","Ñ":"eñe","O":"o","P":"pe","Q":"cu",
            "R":"erre","S":"ese","T":"te","U":"u","V":"uve","W":"uve doble","X":"equis","Y":"ye","Z":"seta"}
        text=re.sub(r"letra\s+([A-ZÑ])\b",lambda match:"letra: "+names[match.group(1)],line["text"])
        match=re.search(r"letra\s+([A-ZÑ])\b",line["text"])
        if match and args.seed is not None and args.seed>=1000:
            text=text.rstrip('.')+'. '+names[match.group(1)]+'.'
        return text
    if line["key"].endswith("-sentence"):
        return line["text"].replace("corresponde:","corresponde.")
    if line["key"].endswith("-syllable-hunt"):
        if line['key']=='game-letra-enye-syllable-hunt' and args.seed is not None and args.seed>=4000:
            return 'Busca la sílaba con eñe e i. Tócala.'
        if line['key']=='game-letra-enye-syllable-hunt' and args.seed is not None and args.seed>=3000:
            return line['text'].replace('ñi y tócala','ñi, como en arañita. Y tócala')
        if args.seed is not None and args.seed>=2000:
            def emphasize(match):
                syllable=match.group(2)
                if line['key']=='game-letra-x-syllable-hunt':
                    syllable='si'  # Spanish initial xi, as in xilófono (RAE DPD x).
                # An acute accent guides stress only; the teaching sound is unchanged.
                position=max((i for i,char in enumerate(syllable) if char in "aeiou"),default=-1)
                if position>=0:
                    syllable=syllable[:position]+syllable[position].translate(str.maketrans("aeiou","áéíóú"))+syllable[position+1:]
                return f"{match.group(1)}: {syllable}. {syllable}. Ahora tócala"
            return re.sub(r"(sílaba)\s+(\w+)\s+y tócala",emphasize,line["text"],flags=re.I)
        replacement=r"\1: \2. \2. Y tócala" if args.seed is not None and args.seed>=1000 else r"\1: \2. Y tócala"
        return re.sub(r"(sílaba)\s+(\w+)\s+y tócala",replacement,line["text"],flags=re.I)
    return line["text"]

cursor = 0
while cursor < len(texts):
    batch = [texts[cursor]]
    cursor += 1
    while cursor < len(texts) and len(batch)<args.batch_size:
        candidate = texts[cursor]
        lengths = [len(t.split()) for t in batch]+[len(candidate.split())]
        if max(lengths)>max(4,min(lengths)*1.8): break
        batch.append(candidate)
        cursor += 1
    keys = [groups[text][0]["key"] for text in batch]
    print(f"GENERATING {keys}",flush=True)
    generation_steps = 0
    started = time.monotonic()
    limit = min(700,max(120,max(len(spoken_text(groups[t][0]).split()) for t in batch)*10+80))
    seed = args.seed if args.seed is not None else 42+args.seed_offset+sum(ord(c) for c in "|".join(keys))
    torch.manual_seed(seed)
    try:
        with torch.inference_mode():
            wavs, rate = model.generate_voice_clone(text=[spoken_text(groups[text][0]) for text in batch],language="Spanish",voice_clone_prompt=prompt,
                non_streaming_mode=True,max_new_tokens=limit)
        elapsed = time.monotonic()-started
        for text,wave in zip(batch,wavs):
            for line in groups[text]:
                try:
                    store_audio(line,wave,rate,elapsed/len(batch),limit)
                    print(f"SAVED {line['key']} ({len(state['files'])}/{len(catalog)})",flush=True)
                except Exception as error:
                    state["failures"][line["key"]] = str(error)
                    save()
                    print(f"REVIEW {line['key']}: {error}",flush=True)
        print(f"BATCH completed in {elapsed:.1f}s",flush=True)
    except Exception as error:
        for key in keys: state["failures"][key]=str(error)
        save()
        print(f"BATCH FAILED: {error}",flush=True)
        if args.batch_size>1:
            args.batch_size=max(1,args.batch_size//2)
            print(f"Reducing subsequent batches to {args.batch_size}",flush=True)
print(f"DONE staged {len(state['files'])}/{len(catalog)}; failures {len(state['failures'])}",flush=True)
