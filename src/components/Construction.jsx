import {useEffect,useRef} from "react";
import {constructionState} from "../data/missionStories.js";
import {speak} from "./audio.js";
import "../styles/construction.css";

export function ConstructionScene({project,count,total,decorative=false}){
  const state=constructionState(count,total);
  const piece=(n,children)=><g key={n} className={`construction-piece ${state.visibleParts>=n?'is-built':'is-blueprint'}`}>{children}</g>;
  return <svg className="construction-drawing" viewBox="0 0 310 210" role={decorative?undefined:"img"} aria-hidden={decorative?true:undefined} aria-label={decorative?undefined:`${project.title}: ${state.completed} de ${state.total} retos completados`}>
    <rect x="0" y="0" width="310" height="210" rx="22" fill="#e9f7ff"/><circle cx="274" cy="29" r="16" fill="#ffdf71"/>
    <path d="M20 44 Q25 26 40 36 Q48 18 60 35 Q78 31 78 46Z" fill="white"/>
    <ellipse cx="155" cy="190" rx="135" ry="15" fill="#c4e7b1"/>
    {project.subject==="lengua"?<>
      {piece(1,<rect x="63" y="172" width="188" height="15" rx="7" fill="#c8955a"/>)}
      {piece(2,<rect x="86" y="78" width="140" height="98" rx="5" fill="#7bc8df"/>)}
      {piece(3,<path d="M66 84L155 25L245 84Z" fill="#ef846e"/>)}
      {piece(4,<><rect x="136" y="117" width="39" height="59" rx="15" fill="#a86d3d"/><circle cx="165" cy="150" r="3" fill="#ffe38c"/></>)}
      {piece(5,<><rect x="104" y="101" width="23" height="28" rx="5" fill="#fff2ac"/><path d="M115 102V128M105 115H126" stroke="#d79f40" strokeWidth="3"/></>)}
      {piece(6,<><rect x="184" y="138" width="9" height="30" rx="2" fill="#e98075"/><rect x="195" y="133" width="9" height="35" rx="2" fill="#ffd875"/><rect x="206" y="141" width="9" height="27" rx="2" fill="#866fc8"/><path d="M181 170H220" stroke="#955f3c" strokeWidth="5"/></>)}
    </>:project.subject==="matematicas"?<>
      <path d="M77 183Q155 156 233 183V210H77Z" fill="#93d6ef"/>
      {piece(1,<><rect x="21" y="158" width="72" height="30" rx="10" fill="#83bf7b"/><rect x="218" y="158" width="72" height="30" rx="10" fill="#83bf7b"/></>)}
      {piece(2,<><rect x="65" y="90" width="29" height="80" rx="5" fill="#81b9da"/><rect x="218" y="90" width="29" height="80" rx="5" fill="#b195d6"/></>)}
      {piece(3,<path d="M84 146Q155 45 228 146V174Q155 89 84 174Z" fill="#ed9971"/>)}
      {piece(4,<rect x="49" y="88" width="215" height="20" rx="6" fill="#f4cb72"/>)}
      {piece(5,<path d="M57 68H254M65 68V89M109 68V89M155 68V89M201 68V89M247 68V89" fill="none" stroke="#a96d3d" strokeWidth="6" strokeLinecap="round"/>)}
      {piece(6,<><path d="M251 24V88" stroke="#655799" strokeWidth="5"/><path d="M254 25L287 39L254 52Z" fill="#b79de3"/></>)}
    </>:<>
      {piece(1,<ellipse cx="157" cy="178" rx="104" ry="16" fill="#ba8f61"/>)}
      {piece(2,<><path d="M132 171V123" stroke="#4b9b58" strokeWidth="6"/><path d="M131 145Q101 144 105 121Q131 120 131 145M134 137Q163 133 157 114Q134 117 134 137" fill="#80c879"/></>)}
      {piece(3,<>{[91,178].map((x,i)=><g key={x}><path d={`M${x} 174V132`} stroke="#4b9b58" strokeWidth="4"/>{[[0,-12],[12,0],[0,12],[-12,0]].map(([dx,dy])=><circle key={`${dx}-${dy}`} cx={x+dx} cy={126+dy} r="9" fill={i?'#e4a0cb':'#ed9d79'}/>)}<circle cx={x} cy="126" r="8" fill="#ffdd70"/></g>)}</>)}
      {piece(4,<><rect x="210" y="140" width="32" height="24" rx="6" fill="#80c7e3"/><path d="M214 140Q212 120 232 130M240 148L260 135" fill="none" stroke="#5c9ec1" strokeWidth="6" strokeLinecap="round"/><path d="M258 146L254 155M268 145L265 154" stroke="#73bfe0" strokeWidth="3" strokeLinecap="round"/></>)}
      {piece(5,<><ellipse cx="232" cy="81" rx="13" ry="19" transform="rotate(-28 232 81)" fill="#eebf70"/><ellipse cx="253" cy="81" rx="13" ry="19" transform="rotate(28 253 81)" fill="#eaa0b2"/><path d="M243 69V97M242 71L235 62M244 71L251 62" stroke="#82613d" strokeWidth="4" strokeLinecap="round"/></>)}
      {piece(6,<><rect x="51" y="79" width="14" height="91" rx="5" fill="#a87649"/><circle cx="56" cy="64" r="30" fill="#83bd75"/><circle cx="39" cy="77" r="23" fill="#91cb7c"/><circle cx="77" cy="76" r="23" fill="#a6d78c"/></>)}
    </>}
    <text x="16" y="186" fontSize="29" aria-hidden="true">{project.icon}</text>
  </svg>;
}

export function ConstructionButton({project,count,total,onClick,buttonRef}){
  return <button ref={buttonRef} className="construction-button" onClick={onClick} aria-label={`Ver mi construcción: ${count} de ${total} retos`}><ConstructionScene project={project} count={count} total={total} decorative/><span>{count}/{total}<small>Mi obra</small></span></button>;
}

export function ConstructionDialog({project,count,total,progress,onClose}){
  const close=useRef(null),state=constructionState(count,total);
  useEffect(()=>{close.current?.focus();},[]);
  const labels=total===3?["Preparar","Construir","Decorar"]:project.parts;
  return <div className="primary-feedback-shade construction-shade"><section className="construction-dialog" role="dialog" aria-modal="true" aria-labelledby="construction-title" onKeyDown={e=>{
    if(e.key==="Escape"){e.preventDefault();onClose();}
    if(e.key==="Tab"){const buttons=[...e.currentTarget.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  }}><h2 id="construction-title">{state.complete?"🌟 ":""}{project.title}</h2><p>{state.complete?"¡Mira lo que has construido!":project.task}</p><ConstructionScene project={project} count={count} total={total}/><ol className="construction-parts" aria-label="Pasos de mi construcción">{labels.map((label,i)=><li key={label} aria-label={`${label}: ${i<(total===3?state.completed:state.visibleParts)?'completado':'por construir'}`} className={i<(total===3?state.completed:state.visibleParts)?'is-done':''}><span aria-hidden="true">{i<(total===3?state.completed:state.visibleParts)?'★':'○'}</span> {label}</li>)}</ol><div className="construction-actions"><button className="primary-secondary-button" onClick={()=>speak(project.voice,progress.voice,progress.voiceURI,{audioKey:project.audioKey})}>🔊 Escuchar</button><button ref={close} className="primary-main-button" onClick={onClose}>Seguir jugando →</button></div></section></div>;
}
