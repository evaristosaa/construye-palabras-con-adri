import Adri from "./Adri";
import { characters } from "../data/learningData";
import VoiceGuide from "./VoiceGuide";

export default function Characters({ unlockedCharacters, progress }) {
  return (
    <section className="characters-screen comic-panel">
      <VoiceGuide
        text="Esta es tu colección de Adri. Gana piezas para desbloquear más personajes."
        enabled={progress.voice}
        compact
      />
      <h2>Mi colección de Adri</h2>
      <div className="character-grid">
        {characters.map((character) => {
          const unlocked = unlockedCharacters.includes(character.id);
          return (
            <article key={character.id} className={`character-card ${unlocked ? "" : "locked"}`}>
              {unlocked ? <Adri variant={character.variant} size="small" /> : <div className="secret-card">?</div>}
              <h3>{unlocked ? character.title : "¿Secreto?"}</h3>
              <p>{unlocked ? "Desbloqueado" : `${character.unlock} piezas`}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
