import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { classmates } from "../data/classmates.js";
import { blankSnackSession, cleanSnackSession, changeSnackPlate, checkSnackStep, snackHint, snackStory, snackCare, snackItems, snackStages, snackId, snackRewardId } from "../data/snackAdventure.js";
import { snackInstructions, resumeSnackAfterStory } from "../data/snackAdventure.js";
import { FriendAvatar } from "./Classmates";
import { SnackIcon, PicnicScene } from "./SnackArt";
import NarrationButton from "./NarrationButton";
import SnackStoryPlayer from "./SnackStoryPlayer";
import { speakResult } from "./audio.js";

export default function SnackAdventure({ progress, completeGame, attemptPrimaryActivity, saveSnackSession }) {
  const [session, setSession] = useState(() => cleanSnackSession(progress.adventures?.[snackId]));
  const [message, setMessage] = useState("");
  const [narrating, setNarrating] = useState(false);
  const [storyIndex,setStoryIndex]=useState(0);
  const [showStory,setShowStory]=useState(true);
  const heading = useRef(null), locked = useRef(false);
  const stage = snackStages[session.stage], story = showStory ? snackStory[storyIndex] : null;
  const solved = session.solved.includes(stage);
  useEffect(() => { saveSnackSession(session); }, [session, saveSnackSession]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); setMessage(""); setNarrating(false); locked.current = false; }, [stage,showStory]);
  function change(update) { setMessage(""); setSession(current => ({ ...current, ...update })); }
  function finishStory() { setSession(current=>resumeSnackAfterStory(current)); setShowStory(false); }
  function replay() { setSession(blankSnackSession()); setStoryIndex(0); setShowStory(true); }
  function next() { change({ stage: Math.min(6, session.stage + 1) }); }
  function help() {
    const level = Math.min(3, (session.help[stage] || 0) + 1);
    setSession(current => ({ ...current, help: { ...current.help, [stage]: level } }));
    setMessage(snackHint(stage, level, session));
  }
  function check() {
    if (locked.current || solved) return;
    const correct = checkSnackStep(stage, session);
    attemptPrimaryActivity(snackRewardId(stage), correct, { variantKey: snackId, supported: !!session.help?.[stage] });
    if (correct) {
      locked.current = true;
      setSession(current => ({ ...current, solved: [...new Set([...current.solved, stage])] }));
      completeGame(snackRewardId(stage));
      setMessage(stage === "cesta" ? "¡La cesta coincide con la nota!" : stage === "reparto" ? "¡Dos para cada amigo! Dos, dos y dos son seis." : "¡Manos limpias, mesa preparada y a compartir!");
      speakResult("success", progress.voice, progress.sound, progress.voiceURI);
    } else {
      const level = Math.max(1, session.help[stage] || 0);
      setSession(current => ({ ...current, help: { ...current.help, [stage]: level } }));
      setMessage(snackHint(stage, level, session));
    }
  }
  const titles = { cesta: "¿Qué llevamos?", reparto: "Lo mismo para los tres", cuidado: "¿Qué hacemos primero?", final: "¡La merienda está lista!" };
  const cueText = story?.text || snackInstructions[stage];
  const cueKey = story?.audioKey || `snack-${stage}`;
  return <section className={`snack-screen stage-${stage} ${solved ? "step-solved" : ""}`}>
    <header className="snack-header"><Link to="/" className="primary-secondary-button snack-menu-button">⌂ Menú</Link><span>La merienda</span><div className="snack-step-dots" aria-label={`${session.solved.length} de 3 retos resueltos`}>{[0,1,2].map(i=><b key={i} className={i<session.solved.length?"is-done":""}>{i<session.solved.length?"★":"○"}</b>)}</div></header>
    <div className="snack-main comic-panel">
      {story ? <>
        <PicnicScene scene={story.scene}/>
        <div className="snack-story-copy"><p className="eyebrow">Nuestro cuento</p><h1 ref={heading} tabIndex={-1}>Una merienda en el parque</h1><p className={`snack-read-text ${narrating?"is-narrating":""}`}>{story.text}</p><SnackStoryPlayer progress={progress} onSentence={setStoryIndex} onPlaying={setNarrating} onFinish={finishStory} onListen={()=>setSession(current=>({...current,listened:true}))}/></div>
      </> : stage === "final" ? <>
        <PicnicScene scene="picnic" complete/>
        <div className="snack-finish-copy"><p className="eyebrow">Lo hemos hecho juntos</p><h1 ref={heading} tabIndex={-1}>{titles.final}</h1><p>Leímos la nota, repartimos y preparamos la mesa.</p><NarrationButton audioKey={cueKey} text={cueText} progress={progress} label="Escuchar"/><p className="snack-offscreen">Ahora puedes repartir una merienda con alguien de casa.</p></div>
      </> : <>
        <div className="snack-task-heading"><div><p className="eyebrow">{stage==="cesta"?"Lengua":stage==="reparto"?"Matemáticas":"Mi mundo"}</p><h1 ref={heading} tabIndex={-1}>{titles[stage]}</h1></div><NarrationButton key={cueKey} audioKey={cueKey} text={cueText} progress={progress} label="Escuchar ayuda" onListen={()=>setSession(current=>({...current,help:{...current.help,[stage]:Math.max(1,current.help[stage]||0)}}))}/></div>
        {stage === "cesta" && <div className="snack-basket-game"><aside className={`snack-note ${(session.help.cesta||0)>0?"is-pointed":""}`}><span>La nota dice:</span><strong>Dos manzanas y una botella de agua.</strong><small>Para los tres amigos</small></aside><div className="snack-basket-play"><div className="snack-food-shop">{snackItems.map(item=><button key={item.id} disabled={solved||session.basket.length>=6} className="snack-food-button" onClick={()=>change({basket:[...session.basket,item.id]})} aria-label={`Añadir ${item.label.toLowerCase()}`}><SnackIcon kind={item.id}/><strong>{item.label}</strong><span aria-hidden="true">＋</span></button>)}</div><div className="snack-basket"><strong>Tu cesta</strong><div className="snack-basket-items">{session.basket.length ? session.basket.map((item,i)=><button key={i} disabled={solved} onClick={()=>change({basket:session.basket.filter((_,j)=>j!==i)})} aria-label={`Quitar ${snackItems.find(x=>x.id===item).label.toLowerCase()} ${i+1}`}><SnackIcon kind={item}/><span aria-hidden="true">−</span></button>) : <span className="snack-empty">Toca para poner algo en la cesta</span>}</div></div></div></div>}
        {stage === "reparto" && <div className="snack-sharing-game"><div className="snack-reserve"><p>Hay seis trozos para compartir.</p><div aria-label={`${6-session.plates.reduce((a,b)=>a+b,0)} trozos sin repartir`} className="snack-reserve-pieces">{Array.from({length:6-session.plates.reduce((a,b)=>a+b,0)},(_,i)=><SnackIcon kind="piece" key={i}/>)}</div><small>{6-session.plates.reduce((a,b)=>a+b,0) ? "Toca un plato para dar un trozo." : "Ya están todos. Compara los platos."}</small></div><div className="snack-plates">{classmates.map((friend,i)=><div key={friend.id} className="snack-friend-plate"><div className="snack-plate-friend"><FriendAvatar name={friend.name} decorative/><strong>{friend.name}</strong></div><button className="snack-plate-add" disabled={solved||session.plates.reduce((a,b)=>a+b,0)>=6} onClick={()=>change({plates:changeSnackPlate(session.plates,i,1)})} aria-label={`Dar un trozo a ${friend.name}`}><span className="snack-plate-food">{Array.from({length:session.plates[i]},(_,n)=><SnackIcon key={n} kind="piece"/>)}</span><span>＋ Dar</span></button><span className="snack-plate-count" aria-live="polite">{session.plates[i]} {session.plates[i]===1?"trozo":"trozos"}</span><button className="snack-plate-remove" disabled={solved||session.plates[i]===0} onClick={()=>change({plates:changeSnackPlate(session.plates,i,-1)})} aria-label={`Quitar un trozo a ${friend.name}`}>− Quitar</button></div>)}</div></div>}
        {stage === "cuidado" && <div className="snack-care-game"><p>Toca los dibujos en orden. Toca tu fila para cambiar.</p><div className="snack-care-line" aria-label="Tu orden">{[0,1,2].map((_,i)=>{const item=snackCare.find(x=>x.id===session.order[i]);return item?<button key={i} disabled={solved} onClick={()=>change({order:session.order.filter((_,j)=>j!==i)})} aria-label={`Quitar paso ${i+1}: ${item.label}`}><b>{i+1}</b><SnackIcon kind={item.id}/><span>{item.label}</span></button>:<span className="snack-care-empty" key={i}>{i+1}</span>;})}</div><div className="snack-care-options">{[snackCare[2],snackCare[0],snackCare[1]].map(item=><button key={item.id} disabled={solved||session.order.includes(item.id)} onClick={()=>change({order:[...session.order,item.id]})}><SnackIcon kind={item.id}/><span>{item.label}</span></button>)}</div></div>}
        <div className={`snack-feedback ${solved?"is-success":""}`} role="status" aria-live="polite">{message || (solved ? "¡Ya está! Puedes seguir." : "Puedes probar y cambiar lo que necesites.")}</div>
      </>}
    </div>
    <footer className="snack-footer">
      {story ? <button className="primary-main-button" onClick={finishStory}>Ir a los retos →</button> : stage === "final" ? <><button className="primary-secondary-button" onClick={replay}>Volver a jugar</button><Link className="primary-main-button" to="/">Terminar por hoy</Link></> : <><button className="primary-secondary-button snack-hint-button" disabled={solved} onClick={help}>💡 Una pista</button>{solved?<button className="primary-main-button" onClick={next}>{stage==="cuidado"?"Ver la merienda →":"Seguir →"}</button>:<button className="primary-main-button" disabled={stage==="cesta"?!session.basket.length:stage==="reparto"?!session.plates.some(Boolean):session.order.length!==3} onClick={check}>Comprobar</button>}</>}
    </footer>
  </section>;
}
