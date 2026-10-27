import {useSessionState} from "../storage/sessionDrafts.js";
import {useState} from 'react';
import {patternSymbols,patternAnswer,placePatternPiece,removePatternPiece} from '../data/patternBuilder.js';

function symbolFor(id){return patternSymbols.find(s=>s.id===id);}
export default function PatternBuilder({activity,onAnswer}){
 const[pieces,setPieces]=useSessionState(`pattern:${activity.id}`,()=>Array(activity.slots).fill(null));
 const count=pieces.filter(Boolean).length;
 return <div className="pattern-builder"><div className="pattern-example" style={{'--pattern-unit':activity.unit.length}} aria-label="El patrón empieza así">{activity.given.map((id,i)=><span className={`pattern-piece shape-${id}`} key={i} aria-label={symbolFor(id).label}>{symbolFor(id).glyph}</span>)}</div>
  <div className="pattern-slots" aria-label="Tu continuación">{Array.from({length:activity.slots},(_,i)=>pieces[i]?<button className={`pattern-piece shape-${pieces[i]}`} key={i} onClick={()=>setPieces(old=>removePatternPiece(old,i))} aria-label={`Quitar pieza ${i+1}: ${symbolFor(pieces[i]).label}`}>{symbolFor(pieces[i]).glyph}</button>:<span key={i} className="pattern-empty">?</span>)}</div>
  <div className="pattern-palette" aria-label="Figuras disponibles">{patternSymbols.map(s=><button key={s.id} className={`primary-secondary-button shape-${s.id}`} disabled={count===activity.slots} aria-label={`Poner ${s.label.toLowerCase()}`} onClick={()=>setPieces(old=>placePatternPiece(old,s.id))}>{s.glyph}</button>)}</div>
  <p role="status">{count} de {activity.slots} piezas colocadas</p>
  <div className="math-actions"><button className="primary-secondary-button" disabled={!count} onClick={()=>setPieces(old=>removePatternPiece(old,old.map(Boolean).lastIndexOf(true)))}>Quitar la última</button><button className="primary-main-button" disabled={count!==activity.slots} onClick={()=>onAnswer(patternAnswer(pieces))}>Comprobar</button></div>
 </div>;
}
