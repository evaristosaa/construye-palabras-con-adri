export const skillDefinitions={
  palabras:['Sílabas y sonidos',[]],frases:['Construir frases',['palabras']],comprendo:['Comprender textos',['frases']],puntuacion:['Mayúsculas y signos',['frases']],describo:['Vocabulario y descripción',['palabras']],grupos:['Grupos consonánticos',['palabras']],cuentos:['Secuencias y personajes',['comprendo']],cotidianos:['Leer instrucciones',['comprendo']],
  numeros:['Cantidades y orden',[]],sumas:['Componer cantidades',['numeros']],restas:['Quitar y comparar',['numeros']],problemas:['Resolver situaciones',['sumas','restas']],decenas:['Decenas y unidades',['numeros']],formas:['Formas y orientación',[]],medidas:['Medida y comparación',['numeros']],datos:['Interpretar datos',['numeros']],
  calculo:['Cálculo con el diez',['sumas','restas']],vida:['Tiempo, medidas y monedas',['numeros']],habitos:['Hábitos saludables',['cuerpo']],convivo:['Convivencia y emociones',[]],
  cuerpo:['Mi cuerpo y sus cuidados',[]],salud:['Hábitos saludables',['cuerpo']],animales:['Observar animales',[]],plantas:['Observar plantas',[]],familia:['Convivencia y emociones',[]],materiales:['Materiales y cambios',[]],entorno:['Cuidar el entorno',[]],tiempo:['Tiempo y observación',[]]
};
export function skillsForActivity(activityId){
  const parts=String(activityId).split('-');
  const subject=parts[1];const topic=parts[2];
  if(parts[0]==='primaria'&&skillDefinitions[topic])return [{id:`${subject}:${topic}`,subject,topic,title:skillDefinitions[topic][0],prerequisites:skillDefinitions[topic][1].map(t=>`${subject}:${t}`)}];
  if(parts[0]==='aventura'&&parts[1]==='merienda')return skillsForActivity(`primaria-${parts.at(-1)==='cesta'?'lengua-cotidianos':parts.at(-1)==='reparto'?'matematicas-sumas':'medio-habitos'}-1`);
  if(parts[0]==='semilla')return skillsForActivity('primaria-lengua-comprendo-1');
  const topicMap={figuras:'formas',camino:'formas',tienda:'sumas'};
  if(parts[0]==='explora'&&topicMap[parts[1]])return skillsForActivity(`primaria-matematicas-${topicMap[parts[1]]}-1`);
  if(parts[0]==='mates'&&parts[1]==='taller')return skillsForActivity(`primaria-matematicas-${['numeros','sumas','formas','medidas','datos','formas'][Number(parts[3])]||'numeros'}-1`);
  return [];
}
export function recordLearningEvent(events=[],activityId,correct,{now=new Date(),variantKey='original',supported=false}={}){
  return [...events,{activityId,correct:!!correct,supported:!!supported,variantKey:String(variantKey).slice(0,100),at:new Date(now).toISOString(),skills:skillsForActivity(activityId).map(s=>s.id)}].slice(-1500);
}
export function summarizeSkills(events=[]){
  const groups={};for(const event of events){for(const skill of skillsForActivity(event.activityId)){
    const row=groups[skill.id]??={...skill,attempts:0,independent:0,supported:0,days:new Set(),examples:new Set(),lastAt:event.at};
    row.attempts++;row.lastAt=event.at;
    if(event.correct){if(event.supported)row.supported++;else{row.independent++;row.days.add(new Date(event.at).toLocaleDateString('en-CA'));row.examples.add(`${event.activityId}:${event.variantKey}`);}}
  }}
  return Object.values(groups).map(r=>({...r,days:r.days.size,examples:r.examples.size,state:r.days.size>=2&&r.examples.size>=2?'En situaciones diferentes':r.independent?'Practicamos':'Lo descubrimos'}));
}
export function selectSkillPractice(activities,progress,now=new Date()){
  const summaries=summarizeSkills(progress.learningEvents);
  const byId=Object.fromEntries(summaries.map(s=>[s.id,s]));
  const today=new Date(now).toDateString();
  const candidates=activities.filter(a=>skillsForActivity(a.id).every(s=>s.prerequisites.every(id=>byId[id]?.independent>0)));
  const pool=candidates.length?candidates:activities;
  return [...pool].sort((a,b)=>{
    function score(item){const s=byId[skillsForActivity(item.id)[0]?.id];const attempt=progress.primaryAttempts?.[item.id];return (attempt?.lastCorrectAt&&new Date(attempt.lastCorrectAt).toDateString()===today?100:0)+(s?.state==='En situaciones diferentes'?20:0)+(s?.independent?5:0)+(attempt?.attempts?1:0);}
    return score(a)-score(b);
  })[0];
}
