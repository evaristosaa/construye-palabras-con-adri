import { useState } from "react";
import { Link } from "react-router-dom";
import { primaryMissions } from "../data/primaryData.js";
import { needsPrimaryPractice, isReviewDue } from "../data/primaryPractice.js";
import VoiceGuide from "./VoiceGuide";
import { settingsGuide, settingsVoiceSample } from "../data/voiceScripts.js";
import { screenAudioKeys } from "../data/adriAudioCatalog.js";
import { speak } from "./audio.js";

export default function Settings({ progress, updateSettings, resetProgress }) {
  const [page,setPage]=useState(0);
  const [reviewIndex,setReviewIndex]=useState(0);
  const [confirmReset,setConfirmReset]=useState(false);
  const tabs=['Lectura','Sonido','Repaso','Datos'];
  const reviews=primaryMissions.flatMap(m=>m.activities.filter(a=>needsPrimaryPractice(progress.primaryAttempts?.[a.id])||isReviewDue(progress.primaryAttempts?.[a.id])).map(a=>({...a,mission:m})));
  const review=reviews[Math.min(reviewIndex,Math.max(0,reviews.length-1))];
  const last=review && progress.primaryAttempts[review.id];
  return <section className="comic-panel family-screen"><header className="screen-heading"><div><p className="eyebrow">Para acompañar a Adri</p><h1>Familia</h1></div><VoiceGuide text={settingsGuide} audioKey={screenAudioKeys.settings} enabled={progress.voice} compact auto={false}/></header>
    <nav className="family-tabs" aria-label="Opciones de familia">{tabs.map((tab,i)=><button key={tab} aria-pressed={page===i} onClick={()=>{setPage(i);setConfirmReset(false);}}>{tab}</button>)}</nav>
    <div className="family-content">
    {page===0 && <><h2>Leer a su ritmo</h2><label className="family-setting">Tipo de letra<select value={progress.readingFont || 'print'} onChange={e=>updateSettings({readingFont:e.target.value})}><option value="print">Imprenta</option><option value="round">Redonda</option></select></label><label className="family-setting">Tamaño<select value={progress.readingSize || 'normal'} onChange={e=>updateSettings({readingSize:e.target.value})}><option value="normal">Normal</option><option value="large">Grande</option></select></label><label className="family-setting">Mostrar pista al empezar<input type="checkbox" checked={!!progress.readingGuidance} onChange={e=>updateSettings({readingGuidance:e.target.checked})}/></label><p className="family-note">El botón Aa divide el texto en pasos. Se mantienen las mayúsculas cuando se practican.</p></>}
    {page===1 && <><h2>La voz de Adri</h2><label className="family-setting">Sonidos positivos<input type="checkbox" checked={progress.sound} onChange={e=>updateSettings({sound:e.target.checked})}/></label><label className="family-setting">Ayudas habladas<input type="checkbox" checked={progress.voice} onChange={e=>updateSettings({voice:e.target.checked})}/></label><button className="primary-main-button" onClick={()=>speak(settingsVoiceSample,progress.voice,progress.voiceURI,{audioKey:screenAudioKeys.settingsSample})}>🔊 Probar voz</button></>}
    {page===2 && <><h2>Práctica y repaso</h2>{review ? <><p className="review-topic">{review.mission.title}</p><p>{review.question}</p><small>{last.lastAttemptAt ? `Última práctica: ${new Date(last.lastAttemptAt).toLocaleDateString('es-ES')}` : 'Práctica anterior guardada'}</small><Link className="primary-main-button" to={`/primaria/mision/${review.mission.id}?reto=${review.id}`}>Practicar este reto →</Link><nav className="mission-pager" aria-label="Recomendaciones de repaso"><button className="primary-secondary-button" disabled={reviewIndex===0} onClick={()=>setReviewIndex(v=>v-1)} aria-label="Repaso anterior">←</button><span>{Math.min(reviewIndex+1,reviews.length)} / {reviews.length}</span><button className="primary-secondary-button" disabled={reviewIndex>=reviews.length-1} onClick={()=>setReviewIndex(v=>v+1)} aria-label="Repaso siguiente">→</button></nav></> : <p>No hay repasos pendientes. Al practicar se programan nuevas visitas para otros días.</p>}<p className="family-note">Se repasa tras 1, 3 y 7 días de práctica en fechas distintas. Completar actividades no es una nota ni acredita dominio.</p></>}
    {page===3 && <><h2>Datos de este navegador</h2><p>El progreso y los ajustes se guardan en este dispositivo. Las partidas de repaso conservan los premios sin duplicarlos.</p><Link className="primary-secondary-button" to="/logros">Ver mis logros</Link>{confirmReset ? <div className="reset-confirm"><p>¿Borrar todos los logros y ajustes? No se puede deshacer.</p><button className="primary-secondary-button" onClick={()=>setConfirmReset(false)}>Conservar mis datos</button><button className="danger-button" onClick={()=>{resetProgress();setConfirmReset(false);}}>Sí, borrar todo</button></div> : <button className="danger-button" onClick={()=>setConfirmReset(true)}>Reiniciar progreso</button>}</>}
    </div>
  </section>;
}
