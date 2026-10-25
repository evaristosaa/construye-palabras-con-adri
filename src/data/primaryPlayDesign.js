import {classmates} from "./classmates.js";
// Interaction changes preserve activity IDs, learning goals and existing rewards.
export function makePlayActivity(activity, topic, index, alternate = false) {
  if (topic === "cuerpo" && index === 2) {
    const {options,...content}=activity;
    const items=alternate
      ? [{label:"Duro",icon:"🪨",category:0},{label:"Azul",icon:"🔵",category:1},{label:"Áspero",icon:"🧽",category:0}]
      : [{label:"Suave",icon:"🧸",category:0},{label:"Rugoso",icon:"🪵",category:0},{label:"Rojo",icon:"🔴",category:1}];
    return {...content,type:"sort",question:"¿Con qué sentido lo notas?",categories:["Tacto","Vista"],items,answer:items.map(i=>i.category).join('|'),hint:"Con la piel notas la textura y la dureza. Con los ojos ves los colores.",explanation:"El tacto permite notar texturas y dureza; la vista permite distinguir colores."};
  }
  if (topic === "plantas" && index === 4) {
    const {options,...content}=activity;
    const pieces=alternate?["📏 Mido hoy","📏 Mido mañana","🔎 Comparo"]:["👀 Observo","✏️ Anoto","🔎 Comparo"];
    return {...content,type:"order",question:alternate?"Ordena cómo comprobarías si crece.":"Ordena los pasos para investigar.",pieces,answer:pieces.join(' '),hint:alternate?"Primero medimos hoy. Repetimos mañana y comparamos las medidas.":"Primero observa la planta. Anota lo que ves y compara con otro día.",explanation:"Observar y registrar la misma planta en distintos momentos permite comparar sus cambios."};
  }
  if (["sumas","restas","calculo"].includes(topic)) {
    const target=Number(activity.answer);
    const numbers=activity.question.match(/\d+/g)?.map(Number) || [];
    const initial=activity.question.includes("__") ? 0 : numbers[0] || 0;
    const {options,visual,...content}=activity;
    return {...content,type:"quantity",initial,capacity:Math.max(initial,target)>10?20:10};
  }
  if (topic === "decenas" && index < 3) {
    const digits=activity.answer.match(/\d+/g).map(Number);
    const target=index===2 ? digits[0]*10+digits[1] : digits[0];
    const {options,...content}=activity;
    return {...content,type:"place-value",answer:String(target),question:index===2 ? `Construye el número ${target}.` : activity.question};
  }
  if (topic === "palabras" && [0,1,5].includes(index)) {
    const words=alternate ? {0:["so","pa"],1:["to","ma","te"],5:["za","pa","to"]} : {0:["ca","sa"],1:["pe","lo","ta"],5:["ca","mi","sa"]};
    const {options,...content}=activity;
    const syllables=words[index];
    return {...content,type:"syllables",question:"Da una palmada por cada sílaba.",word:syllables.join(""),wordAudioKey:`word-${syllables.join("")}`,syllables,answer:String(syllables.length),hint:`Dilo despacio: ${syllables.join(" / ")}.`};
  }
  return activity;
}
export const beyondScreen = {
 palabras:"Busca un objeto de casa y separa su nombre con palmadas.",frases:"Inventa una frase sobre lo que está haciendo alguien a tu lado.",comprendo:"Cuenta con tus palabras algo que acabes de leer.",puntuacion:"Escribe tu nombre y rodea la mayúscula inicial.",describo:"Elige un objeto y descríbelo sin decir su nombre. ¿Lo adivinan?",grupos:"Busca tres palabras que empiecen por dos consonantes juntas.",cuentos:"Inventa otro final y cuéntaselo a alguien.",cotidianos:"Dibuja o escribe una lista para una excursión.",
 numeros:"Cuenta diez objetos pequeños y sepáralos en dos grupos.",sumas:"Junta dos grupos de juguetes y explica cuántos hay.",restas:"Aparta algunos objetos de un grupo y cuenta los que quedan.",decenas:"Reúne diez objetos para formar una decena y deja algunas unidades sueltas.",calculo:"Busca dos grupos de objetos que juntos formen diez.",problemas:"Inventa un problema con tus juguetes y resuélvelo con alguien.",formas:"Busca un círculo, un triángulo y un cuadrado a tu alrededor.",vida:"Dibuja dos monedas y juega a comprar algo con ellas.",
 cuerpo:"Con los ojos cerrados, toca una tela conocida y describe su textura.",habitos:"Cuenta qué haces para cuidarte antes de dormir.",convivo:"Propón a alguien un juego en el que podáis turnaros.",animales:"Observa un animal sin molestarlo y cuenta qué necesita.",plantas:"Dibuja una planta hoy y compárala dentro de unos días.",materiales:"Busca un material flexible y otro rígido entre objetos seguros.",entorno:"Piensa en una pequeña acción para cuidar un espacio compartido.",tiempo:"Mira el cielo y dibuja qué tiempo hace hoy.",
};
export const storyCharacters = classmates;
export const wordVoiceLines=["casa","sopa","pelota","tomate","camisa","zapato"].map(word=>({key:`word-${word}`,filename:`word-${word}.wav`,text:word}));
export const storyPlaces = [{name:"el parque",icon:"🌳"},{name:"el jardín",icon:"🌻"},{name:"la biblioteca",icon:"📚"}];
export const storyEvents = [{name:"encontró una semilla",icon:"🌱"},{name:"ayudó a un amigo",icon:"🤝"},{name:"descubrió una pista",icon:"🔎"}];
export function composeStory(character,place,event) {
  if(!storyCharacters.includes(character)||!storyPlaces.includes(place)||!storyEvents.includes(event)) return "";
  return `Un día, ${character.name} visitó ${place.name}. Allí ${event.name}.`;
}
