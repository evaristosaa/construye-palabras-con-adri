// Original home practice inspired by publicly described manipulative teaching.
// No publisher exercises, illustrations or school-session numbering are reproduced.
import {patternContinuation,patternAnswer} from './patternBuilder.js';
export const mathWorkshopVoices = [
  ["math-workshop", "Vamos a jugar con las mates. Piensa, prueba y cuenta cómo lo has hecho."],
  ["math-line", "Empieza en el número marcado. Da saltos de uno en uno y comprueba."],
  ["math-split", "Reparte las fichas en dos grupos. Busca dos maneras diferentes."],
  ["math-reflect", "¿Cómo lo has pensado? Cuéntaselo a alguien. Puedes usar objetos o dibujarlo."],
  ["math-pattern-build", "Mira el grupo que se repite. Toca las figuras para continuar el patrón. Puedes quitar una pieza y volver a probar."],
].map(([key,text])=>({key,text,filename:`${key}.wav`}));

export const workshopThemes = ["Saltos y números", "Amigos de una cantidad", "Detectives de patrones", "Medimos jugando", "Leemos los datos", "Miramos las formas"];
export function splitSignature(left,total) { return `${Math.min(left,total-left)}+${Math.max(left,total-left)}`; }
export function workshopId(range,session,index) { return `mates-taller-${range}-${session}-${index}`; }
export function nextWorkshopSession(progress,range) {
  const completed=progress.completedGames || [];
  // Revisit a session with unresolved difficulties before moving on.
  const difficult=workshopThemes.findIndex((_,s)=>[0,1,2].some(i=>{
    const a=progress.primaryAttempts?.[workshopId(range,s,i)];
    return a?.mistakes>=2 && (a.correctStreak||0)<2;
  }));
  if(difficult>=0) return difficult;
  const next=workshopThemes.findIndex((_,s)=>[0,1,2].some(i=>!completed.includes(workshopId(range,s,i))));
  return next<0?0:next;
}

export function buildMathWorkshop(requestedRange,requestedSession) {
  const range=requestedRange===20?20:10;
  const session=Number.isInteger(requestedSession)&&requestedSession>=0&&requestedSession<6?requestedSession:0;
  const extra=range===20?10:0;
  const warmTotal=3+session;
  const warm={type:"choice",question:"¿Cuántos puntos ves en total?",dots:[Math.min(5,warmTotal),Math.max(0,warmTotal-5)],answer:String(warmTotal),options:[warmTotal+1,warmTotal-1,warmTotal].map(String),hint:"Mira cada grupo. Puedes contar los puntos o juntar las cantidades.",explanation:`Hay ${warmTotal} puntos. Puedes reconocer grupos pequeños y después juntarlos.`};
  const patternUnit=range===20?['circle','triangle','triangle','square']:['circle','triangle','triangle'];
  const nextPattern=patternContinuation(patternUnit,patternUnit.length*2,patternUnit.length);
  const central=[
    {type:"line",question:`Empieza en ${3+extra} y avanza 4.`,start:3+extra,min:extra,max:10+extra,answer:String(7+extra),hint:"Cada salto hacia delante suma uno.",explanation:`Cuatro saltos desde ${3+extra} llegan a ${7+extra}.`,audioKey:"math-line"},
    {type:"split",question:`Forma ${range} de dos maneras.`,total:range,hint:"Cambia cuántas fichas hay en cada grupo. Busca otros dos números, no solo otro orden.",explanation:`Una misma cantidad se puede repartir de distintas maneras. Juntar los dos grupos siempre da ${range}.`,audioKey:"math-split"},
    {type:"pattern-build",question:"Construye cómo sigue el patrón.",unit:patternUnit,given:patternContinuation(patternUnit,0,patternUnit.length*2),slots:patternUnit.length,answer:patternAnswer(nextPattern),hint:range===20?"Busca el grupo que se repite: círculo, triángulo, triángulo, cuadrado.":"Busca el grupo que se repite: círculo, triángulo, triángulo.",explanation:"Las figuras siguen la misma regla. Podemos repetir ese grupo una y otra vez.",audioKey:"math-pattern-build"},
    {type:"choice",question:"¿Cuántas unidades mide la cinta?",measure:range===20?7:5,answer:range===20?"7":"5",options:range===20?["6","8","7"]:["4","5","6"],hint:"Cuenta los cuadrados iguales desde el principio hasta el final, sin huecos.",explanation:"Medir es comparar con una unidad. Aquí cada cuadrado representa la misma longitud."},
    {type:"choice",question:"¿Qué fruta tiene más votos?",chart:[{label:"Manzana",icon:"🍎",value:3},{label:"Pera",icon:"🍐",value:5},{label:"Plátano",icon:"🍌",value:2}],options:["Manzana","Plátano","Pera"],answer:"Pera",hint:"Cada punto es un voto. Busca la fila con más puntos.",explanation:"La pera tiene cinco votos, más que la manzana y el plátano. Cada punto representa un voto."},
    {type:"shape",question:"Toca el triángulo, aunque esté girado.",options:["Cuadrado","Triángulo","Círculo"],answer:"Triángulo",hint:"Busca tres lados rectos y tres vértices.",explanation:"Girar un triángulo no cambia sus tres lados ni sus tres vértices."},
  ][session];
  const minus=session%2===1, start=6+extra,change=2+session%3,result=minus?start-change:start+change;
  const context={type:"line",question:minus?`Hay ${start} niños jugando. Se van ${change}. ¿Cuántos quedan?`:`Hay ${start} niños jugando. Llegan ${change}. ¿Cuántos hay ahora?`,start,min:extra,max:10+extra,answer:String(result),hint:minus?"Cuando se van, la cantidad baja. Retrocede un salto por cada niño que se va.":"Cuando llegan, la cantidad aumenta. Avanza un salto por cada niño que llega.",explanation:minus?`${start} menos ${change} son ${result}. Puedes comprobarlo con objetos o saltando hacia atrás.`:`${start} más ${change} son ${result}. Puedes comprobarlo con objetos o saltando hacia delante.`,audioKey:"math-line"};
  return [warm,central,context].map((a,i)=>({...a,id:workshopId(range,session,i),phase:["1 · Pienso","2 · Pruebo","3 · Resuelvo"][i],audioKey:a.audioKey||"primary-math"}));
}
