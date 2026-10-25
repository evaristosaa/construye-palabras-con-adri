import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSubjectWorkshop,subjectWorkshopVoices} from '../src/data/subjectWorkshop.js';
import {primaryMissions,isPrimaryAnswerCorrect,assembledPrimaryAnswer} from '../src/data/primaryData.js';
import {normalizeProgress,awardGameCompletion,awardGameWithMissionCompletion,awardPrimaryCompletion,recordPrimaryAttempt} from '../src/hooks/progressModel.js';
import {storyCharacters} from '../src/data/primaryPlayDesign.js';
import {readFileSync} from 'node:fs';
import {localVoiceFiles} from '../src/data/localVoiceFiles.js';

test('stories offer exactly Adri, Juan and Cayetana',()=>assert.deepEqual(storyCharacters.map(c=>c.name),['Adri','Juan','Cayetana']));

test('both subject workshops mix three topics and include an interactive central challenge',()=>{
 for(const subject of ['lengua','medio']){
  const games=buildSubjectWorkshop(subject,normalizeProgress());
  assert.equal(games.length,3);assert.equal(new Set(games.map(g=>g.topic)).size,3);
  assert.ok(['order','sort','syllables'].includes(games[1].type));
  const ids=new Set(primaryMissions.filter(m=>m.subject===subject).flatMap(m=>m.activities.map(a=>a.id)));
  for(const g of games){assert.equal(g.subject,subject);assert.ok(ids.has(g.id));assert.ok(g.workshopPhase);}
 }
 assert.deepEqual(buildSubjectWorkshop('unknown',{}),[]);
 assert.deepEqual(buildSubjectWorkshop('matematicas',{}),[]);
});

test('subject workshops revisit errors, alternate presentations and retain idempotent rewards',()=>{
 const a=primaryMissions.find(m=>m.id==='primaria-lengua-frases').activities[0];
 let p=recordPrimaryAttempt(recordPrimaryAttempt(normalizeProgress(),a.id,false),a.id,false);
 const before=JSON.stringify(p),first=buildSubjectWorkshop('lengua',p);
 assert.equal(first[1].id,a.id);assert.equal(JSON.stringify(p),before);
 for(const g of first)p=awardGameCompletion(recordPrimaryAttempt(p,g.id,true),g.id);
 const once=p.pieces;
 for(const g of first)p=awardGameCompletion(p,g.id);
 assert.equal(p.pieces,once);assert.equal(p.stars,3);
 const next=buildSubjectWorkshop('lengua',p);assert.ok(next.every(g=>g.variantKey));
});

test('new observation activities classify senses and order original research steps correctly',()=>{
 const senses=primaryMissions.find(m=>m.id==='primaria-medio-cuerpo').activities[2];
 for(const a of [senses,...senses.variants]){assert.equal(a.type,'sort');assert.deepEqual(a.categories,['Tacto','Vista']);assert.equal(a.answer,a.items.map(i=>i.category).join('|'));}
 const research=primaryMissions.find(m=>m.id==='primaria-medio-plantas').activities[4];
 for(const a of [research,...research.variants]){assert.equal(a.type,'order');const ordered=[...a.pieces].sort((x,y)=>a.answer.indexOf(x)-a.answer.indexOf(y));assert.ok(isPrimaryAnswerCorrect(a,assembledPrimaryAnswer({...a,pieces:ordered},[0,1,2])));}
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/adri-local/manifest.json',import.meta.url),'utf8'));
 const cue=subjectWorkshopVoices[0],entry=manifest.files.find(f=>f.key===cue.key);
 assert.equal(entry.text,cue.text);assert.equal(entry.filename,localVoiceFiles[cue.key]);
});

test('finishing a mission in mixed practice awards its sticker and bonus exactly once',()=>{
 const mission=primaryMissions[0],ids=mission.activities.map(a=>a.id);
 let p=normalizeProgress({stars:5,completedGames:ids.slice(0,5),completedLevels:['letra-a']});
 p=awardGameWithMissionCompletion(p,ids[5],primaryMissions);
 assert.deepEqual(p.primaryCompletedLevels,[mission.id]);assert.equal(p.stars,9);assert.equal(p.pieces,6);
 p=awardGameWithMissionCompletion(p,ids[5],primaryMissions);
 p=awardPrimaryCompletion(p,mission.id,ids);
 assert.equal(p.stars,9);assert.equal(p.pieces,6);assert.deepEqual(p.completedLevels,['letra-a']);
 const partial=awardGameWithMissionCompletion(normalizeProgress(),ids[0],primaryMissions);
 assert.equal(partial.stars,1);assert.deepEqual(partial.primaryCompletedLevels,[]);
 const legacy=awardGameWithMissionCompletion(partial,'legacy-letter-game',primaryMissions);
 assert.equal(legacy.stars,2);assert.deepEqual(legacy.primaryCompletedLevels,[]);
});
