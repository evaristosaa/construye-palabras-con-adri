import { Link } from "react-router-dom";
import Adri from "./Adri";
import { modules } from "../data/learningData";
import VoiceGuide from "./VoiceGuide";

export default function LevelSelect({ progress }) {
  const isUnlocked = (module) =>
    module.unlocked || !module.unlockedAfter || progress.completedLevels.includes(module.unlockedAfter);

  return (
    <section className="mission-screen comic-panel">
      <VoiceGuide
        text="Elige una misión. Primero puedes jugar con vocales. También puedes tocar una letra y yo te explico el juego paso a paso."
        enabled={progress.voice}
        compact
      />
      <Adri variant="reader" bubble="Elige tu misión" size="medium" />
      <div className="mission-map">
        <h2>Elige tu misión</h2>
        {modules.map((module, index) => {
          const unlocked = isUnlocked(module);
          const completed = progress.completedLevels.includes(module.id);
          return (
            <Link
              key={module.id}
              to={unlocked ? `/juego/${module.id}` : "#"}
              className={`mission-block mission-${module.color} pos-${index} ${unlocked ? "" : "locked"}`}
              aria-disabled={!unlocked}
            >
              <span className="mission-star">{completed ? "★" : unlocked ? "☆" : "🔒"}</span>
              <strong>{module.badge}</strong>
              <small>{module.title}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
