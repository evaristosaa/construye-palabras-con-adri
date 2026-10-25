import { useEffect, useRef, useState } from "react";
import WorldArt from "./WorldArt";
import {FriendAvatar} from "./Classmates";
import {classmateAt} from "../data/classmates.js";
import {ConstructionScene,ConstructionButton,ConstructionDialog} from "./Construction";
import {constructionFor,addConstructionWin,constructionVoices} from "../data/missionStories.js";
import { Link } from "react-router-dom";
import { buildMathWorkshop, nextWorkshopSession, splitSignature, workshopThemes, mathWorkshopVoices } from "../data/mathWorkshop.js";
import { primaryVoiceTexts } from "../data/primaryVoiceLines.js";
import { speak, speakResult } from "./audio.js";
import "../styles/mathWorkshop.css";

const voiceTexts=Object.fromEntries([...mathWorkshopVoices,...constructionVoices].map(v=>[v.key,v.text]));

function NumberLine({activity,onAnswer}) {
  const [position,setPosition]=useState(activity.start),[trail,setTrail]=useState([activity.start]);
  function jump(change) { const next=position+change;setPosition(next);setTrail(old=>[...old,next]); }
  return <div className="math-number-line">
    <div className="math-line-numbers" aria-label={`Recta del ${activity.min} al ${activity.max}`}>{Array.from({length:11},(_,i)=>i+activity.min).map(n=><span key={n} className={`${n===position?'is-current':''} ${n===activity.start?'is-start':''}`} aria-current={n===position?"step":undefined}>{n}{n===activity.start&&<small>Inicio</small>}</span>)}</div>
    <p role="status">Estoy en <strong>{position}</strong> · {trail.length-1} {trail.length===2?'salto':'saltos'}</p>
    <div className="math-jump-buttons"><button className="primary-secondary-button" disabled={position===activity.min} onClick={()=>jump(-1)} aria-label="Retroceder un salto">← −1</button><button className="primary-secondary-button" disabled={position===activity.max} onClick={()=>jump(1)} aria-label="Avanzar un salto">+1 →</button></div>
    <div className="math-actions"><button className="primary-secondary-button" onClick={()=>{setPosition(activity.start);setTrail([activity.start]);}}>Reiniciar</button><button className="primary-main-button" onClick={()=>onAnswer(String(position))}>Comprobar</button></div>
  </div>;
}

function SplitQuantity({activity,onAnswer}) {
  const [left,setLeft]=useState(Math.floor(activity.total/2)),[found,setFound]=useState([]);
  const signature=splitSignature(left,activity.total),repeated=found.includes(signature);
  function save(){if(repeated)return;const next=[...found,signature];setFound(next);if(next.length===2)onAnswer("two-ways");}
  return <div className="math-split">
    <div className="math-split-frame" aria-label={`${left} fichas azules y ${activity.total-left} fichas amarillas`}>{Array.from({length:activity.total},(_,i)=><span key={i} className={i<left?'blue':'yellow'}/>)}</div>
    <p className="math-equation" aria-live="polite">{left} + {activity.total-left} = {activity.total}</p>
    <div className="math-jump-buttons"><button className="primary-secondary-button" disabled={left===0} onClick={()=>setLeft(v=>v-1)} aria-label="Una ficha menos en el grupo azul">− Azul</button><button className="primary-secondary-button" disabled={left===activity.total} onClick={()=>setLeft(v=>v+1)} aria-label="Una ficha más en el grupo azul">+ Azul</button></div>
    <p role="status">{found.length?`Ya encontraste: ${found[0]}. Busca otra.`:"Encuentra dos repartos diferentes."}</p>
    <button className="primary-main-button" disabled={repeated} onClick={save}>{repeated?"Cambia el reparto":"Guardar esta forma"}</button>
  </div>;
}

function MathRepresentation({activity}) {
  if(activity.dots)return <div className="math-dice" role="img" aria-label={activity.dots.map(n=>`${n} puntos`).join(" y ")}>{activity.dots.filter(n=>n>0).map((n,i)=><div key={i} className="math-die">{Array.from({length:n},(_,j)=><span key={j}/>)}</div>)}</div>;
  if(activity.pattern)return <div className="math-pattern" aria-label={activity.pattern.map(p=>p==='●'?'círculo':p==='▲'?'triángulo':'interrogación').join(', ')}>{activity.pattern.map((p,i)=><span key={i}>{p}</span>)}</div>;
  if(activity.measure)return <div className="math-measure" role="img" aria-label={`Cinta sobre ${activity.measure} cuadrados iguales`}><div className="math-ribbon"/><div>{Array.from({length:activity.measure},(_,i)=><span key={i}/>)}</div><small>Cada cuadrado = 1 unidad</small></div>;
  if(activity.chart)return <div className="math-chart"><small>Cada ● = 1 voto</small>{activity.chart.map(row=><div key={row.label} aria-label={`${row.label}: ${row.value} votos`}><span>{row.icon} {row.label}</span><strong aria-hidden="true">{"●".repeat(row.value)}</strong></div>)}</div>;
  return null;
}

export default function MathWorkshop({progress,completeGame,attemptPrimaryActivity}) {
  const [range,setRange]=useState(10),[session,setSession]=useState(()=>nextWorkshopSession(progress,10)),[started,setStarted]=useState(false),[index,setIndex]=useState(0),[feedback,setFeedback]=useState(null),[reflection,setReflection]=useState("");
  const heading=useRef(null),feedbackButton=useRef(null),locked=useRef(false);
  const project=constructionFor("matematicas");
  const [constructionWins,setConstructionWins]=useState([]),[showConstruction,setShowConstruction]=useState(false);
  const buildButton=useRef(null),buildWasOpen=useRef(false);
  useEffect(()=>{if(buildWasOpen.current&&!showConstruction)buildButton.current?.focus({preventScroll:true});buildWasOpen.current=showConstruction;},[showConstruction]);
  const activities=buildMathWorkshop(range,session),activity=activities[Math.min(index,2)],finished=index===3;
  const audioKey=!started?"quest-matematicas":finished?"math-reflect":activity.audioKey;
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[started,index,session]);
  useEffect(()=>{if(feedback)feedbackButton.current?.focus();else heading.current?.focus({preventScroll:true});},[feedback]);
  useEffect(()=>{speak(voiceTexts[audioKey]||primaryVoiceTexts[audioKey],progress.voice,progress.voiceURI,{audioKey});},[audioKey,progress.voice,progress.voiceURI]);
  function answer(value){
    if(locked.current)return;
    const correct=activity.type==="split"?value==="two-ways":value===activity.answer;
    attemptPrimaryActivity(activity.id,correct,{variantKey:"workshop"});
    if(correct){locked.current=true;setConstructionWins(wins=>addConstructionWin(wins,activity.id));completeGame(activity.id);}
    setFeedback({correct,text:correct?activity.explanation:activity.hint});
    speakResult(correct?"success":"retry",progress.voice,progress.sound,progress.voiceURI);
  }
  function closeFeedback(){if(feedback.correct){setIndex(i=>i+1);locked.current=false;}setFeedback(null);}
  function start(){setConstructionWins([]);setIndex(0);setReflection("");setFeedback(null);locked.current=false;setStarted(true);}
  return <section className="math-workshop comic-panel">
    <header inert={feedback||showConstruction?true:undefined}><Link className="primary-text-link" to="/primaria?materia=matematicas">← Matemáticas</Link>{started&&<ConstructionButton project={project} count={constructionWins.length} total={3} buttonRef={buildButton} onClick={()=>setShowConstruction(true)}/>}<button className="primary-help-button" aria-label="Escuchar ayuda" onClick={()=>speak(voiceTexts[audioKey]||primaryVoiceTexts[audioKey],progress.voice,progress.voiceURI,{audioKey})}>🔊</button></header>
    {!started?<div className="math-intro illustrated-math"><h1 ref={heading} tabIndex={-1}>🎲 Mis juegos de mates</h1><WorldArt subject="matematicas" className="math-intro-scene"/><p className="math-steps-caption">{project.task}</p><fieldset><legend>Elige las cantidades</legend>{[10,20].map(n=><button key={n} className="primary-secondary-button" aria-pressed={range===n} onClick={()=>{setRange(n);setSession(nextWorkshopSession(progress,n));}}>Hasta {n}</button>)}</fieldset><h2>{workshopThemes[session]}</h2><nav className="math-session-picker" aria-label="Elegir juego de matemáticas"><button className="primary-secondary-button" disabled={session===0} onClick={()=>setSession(s=>s-1)} aria-label="Juego anterior">←</button><span>{session+1} / 6</span><button className="primary-secondary-button" disabled={session===5} onClick={()=>setSession(s=>s+1)} aria-label="Juego siguiente">→</button></nav><p>3 retos · sin reloj · puedes usar objetos</p><button className="primary-main-button" onClick={start}>¡Vamos a jugar!</button></div>:finished?<div className="math-reflection" inert={showConstruction?true:undefined}><p className="eyebrow">🌟 ¡Obra terminada! · Lo cuento</p><h1 ref={heading} tabIndex={-1}>¿Cómo lo has pensado?</h1><p>Cuéntaselo a alguien o dibújalo.</p><div className="math-feelings" aria-label="Cómo me he sentido">{["😊 Yo solo","🤝 Con ayuda","🌱 Quiero practicar"].map(label=><button className="primary-secondary-button" key={label} aria-pressed={reflection===label} onClick={()=>setReflection(label)}>{label}</button>)}</div><p role="status">{reflection.includes("practicar")?"Podemos repetir usando fichas u objetos reales.":reflection?"Gracias por contarlo. Aprender con ayuda también cuenta.":"No hay una respuesta buena o mala."}</p><p className="math-offscreen">Fuera de la pantalla: {session===3?"mide un lápiz usando piezas iguales, sin dejar huecos.":session===4?"pregunta por la fruta favorita en casa y dibuja un voto por persona.":"reparte diez objetos en dos grupos y enseña dos formas distintas."}</p><div className="math-actions"><button className="primary-main-button" onClick={()=>{setSession(nextWorkshopSession(progress,range));setStarted(false);}}>Elegir otro juego</button><button className="primary-secondary-button" onClick={start}>Repetir</button></div></div>:<>
      <div className="math-stage" inert={feedback||showConstruction?true:undefined}><div className="eyebrow math-stage-label"><FriendAvatar name={classmateAt(index).name} className="math-stage-buddy"/>{activity.phase} · {index+1} / 3</div><progress max="3" value={index} aria-label="Avance del juego"/><h1 ref={heading} tabIndex={-1}>{activity.question}</h1><MathRepresentation activity={activity}/><div className="math-exercise" key={activity.id}>
        {activity.type==="line"?<NumberLine activity={activity} onAnswer={answer}/>:activity.type==="split"?<SplitQuantity activity={activity} onAnswer={answer}/>:<div className="math-choices">{activity.options.map(option=><button key={option} className="primary-secondary-button" onClick={()=>answer(option)}>{activity.type==="shape"?<><svg width="65" height="65" viewBox="0 0 70 70" aria-hidden="true">{option==="Triángulo"?<polygon points="9,12 60,32 20,62"/>:option==="Cuadrado"?<rect x="12" y="12" width="46" height="46"/>:<circle cx="35" cy="35" r="25"/>}</svg><span className="sr-only">{option}</span></>:option}</button>)}</div>}
      </div><button className="primary-text-link math-hint" onClick={()=>setFeedback({correct:false,text:activity.hint})}>💡 Una pista</button></div>
      {feedback&&<div className="primary-feedback-shade"><div className="primary-feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="math-feedback-title" onKeyDown={e=>{if(e.key==="Tab"){e.preventDefault();feedbackButton.current?.focus();}if(e.key==="Escape"&&!feedback.correct)closeFeedback();}}>{feedback.correct&&<div className="world-celebration construction-celebration" aria-hidden="true"><ConstructionScene project={project} count={constructionWins.length} total={3} decorative/><span>🌟</span><i>✦</i><i>✦</i><i>✦</i></div>}<h2 id="math-feedback-title">{feedback.correct?constructionWins.length===3?"¡Obra terminada!":"¡Tu obra crece!":"Prueba con esta idea"}</h2><p>{feedback.text}</p><button ref={feedbackButton} className="primary-main-button" onClick={closeFeedback}>{feedback.correct?index===2?"Lo cuento →":"Siguiente reto →":"Volver al reto"}</button></div></div>}
    </>}
    {showConstruction&&<ConstructionDialog project={project} count={constructionWins.length} total={3} progress={progress} onClose={()=>setShowConstruction(false)}/>}
  </section>;
}
