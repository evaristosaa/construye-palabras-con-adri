"""Generate Adri's lines locally from the chosen synthetic reference voice."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
os.environ.setdefault("HF_HOME", str(ROOT / ".voice-cache" / "huggingface"))
os.environ.setdefault("NUMBA_CACHE_DIR", str(ROOT / ".voice-cache" / "numba"))
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

parser = argparse.ArgumentParser()
parser.add_argument("--all", action="store_true", help="Generate the full catalog; otherwise only the greeting")
parser.add_argument("--model", default=str(ROOT / ".voice-cache" / "models" / "qwen-0.6b"))
parser.add_argument("--threads", type=int, default=6)
parser.add_argument("--catalog-file", help="Optional JSON catalog of additional learning lines")
args = parser.parse_args()
if Path(args.model).is_dir():
    os.environ.setdefault("HF_HUB_OFFLINE", "1")
    os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel

torch.set_num_threads(args.threads)
torch.set_num_interop_threads(2)
torch.manual_seed(42)
reference_dir = ROOT / "public" / "audio" / "adri"
reference = json.loads((reference_dir / "reference.json").read_text(encoding="utf-8-sig"))
reference_wav = reference_dir / reference["filename"]
fingerprint = hashlib.sha256(reference_wav.read_bytes()).hexdigest()
catalog = subprocess.check_output(
    ["node", "--input-type=module", "-e", "import {voiceLines} from './src/data/adriAudioCatalog.js'; console.log(JSON.stringify(voiceLines));"],
    cwd=ROOT, encoding="utf-8",
)
lines = json.loads(Path(args.catalog_file).read_text(encoding="utf-8-sig")) if args.catalog_file else json.loads(catalog)
if not args.all and not args.catalog_file:
    lines = [line for line in lines if line["key"] == "screen-home"]

output = ROOT / "public" / "audio" / "adri-local"
output.mkdir(parents=True, exist_ok=True)
manifest_path = output / "manifest.json"
try:
    previous = json.loads(manifest_path.read_text(encoding="utf-8"))
except FileNotFoundError:
    previous = {}
if previous.get("model") == args.model and previous.get("referenceSha256") == fingerprint:
    completed = {line["key"]: line for line in previous.get("files", [])}
else:
    completed = {}

def write_routes():
    routes = {key: entry["filename"] for key, entry in completed.items()}
    (ROOT / "src" / "data" / "localVoiceFiles.js").write_text("export const localVoiceFiles = Object.freeze(" + json.dumps(routes, indent=2) + ");\n", encoding="utf-8")

write_routes()
original_manifest = json.loads((reference_dir / "manifest.json").read_text(encoding="utf-8-sig"))
originals = {entry["key"]: entry for entry in original_manifest["files"]}
pending = []
for line in lines:
    original = originals.get(line["key"])
    if original and original["text"] == line["text"] and (reference_dir / original["filename"]).exists():
        continue
    if completed.get(line["key"], {}).get("text") == line["text"] and (output / completed[line["key"]]["filename"]).exists():
        continue
    pending.append(line)
print(f"Keeping {len(lines) - len(pending)} existing recordings; generating {len(pending)} missing lines", flush=True)
lines = pending
if not lines:
    raise SystemExit(0)

print(f"Loading {args.model} on CPU ({args.threads} threads)", flush=True)
model = Qwen3TTSModel.from_pretrained(args.model, device_map="cpu", dtype=torch.float32, attn_implementation="sdpa")
print("Preparing synthetic reference voice", flush=True)
prompt = model.create_voice_clone_prompt(ref_audio=str(reference_wav), ref_text=reference["text"], x_vector_only_mode=False)

for index, line in enumerate(lines, 1):
    filename = f"{line['key']}.wav"
    target = output / filename
    if completed.get(line["key"], {}).get("text") == line["text"] and target.exists():
        print(f"[{index}/{len(lines)}] Reused {filename}", flush=True)
        continue
    start = time.monotonic()
    print(f"[{index}/{len(lines)}] Generating {filename}", flush=True)
    with torch.inference_mode():
        wavs, sr = model.generate_voice_clone(text=line["text"], language="Spanish", voice_clone_prompt=prompt, max_new_tokens=700)
    sf.write(target, wavs[0], sr)
    duration = len(wavs[0]) / sr
    elapsed = time.monotonic() - start
    completed[line["key"]] = {"key": line["key"], "text": line["text"], "filename": filename, "durationSeconds": duration, "generationSeconds": elapsed}
    manifest_path.write_text(json.dumps({"model": args.model, "referenceSha256": fingerprint, "files": list(completed.values())}, ensure_ascii=False, indent=2), encoding="utf-8")
    write_routes()
    print(f"Saved {filename}: {duration:.1f}s audio in {elapsed:.1f}s", flush=True)
