import Adri from "./Adri";
import VoiceGuide from "./VoiceGuide";

export default function ProgressProfile({ progress }) {
  const level = Math.max(1, Math.floor(progress.pieces / 15) + 1);

  return (
    <section className="profile-screen comic-panel">
      <VoiceGuide
        text="Aquí vemos cómo vamos. Estas son tus estrellas, tus piezas y las misiones que ya completaste conmigo."
        enabled={progress.voice}
        compact
      />
      <Adri variant="teacher" bubble="¡Cada palabra es una nueva aventura!" />
      <div className="profile-card">
        <div className="level-ring">
          <span>Nivel</span>
          <strong>{level}</strong>
        </div>
        <p><strong>Estrellas:</strong> {progress.stars}</p>
        <p><strong>Piezas:</strong> {progress.pieces}</p>
        <p><strong>Niveles completados:</strong> {progress.completedLevels.length}/5</p>
        <p><strong>Racha:</strong> {progress.streak} días</p>
      </div>
    </section>
  );
}
