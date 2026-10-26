"""Check staged recordings with local ASR and waveform metrics; keep report private."""
import argparse
import atexit
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time
from math import gcd

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--watch", action="store_true")
args = parser.parse_args()
os.environ.setdefault("HF_HOME",str(ROOT/".voice-cache"/"huggingface"))
os.environ.setdefault("HF_HUB_OFFLINE","1")
os.environ.setdefault("TRANSFORMERS_OFFLINE","1")
import torch
import soundfile as sf
import numpy as np
from scipy.signal import resample_poly
from transformers import pipeline
from voice_validation import check_transcript,asr_domain_prompt
torch.set_num_threads(2)
try:
    import psutil
    psutil.Process().nice(psutil.BELOW_NORMAL_PRIORITY_CLASS)
except (ImportError,AttributeError,OSError):
    pass
private=ROOT/"tmp"/"approved-voice-job"
state_path=private/"state.json"
report_path=private/"validation.json"
stop_path=private/"stop-validation"
watcher_path=private/"watcher-status.json"
if args.watch:
    stop_path.unlink(missing_ok=True)
    watcher_path.write_text(json.dumps({"running":True}),encoding="utf8")
    atexit.register(lambda:watcher_path.write_text(json.dumps({"running":False}),encoding="utf8"))
output=ROOT/"public"/"audio"/"adri-local"
catalog=json.loads(subprocess.check_output(["node","--input-type=module","-e",
    "import {voiceCatalog} from './src/data/voiceCatalog.js';console.log(JSON.stringify(voiceCatalog));"],cwd=ROOT,encoding="utf8"))
expected={line["key"]:line["text"] for line in catalog}
report=json.loads(report_path.read_text(encoding="utf8")) if report_path.exists() else {}
def save():
    temporary=report_path.with_suffix(".next.json")
    temporary.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
    temporary.replace(report_path)
print("Loading local ASR verifier",flush=True)
for key,entry in report.items():
    if key in expected and entry.get("status") not in ["approved-home","error"]:
        entry.update(check_transcript(key,expected[key],entry.get("transcript","")))
if report: save()
asr=pipeline("automatic-speech-recognition",model="openai/whisper-base",device="cpu")
prompts={}
last_summary = None
while True:
    if not state_path.exists():
        if not args.watch: break
        time.sleep(3)
        continue
    state=json.loads(state_path.read_text(encoding="utf8"))
    for key,entry in list(state["files"].items()):
        if key not in expected: continue
        previous=report.get(key,{})
        phonics=key.endswith(("-syllable-hunt","-letter"))
        if previous.get("sha256")==entry["sha256"] and previous.get("text")==expected[key] and (not phonics or previous.get("asrDomainVersion")==2): continue
        try:
            path=output/entry["filename"]
            if hashlib.sha256(path.read_bytes()).hexdigest()!=entry["sha256"]: continue
            wave,sr=sf.read(path)
            if not np.isfinite(wave).all() or np.sqrt(np.mean(wave*wave))<.002 or np.max(np.abs(wave))>=.999:
                raise ValueError("Invalid or clipped waveform")
            if entry.get("reusedApprovedHome"):
                result={"text":expected[key]}
                status="approved-home"
                similarity=1.
            else:
                factor=gcd(sr,16000)
                samples=resample_poly(wave,16000//factor,sr//factor).astype(np.float32)
                context=asr_domain_prompt(key,catalog)
                if context not in prompts: prompts[context]=asr.tokenizer.get_prompt_ids(context,return_tensors="pt")
                result=asr({"raw":samples,"sampling_rate":16000},generate_kwargs={"language":"spanish","task":"transcribe","prompt_ids":prompts[context]})
                text_check=check_transcript(key,expected[key],result["text"])
                similarity=text_check["similarity"]
                status=text_check["status"]
            report[key]={"sha256":entry["sha256"],"text":expected[key],"transcript":result["text"],
                "similarity":similarity,"status":status,"durationSeconds":len(wave)/sr,
                "asrDomainVersion":2,**({} if status=="approved-home" else text_check)}
            save()
            print(f"CHECK {key}: {status} ({similarity:.2f})",flush=True)
        except Exception as error:
            report[key]={"sha256":entry["sha256"],"text":expected[key],"status":"error","error":str(error)}
            save()
            print(f"CHECK {key}: ERROR {error}",flush=True)
    covered=sum(1 for key in expected if report.get(key,{}).get("sha256")==state["files"].get(key,{}).get("sha256") and key in state["files"])
    summary = (covered,sum(r['status'] in ['review','error'] for r in report.values()))
    if summary != last_summary:
        print(f"VERIFIED {covered}/{len(expected)}; review {summary[1]}",flush=True)
        last_summary = summary
    if not args.watch or covered==len(expected) or stop_path.exists(): break
    time.sleep(5)
