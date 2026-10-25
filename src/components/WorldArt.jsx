import {worldFor,worldAsset} from "../data/learningWorlds.js";

// Atmospheric artwork is deliberately separate from the problem's evidence.
// It contains no answer labels and is skipped by assistive technology.
export default function WorldArt({subject="lengua",className="",caption=false}){
  const world=worldFor(subject);
  return <figure className={`world-art art-${subject} ${className}`} aria-hidden="true"><img src={worldAsset(subject,import.meta.env.BASE_URL)} alt="" width="1536" height="1024" decoding="async" draggable="false" style={{objectPosition:world.position}}/>{caption&&<figcaption>{world.title}</figcaption>}</figure>;
}
