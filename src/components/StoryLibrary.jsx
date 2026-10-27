import {Link} from 'react-router-dom';

export default function StoryLibrary(){
 return <section className="story-library comic-panel" style={{'--reading-scene':`url("${import.meta.env.BASE_URL}assets/worlds/reading-village.webp")`,'--garden-scene':`url("${import.meta.env.BASE_URL}assets/worlds/discovery-garden.webp")`}}><header><Link className="primary-secondary-button" to="/primaria?materia=lengua">← Lengua</Link><Link className="primary-main-button" to="/primaria/crea">✨ Crear cuento</Link><h1>📚 Nuestros cuentos</h1></header><div className="story-library-cards">
  <Link to="/primaria/merienda"><span className="library-art library-snack" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/characters/amigos-comic-unificado-v1.webp`} alt=""/><b>🧺</b></span><strong>La merienda de los amigos</strong><small>Escucha, lee y prepara una merienda.</small></Link>
  <Link to="/primaria/cuentos/semilla"><span className="library-art library-seed" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/characters/amigos-comic-unificado-v1.webp`} alt=""/><b>🌱</b></span><strong>La semilla de Cayetana</strong><small>Un cuento y tres preguntas para descubrir.</small></Link>
 </div></section>;
}
