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
export function FriendReaction({name,emotion="observe",className=""}){
  const friend=classmateFor(name),column=classmates.findIndex(c=>c.id===friend.id),row={observe:0,idea:1,celebrate:2}[emotion]??0;
  return <span className={`friend-reaction reaction-${emotion} ${className}`} role="img" aria-label={`${friend.name}: ${{observe:"observando",idea:"propone una idea",celebrate:"celebra tu esfuerzo"}[emotion]||"te acompaña"}`} style={{backgroundImage:`url("${import.meta.env.BASE_URL}assets/characters/amigos-expresiones-v1.webp")`,backgroundPosition:`${column*50}% ${row*50}%`}}/>;
}
export function FriendCompanion({name,variant}){
  return <FriendReaction name={name} emotion={variant==="celebrating"?"celebrate":variant==="pointing"?"idea":"observe"} className="companion-reaction"/>;
}
