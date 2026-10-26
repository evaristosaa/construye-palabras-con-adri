import test from 'node:test';
import assert from 'node:assert/strict';
import {speak} from '../src/components/audio.js';

test('blocked autoplay does not replace Adri with the browser voice; an explicit tap can retry',async()=>{
  const previous=Object.fromEntries(['window','Audio','SpeechSynthesisUtterance'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
  let attempts=0,synthetic=0;
  class Recording {
    pause(){}
    play(){attempts++;return attempts===1?Promise.reject(Object.assign(new Error('Gesture required'),{name:'NotAllowedError'})):Promise.resolve();}
  }
  try{
    globalThis.Audio=Recording;
    globalThis.SpeechSynthesisUtterance=class {};
    globalThis.window={Audio:Recording,speechSynthesis:{cancel(){},getVoices:()=>[{lang:'es-ES',name:'Pablo'}],speak(){synthetic++;}}};
    speak('Una ayuda',true,'',{audioKey:'primary-intro'});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(attempts,1);
    assert.equal(synthetic,0);
    speak('Una ayuda',true,'',{audioKey:'primary-intro'});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(attempts,2);
    assert.equal(synthetic,0);
  }finally{
    for(const [key,descriptor] of Object.entries(previous)){
      if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];
    }
  }
});
