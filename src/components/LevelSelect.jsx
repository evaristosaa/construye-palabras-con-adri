import { Link } from "react-router-dom";
import Adri from "./Adri";
import { modules } from "../data/learningData";

export default function LevelSelect({ progress }) {
  const isUnlocked = (module) =>
    module.unlocked || !module.unlockedAfter || progress.completedLevels.includes(module.unlockedAfter);

  return (
    <section className="mission-screen comic-panel">
      <Adri variant="reader" bubble="Elige tu misión" size="medium" />
      <div className="mission-map">
        <h2>Elige tu misión</h2>
        <div className="map-path" aria-hidden="true" />
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
