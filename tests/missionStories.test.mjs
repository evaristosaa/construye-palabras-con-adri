import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {primaryMissions} from '../src/data/primaryData.js';
import {constructionFor,constructionState,initialConstructionWins,addConstructionWin,constructionVoices} from '../src/data/missionStories.js';
import {localVoiceFiles} from '../src/data/localVoiceFiles.js';

test('all 24 missions have a short topic-specific purpose and a six-part project',()=>{
 const tasks=[];
 for(const m of primaryMissions){const p=constructionFor(m.subject,m.activities[0].topic);assert.equal(p.subject,m.subject);assert.equal(p.parts.length,6);assert.equal(new Set(p.parts).size,6);assert.ok(p.task.length>15&&p.task.length<=65);tasks.push(p.task);}
 assert.equal(new Set(tasks).size,24);
 assert.equal(constructionFor('unknown').subject,'lengua');
});

test('three and six challenge journeys reach a whole build only on their last win',()=>{
 for(const total of [3,6]){
  let previous=-1;
  for(let n=0;n<=total;n++){const s=constructionState(n,total);assert.ok(s.visibleParts>previous);previous=s.visibleParts;assert.equal(s.complete,n===total);assert.equal(s.completed,n);}
  assert.equal(constructionState(total,total).visibleParts,6);
 }
 assert.equal(constructionState(-3,6).visibleParts,0);
 assert.equal(constructionState(40,6).visibleParts,6);
 assert.ok(Number.isFinite(constructionState(NaN,0).visibleParts));
});

test('resume counts actual saved activities and never invents wins from a deep-link position',()=>{
 const a=primaryMissions[0].activities,ids=a.map(x=>x.id),saved=[ids[4],ids[4],'unknown'];
 assert.deepEqual(initialConstructionWins(a,saved),[ids[4]]);
 assert.deepEqual(initialConstructionWins(a,[]),[]);
 assert.deepEqual(saved,[ids[4],ids[4],'unknown']);
 assert.deepEqual(initialConstructionWins(a,ids),[]);
 assert.deepEqual(initialConstructionWins(a,saved,true),[]);
});

test('a solved activity contributes once to the current build without mutating history',()=>{
 const before=['a'];const after=addConstructionWin(before,'b');
 assert.deepEqual(before,['a']);assert.deepEqual(after,['a','b']);assert.equal(addConstructionWin(after,'b'),after);
});

test('all three story guides have matching local recordings',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/adri-local/manifest.json',import.meta.url),'utf8'));
 for(const cue of constructionVoices){const entry=manifest.files.find(f=>f.key===cue.key);assert.equal(entry.text,cue.text);assert.equal(entry.filename,localVoiceFiles[cue.key]);assert.ok(entry.durationSeconds>1&&entry.durationSeconds<12);const file=new URL(`../public/audio/adri-local/${entry.filename}`,import.meta.url);assert.ok(statSync(file).size>1000);assert.equal(readFileSync(file).subarray(0,4).toString(),'RIFF');}
});
