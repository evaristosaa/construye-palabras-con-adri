import test from 'node:test';
import assert from 'node:assert/strict';
import {blankSnackSession,cleanSnackSession,checkSnackStep,changeSnackPlate,snackRewardId,snackStepIds,snackHint,snackVoiceLines} from '../src/data/snackAdventure.js';
import {normalizeProgress,awardGameCompletion} from '../src/hooks/progressModel.js';
import {resumeSnackAfterStory} from '../src/data/snackAdventure.js';

test('after the entry story, resume the saved challenge and its work, or replay a completed adventure',()=>{
 const initial=blankSnackSession();assert.equal(resumeSnackAfterStory(initial).stage,3);assert.equal(initial.stage,0);
 const saved={...initial,stage:4,basket:['apple','apple','water'],solved:['cesta'],plates:[2,1,0],help:{reparto:2}};
 const resumed=resumeSnackAfterStory(saved);
 assert.equal(resumed.stage,4);assert.deepEqual(resumed.plates,[2,1,0]);assert.deepEqual(resumed.solved,['cesta']);assert.equal(resumed.help.reparto,2);
 const completed={...saved,stage:6,plates:[2,2,2],order:['wash','table','eat'],solved:[...snackStepIds]};
 assert.deepEqual(resumeSnackAfterStory(completed),{...blankSnackSession(),stage:3});
 assert.equal(completed.stage,6);assert.deepEqual(completed.solved,snackStepIds);
});

test('the shared project requires the exact note, fair sharing and the meaningful order',()=>{
 const s=blankSnackSession();s.basket=['water','apple','apple'];s.plates=[2,2,2];s.order=['wash','table','eat'];
 for(const step of snackStepIds)assert.equal(checkSnackStep(step,s),true,step);
 assert.equal(checkSnackStep('cesta',{...s,basket:['apple','water','banana']}),false);
 assert.equal(checkSnackStep('cesta',{...s,basket:['apple','apple','water','water']}),false);
 assert.equal(checkSnackStep('reparto',{...s,plates:[3,2,1]}),false);
 assert.equal(checkSnackStep('cuidado',{...s,order:['table','wash','eat']}),false);
});
test('putting and taking pieces preserves the total of six for every feasible arrangement',()=>{
 for(let a=0;a<=6;a++)for(let b=0;b<=6-a;b++)for(let c=0;c<=6-a-b;c++)for(let i=0;i<3;i++)for(const d of [-1,1]){
  const before=[a,b,c],after=changeSnackPlate(before,i,d);
  assert.ok(after.every(n=>n>=0&&n<=6));assert.ok(after.reduce((x,y)=>x+y,0)<=6);
  assert.deepEqual(before,[a,b,c]);
  for(let j=0;j<3;j++)if(i!==j)assert.equal(before[j],after[j]);
 }
});
test('a resumed draft keeps real work but cannot invent solved steps or jump to the ending',()=>{
 const raw={...blankSnackSession(),stage:6,basket:['apple','water'],plates:[6,0,0],order:['eat','table','wash'],solved:[...snackStepIds],help:{cesta:2}};
 const draft=cleanSnackSession(raw);
 assert.equal(draft.stage,3);assert.deepEqual(draft.solved,[]);assert.deepEqual(draft.basket,raw.basket);assert.equal(draft.help.cesta,2);
 assert.deepEqual(cleanSnackSession({...raw,plates:[-1,7,0]}).plates,[0,0,0]);
 assert.deepEqual(cleanSnackSession({version:99}),blankSnackSession());
 const complete=cleanSnackSession({...raw,basket:['apple','apple','water'],plates:[2,2,2],order:['wash','table','eat']});
 assert.equal(complete.stage,6);assert.deepEqual(complete.solved,snackStepIds);
});
test('replaying the project never duplicates rewards or rewrites previous school progress',()=>{
 const initial=normalizeProgress({progressVersion:2,completedGames:['letra-a-letter'],completedLevels:['letra-a'],stars:4});
 let p=initial;for(let replay=0;replay<3;replay++)for(const step of snackStepIds)p=awardGameCompletion(p,snackRewardId(step));
 assert.equal(p.stars,7);assert.equal(p.pieces,4);assert.deepEqual(p.completedLevels,['letra-a']);assert.equal(initial.stars,4);
});
test('hints keep the problem and voice lines have stable unique keys',()=>{
 const s=blankSnackSession();assert.match(snackHint('reparto',1,s),/quedan trozos/);assert.match(snackHint('reparto',3,s),/tres trozos/);
 assert.equal(new Set(snackVoiceLines.map(v=>v.key)).size,7);assert.ok(snackVoiceLines.every(v=>v.text.length>20));
});
