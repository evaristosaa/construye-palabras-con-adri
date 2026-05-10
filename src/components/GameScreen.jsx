import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Adri from "./Adri";
import { Brick, Drawing, Stars } from "./Blocks";
import { levelsById, positiveMessages } from "../data/learningData";
import { playPositive, speak } from "./audio";

const brickColors = ["red", "yellow", "blue", "green", "purple"];

export default function GameScreen({ progress, completeGame, completeLevel }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [built, setBuilt] = useState([]);
  const [feedback, setFeedback] = useState("¡Sigue así!");
  const level = levelsById[levelId] || levelsById.vocales;
  const game = level.games[gameIndex];

  useEffect(() => {
    speak(game.speak || game.prompt, progress.voice);
  }, [game.id, game.prompt, game.speak, progress.voice]);

  const solvedCount = useMemo(
    () => level.games.filter((item) => progress.completedGames.includes(item.id)).length,
    [level.games, progress.completedGames]
  );

  function celebrate(gameId = game.id) {
    playPositive(progress.sound);
    const message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    setFeedback(message);
    completeGame(gameId);
  }

  function handleChoice(option) {
    setSelected(option);
    if (option === game.answer) {
      celebrate();
      setTimeout(() => nextGame(), 650);
    } else {
      setFeedback("Casi, Adri. Mira la pista brillante.");
    }
  }

  function handleBuild(letter) {
    const next = [...built, letter];
    setBuilt(next);
    if (next.join("") === game.answer) {
      celebrate();
      setTimeout(() => nextGame(), 700);
    } else if (!game.answer.startsWith(next.join(""))) {
      setFeedback("Prueba otro bloque. Te ayudo con una pista.");
      setBuilt([]);
    }
  }

  function dropBlock(event) {
    event.preventDefault();
    handleBuild(event.dataTransfer.getData("text/plain"));
  }

  function nextGame() {
    setSelected("");
    setBuilt([]);
    setFeedback("¡Has colocado una pieza!");
    if (gameIndex < level.games.length - 1) {
      setGameIndex((current) => current + 1);
    } else {
      completeLevel(level.id);
      navigate(`/recompensa/${level.id}`);
    }
  }

  function markPhraseRead() {
    celebrate();
    setTimeout(() => nextGame(), 700);
  }

  return (
    <section className="game-screen">
      <div className="game-header comic-panel">
        <div>
          <p className="eyebrow">{level.subtitle}</p>
          <h2>{gameIndex + 1}. {game.title}</h2>
        </div>
        <button
          className="round-button"
          onClick={() => speak(game.speak || game.prompt, progress.voice)}
          aria-label="Escuchar la instrucción"
        >
          🔊
        </button>
      </div>

      <div className="game-stage comic-panel">
        <Adri variant={game.character} size="medium" bubble={game.prompt} />
        <div className="activity-card">
          {game.drawing && <Drawing type={game.drawing} />}
          {game.type === "choice" && (
            <div className="choice-grid">
              {game.options.map((option, index) => (
                <Brick
                  key={option}
                  color={brickColors[index % brickColors.length]}
                  selected={selected === option || (selected && option === game.answer)}
                  onClick={() => handleChoice(option)}
                >
                  {option}
                </Brick>
              ))}
            </div>
          )}

          {game.type === "build" && (
            <>
              <div className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={dropBlock}>
                {built.length ? built.join("") : "Arrastra o toca bloques"}
              </div>
              <div className="choice-grid block-row">
                {game.blocks.map((letter, index) => (
                  <Brick
                    key={`${letter}-${index}`}
                    color={brickColors[index % brickColors.length]}
                    draggable
                    onClick={() => handleBuild(letter)}
                  >
                    {letter}
                  </Brick>
                ))}
              </div>
            </>
          )}

          {game.type === "phrase" && (
            <div className="phrase-reader">
              <p>{game.phrase || game.prompt}</p>
              <button className="check-button" onClick={markPhraseRead}>
                ✓
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="game-footer comic-panel">
        <Stars count={Math.min(3, selected === game.answer || built.join("") === game.answer ? 3 : solvedCount % 4)} />
        <strong>{feedback}</strong>
        <div className="progress-track">
          <span style={{ width: `${((gameIndex + 1) / level.games.length) * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
