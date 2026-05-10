import { Link } from "react-router-dom";
import VoiceGuide from "./VoiceGuide";
import Adri from "./Adri";

export default function Home({ progress }) {
  return (
    <section className="home-screen comic-panel">
      <VoiceGuide
        text="Hola Adri. Elige un botón para empezar a leer, jugar o ver tus logros."
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
          <nav className="home-actions" aria-label="Menú inicial">
            <Link className="big-action green" to="/niveles">
              ▶ Jugar
            </Link>
            <Link className="big-action blue" to="/juego/vocales">
              🔊 Vocales
            </Link>
            <Link className="big-action yellow" to="/coleccion">
              🧱 Construcciones
            </Link>
            <Link className="big-action purple" to="/progreso">
              ★ Mis logros
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
