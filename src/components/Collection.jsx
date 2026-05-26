import Adri from "./Adri";
import { constructionGoal, constructionSteps, totalMissions } from "../data/learningData";
import VoiceGuide from "./VoiceGuide";
import { screenAudioKeys } from "../data/adriAudioCatalog";
import { collectionGuide } from "../data/voiceScripts";

function BigConstruction({ completedLevels = 0 }) {
  const step = Math.min(constructionSteps.length, completedLevels);
  const built = (partStep) => `part ${step >= partStep ? "built" : ""}`;
  return (
    <div className="big-construction" aria-label={`Construcción completada ${step} de ${constructionSteps.length}`}>
      <span className={`${built(1)} plot`} />
      <span className={`${built(2)} foundation`} />
      <span className={`${built(3)} wall-low`} />
      <span className={`${built(4)} wall-high`} />
      <span className={`${built(5)} block-door`} />
      <span className={`${built(6)} block-windows`}>
        <i />
        <i />
      </span>
      <span className={`${built(7)} roof-row`} />
      <span className={`${built(8)} roof-cap`} />
      <span className={`${built(9)} block-chimney`} />
      <span className={`${built(10)} block-garden`}>
        <i />
        <i />
        <i />
      </span>
      <span className={`${built(11)} block-flag`}>
        <strong>ADRI</strong>
      </span>
    </div>
  );
}

export default function Collection({ progress }) {
  const completed = progress.completedLevels.length;
  const percent = Math.min(100, (completed / totalMissions) * 100);

  return (
    <section className="collection-screen comic-panel construction-screen">
      <VoiceGuide
        text={collectionGuide}
        audioKey={screenAudioKeys.collection}
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
        <small>{progress.pieces}/{constructionGoal} piezas colocadas</small>
      </div>
    </section>
  );
}
