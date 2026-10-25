import { primarySubjects, primaryMissions } from "./primaryData.js";
import { modules } from "./learningData.js";
import { workshopThemes, workshopId } from "./mathWorkshop.js";

const stickerIcons = {
  lengua: ["🏠", "🐱", "🎒", "✏️", "🌻", "🚂", "🐭", "📚"],
  matematicas: ["🌟", "🧩", "🍎", "🏗️", "🚀", "🛝", "🔺", "🪙"],
  medio: ["🖐️", "🪥", "🤝", "🦋", "🌱", "🧲", "🌳", "🌦️"],
};
const workshopIcons=["🐸", "🎨", "🔍", "📏", "🍐", "🔷"];

export function buildAchievementAlbum(progress) {
  const games=new Set(progress.completedGames || []);
  const completedMissions=new Set(progress.primaryCompletedLevels || []);
  const completedLetters=new Set(progress.completedLevels || []);
  const areas=primarySubjects.map(subject=>({
    id:subject.id,title:subject.id==="medio"?"Mi mundo":subject.title,
    label:subject.title,icon:subject.icon,to:`/primaria?materia=${subject.id}`,
    stickers:primaryMissions.filter(m=>m.subject===subject.id).map((mission,i)=>({
      id:mission.id,title:mission.title,icon:stickerIcons[subject.id][i],
      earned:completedMissions.has(mission.id),
      done:mission.activities.filter(a=>games.has(a.id)).length,total:mission.activities.length,
      to:`/primaria/mision/${mission.id}`,
    })),
  }));
  areas.push({id:"taller",title:"Juegos de mates",label:"Juegos de mates",icon:"🎲",to:"/primaria/mates",
    stickers:[10,20].flatMap(range=>workshopThemes.map((title,s)=>{
      const done=[0,1,2].filter(i=>games.has(workshopId(range,s,i))).length;
      return {id:`taller-${range}-${s}`,title:`${title} · hasta ${range}`,icon:workshopIcons[s],earned:done===3,done,total:3,to:"/primaria/mates"};
    })),
  });
  const letters=modules.map(module=>({id:module.id,title:module.title,letter:module.badge,icon:module.badge,to:`/juego/${module.id}`,earned:completedLetters.has(module.id)}));
  for(const area of areas) area.earned=area.stickers.filter(s=>s.earned).length;
  const stickers=areas.flatMap(area=>area.stickers);
  // A partially played mission is a concrete next step. Otherwise suggest the
  // least collected subject. Old/unknown ids never count as letter achievements.
  const next=stickers.find(s=>!s.earned&&s.done>0)
    || [...areas].sort((a,b)=>a.earned/a.stickers.length-b.earned/b.stickers.length).flatMap(a=>a.stickers).find(s=>!s.earned)
    || letters.find(letter=>!letter.earned);
  const earned=stickers.filter(s=>s.earned).length+letters.filter(l=>l.earned).length;
  return {areas,letters,next,earned,total:stickers.length+letters.length};
}
