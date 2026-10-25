import assert from 'node:assert/strict';
import test from 'node:test';
import {primaryMissions, isPrimaryAnswerCorrect, assembledPrimaryAnswer} from '../src/data/primaryData.js';
import {normalizeProgress, recordPrimaryAttempt, awardGameCompletion} from '../src/hooks/progressModel.js';
import {buildPrimaryAdventure, presentPrimaryActivity, isReviewDue} from '../src/data/primaryPractice.js';
function orders(xs){return xs.length ? xs.flatMap((v,i)=>orders(xs.filter((_,j)=>j!==i)).map(rest=>[v,...rest])) : [[]];}

test('all 144 original and 144 alternate examples have a solvable answer and an explanation',()=>{
 for(const m of primaryMissions)for(const a of m.activities){
  assert.equal(a.variants.length,1,a.id);
  const b={...a,...a.variants[0]};
  assert.notEqual(JSON.stringify([a.question,a.answer,a.options,a.passage,a.items,a.word]),JSON.stringify([b.question,b.answer,b.options,b.passage,b.items,b.word]),a.id);
  for(const item of [a,b]){
   assert.ok(item.explanation?.length>12,a.id);
   assert.ok(item.hint && item.idea && item.ideaAudioKey,a.id);
   if(item.type==='choice'){assert.equal(new Set(item.options).size,item.options.length,a.id);assert.equal(item.options.filter(o=>isPrimaryAnswerCorrect(item,o)).length,1,a.id);}
   else if(item.type==='order')assert.ok(orders(item.pieces.map((_,i)=>i)).some(indices=>assembledPrimaryAnswer(item,indices)===item.answer),a.id);
   else if(item.type==='sort'){
    assert.equal(item.items.length,3);assert.equal(item.categories.length,2);
    assert.equal(item.answer,item.items.map(i=>i.category).join('|'));
    assert.ok(item.items.every(i=>i.icon&&i.label&&i.category>=0&&i.category<item.categories.length));
   }else if(item.type==='quantity'){
    assert.ok(Number.isInteger(Number(item.answer))&&Number(item.answer)>=0&&Number(item.answer)<=item.capacity,a.id);
    assert.ok(item.initial>=0&&item.initial<=item.capacity,a.id);
   }else if(item.type==='place-value')assert.ok(Number(item.answer)>=0&&Number(item.answer)<=99,a.id);
   else if(item.type==='syllables')assert.equal(Number(item.answer),item.syllables.length,a.id);
   else assert.equal(item.type,'write',a.id);
  }
 }
});

test('variant changes on success, stays after mistakes and keeps the same reward key',()=>{
 const a=primaryMissions[0].activities[0];let p=normalizeProgress();
 const first=presentPrimaryActivity(a,p);
 p=recordPrimaryAttempt(p,a.id,false);
 assert.equal(presentPrimaryActivity(a,p).variantKey,first.variantKey);
 p=awardGameCompletion(recordPrimaryAttempt(p,a.id,true,{variantKey:first.variantKey}),a.id);
 const second=presentPrimaryActivity(a,p);
 assert.notEqual(second.variantKey,first.variantKey);assert.equal(second.id,first.id);
 const again=awardGameCompletion(recordPrimaryAttempt(p,a.id,true,{variantKey:second.variantKey}),a.id);
 assert.equal(again.pieces,1);assert.equal(again.stars,1);
 assert.equal(again.primaryAttempts[a.id].lastVariant,second.variantKey);
});

test('spaced review uses different calendar days and same-day repetition does not lengthen intervals',()=>{
 const id=primaryMissions[0].activities[0].id;let p=normalizeProgress();
 const date=(day,hour=10)=>new Date(2026,9,day,hour);
 p=recordPrimaryAttempt(p,id,true,{now:date(24)});
 assert.equal(p.primaryAttempts[id].reviewStage,1);assert.equal(new Date(p.primaryAttempts[id].reviewDue).getDate(),25);
 p=recordPrimaryAttempt(p,id,true,{now:date(24,12)});
 assert.equal(p.primaryAttempts[id].reviewStage,1);
 assert.equal(isReviewDue(p.primaryAttempts[id],date(24,20)),false);
 assert.equal(isReviewDue(p.primaryAttempts[id],date(25)),true);
 p=recordPrimaryAttempt(p,id,true,{now:date(25)});
 assert.equal(p.primaryAttempts[id].reviewStage,2);assert.equal(new Date(p.primaryAttempts[id].reviewDue).getDate(),28);
 p=recordPrimaryAttempt(p,id,true,{now:date(28)});
 assert.equal(p.primaryAttempts[id].reviewStage,3);assert.equal(new Date(p.primaryAttempts[id].reviewDue).getDate(),4);
 p=recordPrimaryAttempt(p,id,false,{now:date(29)});
 assert.equal(p.primaryAttempts[id].reviewStage,0);assert.equal(new Date(p.primaryAttempts[id].reviewDue).getDate(),30);
});

test('adventures prioritize a due review over new work but leave future reviews alone',()=>{
 const a=primaryMissions[1].activities[0];
 let p=normalizeProgress({completedGames:[a.id]});
 p=recordPrimaryAttempt(p,a.id,true,{now:new Date(2026,9,20,10)});
 assert.equal(buildPrimaryAdventure(p,new Date(2026,9,20,12))[0].id,primaryMissions[0].activities[0].id);
 assert.equal(buildPrimaryAdventure(p,new Date(2026,9,21,10))[0].id,a.id);
 assert.equal(isReviewDue({attempts:4,mistakes:2},new Date()),false);
});

test('alternate content never inherits the picture or passage from a different example',()=>{
 const a=primaryMissions.find(m=>m.id==='primaria-matematicas-sumas').activities[0];
 const shown=presentPrimaryActivity(a,normalizeProgress({primaryAttempts:{[a.id]:{attempts:1,mistakes:0}}}));
 assert.equal(shown.question,'3 + 4 =');assert.equal(shown.answer,'7');assert.equal(shown.visual,undefined);
 const classification=primaryMissions.find(m=>m.id==='primaria-medio-animales').activities[0];
 const next=presentPrimaryActivity(classification,normalizeProgress({primaryAttempts:{[classification.id]:{attempts:1,mistakes:0}}}));
 assert.equal(next.type,'choice');assert.equal(next.items,undefined);
});
