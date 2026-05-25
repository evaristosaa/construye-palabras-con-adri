import Adri from "./Adri";
import VoiceGuide from "./VoiceGuide";
import { totalMissions } from "../data/learningData";

export default function ProgressProfile({ progress }) {
  const completed = progress.completedLevels.length;
  const level = Math.min(totalMissions, completed + 1);
  const percent = Math.min(100, (completed / totalMissions) * 100);

  return (
    <section className="profile-screen comic-panel">
      <VoiceGuide
        text="Aquí vemos tu progreso. La parte más importante es cuántas misiones llevas completadas."
        enabled={progress.voice}
        voiceURI={progress.voiceURI}
        compact
      />
      <Adri variant="teacher" size="side" bubble="Mira todo lo que ya has leído." />
      <div className="profile-card progress-card">
        <h2>Progreso de lectura</h2>
        <div className="mission-count">
          <strong>{completed}</strong>
          <span>de {totalMissions} misiones</span>
        </div>
        <div className="piece-track progress-big">
          <span style={{ width: `${percent}%` }} />
        </div>
        <p>
          <strong>Nivel actual:</strong> {level} de {totalMissions}
        </p>
        <p>
          <strong>Estrellas:</strong> {progress.stars}
        </p>
        <p>
          <strong>Piezas:</strong> {progress.pieces}
        </p>
        <p>
          <strong>Racha:</strong> {progress.streak} días
        </p>
      </div>
    </section>
  );
}
