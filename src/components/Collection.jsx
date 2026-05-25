import Adri from "./Adri";
import { constructionGoal, constructionSteps, totalMissions } from "../data/learningData";
import VoiceGuide from "./VoiceGuide";

function BigConstruction({ completedLevels = 0 }) {
  const step = Math.min(constructionSteps.length, Math.round((completedLevels / totalMissions) * constructionSteps.length));
  return (
    <div className="big-construction" aria-label={`Construcción completada ${step} de ${constructionSteps.length}`}>
      <span className={`part ground ${step >= 1 ? "built" : ""}`} />
      <span className={`part base ${step >= 2 ? "built" : ""}`} />
      <span className={`part wall-left ${step >= 3 ? "built" : ""}`} />
      <span className={`part wall-right ${step >= 4 ? "built" : ""}`} />
      <span className={`part door ${step >= 5 ? "built" : ""}`} />
      <span className={`part window-one ${step >= 6 ? "built" : ""}`} />
      <span className={`part window-two ${step >= 7 ? "built" : ""}`} />
      <span className={`part roof ${step >= 8 ? "built" : ""}`} />
      <span className={`part chimney ${step >= 9 ? "built" : ""}`} />
      <span className={`part flag ${step >= 10 ? "built" : ""}`} />
    </div>
  );
}

export default function Collection({ progress }) {
  const completed = progress.completedLevels.length;
  const percent = Math.min(100, (completed / totalMissions) * 100);

  return (
    <section className="collection-screen comic-panel construction-screen">
      <VoiceGuide
        text="Esta es nuestra construcción. Cada misión terminada coloca una parte nueva de la Casa de las Palabras."
        enabled={progress.voice}
        voiceURI={progress.voiceURI}
        compact
      />
      <Adri variant="builder" size="side" bubble="Construimos una casa, misión a misión." />
      <div className="construction-card">
        <h2>Casa de las palabras</h2>
        <BigConstruction completedLevels={completed} />
        <p>
          <strong>{completed}</strong> de <strong>{totalMissions}</strong> misiones completadas
        </p>
        <div className="piece-track" aria-label={`${Math.round(percent)} por ciento completado`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <small>{progress.pieces}/{constructionGoal} piezas de juego acumuladas</small>
      </div>
    </section>
  );
}
