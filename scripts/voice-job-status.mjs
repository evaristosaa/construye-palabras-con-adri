import {readFileSync,existsSync} from 'node:fs';
import {voiceCatalog} from '../src/data/voiceCatalog.js';
const read=path=>existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
const state=read('tmp/approved-voice-job/state.json');
const validation=read('tmp/approved-voice-job/validation.json');
const resolutions=read('tmp/approved-voice-job/resolutions.json');
const accepted=new Set(['pass','approved-home','pass-second-asr','phonetic-equivalent']);
let generated=0,checked=0,approved=0;
const review=[];
for(const line of voiceCatalog){
  const entry=state.files?.[line.key];
  if(!entry||entry.text!==line.text)continue;
  generated++;
  const raw=validation[line.key],override=resolutions[line.key];
  const check=override?.sha256===entry.sha256&&override.text===line.text?override:raw;
  if(!check||check.sha256!==entry.sha256||check.text!==line.text)continue;
  checked++;
  if(accepted.has(check.status))approved++;
  else review.push({key:line.key,text:line.text,transcript:check.transcript,reasons:check.reasons||[check.error]});
}
console.log(JSON.stringify({total:voiceCatalog.length,generated,checked,approved,review,
  generationFailures:state.failures||{},activeProfile:read('public/audio/adri-local/manifest.json').voiceProfile||'previous-library'}));
