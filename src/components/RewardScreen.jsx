import { Link } from "react-router-dom";
import Adri from "./Adri";
import { Stars } from "./Blocks";
import VoiceGuide from "./VoiceGuide";
import { screenAudioKeys } from "../data/adriAudioCatalog";
import { rewardGuide } from "../data/voiceScripts";

export default function RewardScreen({ progress }) {
  return (
    <section className="reward-screen comic-panel">
      <VoiceGuide
        text={rewardGuide}
        audioKey={screenAudioKeys.reward}
        enabled={progress.voice}
        voiceURI={progress.voiceURI}
        compact
      />
      <Adri variant="celebrating" size="side" bubble="¡Bien! ¡Misión superada!" />
      <div className="reward-card">
        <h2>¡Misión superada!</h2>
        <Stars count={3} />
        <p>Una parte más para la Casa de las Palabras</p>
        <div className="mega-stars">★★★</div>
        <strong>Total: {progress.pieces} piezas</strong>
      </div>
      <div className="home-actions">
        <Link className="big-action green" to="/niveles">
          Otra misión
        </Link>
        <Link className="big-action blue" to="/coleccion">
          Ver construcción
        </Link>
      </div>
    </section>
  );
}
