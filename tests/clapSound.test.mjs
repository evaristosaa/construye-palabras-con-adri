import test from 'node:test';
import assert from 'node:assert/strict';
import {playClap,speak} from '../src/components/audio.js';

test('each tap plays a short clap, reuses its context, respects mute and keeps narration playing',()=>{
  const oldWindow=globalThis.window,oldAudio=globalThis.Audio;
  let contexts=0,pauses=0,buffer,disconnected=0;
  const sources=[];
  class Context {
    constructor(){contexts++;this.sampleRate=48000;this.state='running';this.destination={};}
    createBuffer(channels,size){buffer=new Float32Array(size);return{getChannelData:()=>buffer};}
    createBufferSource(){const node={connect(){},disconnect(){disconnected++;},start(){sources.push(node);}};return node;}
    createBiquadFilter(){return{frequency:{},Q:{},connect(){},disconnect(){disconnected++;}};}
    createGain(){return{gain:{},connect(){},disconnect(){disconnected++;}};}
  }
  class Recording {play(){return Promise.resolve();} pause(){pauses++;}}
  try {
    globalThis.window={AudioContext:Context,Audio:Recording};globalThis.Audio=Recording;
    assert.equal(playClap(false),false);assert.equal(contexts,0);
    speak('Una palabra',true,'',{audioKey:'word-casa'});
    for(let i=0;i<6;i++)assert.equal(playClap(true),true);
    assert.equal(contexts,1);assert.equal(sources.length,6);assert.equal(pauses,0);
    assert.equal(playClap(false),false);assert.equal(sources.length,6);
    assert.ok(buffer.length/48000<=.2);assert.ok(buffer.some(n=>Math.abs(n)>.05));
    assert.ok(buffer.every(n=>Number.isFinite(n)&&Math.abs(n)<=1));
    for(const source of sources)source.onended();assert.equal(disconnected,18);
    globalThis.window={};assert.equal(playClap(true),false);
  } finally {
    if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;
    if(oldAudio===undefined)delete globalThis.Audio;else globalThis.Audio=oldAudio;
  }
});
