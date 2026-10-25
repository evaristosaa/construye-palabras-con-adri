import { Link, useSearchParams } from "react-router-dom";
import VoiceGuide from "./VoiceGuide";
import {FriendTeam} from "./Classmates";
import WorldArt from "./WorldArt";
import { learningWorlds } from "../data/learningWorlds.js";
import {constructionFor} from "../data/missionStories.js";
import { primarySubjects, primaryStages, primaryMissions, getPrimaryRecommendation } from "../data/primaryData.js";
import { primaryVoiceTexts } from "../data/primaryVoiceLines.js";

export default function PrimaryHub({ progress }) {
  const [params, setParams] = useSearchParams();
  const subject = primarySubjects.find(item => item.id === params.get("materia"));
  const finished = progress.primaryCompletedLevels || [];
  const missions = primaryMissions.filter(mission => mission.subject === subject?.id);
  const recommended = subject && getPrimaryRecommendation(subject.id, finished);
  const requested = Number(params.get("mision"));
  const index = params.has("mision") && Number.isInteger(requested) && requested >= 1 && requested <= missions.length ? requested - 1 : Math.max(0, missions.findIndex(item => item.id === recommended?.id));
  const mission = missions[index];
  const project=subject&&constructionFor(subject.id,mission.activities[0].topic);
  const count = mission?.activities.filter(activity => progress.completedGames.includes(activity.id)).length || 0;
  return <section className={`primary-hub comic-panel screen-hub ${subject ? `subject-${subject.id}` : ""}`}>
    <header className="screen-heading"><div><p className="eyebrow">1.º de Primaria</p><h1>{subject ? `${subject.icon} ${subject.title}` : "¿A qué jugamos?"}</h1></div><VoiceGuide text={project?project.voice:primaryVoiceTexts["primary-intro"]} audioKey={project?project.audioKey:"primary-intro"} enabled={progress.voice} compact /></header>
    {!subject ? <>
      <Link to="/primaria/aventura" className="primary-main-button adventure-start friends-adventure" aria-label="Jugar con Adri, Juan y Cayetana. Tres retos, uno de cada materia"><FriendTeam/><span>▶ Jugar con amigos<small>3 retos · uno de cada materia</small></span></Link>
      <nav className="subject-picker world-picker" aria-label="Asignaturas">{primarySubjects.map(item => <button className={`subject-choice world-choice subject-${item.id}`} key={item.id} onClick={() => setParams({ materia: item.id })}><WorldArt subject={item.id}/><span className="world-choice-copy"><strong>{item.title}</strong><small>{learningWorlds[item.id].title}</small></span><b aria-hidden="true">→</b></button>)}</nav>
    </> : <>
      <div className="subject-back-row"><button className="primary-text-link subject-back" onClick={() => setParams({})}>← Materias</button><Link className="primary-text-link story-link" to={subject.id === "matematicas" ? "/primaria/mates" : `/primaria/taller/${subject.id}`}>🎲 Juegos variados</Link></div>
      <article className="mission-preview illustrated-mission" key={mission.id}>
        <p className="eyebrow">Misión {mission.number} de {missions.length} · {primaryStages[mission.stage]}</p>
        <WorldArt subject={subject.id} className="mission-scene"/>
        <h2>{mission.title}</h2><p>{mission.goal}</p>
        <span className="mission-purpose">{project.task}</span>
        <Link className="primary-main-button" to={`/primaria/mision/${mission.id}`}>{finished.includes(mission.id) ? "Volver a jugar" : count ? "Continuar jugando →" : "¡Jugar! →"}</Link>
      </article>
      <nav className="mission-pager" aria-label="Elegir misión"><button className="primary-secondary-button" disabled={index === 0} onClick={() => setParams({ materia: subject.id, mision: index })} aria-label="Misión anterior">←</button><span>{index + 1} / {missions.length}</span><button className="primary-secondary-button" disabled={index === missions.length - 1} onClick={() => setParams({ materia: subject.id, mision: index + 2 })} aria-label="Misión siguiente">→</button></nav>
    </>}
  </section>;
}
