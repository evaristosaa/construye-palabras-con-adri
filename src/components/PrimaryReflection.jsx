import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { speak } from "./audio.js";

import {ConstructionButton,ConstructionDialog} from "./Construction";
import { subjectWorkshopInfo } from "../data/subjectWorkshop.js";
import { mathWorkshopVoices } from "../data/mathWorkshop.js";
import "../styles/mathWorkshop.css";
import "../styles/subjectWorkshop.css";

export default function PrimaryReflection({mission,activity,progress,invitation,nextMission,project,constructionCount=0}) {
  const [feeling,setFeeling]=useState("");
  const heading=useRef(null);
  const [showConstruction,setShowConstruction]=useState(false);
  const buildButton=useRef(null),wasOpen=useRef(false);
  const subject=mission.subject||activity.subject;
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
  useEffect(()=>{if(wasOpen.current&&!showConstruction)buildButton.current?.focus({preventScroll:true});wasOpen.current=showConstruction;},[showConstruction]);
  const cue=mathWorkshopVoices.find(v=>v.key==="math-reflect");
  return <section className="math-workshop primary-reflection comic-panel">
    <header inert={showConstruction?true:undefined}><Link className="primary-text-link" to={mission.returnTo||(mission.adventure?"/primaria":`/primaria?materia=${subject}`)}>← Elegir juego</Link><ConstructionButton project={project} count={constructionCount} total={mission.activities.length} buttonRef={buildButton} onClick={()=>setShowConstruction(true)}/><button className="primary-help-button" aria-label="Escuchar ayuda" onClick={()=>speak(cue.text,progress.voice,progress.voiceURI,{audioKey:cue.key})}>🔊</button></header>
    <div className="math-reflection" inert={showConstruction?true:undefined}><p className="eyebrow">{constructionCount===mission.activities.length?"🌟 ¡Obra terminada!":"🌟 ¡Retos conseguidos!"} · Ahora lo cuento</p><h1 ref={heading} tabIndex={-1}>¿Qué has descubierto?</h1><p>{subjectWorkshopInfo[subject]?.reflection||"Cuéntaselo a alguien o dibuja cómo lo has resuelto."}</p>
      <div className="math-feelings" aria-label="Cómo he aprendido">{["😊 Yo solo","🤝 Con ayuda","🌱 Quiero practicar"].map(label=><button key={label} className="primary-secondary-button" aria-pressed={feeling===label} onClick={()=>setFeeling(label)}>{label}</button>)}</div>
      <p role="status">{feeling.includes("practicar")?"Puedes repetir con calma y pedir ayuda.":feeling?"¡Cada intento te ayuda a aprender!":"Aprender con ayuda también cuenta."}</p>
      <p className="math-offscreen">Fuera de la pantalla: {invitation}</p>
      <div className="math-actions"><Link className="primary-main-button" to={nextMission?`/primaria/mision/${nextMission.id}`:mission.returnTo||(mission.adventure?"/primaria":`/primaria?materia=${subject}`)}>{nextMission?"Siguiente misión →":"Elegir otro juego"}</Link><Link className="primary-secondary-button" to="/logros">Mis pegatinas ★</Link></div>
    </div>
    {showConstruction&&<ConstructionDialog project={project} count={constructionCount} total={mission.activities.length} progress={progress} onClose={()=>setShowConstruction(false)}/>}
  </section>;
}
