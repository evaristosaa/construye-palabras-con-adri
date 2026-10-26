import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {FriendCompanion,FriendAvatar} from "./Classmates";
import {classmateAt} from "../data/classmates.js";
import CountingBoard from "./CountingBoard";
import PictureSort from "./PictureSort";
import ReadingSupport from "./ReadingSupport";
import PrimaryReflection from "./PrimaryReflection";
import {worldAsset,worldFor} from "../data/learningWorlds.js";

import { choicePictures } from "../data/choicePictures.js";
import {ConstructionScene,ConstructionButton,ConstructionDialog} from "./Construction";
import {constructionFor,initialConstructionWins,addConstructionWin} from "../data/missionStories.js";
import { QuantityGame, PlaceValueGame, SyllableGame } from "./ManipulativeGames";
import { beyondScreen } from "../data/primaryPlayDesign.js";
import { localVoiceFiles } from "../data/localVoiceFiles.js";
import { buildPrimaryAdventure, preparePrimaryMission } from "../data/primaryPractice.js";
import { primaryMissionsById, primarySubjects, isPrimaryAnswerCorrect, assembledPrimaryAnswer, getPrimaryRecommendation } from "../data/primaryData.js";
import { primaryAudioKey, primaryVoiceTexts } from "../data/primaryVoiceLines.js";
import { speak, speakResult } from "./audio.js";

export default function PrimaryGame(props) {
  const { missionId } = useParams();
  const [routeParams] = useSearchParams();
  const mission = primaryMissionsById[missionId];
  return mission ? <PreparedMission key={`${mission.id}:${routeParams.get("reto")||""}`} mission={mission} {...props} /> : <Navigate to="/primaria" replace />;
}
function PreparedMission({mission,...props}) {
  const [params] = useSearchParams();
  const [prepared] = useState(()=>({...preparePrimaryMission(mission,props.progress),startIndex:mission.activities.findIndex(a=>a.id===params.get("reto"))}));
  return <MissionPlayer mission={prepared} {...props} />;
}

export function PrimaryAdventure(props) {
  const [mission] = useState(() => ({ id: "aventura", title: "Juego con Adri", adventure: true, activities: buildPrimaryAdventure(props.progress) }));
  return <MissionPlayer mission={mission} {...props} />;
}

export function MissionPlayer({ mission, progress, completeGame, completePrimaryMission, attemptPrimaryActivity }) {
  const [index, setIndex] = useState(() => {
    if (mission.adventure) return 0;
    if (mission.startIndex >= 0) return mission.startIndex;
    const next = mission.activities.findIndex(activity => !progress.completedGames.includes(activity.id));
    return next < 0 ? 0 : next;
  });
  const [selected, setSelected] = useState("");
  const [pieces, setPieces] = useState([]);
  const [entry, setEntry] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [constructionWins,setConstructionWins]=useState(()=>initialConstructionWins(mission.activities,progress.completedGames,mission.adventure));
  const [showConstruction,setShowConstruction]=useState(false);
  const constructionButton=useRef(null),constructionWasOpen=useRef(false);
  const [reading, setReading] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [showReading,setShowReading] = useState(false);
  const readingButton = useRef(null);
  const readingWasOpen = useRef(false);
  const [tokens, setTokens] = useState(() => Array(20).fill(false));
  const boardButton = useRef(null);
  const boardWasOpen = useRef(false);
  const feedbackButton = useRef(null);
  const feedbackWasOpen = useRef(false);
  const locked = useRef(false);
  const heading = useRef(null);
  const activity = mission.activities[index];
  const friend=classmateAt(index);
  const project=constructionFor(mission.subject||"lengua",mission.adventure?undefined:mission.activities[0].topic);
  const optionPictures=choicePictures(activity);
  const subject = primarySubjects.find(item => item.id === (activity.subject || mission.subject));
  const audioKey = primaryAudioKey(activity, subject.id);
  const nextMission = getPrimaryRecommendation(mission.subject, progress.primaryCompletedLevels || []);

  useEffect(() => { if (!finished) heading.current?.focus({ preventScroll: true }); }, [index, finished, reading]);
  useEffect(() => {
    if (feedback) feedbackButton.current?.focus();
    else if (feedbackWasOpen.current) heading.current?.focus({preventScroll:true});
    feedbackWasOpen.current=Boolean(feedback);
  }, [feedback]);
  useEffect(() => {
    if (boardWasOpen.current && !showBoard) boardButton.current?.focus();
    boardWasOpen.current = showBoard;
  }, [showBoard]);
  useEffect(()=>{if(readingWasOpen.current && !showReading) readingButton.current?.focus(); readingWasOpen.current=showReading;},[showReading]);
  useEffect(()=>{if(constructionWasOpen.current&&!showConstruction)constructionButton.current?.focus({preventScroll:true});constructionWasOpen.current=showConstruction;},[showConstruction]);
  useEffect(()=>{if(progress.readingGuidance) setFeedback(activity.hint);},[activity.id]);
  useEffect(() => {
    const key = finished ? "primary-complete" : audioKey;
    speak(primaryVoiceTexts[key], progress.voice, progress.voiceURI, { audioKey: key });
  }, [audioKey, finished, progress.voice, progress.voiceURI]);

  function submit(value) {
    if (locked.current) return;
    const correct = isPrimaryAnswerCorrect(activity, value);
    setSelected(value);
    attemptPrimaryActivity(activity.id, correct, {variantKey:activity.variantKey});
    if (correct) {
      locked.current = true;
      setSolved(true);
      setConstructionWins(wins=>addConstructionWin(wins,activity.id));
      setFeedback("¡Lo has conseguido!");
      completeGame(activity.id);
      speakResult("success", progress.voice, progress.sound, progress.voiceURI);
    } else {
      setFeedback(activity.hint);
      speakResult("retry", progress.voice, progress.sound, progress.voiceURI);
    }
  }
  function next() {
    if (!locked.current) return;
    if (index === mission.activities.length - 1) {
      if (!mission.adventure) completePrimaryMission(mission.id, mission.activities.map(item => item.id));
      setFinished(true);
      return;
    }
    locked.current = false;
    setIndex(current => current + 1);
    setSelected(""); setPieces([]); setEntry(""); setFeedback(""); setSolved(false); setReading(true); setTokens(Array(20).fill(false));
  }

  if (finished) return <PrimaryReflection mission={mission} activity={activity} progress={progress} invitation={beyondScreen[activity.topic]} nextMission={!mission.adventure&&nextMission?.id!==mission.id?nextMission:null} project={project} constructionCount={constructionWins.length}/>;

  return <section className={`primary-game narrative-game subject-${subject.id} ${mission.workshop?'is-workshop':''}`} style={{'--mission-world':`url("${worldAsset(subject.id,import.meta.env.BASE_URL)}")`}}>
    <header inert={feedback || showBoard || showReading || showConstruction ? true : undefined} className="primary-game-heading comic-panel"><Link className="primary-text-link" to={mission.returnTo || (mission.adventure ? "/primaria" : `/primaria?materia=${mission.subject}`)}>← {mission.adventure ? "Salir del juego" : subject.title}</Link><p>{activity.workshopPhase || mission.title}</p><ConstructionButton project={project} count={constructionWins.length} total={mission.activities.length} buttonRef={constructionButton} onClick={()=>setShowConstruction(true)}/><progress max={mission.activities.length} value={index + (solved ? 1 : 0)} aria-label="Avance de la misión" /></header>
    <div inert={feedback || showBoard || showReading || showConstruction ? true : undefined} className="primary-play-layout">
      <aside className="primary-companion comic-panel"><ConstructionScene project={project} count={constructionWins.length} total={mission.activities.length}/><FriendCompanion name={friend.name} variant={solved ? "celebrating" : subject.id === "medio" ? "detective" : "reader"}/><strong className="companion-name">{friend.name} te acompaña</strong><p>{project.task}</p><span>{constructionWins.length} de {mission.activities.length} retos de esta obra</span></aside>
      <div className={`mission-stage comic-panel activity-${activity.type}`}>
        <div className="mission-scenery" aria-hidden="true"><span>{worldFor(subject.id).title}</span><img src={`${import.meta.env.BASE_URL}assets/characters/amigos-comic-unificado-v1.png`} alt="" draggable="false"/></div>
      <div className="primary-exercise mission-task-card">
        <div className="primary-exercise-top"><FriendAvatar name={friend.name} className="quest-buddy"/><p className="eyebrow">{subject.icon} {subject.title}</p><div className="primary-tool-buttons">{subject.id === "matematicas" && !["quantity","place-value"].includes(activity.type) && <button ref={boardButton} className="primary-help-button" onClick={() => setShowBoard(true)}>Fichas</button>}<button ref={readingButton} className="primary-help-button" onClick={() => setShowReading(true)} aria-label="Leer paso a paso">Aa</button><button className="primary-help-button" onClick={() => { setFeedback(activity.hint); }} aria-label="Ver una pista">💡</button><button className="primary-help-button" onClick={() => speak(primaryVoiceTexts[audioKey], progress.voice, progress.voiceURI, { audioKey })} aria-label="Escuchar ayuda">🔊</button></div></div>
        {activity.passage && reading ? <div className="primary-reading-step"><h1 ref={heading} tabIndex={-1}>Lee con calma</h1><div className="primary-reading"><p>{activity.passage}</p></div><button className="primary-main-button" onClick={() => { setReading(false); }}>Ya lo he leído →</button></div> : <>
        {activity.passage && <button className="primary-text-link" onClick={() => setReading(true)}>📖 Volver al texto</button>}
        {activity.visual && <div className="primary-visual" aria-label="Apoyo visual para contar">{activity.visual}</div>}
        <h1 ref={heading} tabIndex={-1}>{activity.question}</h1>
        {activity.type === "quantity" && <QuantityGame key={activity.id} activity={activity} solved={solved} onSubmit={submit}/>}
        {activity.type === "place-value" && <PlaceValueGame key={activity.id} activity={activity} solved={solved} onSubmit={submit}/>}
        {activity.type === "syllables" && <SyllableGame key={activity.id} activity={activity} solved={solved} onSubmit={submit} progress={progress}/>}
        {activity.type === "sort" && <PictureSort key={activity.id} activity={activity} solved={solved} onComplete={submit} onWrong={()=>submit("__wrong_sort__")} />}
        {activity.type === "choice" && <div className="primary-answers">{activity.options.map((option, optionIndex) => <button key={option} disabled={solved} className={`primary-answer ${selected === option ? solved ? "is-correct" : "is-retry" : ""}`} onClick={() => submit(option)}><span className={optionPictures?"choice-icon":undefined} aria-hidden={Boolean(optionPictures)}>{optionPictures?.[optionIndex] || optionIndex + 1}</span><strong>{option}</strong></button>)}</div>}
        {activity.type === "order" && <div className="primary-builder"><div className="primary-answer-zone" aria-live="polite">{pieces.length ? assembledPrimaryAnswer(activity, pieces) : "Toca las piezas; toca otra vez para quitar"}</div><div className="primary-word-pieces">{activity.pieces.map((piece, pieceIndex) => <button key={pieceIndex} disabled={solved} aria-pressed={pieces.includes(pieceIndex)} onClick={() => { setPieces(current => current.includes(pieceIndex) ? current.filter(i=>i!==pieceIndex) : [...current, pieceIndex]); setFeedback(""); }}>{piece}</button>)}</div><div className="primary-actions"><button className="primary-secondary-button" disabled={solved || !pieces.length} onClick={() => { setPieces(current => current.slice(0, -1)); setFeedback(""); }}>Deshacer</button><button className="primary-main-button" disabled={solved || pieces.length !== activity.pieces.length} onClick={() => submit(assembledPrimaryAnswer(activity, pieces))}>Comprobar</button></div></div>}
        {activity.type === "write" && <form className="primary-write" onSubmit={event => { event.preventDefault(); if (entry.trim()) submit(entry); }}><label htmlFor="primary-response">Tu respuesta</label><input id="primary-response" value={entry} onChange={event => { setEntry(event.target.value); setFeedback(""); }} disabled={solved} autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={60} /><button className="primary-main-button" disabled={solved || !entry.trim()} type="submit">Comprobar</button></form>}
        </>}
      </div>
      </div>
    </div>
    {showConstruction&&<ConstructionDialog project={project} count={constructionWins.length} total={mission.activities.length} progress={progress} onClose={()=>setShowConstruction(false)}/>}
    {showReading && <ReadingSupport activity={activity} onClose={()=>setShowReading(false)} />}
    {showBoard && <CountingBoard question={activity.question} tokens={tokens} setTokens={setTokens} onClose={() => setShowBoard(false)} />}
    {feedback && <div className="primary-feedback-shade"><div className={`primary-feedback-dialog ${solved ? "is-success" : ""}`} role="dialog" aria-modal="true" aria-labelledby="primary-feedback-title" onKeyDown={event => { if (event.key === "Tab") { const buttons=[...event.currentTarget.querySelectorAll("button")], first=buttons[0], last=buttons.at(-1); if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();} } if (event.key === "Escape" && !solved) setFeedback(""); }}>{solved?<div className="world-celebration construction-celebration" aria-hidden="true"><ConstructionScene project={project} count={constructionWins.length} total={mission.activities.length} decorative/><span>🌟</span><i>✦</i><i>✦</i><i>✦</i></div>:<span className="feedback-symbol" aria-hidden="true">💡</span>}<h2 id="primary-feedback-title">{solved ? constructionWins.length===mission.activities.length ? "¡Obra terminada!" : "¡Tu obra crece!" : "Una pista"}</h2>{!solved && progress.readingGuidance && !selected && <p className="guided-question"><strong>{activity.question}</strong></p>}<p>{solved ? activity.explanation : feedback}</p>{solved && localVoiceFiles[activity.ideaAudioKey] && <button className="primary-secondary-button" onClick={()=>speak(activity.idea,progress.voice,progress.voiceURI,{audioKey:activity.ideaAudioKey})}>🔊 Escuchar consejo</button>}<button ref={feedbackButton} className="primary-main-button" onClick={solved ? next : () => { setFeedback(""); heading.current?.focus(); }}>{solved ? index === mission.activities.length - 1 ? mission.adventure ? "Terminar juego ★" : "Terminar misión ★" : "Siguiente reto →" : "Volver al reto"}</button></div></div>}
  </section>;
}
