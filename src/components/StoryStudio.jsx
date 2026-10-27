import {blankCreation,saveCreation} from "../storage/creativeStore.js";
import {useSessionState} from "../storage/sessionDrafts.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { storyCharacters, storyPlaces, storyEvents, composeStory } from "../data/primaryPlayDesign.js";
import { primaryVoiceTexts } from "../data/primaryVoiceLines.js";
import { speak } from "./audio.js";
import WorldArt from "./WorldArt";
import {FriendPortrait,FriendAvatar} from "./Classmates";

export default function StoryStudio({progress}) {
  const [step,setStep]=useSessionState("story-step",0),[chosen,setChosen]=useSessionState("story-choices",[null,null,null]);
  const heading=useRef(null);
  const [message,setMessage]=useState("");
  async function save(){try{const work=blankCreation("story");work.frames[0].text=composeStory(...chosen).slice(0,240);work.frames[0].friend=chosen[0].name;await saveCreation(work);setMessage("¡Cuento guardado! Puedes continuarlo en Mi álbum.");}catch(e){setMessage(e.message);}}
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[step]);
  const lists=[storyCharacters,storyPlaces,storyEvents];
  const titles=['¿Quién aparece?','¿Dónde está?','¿Qué sucede?'];
  useEffect(()=>{speak(primaryVoiceTexts['primary-story'],progress.voice,progress.voiceURI,{audioKey:'primary-story'});},[progress.voice,progress.voiceURI]);
  function choose(item){setChosen(items=>items.map((old,i)=>i===step?item:old));setStep(v=>v+1);}
  return <section className="story-studio illustrated-story comic-panel"><header className="screen-heading"><Link className="primary-secondary-button" to="/primaria/club?zona=crear">← Crear</Link><span className="eyebrow">Mi taller de cuentos</span></header>{step<3&&<WorldArt subject={step===1?"medio":"lengua"} className="story-scene"/>}{step<3 ? <><h1 ref={heading} tabIndex={-1}>{titles[step]}</h1><p>Elige lo que más te guste</p><div className={`story-options ${step===0?"friend-options":""}`}>{lists[step].map(item=><button key={item.name} className="primary-secondary-button" onClick={()=>choose(item)}>{step===0?<FriendPortrait name={item.name} decorative/>:<span aria-hidden="true">{item.icon}</span>}<strong>{item.name}</strong></button>)}</div><footer className="story-footer"><button className="primary-secondary-button" disabled={step===0} onClick={()=>setStep(v=>v-1)}>← Atrás</button><span>Paso {step+1} de 3</span></footer></> : <><h1 ref={heading} tabIndex={-1}>¡Tu cuento!</h1><div className="story-icons" aria-hidden="true">{chosen.map(item=>item.image?<FriendAvatar key={item.name} name={item.name} decorative/>:<span key={item.name}>{item.icon}</span>)}</div><p className="created-story">{composeStory(...chosen)}</p><p>¿Qué pasa después? Cuéntaselo a alguien o dibújalo.</p><p role="status">{message}</p><div className="primary-actions"><button className="primary-main-button" onClick={save}>Guardar cuento ★</button><Link className="primary-secondary-button" to="/primaria/album">Mi álbum</Link><button className="primary-main-button" onClick={()=>setStep(0)}>Inventar otro cuento</button><button className="primary-secondary-button" onClick={()=>setStep(2)}>Cambiar lo que pasa</button></div></>}</section>;
}
