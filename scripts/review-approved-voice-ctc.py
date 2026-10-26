"""Independent Spanish CTC transcription, without an expected-text prompt or LM."""
import argparse
import hashlib
import json
import os
from pathlib import Path
from math import gcd

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--keys',help='Only these comma-separated recording keys')
args=parser.parse_args()
os.environ.setdefault('HF_HOME',str(ROOT/'.voice-cache'/'huggingface'))
os.environ.setdefault('HF_HUB_OFFLINE','1')
os.environ.setdefault('TRANSFORMERS_OFFLINE','1')
import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from transformers import Wav2Vec2ForCTC,Wav2Vec2Processor
from voice_validation import check_transcript

torch.set_num_threads(2)
private=ROOT/'tmp'/'approved-voice-job'
state=json.loads((private/'state.json').read_text(encoding='utf8'))
report=json.loads((private/'validation.json').read_text(encoding='utf8'))
path=private/'resolutions.json'
resolutions=json.loads(path.read_text(encoding='utf8')) if path.exists() else {}
keys=[key for key,entry in report.items() if entry['status'] in ['review','error']
    and resolutions.get(key,{}).get('sha256')!=state['files'].get(key,{}).get('sha256')]
if args.keys: keys=[key for key in keys if key in args.keys.split(',')]
if not keys:
    print('No unresolved recordings for independent CTC review',flush=True)
    raise SystemExit(0)
model_dir=ROOT/'.voice-cache'/'models'/'spanish-ctc'
cache_path=private/'ctc-review.json'
cache=json.loads(cache_path.read_text(encoding='utf8')) if cache_path.exists() else {}
processor=model=None
for key in keys:
    entry=state['files'][key]
    audio=ROOT/'public'/'audio'/'adri-local'/entry['filename']
    if hashlib.sha256(audio.read_bytes()).hexdigest()!=entry['sha256']:
        raise ValueError(f'Changed audio: {key}')
    wave,sr=sf.read(audio)
    if not np.isfinite(wave).all() or np.sqrt(np.mean(wave*wave))<.002 or np.max(np.abs(wave))>=.999:
        raise ValueError(f'Invalid audio waveform: {key}')
    previous=cache.get(key,{})
    if previous.get('sha256')==entry['sha256']:
        transcript=previous['transcript']
    else:
        if model is None:
            processor=Wav2Vec2Processor.from_pretrained(model_dir,local_files_only=True)
            model=Wav2Vec2ForCTC.from_pretrained(model_dir,local_files_only=True).eval()
        factor=gcd(sr,16000)
        samples=resample_poly(wave,16000//factor,sr//factor).astype(np.float32)
        inputs=processor(samples,sampling_rate=16000,return_tensors='pt',padding=True)
        with torch.inference_mode():
            logits=model(**inputs).logits
        transcript=processor.batch_decode(logits.argmax(dim=-1))[0]
    check=check_transcript(key,entry['text'],transcript)
    cache[key]={'sha256':entry['sha256'],'text':entry['text'],'transcript':transcript,**check}
    next_cache=cache_path.with_suffix('.next.json')
    next_cache.write_text(json.dumps(cache,ensure_ascii=False,indent=2),encoding='utf8')
    next_cache.replace(cache_path)
    if check['status']=='pass':
        resolutions[key]={'sha256':entry['sha256'],'text':entry['text'],'status':'pass-second-asr',
            'transcript':transcript,'similarity':check['similarity'],
            'reviewMethod':'independent-local-spanish-wav2vec2-ctc-no-lm'}
        temporary=path.with_suffix('.next.json')
        temporary.write_text(json.dumps(resolutions,ensure_ascii=False,indent=2),encoding='utf8')
        temporary.replace(path)
    print(json.dumps({'key':key,'transcript':transcript,**check},ensure_ascii=True),flush=True)
