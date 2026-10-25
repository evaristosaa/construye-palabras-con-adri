const tasks={
  palabras:"Separa palabras para llenar la biblioteca del zorro.",frases:"Ordena los mensajes de la biblioteca del zorro.",comprendo:"Lee las pistas que ha encontrado el zorro.",puntuacion:"Ayuda al zorro a preparar sus carteles.",describo:"Descubre cómo son los tesoros de la biblioteca.",grupos:"Resuelve las palabras escondidas del zorro.",cuentos:"Ordena las historias de la biblioteca.",cotidianos:"Prepara las notas y listas de la biblioteca.",
  numeros:"Cuenta las piezas del puente del robot.",sumas:"Junta piezas para construir el puente del robot.",restas:"Calcula las piezas que quedan para el puente.",decenas:"Agrupa las piezas del robot en decenas y unidades.",calculo:"Resuelve los cálculos para completar el puente.",problemas:"Ayuda al robot con los problemas de su puente.",formas:"Reconoce las formas que usa el robot.",vida:"Descubre medidas y cantidades con el robot.",
  cuerpo:"Explora el jardín con los sentidos de la rana.",habitos:"Ayuda a la rana a cuidar su cuerpo y su jardín.",convivo:"Prepara con la rana un jardín para compartir.",animales:"Descubre los animales que visitan el jardín.",plantas:"Ayuda a la rana a cuidar las plantas.",materiales:"Explora los materiales del jardín de la rana.",entorno:"Ayuda a la rana a cuidar su entorno.",tiempo:"Observa cómo cambia el jardín con el tiempo.",
};
export const constructionProjects={
  lengua:{subject:"lengua",title:"La biblioteca del zorro",icon:"🦊",task:"Ayuda al zorro a construir su biblioteca.",parts:["Suelo","Paredes","Tejado","Puerta","Ventana","Libros"],voice:"Ayuda al zorro a construir su biblioteca. Cada reto añade una parte."},
  matematicas:{subject:"matematicas",title:"El puente del robot",icon:"🤖",task:"Ayuda al robot a construir su puente.",parts:["Orillas","Pilares","Arco","Camino","Barandilla","Bandera"],voice:"Ayuda al robot a construir su puente. Cada reto añade una parte."},
  medio:{subject:"medio",title:"El jardín de la rana",icon:"🐸",task:"Ayuda a la rana a crear su jardín.",parts:["Tierra","Brote","Flores","Agua","Mariposa","Árbol"],voice:"Ayuda a la rana a crear su jardín. Cada reto añade una parte."},
};
export const constructionVoices=Object.values(constructionProjects).map(p=>({key:`quest-${p.subject}`,filename:`quest-${p.subject}.wav`,text:p.voice}));
export function constructionFor(subject,topic){
  const project=constructionProjects[subject]||constructionProjects.lengua;
  return {...project,task:tasks[topic]||project.task,audioKey:`quest-${project.subject}`};
}
export function constructionState(count,total){
  const safeTotal=Number.isInteger(total)&&total>0?total:1;
  const completed=Math.max(0,Math.min(safeTotal,Number.isFinite(count)?Math.floor(count):0));
  return {completed,total:safeTotal,visibleParts:Math.floor(completed/safeTotal*6),complete:completed===safeTotal};
}
export function initialConstructionWins(activities,completedGames=[],short=false){
  if(short)return [];
  const saved=new Set(completedGames);
  const wins=[...new Set(activities.filter(a=>saved.has(a.id)).map(a=>a.id))];
  // A replay builds a fresh toy; permanent achievements remain in progress.
  return wins.length===activities.length?[]:wins;
}
export function addConstructionWin(wins,id){return wins.includes(id)?wins:[...wins,id];}
