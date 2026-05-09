import { Link } from "react-router-dom";
import Adri from "./Adri";
import { Stars } from "./Blocks";

export default function RewardScreen({ progress }) {
  return (
    <section className="reward-screen comic-panel">
      <Adri variant="celebrating" bubble="¡Nivel superado!" />
      <div className="reward-card">
        <h2>¡Nivel superado!</h2>
        <Stars count={3} />
        <p>Piezas +5</p>
        <div className="mega-stars">★★★</div>
        <strong>Total: {progress.pieces} piezas</strong>
      </div>
      <div className="home-actions">
        <Link className="big-action green" to="/niveles">Otra misión</Link>
        <Link className="big-action blue" to="/coleccion">Ver construcción</Link>
      </div>
    </section>
  );
}
