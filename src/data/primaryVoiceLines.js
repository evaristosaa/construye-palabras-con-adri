export const primaryVoiceTexts = Object.freeze({
  "home-welcome": "¡Vamos a jugar! Soy Adri. Con Juan y Cayetana descubriremos palabras, números y un montón de sorpresas. ¿Te apuntas?",
  "primary-intro": "En primero aprendemos con palabras, números y descubrimientos. Elige una materia y una misión. Vamos paso a paso.",
  "primary-choice": "Lee la pregunta con calma y elige una respuesta. Si te equivocas, mira la pista y vuelve a intentarlo.",
  "primary-reading": "Lee el texto despacio. Después responde a la pregunta. Puedes volver a leerlo tantas veces como quieras.",
  "primary-order": "Toca las piezas en orden para construir la respuesta. Si quieres cambiar algo, toca deshacer.",
  "primary-write": "Escribe tu respuesta y toca comprobar. Revisa las letras antes de terminar.",
  "primary-math": "Lee y resuelve el reto. Puedes contar con los dedos, usar objetos o hacer un dibujo. Después elige tu respuesta.",
  "primary-complete": "¡Misión terminada! Has aprendido algo nuevo. Descansa un poquito o elige otra misión para seguir descubriendo.",
  "primary-quantity": "Pon o quita fichas para resolver el reto. Después comprueba.",
  "primary-place": "Construye el número con decenas y unidades. Después comprueba.",
  "primary-syllables": "Di la palabra despacio. Toca una palmada por cada sílaba.",
  "primary-story": "Elige quién aparece, dónde está y qué sucede. Inventa tu cuento.",
});

export const primaryVoiceLines = Object.entries(primaryVoiceTexts).map(([key, text]) => ({ key, filename: `${key}.mp3`, text }));

export function primaryAudioKey(activity, subject) {
  if (activity.type === "quantity") return "primary-quantity";
  if (activity.type === "place-value") return "primary-place";
  if (activity.type === "syllables") return "primary-syllables";
  if (activity.type === "order") return "primary-order";
  if (activity.type === "write") return "primary-write";
  if (activity.passage) return "primary-reading";
  return subject === "matematicas" ? "primary-math" : "primary-choice";
}
