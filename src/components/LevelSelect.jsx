import { Link } from "react-router-dom";
import Adri from "./Adri";
import { modules } from "../data/learningData";
import { missionInstructions } from "../data/voiceScripts";
import { screenAudioKeys } from "../data/adriAudioCatalog";
import VoiceGuide from "./VoiceGuide";

export default function LevelSelect({ progress }) {
  const isUnlocked = (module) =>
    module.unlocked || !module.unlockedAfter || progress.completedLevels.includes(module.unlockedAfter);

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
      <div className="mission-map mission-book">
        <h2>Misiones de lectura</h2>
        {modules.map((module) => {
          const unlocked = isUnlocked(module);
          const completed = progress.completedLevels.includes(module.id);
          return (
            <Link
              key={module.id}
              to={unlocked ? `/juego/${module.id}` : "#"}
              className={`mission-block mission-${module.color} ${unlocked ? "" : "locked"}`}
              aria-disabled={!unlocked}
            >
              <span className="mission-star">{completed ? "★" : unlocked ? "☆" : "🔒"}</span>
              <strong>{module.badge}</strong>
              <small>{module.title}</small>
              <span className="mission-syllables">{module.lessons.slice(0, 5).join(" · ")}</span>
              <em>{module.words.slice(0, 2).join(" / ")}</em>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
