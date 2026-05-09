import Adri from "./Adri";
import { characters } from "../data/learningData";

export default function Characters({ unlockedCharacters }) {
  return (
    <section className="characters-screen comic-panel">
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
