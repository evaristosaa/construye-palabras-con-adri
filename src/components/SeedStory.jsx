import FriendScene from "./FriendScene";
import {useRef,useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {seedStory} from '../data/seedStory.js';
import SnackStoryPlayer from './SnackStoryPlayer';
import NarrationButton from './NarrationButton';
import {speakResult} from './audio.js';

export default function SeedStory({progress,completeGame,attemptPrimaryActivity}) {
  const [reading,setReading]=useState(true),[page,setPage]=useState(0),[playing,setPlaying]=useState(false);
  const [index,setIndex]=useState(0),[feedback,setFeedback]=useState(''),[solved,setSolved]=useState(false);
  const heading=useRef(null),locked=useRef(false),supported=useRef(false);
  const question=seedStory.questions[index],finished=index===seedStory.questions.length;
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[reading,index]);
  function startQuestions(){
    const next=seedStory.questions.findIndex(q=>!progress.completedGames.includes(q.id));
    setIndex(Math.max(0,next));setSolved(false);setFeedback('');locked.current=false;setReading(false);
  }
  function answer(text){
    if(locked.current)return;
    const correct=text===question.answer;
    attemptPrimaryActivity(question.id,correct,{variantKey:seedStory.id,supported:supported.current});
    if(correct){locked.current=true;setSolved(true);completeGame(question.id);speakResult('success',progress.voice,progress.sound,progress.voiceURI);}
    if(!correct)supported.current=true;
    setFeedback(correct?question.explanation:question.hint);
  }
  return <section className="seed-reader comic-panel" style={{'--garden-scene':`url("${import.meta.env.BASE_URL}assets/worlds/discovery-garden.webp")`}}>
    <header><Link className="primary-secondary-button" to="/primaria/cuentos">← Cuentos</Link><span>La semilla de Cayetana</span></header>
    {reading ? <>
      <div className={`seed-scene growth-${page}`} aria-hidden="true"><div className="seed-pot"><svg viewBox="0 0 180 180"><path d="m38 108 14 62h77l14-62Z" fill="#d88953" stroke="#784726" strokeWidth="5"/><ellipse cx="90" cy="108" rx="57" ry="14" fill="#71503b" stroke="#784726" strokeWidth="5"/>{page<2?<ellipse cx="90" cy="103" rx="10" ry="6" fill="#e8c481"/>:<><path d="M90 108V57" fill="none" stroke="#43874d" strokeWidth="7"/><path d="M90 80Q40 78 53 40q39-1 37 40M91 67q47 2 36-40-37 0-36 40" fill="#80bf69" stroke="#43874d" strokeWidth="4"/></>}</svg></div><FriendScene scene={page===2?"celebrate":"explore"}/></div>
      <div className="seed-story-copy"><p className="eyebrow">Un cuento para leer y descubrir</p><h1 ref={heading} tabIndex={-1}>{seedStory.title}</h1><p className={playing?'reading-is-playing':''}>{seedStory.pages[page].text}</p>{progress.voice&&<SnackStoryPlayer lines={seedStory.pages} progress={progress} onSentence={setPage} onPlaying={setPlaying} onFinish={startQuestions} onListen={()=>{}}/>}</div>
      <button className="primary-main-button" onClick={()=>{if(!progress.voice&&page<2)setPage(p=>p+1);else startQuestions();}}>{!progress.voice&&page<2?"Seguir leyendo →":"Ir a las preguntas →"}</button>
    </> : finished ? <div className="seed-ending"><span aria-hidden="true">🌱🌟</span><h1 ref={heading} tabIndex={-1}>¡Cuento terminado!</h1><p>Los amigos cuidaron juntos de su planta.</p><p>Con alguien de casa, observa una planta y dibuja una hoja.</p><button className="primary-main-button" onClick={()=>{setReading(true);setPage(0);}}>Volver a escuchar</button><Link className="primary-secondary-button" to="/primaria/cuentos">Elegir otro cuento</Link></div> : <>
      <div className="seed-question-heading"><p className="eyebrow">Pienso sobre el cuento · {index+1} / 3</p><h1 ref={heading} tabIndex={-1}>{question.question}</h1><NarrationButton key={question.id} audioKey={`seed-question-${index+1}`} text={question.question} progress={progress} label="Escuchar pregunta"/></div>
      <div className="seed-answers">{question.options.map(option=><button className="primary-secondary-button" key={option.text} disabled={solved} onClick={()=>answer(option.text)}><span aria-hidden="true">{option.icon}</span><strong>{option.text}</strong></button>)}</div>
      <p className={`seed-feedback ${solved?'is-success':''}`} role="status">{feedback||'Puedes volver al cuento si lo necesitas.'}</p>
      <footer><button className="primary-secondary-button" onClick={()=>{setReading(true);setPage(0);}}>Volver al cuento</button><button className="primary-main-button" disabled={!solved} onClick={()=>{setIndex(i=>i+1);setSolved(false);setFeedback('');locked.current=false;supported.current=false;}}>Seguir →</button></footer>
    </>}
  </section>;
}
