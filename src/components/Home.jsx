import { Link } from "react-router-dom";
import VoiceGuide from "./VoiceGuide";
import { classmates } from "../data/classmates.js";
import { worldAsset } from "../data/learningWorlds.js";
import { primaryVoiceTexts } from "../data/primaryVoiceLines.js";

export default function Home({ progress }) {
  return (
    <section className="home-screen comic-panel primary-home" style={{"--home-world":`url("${worldAsset("lengua",import.meta.env.BASE_URL)}")`}}>
      <VoiceGuide
        text={primaryVoiceTexts["home-welcome"]}
        audioKey="home-welcome"
        enabled={progress.voice}
        compact
      />
      <div className="home-hero">
        <div className="home-character home-friends" aria-label="Adri, Juan y Cayetana">
          <img className="home-friends-illustration" src={`${import.meta.env.BASE_URL}assets/characters/amigos-comic-unificado-v1.png`} alt="" draggable="false" />
          <div className="home-friend-names">{classmates.map(friend => <span key={friend.id}>{friend.name}</span>)}</div>
        </div>
        <div className="home-menu">
          <div className="title-stack">
            <div className="primary-grade-label">1.º de Primaria</div>
            <p>Construye</p>
            <h1>IDEAS</h1>
            <span>con ADRI</span>
          </div>
          <nav className="home-actions" aria-label="Menu inicial">
            <Link className="big-action green" to="/primaria/merienda">
              ¡Vamos a jugar!
            </Link>
            <Link className="big-action yellow" to="/logros">
              Mis logros
            </Link>
            <Link className="big-action purple" to="/ajustes">
              Familia
            </Link>
          </nav>
          <div className="home-review-links"><Link className="primary-home-review" to="/primaria">Elegir materia</Link><Link className="primary-home-review" to="/niveles">Abecedario →</Link></div>
        </div>
      </div>
    </section>
  );
}
