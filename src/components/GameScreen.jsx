import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Adri from "./Adri";
import { Brick, Drawing, Stars } from "./Blocks";
import { levelsById, positiveMessages } from "../data/learningData";
import { gameAudioKey } from "../data/adriAudioCatalog";
import { speak, speakResult } from "./audio";

const brickColors = ["red", "yellow", "blue", "green", "purple", "orange"];

function MissionBuild({ step = 0 }) {
  return (
    <div className="mission-build" aria-label={`Construcción paso ${step}`}>
      <span className={`build-part base ${step >= 1 ? "built" : ""}`} />
      <span className={`build-part wall-left ${step >= 2 ? "built" : ""}`} />
      <span className={`build-part wall-right ${step >= 3 ? "built" : ""}`} />
      <span className={`build-part door ${step >= 4 ? "built" : ""}`} />
      <span className={`build-part window ${step >= 5 ? "built" : ""}`} />
      <span className={`build-part roof ${step >= 6 ? "built" : ""}`} />
      <span className={`build-part chimney ${step >= 7 ? "built" : ""}`} />
      <span className={`build-part flag ${step >= 8 ? "built" : ""}`} />
    </div>
  );
}

export default function GameScreen({ progress, completeGame, completeLevel }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [built, setBuilt] = useState([]);
  const [feedback, setFeedback] = useState("¡Sigue así!");
  const level = levelsById[levelId] || levelsById["letra-a"];
  const game = level.games[gameIndex];
  const hasSideDrawing = game.drawing && game.type !== "imageChoice";

  useEffect(() => {
    setSelected("");
    setBuilt([]);
    setFeedback("¡Sigue así!");
    speak(game.speak || game.prompt, progress.voice, progress.voiceURI, {
      audioKey: gameAudioKey(game.id),
    });
  }, [game.id, game.prompt, game.speak, progress.voice, progress.voiceURI]);

  const solvedCount = useMemo(
    () => level.games.filter((item) => progress.completedGames.includes(item.id)).length,
    [level.games, progress.completedGames]
  );

  function celebrate(gameId = game.id) {
    const message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    setFeedback(message);
    speakResult("success", progress.voice, progress.sound, progress.voiceURI);
    completeGame(gameId, { pieces: 1, stars: 1 });
  }

  function retry() {
    const hint = "Repite. Mira la pista y prueba otra vez.";
    setFeedback(hint);
    speakResult("retry", progress.voice, progress.sound, progress.voiceURI);
  }

  function handleChoice(option) {
    const value = typeof option === "string" ? option : option.label;
    setSelected(value);
    if (value === game.answer) {
      celebrate();
      setTimeout(() => nextGame(), 720);
    } else {
      retry();
    }
  }

  function handleBuild(letter) {
    const next = [...built, letter];
    setBuilt(next);
    if (next.join("") === game.answer) {
      celebrate();
      setTimeout(() => nextGame(), 760);
    } else if (!game.answer.startsWith(next.join(""))) {
      setBuilt([]);
      retry();
    }
  }

  function dropBlock(event) {
    event.preventDefault();
    handleBuild(event.dataTransfer.getData("text/plain"));
  }

  function nextGame() {
    setSelected("");
    setBuilt([]);
    if (gameIndex < level.games.length - 1) {
      setGameIndex((current) => current + 1);
    } else {
      completeLevel(level.id);
      navigate(`/recompensa/${level.id}`);
    }
  }

  function renderOption(option, index, className = "") {
    return (
      <Brick
        key={`${option}-${index}`}
        color={brickColors[index % brickColors.length]}
        className={className}
        selected={selected === option || (selected && option === game.answer)}
        onClick={() => handleChoice(option)}
      >
        {option}
      </Brick>
    );
  }

  function renderImageOption(option, index) {
    return (
      <button
        key={`${option.label}-${index}`}
        className={`image-option ${selected === option.label ? "is-selected" : ""} ${
          selected && option.label === game.answer ? "is-correct" : ""
        }`}
        onClick={() => handleChoice(option)}
      >
        <Drawing type={option.drawing} hideLabel />
        <strong>{option.label}</strong>
      </button>
    );
  }

  return (
    <section className="game-screen">
      <div className="game-header comic-panel">
        <div>
          <p className="eyebrow">{level.subtitle}</p>
          <h2>
            {gameIndex + 1}. {game.title}
          </h2>
        </div>
        <button
          className="round-button"
          onClick={() =>
            speak(game.speak || game.prompt, progress.voice, progress.voiceURI, {
              audioKey: gameAudioKey(game.id),
            })
          }
          aria-label="Escuchar la instrucción"
        >
          🔊
        </button>
      </div>

      <div className="game-stage comic-panel">
        <aside className="game-companion">
          <Adri variant={game.character} size="side" bubble={game.prompt} />
          <MissionBuild step={game.progressBuild || gameIndex + 1} />
        </aside>

        <div className={`activity-card ${hasSideDrawing ? "activity-with-drawing" : ""}`}>
          {game.drawing && !["imageChoice"].includes(game.type) && <Drawing type={game.drawing} />}

          {game.type === "choice" && <div className="choice-grid">{game.options.map(renderOption)}</div>}

          {game.type === "imageChoice" && (
            <div className="image-choice-grid">{game.options.map((option, index) => renderImageOption(option, index))}</div>
          )}

          {game.type === "syllableHunt" && (
            <div className={`workbook-box hunt-${game.targetColor}`}>
              <p>Busca y toca la sílaba</p>
              <strong>{game.answer}</strong>
              <div className="syllable-board">
                {game.options.map((option, index) => renderOption(option, index, "syllable-chip"))}
              </div>
            </div>
          )}

          {game.type === "missing" && (
            <div className="workbook-box missing-game">
              <p>Completa la palabra</p>
              <div className="missing-word">{game.word}</div>
              <small>{game.fullWord}</small>
              <div className="choice-grid block-row">
                {game.options.map((option, index) => renderOption(option, index, "syllable-chip"))}
              </div>
            </div>
          )}

          {game.type === "pictureWord" && (
            <div className="workbook-box">
              <p>Une el dibujo con su nombre</p>
              <div className="choice-grid">{game.options.map(renderOption)}</div>
            </div>
          )}

          {game.type === "sentenceChoice" && (
            <div className="sentence-list">
              {game.options.map((option, index) => (
                <button
                  key={`${option}-${index}`}
                  className={`sentence-option ${selected === option ? "is-selected" : ""} ${
                    selected && option === game.answer ? "is-correct" : ""
                  }`}
                  onClick={() => handleChoice(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {game.type === "build" && (
            <div className="build-workshop">
              <div className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={dropBlock}>
                {built.length ? built.join("") : "Toca los bloques en orden"}
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
            </div>
          )}

          {game.type === "finalChoice" && (
            <div className="workbook-box final-challenge">
              <p>Pista: {game.clue}</p>
              <div className="choice-grid">{game.options.map(renderOption)}</div>
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
