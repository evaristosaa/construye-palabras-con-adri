"""Give flagged educational recordings a second local ASR check."""
import argparse,gc,json,os,subprocess,sys
from pathlib import Path
from math import gcd
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--keys',help='Only these comma-separated keys')
args=parser.parse_args()
os.environ.setdefault('HF_HOME',str(ROOT/'.voice-cache'/'huggingface'))
os.environ.setdefault('HF_HUB_OFFLINE','1')
os.environ.setdefault('TRANSFORMERS_OFFLINE','1')
import torch,soundfile as sf,numpy as np
from scipy.signal import resample_poly
from transformers import pipeline
from voice_validation import check_transcript,asr_domain_prompt
torch.set_num_threads(1)
private=ROOT/'tmp'/'approved-voice-job'
state=json.loads((private/'state.json').read_text(encoding='utf8'))
catalog=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{voiceCatalog}from './src/data/voiceCatalog.js';console.log(JSON.stringify(voiceCatalog));"],cwd=ROOT,encoding='utf8'))
report=json.loads((private/'validation.json').read_text(encoding='utf8'))
path=private/'resolutions.json'
resolutions=json.loads(path.read_text(encoding='utf8')) if path.exists() else {}
for key,entry in list(resolutions.items()):
    current=state['files'].get(key)
    if not current or entry.get('sha256')!=current['sha256'] or check_transcript(key,current['text'],entry.get('transcript',''))['status']!='pass':
        del resolutions[key]
temporary=path.with_suffix('.next.json')
temporary.write_text(json.dumps(resolutions,ensure_ascii=False,indent=2),encoding='utf8')
temporary.replace(path)
keys=[key for key,entry in report.items() if entry['status'] in ['review','error'] and resolutions.get(key,{}).get('sha256')!=entry['sha256']]
if args.keys:keys=[key for key in keys if key in args.keys.split(',')]
if not keys:
    print('No unresolved recordings to review',flush=True)
    raise SystemExit(0)
asr=pipeline('automatic-speech-recognition',model='openai/whisper-tiny',device='cpu')
prompts={}
for key in keys:
    entry=state['files'][key]
    x,sr=sf.read(ROOT/'public'/'audio'/'adri-local'/entry['filename'])
    factor=gcd(sr,16000)
    context=asr_domain_prompt(key,catalog)
    if context not in prompts:prompts[context]=asr.tokenizer.get_prompt_ids(context,return_tensors='pt')
    r=asr({'raw':resample_poly(x,16000//factor,sr//factor).astype(np.float32),'sampling_rate':16000},generate_kwargs={'language':'spanish','task':'transcribe','prompt_ids':prompts[context]})
    check=check_transcript(key,entry['text'],r['text'])
    if check['status']=='pass':
        resolutions[key]={'sha256':entry['sha256'],'text':entry['text'],'status':'pass-second-asr',
            'transcript':r['text'],'similarity':check['similarity'],'reviewMethod':'independent-local-whisper-tiny'}
        temporary=path.with_suffix('.next.json')
        temporary.write_text(json.dumps(resolutions,ensure_ascii=False,indent=2),encoding='utf8')
        temporary.replace(path)
    print(json.dumps({'key':key,'expected':entry['text'],'secondTranscript':r['text'],**check},ensure_ascii=True),flush=True)
if (ROOT/'.voice-cache'/'models'/'spanish-ctc'/'source.json').exists():
    # Free the Whisper weights before loading the independent Spanish CTC model.
    del asr
    gc.collect()
    command=[sys.executable,'-u','scripts/review-approved-voice-ctc.py']
    if args.keys: command.extend(['--keys',args.keys])
    subprocess.run(command,cwd=ROOT,check=True)
