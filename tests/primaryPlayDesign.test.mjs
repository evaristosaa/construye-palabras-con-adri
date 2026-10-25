import test from 'node:test';
import assert from 'node:assert/strict';
import {primaryMissions} from '../src/data/primaryData.js';
import {storyCharacters,storyPlaces,storyEvents,composeStory,beyondScreen} from '../src/data/primaryPlayDesign.js';
const mission=topic=>primaryMissions.find(m=>m.id.endsWith('-'+topic));

test('36 arithmetic presentations have feasible boards and preserve the numeric result',()=>{
 const all=['sumas','restas','calculo'].flatMap(topic=>mission(topic).activities.flatMap(a=>[a,...a.variants]));
 assert.equal(all.length,36);
 for(const a of all){
  assert.equal(a.type,'quantity');assert.ok([10,20].includes(a.capacity));
  assert.ok(a.initial>=0&&a.initial<=a.capacity);assert.ok(Number(a.answer)>=0&&Number(a.answer)<=a.capacity);
  const expression=a.question.match(/^(\d+)\s*([+−])\s*(\d+)\s*=/);
  if(expression){const [,x,operator,y]=expression;assert.equal(Number(a.answer),operator==='+'?Number(x)+Number(y):Number(x)-Number(y),a.question);}
 }
 assert.equal(mission('restas').activities[4].answer,'0');
 assert.equal(mission('sumas').activities[4].initial,0);
});

test('place value requires the correct tens and units for all six presentations',()=>{
 const originals=mission('decenas').activities.slice(0,3);
 assert.deepEqual(originals.map(a=>Number(a.answer)),[10,24,35]);
 assert.deepEqual(originals.map(a=>Number(a.variants[0].answer)),[30,42,64]);
 for(const a of originals.flatMap(a=>[a,...a.variants])){assert.equal(a.type,'place-value');const value=Number(a.answer);assert.equal(Math.floor(value/10)*10+value%10,value);assert.ok(value%10<=9);}
});

test('clapping activities use checked Spanish syllable divisions, not letter counts',()=>{
 const all=mission('palabras').activities.flatMap(a=>[a,...a.variants]).filter(a=>a.type==='syllables');
 assert.equal(all.length,6);
 const expected={casa:'ca-sa',sopa:'so-pa',pelota:'pe-lo-ta',tomate:'to-ma-te',camisa:'ca-mi-sa',zapato:'za-pa-to'};
 for(const a of all){assert.equal(a.syllables.join('-'),expected[a.word]);assert.equal(Number(a.answer),a.syllables.length);assert.ok(a.syllables.length<=6);}
});

test('all 27 story combinations are complete and invalid choices cannot create a story',()=>{
 const stories=[];
 for(const character of storyCharacters)for(const place of storyPlaces)for(const event of storyEvents){const text=composeStory(character,place,event);assert.ok(text.includes(character.name)&&text.includes(place.name)&&text.includes(event.name));stories.push(text);}
 assert.equal(new Set(stories).size,27);
 assert.equal(composeStory(null,storyPlaces[0],storyEvents[0]),'');
 assert.equal(composeStory({name:'otra persona'},storyPlaces[0],storyEvents[0]),'');
});

test('each mission ends with one concrete invitation to continue away from the screen',()=>{
 for(const m of primaryMissions){assert.equal(typeof beyondScreen[m.activities[0].topic],'string');assert.ok(beyondScreen[m.activities[0].topic].length>20);}
});
