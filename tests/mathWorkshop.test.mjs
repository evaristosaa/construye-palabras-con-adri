import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMathWorkshop, nextWorkshopSession, workshopId, workshopThemes, splitSignature, mathWorkshopVoices } from '../src/data/mathWorkshop.js';
import { awardGameCompletion, normalizeProgress, recordPrimaryAttempt } from '../src/hooks/progressModel.js';
import { readFileSync, statSync } from 'node:fs';
import { localVoiceFiles } from '../src/data/localVoiceFiles.js';

test('all twelve short sessions have unique ids, three stages and feasible quantities',()=>{
 const ids=new Set();
 for(const range of [10,20])for(let s=0;s<6;s++){
  const activities=buildMathWorkshop(range,s);
  assert.equal(activities.length,3);
  for(const a of activities){assert.ok(!ids.has(a.id));ids.add(a.id);assert.ok(a.hint&&a.explanation&&a.phase);if(a.options)assert.equal(a.options.filter(o=>o===a.answer).length,1);if(a.type==='line'){assert.ok(a.start>=a.min&&a.start<=a.max);assert.ok(Number(a.answer)>=a.min&&Number(a.answer)<=a.max);assert.equal(a.max-a.min,10);assert.ok(a.max<=range);} }
  assert.equal(activities[0].dots.reduce((a,b)=>a+b),Number(activities[0].answer));
  const context=activities[2];const numbers=context.question.match(/\d+/g).map(Number);
  assert.equal(Number(context.answer),s%2===1?numbers[0]-numbers[1]:numbers[0]+numbers[1]);
 }
 assert.equal(ids.size,36);
 assert.equal(buildMathWorkshop(999,-4)[0].id,workshopId(10,0,0));
});

test('central tasks rotate through number, composition, pattern, measurement, data and space',()=>{
 const central=workshopThemes.map((_,s)=>buildMathWorkshop(10,s)[1]);
 assert.deepEqual(central.map(a=>a.type),['line','split','choice','choice','choice','shape']);
 assert.ok(central[2].pattern);assert.ok(central[3].measure);assert.ok(central[4].chart);
 const most=central[4].chart.reduce((a,b)=>a.value>b.value?a:b);assert.equal(most.label,central[4].answer);
 assert.equal(central[3].measure,Number(central[3].answer));
});

test('two compositions require genuinely different pairs, including zero and the whole',()=>{
 for(const total of [10,20]){
  assert.equal(splitSignature(3,total),splitSignature(total-3,total));
  assert.notEqual(splitSignature(3,total),splitSignature(4,total));
  assert.equal(splitSignature(0,total),`0+${total}`);
 }
});

test('recommendation moves cyclically, revisits unresolved mistakes and replays idempotently',()=>{
 let progress=normalizeProgress({stars:8,completedGames:['old-game'],completedLevels:['letra-a']});
 assert.equal(nextWorkshopSession(progress,10),0);
 for(const a of buildMathWorkshop(10,0)){progress=awardGameCompletion(progress,a.id);progress=awardGameCompletion(progress,a.id);}
 assert.equal(progress.stars,11);assert.equal(progress.pieces,4);assert.deepEqual(progress.completedLevels,['letra-a']);
 assert.equal(nextWorkshopSession(progress,10),1);
 const id=workshopId(10,0,1);progress=recordPrimaryAttempt(progress,id,false);progress=recordPrimaryAttempt(progress,id,false);
 assert.equal(nextWorkshopSession(progress,10),0);
 progress=recordPrimaryAttempt(progress,id,true);progress=recordPrimaryAttempt(progress,id,true);
 assert.equal(nextWorkshopSession(progress,10),1);
 for(let s=1;s<6;s++)for(const a of buildMathWorkshop(10,s))progress=awardGameCompletion(progress,a.id);
 assert.equal(nextWorkshopSession(progress,10),0);assert.equal(nextWorkshopSession(progress,20),0);
});

test('new workshop guidance retains the chosen synthetic reference and matching local recordings',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/adri-local/manifest.json',import.meta.url),'utf8'));
 for(const line of mathWorkshopVoices){const entry=manifest.files.find(f=>f.key===line.key);assert.equal(entry?.text,line.text,line.key);assert.equal(entry.filename,localVoiceFiles[line.key]);assert.ok(statSync(new URL(`../public/audio/adri-local/${entry.filename}`,import.meta.url)).size>1000);}
});
