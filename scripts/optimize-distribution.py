import argparse,hashlib,json,subprocess,wave
from pathlib import Path
from PIL import Image
import imageio_ffmpeg
parser=argparse.ArgumentParser(description='Prepare lighter copies without changing approved WAV masters.')
parser.add_argument('--verify-existing',action='store_true',help='Check and index copies already produced by this pipeline.')
args=parser.parse_args();root=Path(__file__).resolve().parents[1];ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
canonical=json.loads((root/'public/audio/adri-local/manifest.json').read_text(encoding='utf-8'))
out=root/'public/audio/adri-distribution';out.mkdir(exist_ok=True);rows=[]
for entry in canonical['files']:
 source=root/'public/audio/adri-local'/entry['filename'];target=out/(source.stem+'.mp3')
 if hashlib.sha256(source.read_bytes()).hexdigest()!=entry['sha256']:raise RuntimeError('Approved master changed: '+entry['key'])
 if not args.verify_existing:
  subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(source),'-codec:a','libmp3lame','-q:a','3','-ar','24000','-ac','1',str(target)],check=True)
 decoded=subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-i',str(target),'-ar','24000','-ac','1','-f','s16le','-'],capture_output=True,check=True).stdout
 with wave.open(str(source)) as wav:duration=wav.getnframes()/wav.getframerate()
 decoded_duration=len(decoded)/48000
 if abs(decoded_duration-duration)>0.08:raise RuntimeError('Duration mismatch: '+entry['key'])
 rows.append({'key':entry['key'],'filename':target.name,'sourceFilename':source.name,'sourceSha256':entry['sha256'],'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size,'sourceBytes':source.stat().st_size,'durationSeconds':decoded_duration})
manifest={'version':1,'voiceProfile':'adri-approved-v1','encoding':'MP3 VBR q3, mono 24 kHz; no tempo or pitch transformation','files':rows}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
(root/'src/data/distributionVoiceFiles.js').write_text('export const distributionVoiceFiles = Object.freeze('+json.dumps({r['key']:r['filename'] for r in rows},indent=2)+');\n',encoding='utf-8')
images=[]
for source in (root/'public/assets').rglob('*'):
 if source.suffix.lower() not in ['.png','.jpg','.jpeg'] or source.name=='mockup-reference.png':continue
 with Image.open(source) as image:
  if image.width<200 and image.height<200:continue
  target=source.with_suffix('.webp')
  if not args.verify_existing:image.thumbnail((1400,1400));image.save(target,'WEBP',quality=86,method=6)
  if target.exists():images.append({'original':source.relative_to(root/'public').as_posix(),'distribution':target.relative_to(root/'public').as_posix(),'before':source.stat().st_size,'after':target.stat().st_size})
report={'audio':{'files':len(rows),'before':sum(r['sourceBytes'] for r in rows),'after':sum(r['bytes'] for r in rows),'maximumDurationDifferenceSeconds':max(abs(r['durationSeconds']-canonical['files'][i]['durationSeconds']) for i,r in enumerate(rows))},'images':images}
(root/'docs/distribution-measurements.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['audio']))
