import { Link } from "react-router-dom";
import { buildAchievementAlbum } from "../data/achievementAlbum.js";
import { worldAsset } from "../data/learningWorlds.js";
import "../styles/achievementAlbum.css";

export default function Achievements({progress}) {
  const album=buildAchievementAlbum(progress);
  const lettersDone=album.letters.filter(l=>l.earned).length;
  return <section className="comic-panel sticker-album">
    <header className="album-heading"><span className="album-mascot"><img src={`${import.meta.env.BASE_URL}assets/adri-celebrating.png`} alt="Adri celebra contigo"/></span><div><h1>Mis logros</h1><p>{album.earned===album.total?"¡Tu álbum está completo!":album.earned?"¡Mira lo que has conseguido!":"¡Vamos a llenar tu álbum!"}</p></div><span className="album-total" aria-label={`${album.earned} de ${album.total} pegatinas conseguidas`}><span aria-hidden="true">🏆</span><strong>{album.earned}<small> / {album.total}</small></strong></span></header>
    <div className="album-worlds">{album.areas.map(area=><article className={`album-world world-${area.id} ${area.earned===area.stickers.length?'world-complete':''}`} key={area.id} style={{"--album-world-art":`url("${worldAsset(area.id,import.meta.env.BASE_URL)}")`}}>
      <div className="world-heading"><h2><Link to={area.to} aria-label={`${area.label}: ${area.earned} de ${area.stickers.length} pegatinas. Jugar.`}>{area.title}<span aria-hidden="true">↗</span></Link></h2><span className="world-count" aria-hidden="true">{area.earned}/{area.stickers.length}</span></div>
      <div className="album-stickers" role="list" aria-label={`Pegatinas de ${area.label}`}>{area.stickers.map(sticker=><span key={sticker.id} role="listitem" title={`${sticker.title}: ${sticker.earned?'¡Conseguida!':`${sticker.done} de ${sticker.total} retos`}`} aria-label={`${sticker.title}: ${sticker.earned?'conseguida':`por conseguir, ${sticker.done} de ${sticker.total} retos`}`} className={`album-sticker ${sticker.earned?'is-earned':sticker.done?'is-growing':'is-waiting'}`}><span aria-hidden="true">{sticker.icon}</span>{sticker.earned?<b aria-hidden="true">★</b>:sticker.done>0?<b aria-hidden="true">·</b>:null}</span>)}</div>
      <p className="world-caption">{area.earned===area.stickers.length?"¡Colección completa! 🌟":area.earned?"¡Sigue descubriendo!":"Una misión, una pegatina"}</p>
    </article>)}</div>
    <article className="album-letters"><div><h2><Link to="/niveles" aria-label={`Letras: ${lettersDone} de ${album.letters.length} conseguidas. Jugar.`}>🔤 Mis letras <span aria-hidden="true">↗</span></Link></h2><span aria-hidden="true">{lettersDone}/{album.letters.length}</span></div><div className="letter-stickers" role="list" aria-label="Pegatinas del abecedario">{album.letters.map(letter=><span key={letter.id} role="listitem" title={letter.title} aria-label={`${letter.title}: ${letter.earned?'conseguida':'por conseguir'}`} className={letter.earned?'is-earned':''}>{letter.letter}</span>)}</div></article>
    <Link className="album-next" to={album.next?.to||"/primaria"}><span className="next-sticker" aria-hidden="true">{album.next?.icon||"🌟"}</span><span><strong>{album.next?"¡A por tu próxima pegatina!":"¡Seguimos jugando!"}</strong><small>{album.next?.title||"Puedes volver a tus juegos favoritos"}</small></span><b aria-hidden="true">→</b></Link>
  </section>;
}
