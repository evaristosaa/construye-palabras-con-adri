import {useState} from 'react';
import NarrationButton from './NarrationButton';
import {passageAudioKey} from '../data/primaryReadings.js';
import {localVoiceFiles} from '../data/localVoiceFiles.js';

export default function PrimaryReadingPanel({activity,progress,heading,onContinue}) {
  const [playing,setPlaying]=useState(false);
  const audioKey=passageAudioKey(activity);
  return <div className="primary-reading-step">
    <div className="primary-reading-title"><h1 ref={heading} tabIndex={-1}>Lee con calma</h1><NarrationButton audioKey={audioKey} text={activity.passage} progress={{...progress,voice:progress.voice&&Boolean(localVoiceFiles[audioKey])}} label="Escuchar texto" onPlayingChange={setPlaying}/></div>
    <div className={`primary-reading ${playing?'reading-is-playing':''}`}><p>{activity.passage}</p></div>
    <button className="primary-main-button" onClick={onContinue}>Ya lo he leído →</button>
  </div>;
}
