// Only illustrate a set when every alternative has a neutral, literal picture.
// A lone picture beside the right answer would accidentally reveal it.
const pictures={
  'oído':'👂','vista':'👁️','gusto':'👅','olfato':'👃','tacto':'🖐️',
  'gorrión':'🐦','gato':'🐱','rana':'🐸','perro':'🐶','mariposa':'🦋','sardina':'🐟','pez':'🐟','hormiga':'🐜','ratón':'🐭','tortuga':'🐢','caracol':'🐌',
  'pelota':'⚽','sol':'☀️','silla':'🪑','mochila':'🎒','cuento':'📖','manzana':'🍎','pera':'🍐','naranja':'🍊','tomates':'🍅','zapatos':'👟','balón':'⚽','niña':'👧',
  'roja':'🔴','rojo':'🔴','azul':'🔵','verde':'🟢','amarilla':'🟡','blanca':'⚪',
  'agua':'💧','bebida energética':'🥤','refresco azucarado':'🥤','termómetro':'🌡️','regla':'📏','brújula':'🧭',
  'lámpara':'💡','estrella':'⭐','linterna':'🔦','bombilla':'💡',
  'ladrillo':'🧱','piedra':'🪨','papel':'📄','madera':'🪵','cartón':'📦','vidrio transparente':'🪟',
};
export function choicePictures(activity){
  if(activity.type!=="choice"||!activity.options?.length)return null;
  const icons=activity.options.map(option=>pictures[option.toLocaleLowerCase('es').replace(/^(un|una|el|la)\s+/,'')]);
  return icons.every(Boolean)?icons:null;
}
