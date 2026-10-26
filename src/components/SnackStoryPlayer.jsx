import {useEffect,useRef,useState} from 'react';
import {speak,stopSpeaking} from './audio.js';
import {snackStory} from '../data/snackAdventure.js';

// One playback session owns all three approved recordings, including pause and cleanup.
export default function SnackStoryPlayer({progress,onSentence,onPlaying,onFinish,onListen}) {
  const [state,setState]=useState('idle');
  const track=useRef(null),index=useRef(0),generation=useRef(0),status=useRef('idle');
  const callbacks=useRef({onSentence,onPlaying,onFinish,onListen});
  callbacks.current={onSentence,onPlaying,onFinish,onListen};
  function update(value){status.current=value;setState(value);callbacks.current.onPlaying(value==='playing');}
  function playSentence(next,token){
    if(token!==generation.current)return;
    index.current=next;callbacks.current.onSentence(next);update('loading');
    const line=snackStory[next];
    track.current=speak(line.text,true,progress.voiceURI,{audioKey:line.audioKey,recordingOnly:true,onPlaybackChange(value){
      if(token!==generation.current)return;
      if(value==='ended'){
        if(next+1<snackStory.length)playSentence(next+1,token);
        else {update('ended');callbacks.current.onFinish();}
      }else update(value);
    }});
  }
  function start(){callbacks.current.onListen();playSentence(0,++generation.current);}
  useEffect(()=>{
    if(progress.voice)start();
    return()=>{generation.current++;if(track.current)stopSpeaking(track.current);};
  },[progress.voice]);
  function toggle(){
    if(status.current==='playing'){track.current?.pause();return;}
    if(status.current==='paused'&&track.current){track.current.play().catch(()=>update('blocked'));return;}
    start();
  }
  return <span className="narration-control"><button className="primary-secondary-button narration-button" disabled={!progress.voice||state==='loading'} onClick={toggle}>{state==='playing'?'⏸ Pausar cuento':state==='paused'?'▶ Continuar cuento':'🔊 Escuchar cuento completo'}</button>{['blocked','error'].includes(state)&&<small role="status">Toca para escuchar todo el cuento.</small>}</span>;
}
