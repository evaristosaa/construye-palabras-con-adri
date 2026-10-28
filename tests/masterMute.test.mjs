import test from 'node:test';
import assert from 'node:assert/strict';
import {speak,setAudioMuted,playClap,playPositive} from '../src/components/audio.js';
import {normalizeProgress} from '../src/hooks/progressModel.js';
import {exportProgressBackup,importProgressBackup} from '../src/storage/progressStorage.js';

test('master mute immediately stops the current voice, tones and clap, blocks new audio and never replays cancelled work',()=>{
 const oldWindow=globalThis.window,oldAudio=globalThis.Audio;let plays=0,pauses=0,clapStops=0,closes=0,contexts=0;
 class Recording{constructor(){this.currentTime=3;}play(){plays++;return Promise.resolve();}pause(){pauses++;}}
 const param=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}});
 class Context{constructor(){contexts++;this.currentTime=0;this.sampleRate=24000;this.state='running';this.destination={};}createBuffer(c,n){return {getChannelData:()=>new Float32Array(n)};}createGain(){return {gain:param(),connect(){return this;},disconnect(){}};}createBiquadFilter(){return {frequency:{},Q:{},connect(){},disconnect(){}};}createBufferSource(){return {connect(){},disconnect(){},start(){},stop(){clapStops++;}};}createOscillator(){return {frequency:{},connect(){return this;},start(){},stop(){}};}close(){closes++;return Promise.resolve();}}
 try{globalThis.window={Audio:Recording,AudioContext:Context,speechSynthesis:{cancel(){},getVoices:()=>[]}};globalThis.Audio=Recording;setAudioMuted(false);
  const recording=speak('Una ayuda',true,'',{audioKey:'primary-intro'});playPositive();playClap();assert.equal(plays,1);assert.equal(contexts,2);
  setAudioMuted(true);assert.equal(pauses,1);assert.equal(recording.currentTime,0);assert.equal(clapStops,1);assert.equal(closes,1);
  const before=contexts;assert.equal(speak('Otra ayuda',true,'',{audioKey:'primary-intro'}),undefined);assert.equal(playClap(true),false);playPositive();assert.equal(contexts,before);assert.equal(plays,1);
  setAudioMuted(false);assert.equal(plays,1);speak('Nueva ayuda',true,'',{audioKey:'primary-intro'});assert.equal(plays,2);
 }finally{setAudioMuted(false);if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;if(oldAudio===undefined)delete globalThis.Audio;else globalThis.Audio=oldAudio;}
});
test('muting cancels a browser voice waiting for its voice list, even after unmuting',async()=>{
 const previous={window:globalThis.window,SpeechSynthesisUtterance:globalThis.SpeechSynthesisUtterance};let spoken=0;
 try{globalThis.window={speechSynthesis:{cancel(){},getVoices:()=>[],speak(){spoken++;}}};globalThis.SpeechSynthesisUtterance=class{};setAudioMuted(false);speak('Pendiente');const pending=window.speechSynthesis.onvoiceschanged;assert.equal(typeof pending,'function');setAudioMuted(true);setAudioMuted(false);pending();await new Promise(resolve=>setTimeout(resolve,300));assert.equal(spoken,0);
 }finally{setAudioMuted(false);for(const [key,value] of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
test('the saved mute flag preserves separate voice/effect preferences, awards and old backups',()=>{
 const original=normalizeProgress({muted:true,voice:true,sound:false,stars:14,completedGames:['a','b']});const restored=importProgressBackup(exportProgressBackup(original)).progress;assert.equal(restored.muted,true);assert.equal(restored.voice,true);assert.equal(restored.sound,false);assert.equal(restored.stars,14);assert.equal(restored.pieces,2);assert.equal(normalizeProgress({stars:14}).muted,false);assert.throws(()=>importProgressBackup(JSON.stringify({format:'adri-progress-backup',version:1,progress:{muted:'yes'}})));
});
