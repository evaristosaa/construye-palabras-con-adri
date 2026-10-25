import { useEffect, useRef, useState } from "react";

export default function ReadingSupport({ activity, onClose }) {
  const text = [activity.passage,activity.question].filter(Boolean).join(" ");
  const chunks = text.match(/[^.!?]+[.!?]?/g)?.map(s=>s.trim()).filter(Boolean) || [text];
  const [page,setPage] = useState(0);
  const close = useRef(null);
  useEffect(()=>{close.current?.focus();},[]);
  return <div className="primary-feedback-shade"><div className="reading-support" role="dialog" aria-modal="true" aria-labelledby="reading-support-title" onKeyDown={e=>{if(e.key==="Escape") onClose();if(e.key==="Tab"){const bs=[...e.currentTarget.querySelectorAll("button:not(:disabled)")],first=bs[0],last=bs.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}><h2 id="reading-support-title">Leo paso a paso</h2><p className="reading-chunk" aria-live="polite">{chunks[page]}</p><nav className="mission-pager" aria-label="Pasos de lectura"><button className="primary-secondary-button" disabled={page===0} onClick={()=>setPage(v=>v-1)} aria-label="Frase anterior">←</button><span>{page+1} / {chunks.length}</span><button className="primary-secondary-button" disabled={page===chunks.length-1} onClick={()=>setPage(v=>v+1)} aria-label="Frase siguiente">→</button></nav><button ref={close} className="primary-main-button" onClick={onClose}>Volver al reto</button></div></div>;
}
