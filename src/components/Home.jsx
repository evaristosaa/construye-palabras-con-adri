import { Link } from "react-router-dom";
import Adri from "./Adri";
import { Brick } from "./Blocks";

export default function Home({ progress }) {
  return (
    <section className="home-screen comic-panel">
      <div className="title-stack">
        <p>Construye</p>
        <h1>PALABRAS</h1>
        <span>con ADRI</span>
      </div>
      <Adri variant="pointing" bubble="¡Vamos a leer y aventarnos juntos!" />
      <div className="brick-stack" aria-hidden="true">
        <Brick color="yellow">BA</Brick>
        <Brick color="blue">BE</Brick>
        <Brick color="red">BI</Brick>
        <Brick color="green">BO</Brick>
      </div>
      <div className="home-actions">
        <Link className="big-action green" to="/niveles">
          JUGAR ▶
        </Link>
        <Link className="big-action blue" to="/juego/letra-b">
          LETRA B
        </Link>
        <Link className="big-action purple" to="/progreso">
          MIS LOGROS ★ {progress.stars}
        </Link>
      </div>
    </section>
  );
}
