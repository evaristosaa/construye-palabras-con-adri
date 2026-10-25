import { primaryMissions } from "./primaryData.js";
import { presentPrimaryActivity, needsPrimaryPractice, isReviewDue } from "./primaryPractice.js";

export const subjectWorkshopVoices=[{key:"primary-workshop",filename:"primary-workshop.wav",text:"Mira, prueba y descubre. Después, cuenta cómo lo has hecho. Vamos paso a paso."}];
export const subjectWorkshopInfo={
  lengua:{title:"Juegos de Lengua",icon:"📖",intro:"Escucha, construye y cuenta",action:"Pruebo con sílabas y palabras",reflection:"¿Qué te ha ayudado a entender o construir las palabras?"},
  medio:{title:"Juegos de mi mundo",icon:"🌱",intro:"Observa, prueba y descubre",action:"Clasifico y ordeno lo que observo",reflection:"¿Qué has observado? ¿Cómo lo comprobarías en casa?"},
};

export function buildSubjectWorkshop(subject,progress,now=new Date()) {
  if(!subjectWorkshopInfo[subject]) return [];
  const all=primaryMissions.filter(m=>m.subject===subject).flatMap(m=>m.activities);
  const completed=new Set(progress.completedGames || []);
  const rank=a=>needsPrimaryPractice(progress.primaryAttempts?.[a.id])?0:isReviewDue(progress.primaryAttempts?.[a.id],now)?1:!completed.has(a.id)?2:3;
  const recent=a=>Date.parse(progress.primaryAttempts?.[a.id]?.lastAttemptAt)||0;
  const candidates=all.map(a=>({...presentPrimaryActivity(a,progress),subject})).sort((a,b)=>rank(a)-rank(b)||recent(a)-recent(b));
  // The central stage always manipulates language, classifies or sequences.
  const central=candidates.find(a=>["syllables","order","sort"].includes(a.type));
  const warm=candidates.find(a=>a.topic!==central.topic);
  const application=candidates.find(a=>a.topic!==central.topic&&a.topic!==warm.topic);
  return [warm,central,application].map((a,i)=>({...a,workshopPhase:["1 · Pienso","2 · Pruebo","3 · Resuelvo"][i]}));
}
