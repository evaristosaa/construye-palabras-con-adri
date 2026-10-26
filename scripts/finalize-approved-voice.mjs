import {readFileSync,writeFileSync,existsSync,copyFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {voiceCatalog} from '../src/data/voiceCatalog.js';

const root=process.cwd();
const privateDir=path.join(root,'tmp','approved-voice-job');
const output=path.join(root,'public','audio','adri-local');
const state=JSON.parse(readFileSync(path.join(privateDir,'state.json'),'utf8'));
const validation=JSON.parse(readFileSync(path.join(privateDir,'validation.json'),'utf8'));
const resolutionsPath=path.join(privateDir,'resolutions.json');
const resolutions=existsSync(resolutionsPath)?JSON.parse(readFileSync(resolutionsPath,'utf8')):{};
const accepted=new Set(['pass','approved-home','pass-second-asr','phonetic-equivalent']);
const entries=[];
for(const line of voiceCatalog){
  const entry=state.files[line.key];
  const override=resolutions[line.key];
  const check=override?.sha256===entry?.sha256&&override?.text===line.text?override:validation[line.key];
  if(!entry||entry.text!==line.text)throw Error(`Missing current recording: ${line.key}`);
  if(!check||check.sha256!==entry.sha256||check.text!==line.text||!accepted.has(check.status))throw Error(`Voice verification pending: ${line.key}`);
  if(path.basename(entry.filename)!==entry.filename||!entry.filename.startsWith('adri-v1-'))throw Error(`Unexpected asset path: ${line.key}`);
  const bytes=readFileSync(path.join(output,entry.filename));
  if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error(`Recording changed: ${line.key}`);
  if(bytes.subarray(0,4).toString()!=='RIFF'||bytes.subarray(8,12).toString()!=='WAVE')throw Error(`Invalid WAV: ${line.key}`);
  if(entry.referenceOrigin!=='user-approved-local-reference')throw Error(`Different voice profile: ${line.key}`);
  entries.push({...entry,verification:check.status});
}
const manifestPath=path.join(output,'manifest.json');
const routesPath=path.join(root,'src','data','localVoiceFiles.js');
for(const [source,name] of [[manifestPath,'previous-manifest.json'],[routesPath,'previous-localVoiceFiles.js']]){
  const backup=path.join(privateDir,name);
  if(!existsSync(backup))copyFileSync(source,backup);
}
const manifest={schemaVersion:2,voiceProfile:'adri-approved-v1',referenceOrigin:'user-approved-local-reference',
  model:'Qwen/Qwen3-TTS-12Hz-0.6B-Base',tempo:1.12,pitchPreserving:true,files:entries};
// Reference audio, reference text and the source fingerprint deliberately stay private.
writeFileSync(manifestPath+'.next',JSON.stringify(manifest,null,2)+'\n');
const routes=Object.fromEntries(entries.map(e=>[e.key,e.filename]));
writeFileSync(routesPath+'.next','export const localVoiceFiles = Object.freeze('+JSON.stringify(routes,null,2)+');\n');
renameSync(manifestPath+'.next',manifestPath);
renameSync(routesPath+'.next',routesPath);
console.log(`Connected all ${entries.length} recordings to the approved Adri voice.`);
