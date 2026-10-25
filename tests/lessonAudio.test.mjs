import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,statSync} from 'node:fs';
import {lessonVoiceLines} from '../src/data/primaryLessonSupport.js';
import {localVoiceFiles} from '../src/data/localVoiceFiles.js';

test('all 24 learning ideas have their own generated recording with the matching text',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/adri-local/manifest.json',import.meta.url),'utf8'));
 assert.equal(lessonVoiceLines.length,24);
 for(const line of lessonVoiceLines){
  const entry=manifest.files.find(f=>f.key===line.key);
  assert.equal(entry?.text,line.text,line.key);
  assert.equal(localVoiceFiles[line.key],entry.filename,line.key);
  const file=new URL(`../public/audio/adri-local/${entry.filename}`,import.meta.url);
  assert.ok(statSync(file).size>1000,line.key);
  assert.equal(readFileSync(file).subarray(0,4).toString(),'RIFF',line.key);
  assert.ok(entry.durationSeconds>1&&entry.durationSeconds<12,line.key);
 }
});

test('six syllable words have individual recordings matching their displayed word',async()=>{
 const {wordVoiceLines}=await import('../src/data/primaryPlayDesign.js');
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/adri-local/manifest.json',import.meta.url),'utf8'));
 assert.equal(wordVoiceLines.length,6);
 for(const line of wordVoiceLines){const entry=manifest.files.find(f=>f.key===line.key);assert.equal(entry?.text,line.text);assert.equal(localVoiceFiles[line.key],entry.filename);assert.ok(entry.durationSeconds>.2&&entry.durationSeconds<8);assert.ok(statSync(new URL(`../public/audio/adri-local/${entry.filename}`,import.meta.url)).size>1000);}
});
