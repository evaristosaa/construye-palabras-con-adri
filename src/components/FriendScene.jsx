import { friendScenes } from '../data/friendScenes.js';
import { useId } from 'react';

export default function FriendScene({ scene = 'welcome', className = '', decorative = true }) {
  const entry = friendScenes[scene] || friendScenes.welcome;
  const clipId = useId();
  const label = decorative ? undefined : 'Adri, Juan y Cayetana aprenden juntos';
  if (entry.image) return <img className={`friend-scene ${className}`} src={`${import.meta.env.BASE_URL}assets/characters/${entry.image}`} alt={label || ''} draggable="false" decoding="async"/>;
  return <svg className={`friend-scene friend-scene-atlas ${className}`} viewBox={entry.box.join(" ")} preserveAspectRatio="xMidYMid meet" role={decorative ? undefined : 'img'} aria-label={label} aria-hidden={decorative ? true : undefined} focusable="false">
    <defs><clipPath id={clipId}><rect x={entry.box[0]} y={entry.box[1]} width={entry.box[2]} height={entry.box[3]}/></clipPath></defs>
    <image href={`${import.meta.env.BASE_URL}assets/characters/amigos-actividades-v2.webp`} width="1536" height="1024" clipPath={`url(#${clipId})`}/>
  </svg>;
}
