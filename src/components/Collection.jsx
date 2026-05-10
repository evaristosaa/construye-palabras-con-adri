import Adri from "./Adri";
import { rewards } from "../data/learningData";
import VoiceGuide from "./VoiceGuide";

export default function Collection({ progress, completedRewards }) {
  return (
    <section className="collection-screen comic-panel">
      <VoiceGuide
        text="Esta es tu zona de construcciones. Cada vez que aciertas, ganamos piezas para terminar casas, coches y torres."
        enabled={progress.voice}
        compact
      />
      <h2>Mis construcciones</h2>
      <div className="collection-grid">
        {rewards.map((reward) => {
          const unlocked = completedRewards.includes(reward.id);
          return (
            <article key={reward.id} className={`build-card build-${reward.id} ${unlocked ? "" : "locked"}`}>
              <div className="build-illustration" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h3>{reward.title}</h3>
              <p>{unlocked ? "¡Construida!" : `${reward.pieces} piezas`}</p>
            </article>
          );
        })}
      </div>
      <Adri variant="builder" size="medium" bubble={`${progress.pieces}/60 piezas`} />
      <div className="piece-track">
        <span style={{ width: `${Math.min(100, (progress.pieces / 60) * 100)}%` }} />
      </div>
    </section>
  );
}
