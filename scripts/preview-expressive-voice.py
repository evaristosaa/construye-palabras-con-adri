"""Create an isolated expressive synthetic-voice preview; never changes app routes."""
import json
import argparse
import os
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--full-precision", action="store_true", default=True)
parser.add_argument("--int8-experimental", action="store_false", dest="full_precision", help="Reproduce failed int8 experiment; not for app audio")
args = parser.parse_args()
os.environ.setdefault("HF_HOME", str(ROOT / ".voice-cache" / "huggingface"))
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
os.environ.setdefault("NUMBA_CACHE_DIR", str(ROOT / ".voice-cache" / "numba"))

import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel

torch.set_num_threads(4)
torch.set_num_interop_threads(2)
torch.manual_seed(42)
model_path = ROOT / ".voice-cache" / "models" / "qwen-1.7b-voicedesign"
output = ROOT / "tmp" / "expressive-voice"
output.mkdir(parents=True, exist_ok=True)
text = "¡Eh! ¿Te vienes a jugar? Adri, Juan y Cayetana te esperan. ¡Vamos a descubrir cosas juntos!"
instruction = (
    "A lively six-year-old boy speaking native Spanish from Seville, Spain, with soft seseo. "
    "Warm natural youthful tone and conversational rhythm. Smiling, curious question and cheerful invitation. "
    "Clear, relaxed, spontaneous, with natural pauses and expressive intonation, without exaggerated pitch or theatrical acting."
)
print(f"Loading expressive VoiceDesign model on CPU ({'float32' if args.full_precision else 'int8'})", flush=True)
model = Qwen3TTSModel.from_pretrained(str(model_path), device_map="cpu", dtype=torch.float32 if args.full_precision else torch.bfloat16, attn_implementation="sdpa", low_cpu_mem_usage=True)
def quantize_linears(module):
    count = 0
    for name, child in list(module.named_children()):
        if isinstance(child, torch.nn.Linear):
            child.float()
            child.qconfig = torch.ao.quantization.default_dynamic_qconfig
            setattr(module, name, torch.ao.nn.quantized.dynamic.Linear.from_float(child))
            count += 1
        else:
            count += quantize_linears(child)
    return count
if not args.full_precision:
    count = quantize_linears(model.model)
    model.model.float()
    model.model.speech_tokenizer.model.float()
    print(f"Prepared {count} int8 linear layers", flush=True)
steps = 0
def preview_progress(module, inputs, outputs):
    global steps
    steps += 1
    if steps % 24 == 0:
        print(f"Speech generation step {steps}", flush=True)
model.model.talker.register_forward_hook(preview_progress)
start = time.monotonic()
print("Generating isolated preview", flush=True)
with torch.inference_mode():
    wavs, sr = model.generate_voice_design(text=text, language="Spanish", instruct=instruction,
        non_streaming_mode=True, max_new_tokens=180)
target = output / ("home-expressive-v2.wav" if args.full_precision else "home-expressive-v1.wav")
sf.write(target, wavs[0], sr)
metadata = {"text": text, "instruction": instruction, "model": str(model_path),
    "sampleRate": sr, "durationSeconds": len(wavs[0])/sr, "generationSeconds": time.monotonic()-start,
    "filename": target.name, "syntheticVoice": True, "execution": "float32-cpu" if args.full_precision else "int8-linear-float32-cpu"}
(output / ("preview-v2.json" if args.full_precision else "preview.json")).write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(metadata, ensure_ascii=False), flush=True)
