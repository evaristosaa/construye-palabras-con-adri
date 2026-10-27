import {useSessionState} from "../storage/sessionDrafts.js";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MissionPlayer } from "./PrimaryGame";
import { buildSubjectWorkshop, subjectWorkshopInfo } from "../data/subjectWorkshop.js";
import { speak } from "./audio.js";
import WorldArt from "./WorldArt";
import {constructionFor} from "../data/missionStories.js";
import "../styles/subjectWorkshop.css";

export default function SubjectWorkshop(props) {
  const {subjectId}=useParams();
  if(subjectId==="matematicas")return <Navigate to="/primaria/mates" replace/>;
  if(!subjectWorkshopInfo[subjectId])return <Navigate to="/primaria" replace/>;
  return <PreparedWorkshop key={subjectId} subjectId={subjectId} {...props}/>;
}
function PreparedWorkshop({subjectId,...props}) {
  const [started,setStarted]=useState(false);
  const info=subjectWorkshopInfo[subjectId];
  const project=constructionFor(subjectId);
  const [mission]=useSessionState(`prepared:taller-${subjectId}`,()=>({id:`taller-${subjectId}`,subject:subjectId,title:info.title,adventure:true,workshop:true,returnTo:`/primaria?materia=${subjectId}`,activities:buildSubjectWorkshop(subjectId,props.progress)}));
  useEffect(()=>{if(!started)speak(project.voice,props.progress.voice,props.progress.voiceURI,{audioKey:project.audioKey});},[started,props.progress.voice,props.progress.voiceURI]);
  if(started)return <MissionPlayer draftKey={`prepared:taller-${subjectId}`} mission={mission} {...props}/>;
  return <section className={`subject-workshop-intro illustrated-intro comic-panel subject-${subjectId}`}><header className="workshop-top"><Link className="primary-secondary-button" to={mission.returnTo}>← {subjectId==="lengua"?"Lengua":"Conocimiento del Medio"}</Link>{subjectId==="lengua"&&<Link className="primary-main-button" to="/primaria/cuentos">📚 Leer cuentos</Link>}<Link className="primary-secondary-button" to="/primaria/album">🎨 Mi álbum y diario</Link></header><h1>{info.icon} {info.title}</h1><p>{project.task}</p><WorldArt subject={subjectId} className="workshop-scene"/><ol><li><span aria-hidden="true">💭</span><strong>Pienso</strong><small>Recuerdo algo que sé</small></li><li><span aria-hidden="true">🧩</span><strong>Pruebo</strong><small>{info.action}</small></li><li><span aria-hidden="true">💬</span><strong>Lo cuento</strong><small>Explico mi descubrimiento</small></li></ol><p>3 retos variados · con pistas · sin prisas</p><button className="primary-main-button" onClick={()=>setStarted(true)}>¡Vamos a jugar!</button></section>;
}
