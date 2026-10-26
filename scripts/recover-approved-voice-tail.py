"""Stage a complete utterance from a rejected take with a verified quiet tail.

This only prepares a candidate. The regular ASR and asset checks must still pass.
Never changes the approved home, the live manifest or the audio routes.
"""
import argparse,hashlib,json,subprocess,time
from pathlib import Path
import numpy as np
import soundfile as sf
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--key',required=True)
parser.add_argument('--diagnostic',action='store_true',help='Use the preserved diagnostic snapshot')
parser.add_argument('--threshold-db',type=float,default=-42)
args=parser.parse_args()
if not -50<=args.threshold_db<=-30:raise ValueError('Unexpected silence threshold')
catalog=json.loads(subprocess.check_output(['node','--input-type=module','-e',
    "import{voiceCatalog}from './src/data/voiceCatalog.js';console.log(JSON.stringify(voiceCatalog))"],cwd=ROOT,encoding='utf8'))
line=next(entry for entry in catalog if entry['key']==args.key)
if args.key=='home-welcome' or not all(c.isalnum() or c=='-' for c in args.key):
    raise ValueError('The approved home and arbitrary paths cannot be recovered')
private=ROOT/'tmp'/'approved-voice-job'
state_path=private/'state.json'
state=json.loads(state_path.read_text(encoding='utf8'))
if state['profile']['version']!='adri-v1':raise ValueError('Different voice job')
suffix='.diagnostic.wav' if args.diagnostic else '.rejected.wav'
source=private/'raw'/(args.key+suffix)
wave,sr=sf.read(source)
if wave.ndim!=1 or not np.isfinite(wave).all():raise ValueError('Invalid source audio')
# A token limit reached during speech is never recoverable with this helper.
tail=wave[-round(.7*sr):]
if np.sqrt(np.mean(tail*tail))>=.005:raise ValueError('Source ends with activity, not a quiet tail')
quiet_filter=f'silenceremove=start_periods=1:start_duration=0.03:start_threshold={args.threshold_db}dB:start_silence=0.08:stop_periods=-1:stop_duration=0.65:stop_threshold={args.threshold_db}dB:stop_silence=0.25'
cleaned=private/'raw'/(args.key+'.quiet-trimmed.wav')
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
started=time.monotonic()
subprocess.run([ffmpeg,'-nostdin','-hide_banner','-loglevel','error','-y','-i',str(source),'-af',quiet_filter,'-c:a','pcm_s16le',str(cleaned)],check=True)
clean,rate=sf.read(cleaned)
words=len(line['text'].split())
duration=len(clean)/rate
if not .3<duration<max(6,words*.9+1):raise ValueError(f'Cleaned take still has an unexpected duration: {duration}')
clean*=min(1.,.95/float(np.max(np.abs(clean))))
sf.write(cleaned,clean,rate)
output=ROOT/'public'/'audio'/'adri-local'
target=output/f'adri-v1-{args.key}.wav'
subprocess.run([ffmpeg,'-nostdin','-hide_banner','-loglevel','error','-y','-i',str(cleaned),'-af','atempo=1.12','-c:a','pcm_s16le',str(target)],check=True)
final,rate=sf.read(target)
if not np.isfinite(final).all() or np.sqrt(np.mean(final*final))<.002 or np.max(np.abs(final))>=.999:
    raise ValueError('Invalid processed waveform')
state['files'][args.key]={'key':args.key,'text':line['text'],'filename':target.name,
    'durationSeconds':len(final)/rate,'sampleRate':rate,'generationSeconds':None,
    'postprocessSeconds':time.monotonic()-started,'referenceOrigin':'user-approved-local-reference',
    'tempo':1.12,'openingTempo':1.12,'openingSeconds':0,
    'peak':float(np.max(np.abs(final))),'rms':float(np.sqrt(np.mean(final*final))),
    'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'recoveredQuietTail':True,'quietThresholdDb':args.threshold_db}
state['failures'].pop(args.key,None)
next_path=state_path.with_suffix('.next.json')
next_path.write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf8')
next_path.replace(state_path)
print(f'Staged quiet-tail candidate {args.key}: {len(wave)/sr:.2f}s -> {len(final)/rate:.2f}s. Verification required.',flush=True)
