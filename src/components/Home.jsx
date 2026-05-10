import { Link } from "react-router-dom";
import VoiceGuide from "./VoiceGuide";

export default function Home({ progress }) {
  return (
    <section className="home-screen">
      <VoiceGuide
        text="Hola Adri. Toca la pantalla para empezar a construir palabras."
        enabled={progress.voice}
        compact
      />
      <Link className="home-hotspot" to="/niveles" aria-label="Entrar a las misiones de lectura" />
    </section>
  );
}
