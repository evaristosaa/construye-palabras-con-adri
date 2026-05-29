import { Link } from "react-router-dom";
import Adri from "./Adri";
import { Drawing } from "./Blocks";
import { getRecommendedMission, modules } from "../data/learningData";
import { missionInstructions } from "../data/voiceScripts";
import { screenAudioKeys } from "../data/adriAudioCatalog";
import VoiceGuide from "./VoiceGuide";

export default function LevelSelect({ progress }) {
  const recommendedId = getRecommendedMission(progress.completedLevels);

  return (
    <section className="mission-screen comic-panel">
      <VoiceGuide
        text={missionInstructions}
        audioKey={screenAudioKeys.missions}
        enabled={progress.voice}
        voiceURI={progress.voiceURI}
        compact
      />
      <Adri variant="detective" bubble="Vamos letra a letra" size="side" />
      <div className="mission-map alphabet-board">
        <h2>Abecedario</h2>
        {modules.map((module) => {
          const completed = progress.completedLevels.includes(module.id);
          const isNext = module.id === recommendedId && !completed;
          return (
            <Link
              key={module.id}
              to={`/juego/${module.id}`}
              className={`alphabet-tile mission-${module.color} ${completed ? "is-complete" : ""} ${isNext ? "is-next" : ""}`}
            >
              <span className="alphabet-status">{completed ? "★" : isNext ? "AHORA" : ""}</span>
              <span className="alphabet-letters">
                <strong>{module.badge}</strong>
                <b>{module.badge.toLowerCase()}</b>
              </span>
              <Drawing type={module.anchor.drawing} hideLabel />
              <small>{module.anchor.text}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
