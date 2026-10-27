import test from 'node:test';
import assert from 'node:assert/strict';
import {primaryMissions} from '../src/data/primaryData.js';
import {primaryReadingLines,passageAudioKey} from '../src/data/primaryReadings.js';
import {seedStory,seedVoiceLines} from '../src/data/seedStory.js';
import {patternContinuation,patternAnswer,bridgeGroups,placePatternPiece,removePatternPiece} from '../src/data/patternBuilder.js';
import {buildMathWorkshop} from '../src/data/mathWorkshop.js';
import {normalizeProgress,awardGameCompletion} from '../src/hooks/progressModel.js';

test('every original and alternate reading maps to its exact passage, independently of the question',()=>{
 const byKey=new Map(primaryReadingLines.map(line=>[line.key,line]));let presentations=0;
 for(const mission of primaryMissions)for(const activity of mission.activities)for(const example of [activity,...activity.variants])if(example.passage){presentations++;const key=passageAudioKey(example);assert.equal(byKey.get(key)?.text,example.passage);assert.equal(passageAudioKey({...example,question:'Otra pregunta'}),key);}
 assert.equal(presentations,26);assert.equal(primaryReadingLines.length,20);
 assert.equal(new Set(primaryReadingLines.map(l=>l.text)).size,20);
 assert.equal(passageAudioKey({passage:'Texto ajeno al catálogo'}),null);
});
test('the seed story has three original narrated scenes and single, literal comprehension answers',()=>{
 assert.equal(seedStory.pages.length,3);assert.equal(seedStory.questions.length,3);
 for(const question of seedStory.questions){assert.equal(question.options.filter(o=>o.text===question.answer).length,1);assert.ok(question.hint&&question.explanation);}
 assert.equal(new Set(seedVoiceLines.map(l=>l.key)).size,6);
 let p=normalizeProgress({progressVersion:2,completedGames:['old'],completedLevels:['letra-n'],stars:4});
 for(let replay=0;replay<3;replay++)for(const q of seedStory.questions)p=awardGameCompletion(p,q.id);
 assert.equal(p.stars,7);assert.equal(p.pieces,4);assert.deepEqual(p.completedLevels,['letra-n']);
});
test('bridges conserve ten or twenty pieces including empty groups',()=>{
 for(const total of [10,20])for(let left=0;left<=total;left++){const groups=bridgeGroups(total,left);assert.equal(groups.length,total);assert.equal(groups.filter(g=>g==='blue').length,left);assert.equal(groups.filter(g=>g==='yellow').length,total-left);}
 assert.throws(()=>bridgeGroups(10,-1));assert.throws(()=>bridgeGroups(10,11));assert.throws(()=>bridgeGroups(10,.5));
});
test('pattern construction requires a whole continuation, including repeated adjacent shapes',()=>{
 assert.deepEqual(patternContinuation(['circle','triangle','triangle'],4,5),['triangle','triangle','circle','triangle','triangle']);
 assert.throws(()=>patternContinuation([],0,3));assert.throws(()=>patternContinuation(['unknown'],0,2));
 for(const range of [10,20]){const a=buildMathWorkshop(range,2)[1];assert.equal(a.type,'pattern-build');assert.equal(a.given.length,a.unit.length*2);assert.deepEqual(a.given.slice(0,a.unit.length),a.given.slice(a.unit.length));const expected=range===10?['circle','triangle','triangle']:['circle','triangle','triangle','square'];assert.equal(a.answer,patternAnswer(expected));assert.notEqual(a.answer,patternAnswer(expected.slice(0,-1)));assert.notEqual(a.answer,patternAnswer([...expected].reverse()));}
});
test('correcting a pattern slot preserves the other pieces and fills the gap first',()=>{
 const wrong=['square','triangle','triangle'];const gap=removePatternPiece(wrong,0);
 assert.deepEqual(gap,[null,'triangle','triangle']);
 assert.deepEqual(placePatternPiece(gap,'circle'),['circle','triangle','triangle']);
 assert.deepEqual(wrong,['square','triangle','triangle']);
 assert.deepEqual(placePatternPiece(wrong,'circle'),wrong);
 assert.deepEqual(placePatternPiece(gap,'unknown'),gap);
});
