import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {snackVoiceLines} from '../src/data/snackAdventure.js';
import {distributionVoiceFiles} from '../src/data/distributionVoiceFiles.js';
import {primaryMissions} from '../src/data/primaryData.js';
import {primaryVoiceLines,primaryAudioKey} from '../src/data/primaryVoiceLines.js';
import {primaryReadingLines} from '../src/data/primaryReadings.js';
import {seedVoiceLines} from '../src/data/seedStory.js';
import {mathWorkshopVoices} from '../src/data/mathWorkshop.js';
import {wordVoiceLines} from '../src/data/primaryPlayDesign.js';
import {voiceLines} from '../src/data/adriAudioCatalog.js';
export function offlinePackagePlugin(){let outDir;return {name:'adri-offline-package',apply:'build',configResolved(config){outDir=resolve(config.root,config.build.outDir);},async closeBundle(){
  const bundleNames=(await readdir(resolve(outDir,'assets'))).filter(n=>/\.(js|css)$/.test(n));
  const audio=key=>{if(!distributionVoiceFiles[key])throw Error(`Falta la voz: ${key}`);return 'audio/adri-distribution/'+distributionVoiceFiles[key];};
  const corePaths=['index.html','manifest.webmanifest','assets/icons/app-192.png','assets/icons/app-512.png','assets/worlds/reading-village.webp','assets/characters/amigos-comic-unificado-v1.webp',audio('home-welcome'),...bundleNames.map(n=>'assets/'+n)];
  const characters=['adri-clean','adri-reader','adri-detective','adri-builder','adri-audio','adri-celebrating'].map(n=>'assets/'+n+'.webp').concat(['juan-comic-v1','cayetana-comic-v2','amigos-expresiones-v1'].map(n=>'assets/characters/'+n+'.webp'));
  const shared=primaryVoiceLines.map(v=>v.key).concat(['result-success','result-retry','screen-settings','screen-collection','screen-progress','screen-reward','primary-workshop']);
  const packs={merienda:{label:'Inicio y La merienda',resources:[...characters,'assets/worlds/discovery-garden.webp',...[...snackVoiceLines.map(v=>v.key),'result-success','result-retry'].map(audio)]}};
  for(const [subject,label,world] of [['lengua','Lengua y cuentos','reading-village'],['matematicas','Matemáticas y juegos','number-island'],['medio','Conocimiento del Medio','discovery-garden']]){
    const keys=new Set([...shared,`quest-${subject}`]);
    for(const mission of primaryMissions.filter(m=>m.subject===subject))for(const a of mission.activities){for(const v of [a,...a.variants]){keys.add(primaryAudioKey(v,subject));if(a.ideaAudioKey)keys.add(a.ideaAudioKey);}}
    if(subject==='lengua'){for(const line of [...primaryReadingLines,...seedVoiceLines,...wordVoiceLines,...voiceLines])keys.add(line.key);}
    if(subject==='matematicas')for(const line of mathWorkshopVoices)keys.add(line.key);
    packs[subject]={label,resources:[...characters,`assets/worlds/${world}.webp`,...(subject==='lengua'?['assets/worlds/discovery-garden.webp']:[]),...[...keys].filter(k=>distributionVoiceFiles[k]).map(audio)]};
  }
  async function describe(path){const bytes=await readFile(resolve(outDir,path));return {url:path==='index.html'?'./':path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}
  const core=await Promise.all(corePaths.map(describe));
  for(const pack of Object.values(packs)){pack.resources=await Promise.all([...new Set(pack.resources)].filter(p=>!corePaths.includes(p)).map(describe));pack.bytes=[...core,...pack.resources].reduce((n,r)=>n+r.bytes,0);}
  const template=await readFile(resolve('public/sw.js'),'utf8');
  const version=createHash('sha256').update(JSON.stringify({core,packs})).update(template).digest('hex').slice(0,16);
  const manifest={version,core,...packs.merienda,packs};
  await writeFile(resolve(outDir,'offline-package.json'),JSON.stringify(manifest));
  await writeFile(resolve(outDir,'sw.js'),template.replaceAll('__ADRI_RELEASE__',version));
}};}
