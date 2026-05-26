import { Link } from "react-router-dom";
import VoiceGuide from "./VoiceGuide";
import Adri from "./Adri";
import { homeGreeting } from "../data/voiceScripts";
import { screenAudioKeys } from "../data/adriAudioCatalog";

export default function Home({ progress }) {
  return (
    <section className="home-screen comic-panel">
      <VoiceGuide
        text={homeGreeting}
        audioKey={screenAudioKeys.home}
        enabled={progress.voice}
        compact
      />
      <div className="home-hero">
        <div className="home-character" aria-hidden="true">
          <Adri variant="pointing" size="full" />
        </div>
        <div className="home-menu">
          <div className="title-stack">
            <p>Construye</p>
            <h1>PALABRAS</h1>
            <span>con ADRI</span>
          </div>
          <nav className="home-actions" aria-label="Menu inicial">
            <Link className="big-action green" to="/niveles">
              Misiones
            </Link>
            <Link className="big-action yellow" to="/coleccion">
              Construcciones
            </Link>
            <Link className="big-action blue" to="/progreso">
              Progreso
            </Link>
            <Link className="big-action purple" to="/ajustes">
              Ajustes
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
