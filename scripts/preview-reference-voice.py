"""Generate a private voice preview from a user-supplied local reference.

Inputs, prepared reference, audio and metadata stay outside public/ and app routes.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--reference-config", required=True, help="Private JSON: audio, text, startSeconds, endSeconds")
parser.add_argument("--text-file", help="UTF-8 text for a new preview")
parser.add_argument("--name", help="New preview basename, without extension or directories")
args = parser.parse_args()
config = json.loads(Path(args.reference_config).read_text(encoding="utf-8-sig"))
os.environ.setdefault("HF_HOME", str(ROOT / ".voice-cache" / "huggingface"))
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
os.environ.setdefault("NUMBA_CACHE_DIR", str(ROOT / ".voice-cache" / "numba"))

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
from math import gcd
import torch
from qwen_tts import Qwen3TTSModel

torch.set_num_threads(4)
torch.set_num_interop_threads(2)
torch.manual_seed(42)
output = ROOT / "tmp" / "adri-reference-review"
output.mkdir(parents=True, exist_ok=True)
source = Path(config["audio"])
audio, sr = sf.read(source)
if audio.ndim > 1:
    audio = audio.mean(axis=1)
start = float(config.get("startSeconds", 0))
end = float(config.get("endSeconds", len(audio)/sr))
if not 0 <= start < end <= len(audio)/sr:
    raise ValueError("Invalid reference time range")
audio = audio[round(start*sr):round(end*sr)]
if not np.isfinite(audio).all() or np.max(np.abs(audio)) < .005:
    raise ValueError("Invalid or silent reference")
factor = gcd(sr, 24000)
audio = resample_poly(audio, 24000//factor, sr//factor)
audio *= min(1., .95/float(np.max(np.abs(audio))))
reference = output / "reference-prepared.wav"
sf.write(reference, audio, 24000)
text = Path(args.text_file).read_text(encoding="utf-8-sig").strip() if args.text_file else "¡Hola! Soy Adri. Juan y Cayetana te esperan. ¿Te vienes a jugar? ¡Vamos a descubrir cosas juntos!"
if not text:
    raise ValueError("Preview text cannot be empty")
if args.name and (Path(args.name).name != args.name or any(c not in "abcdefghijklmnopqrstuvwxyz0123456789-_" for c in args.name)):
    raise ValueError("Invalid preview basename")
print(f"Prepared {len(audio)/24000:.2f}s local reference", flush=True)
model_path = ROOT / ".voice-cache" / "models" / "qwen-0.6b"
print("Loading voice-clone Base model in float32", flush=True)
model = Qwen3TTSModel.from_pretrained(str(model_path), device_map="cpu", dtype=torch.float32, attn_implementation="sdpa")
steps = 0
def progress(module, inputs, outputs):
    global steps
    steps += 1
    if steps % 24 == 0:
        print(f"Speech generation step {steps}", flush=True)
model.model.talker.register_forward_hook(progress)
prompt = model.create_voice_clone_prompt(ref_audio=str(reference), ref_text=config["text"], x_vector_only_mode=False)
started = time.monotonic()
with torch.inference_mode():
    wavs, sample_rate = model.generate_voice_clone(text=text, language="Spanish", voice_clone_prompt=prompt,
        non_streaming_mode=True, max_new_tokens=250)
target = output / (f"{args.name}.wav" if args.name else "home-real-reference-v1.wav")
sf.write(target, wavs[0], sample_rate)
metadata = {"text": text, "referenceText": config["text"], "referenceStartSeconds": start,
    "referenceEndSeconds": end, "referenceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "referenceOrigin": "user-supplied-local-recording", "generatedPreview": True,
    "model": str(model_path), "durationSeconds": len(wavs[0])/sample_rate,
    "sampleRate": sample_rate, "generationSeconds": time.monotonic()-started, "steps": steps,
    "reachedTokenLimit": steps >= 250, "filename": target.name}
(output / (f"{args.name}.json" if args.name else "preview-reference.json")).write_text(json.dumps(metadata,ensure_ascii=False,indent=2), encoding="utf-8")
print(json.dumps(metadata,ensure_ascii=False), flush=True)
