import Adri from "./Adri";
import {classmates,classmateFor,classmateAsset} from "../data/classmates.js";

export function FriendPortrait({name,className="",decorative=false}){
  const friend=classmateFor(name);
  return <span className={`friend-portrait friend-${friend.id} ${className}`} aria-hidden={decorative?true:undefined}><img src={classmateAsset(name,import.meta.env.BASE_URL)} alt={decorative?"":`${friend.name}, personaje de cómic`} draggable="false" decoding="async"/></span>;
}
export function FriendAvatar({name,className="",decorative=false}){
  const friend=classmateFor(name);
  return <span className={`friend-avatar friend-${friend.id} ${className}`} role={decorative?undefined:"img"} aria-label={decorative?undefined:`${friend.name} te acompaña`} aria-hidden={decorative?true:undefined} title={friend.name}><img src={classmateAsset(name,import.meta.env.BASE_URL)} alt="" draggable="false" decoding="async"/></span>;
}
export function FriendTeam(){return <span className="friend-team" aria-hidden="true">{classmates.map(c=><FriendAvatar key={c.id} name={c.name} decorative/>)}</span>;}
export function FriendCompanion({name,variant}){
  const friend=classmateFor(name);
  return friend.id==="adri"?<Adri variant={variant} size="side"/>:<div className={`adri adri-side adri-reader friend-companion friend-${friend.id}`}><div className="adri-frame"><img src={classmateAsset(name,import.meta.env.BASE_URL)} alt={`${friend.name}, personaje de la clase de Adri`}/></div></div>;
}
