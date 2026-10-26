import test from 'node:test';
import assert from 'node:assert/strict';
import {progressStorageKey,progressBackupKey,loadStoredProgress,saveStoredProgress,clearStoredProgress,importProgressBackup,exportProgressBackup} from '../src/storage/progressStorage.js';
const memory=()=>{const entries=new Map();return{getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};};
test('reset tries to clear both copies and reports a blocked deletion',()=>{
 const seen=[];
 assert.throws(()=>clearStoredProgress({removeItem:key=>{seen.push(key);if(key===progressStorageKey)throw Error('blocked');}}),/blocked/);
 assert.deepEqual(seen,[progressStorageKey,progressBackupKey]);
});

test('a backup round trip preserves old progress, settings and the in-progress scene',()=>{
 const raw={progressVersion:2,stars:9,completedLevels:['letra-n'],completedGames:['a','a','b'],primaryAttempts:{x:{attempts:2,mistakes:1}},readingFont:'round',voice:false,adventures:{'merienda-v1':{version:1,stage:3,basket:['apple']}}};
 const restored=importProgressBackup(exportProgressBackup(raw)).progress;
 assert.deepEqual(restored.completedLevels,['letra-n']);assert.equal(restored.pieces,2);assert.equal(restored.stars,9);assert.equal(restored.voice,false);assert.equal(restored.readingFont,'round');assert.deepEqual(restored.adventures,raw.adventures);
});
test('an unreadable main save recovers the last valid copy and never replaces it with corrupt bytes',()=>{
 const s=memory();saveStoredProgress(s,{stars:2,completedGames:['a']});saveStoredProgress(s,{stars:3,completedGames:['a','b']});
 s.setItem(progressStorageKey,'{broken');const recovered=loadStoredProgress(s);assert.equal(recovered.recovered,true);assert.equal(recovered.progress.stars,2);
 saveStoredProgress(s,recovered.progress);assert.equal(loadStoredProgress(s).progress.stars,2);assert.doesNotThrow(()=>JSON.parse(s.getItem(progressBackupKey)));
});
test('storage errors are reported without crashing, and a reset clears both copies',()=>{
 const blocked={getItem:()=>null,setItem:()=>{throw Error('quota');}};assert.equal(saveStoredProgress(blocked,{stars:0}).ok,false);
 const s=memory();saveStoredProgress(s,{stars:5});clearStoredProgress(s);assert.equal(s.getItem(progressStorageKey),null);assert.equal(s.getItem(progressBackupKey),null);assert.equal(loadStoredProgress(s).progress.stars,0);
});
test('invalid or future imports cannot overwrite progress',()=>{
 for(const text of ['bad','[]',JSON.stringify({format:'other',version:1,progress:{}}),JSON.stringify({format:'adri-progress-backup',version:99,progress:{}}),JSON.stringify({format:'adri-progress-backup',version:1,progress:{stars:-1}}),JSON.stringify({format:'adri-progress-backup',version:1,progress:{completedGames:'all'}}),'{"format":"adri-progress-backup","version":1,"progress":{"__proto__":{"polluted":true}}}'])assert.throws(()=>importProgressBackup(text));
 assert.equal({}.polluted,undefined);
});
