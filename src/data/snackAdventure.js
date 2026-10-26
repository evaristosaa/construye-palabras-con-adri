export const snackId = "merienda-v1";
export const snackStages = ["cuento-1", "cuento-2", "cuento-3", "cesta", "reparto", "cuidado", "final"];
export const snackStepIds = ["cesta", "reparto", "cuidado"];
export const snackItems = [
  { id: "apple", label: "Manzana" },
  { id: "water", label: "Agua" },
  { id: "banana", label: "Plátano" },
];
export const snackStory = [
  { title: "Una merienda en el parque", text: "Adri, Juan y Cayetana preparan una merienda en el parque.", audioKey: "snack-story-1", scene: "friends" },
  { title: "La nota de la merienda", text: "La nota dice: dos manzanas y una botella de agua.", audioKey: "snack-story-2", scene: "note" },
  { title: "¡Vamos a compartir!", text: "Los tres amigos quieren compartir. ¿Les ayudas a preparar la merienda?", audioKey: "snack-story-3", scene: "picnic" },
];
export const snackCare = [
  { id: "wash", label: "Lavar las manos" },
  { id: "table", label: "Preparar la mesa" },
  { id: "eat", label: "Compartir la merienda" },
];
export const snackInstructions = {
  cesta: "Lee la nota. Toca los alimentos para llenar la cesta. Puedes tocar lo que sobra para quitarlo.",
  reparto: "Reparte los seis trozos de manzana entre Adri, Juan y Cayetana. Todos deben tener la misma cantidad.",
  cuidado: "Ordena los dibujos para preparar la merienda. Primero nos lavamos las manos.",
  final: "¡La merienda está lista! Habéis leído, repartido y cuidado de los amigos. ¡Buen trabajo!",
};
export const snackVoiceLines = [
  ...snackStory.map(({ audioKey, text }) => ({ key: audioKey, text, filename: `${audioKey}.wav` })),
  ...Object.entries(snackInstructions).map(([stage, text]) => ({ key: `snack-${stage}`, text, filename: `snack-${stage}.wav` })),
];
export function snackRewardId(step) { return `aventura-${snackId}-${step}`; }
export function blankSnackSession() {
  return { version: 1, stage: 0, basket: [], plates: [0, 0, 0], order: [], solved: [], help: {}, listened: false };
}
export function checkSnackStep(step, session) {
  if (step === "cesta") return session.basket.length === 3 && session.basket.filter(x => x === "apple").length === 2 && session.basket.filter(x => x === "water").length === 1;
  if (step === "reparto") return session.plates.length === 3 && session.plates.every(n => n === 2);
  if (step === "cuidado") return session.order.join(",") === snackCare.map(x => x.id).join(",");
  return false;
}
export function cleanSnackSession(raw) {
  const initial = blankSnackSession();
  if (!raw || raw.version !== 1) return initial;
  const basket = Array.isArray(raw.basket) ? raw.basket.filter(x => snackItems.some(i => i.id === x)).slice(0, 6) : [];
  const plates = Array.isArray(raw.plates) && raw.plates.length === 3 && raw.plates.every(n => Number.isInteger(n) && n >= 0 && n <= 6) && raw.plates.reduce((a,b)=>a+b,0) <= 6 ? [...raw.plates] : [0,0,0];
  const order = Array.isArray(raw.order) ? [...new Set(raw.order.filter(x => snackCare.some(i => i.id === x)))] : [];
  const session = { ...initial, basket, plates, order, listened: raw.listened === true };
  session.help = Object.fromEntries(snackStepIds.map(id => [id, Number.isInteger(raw.help?.[id]) ? Math.max(0,Math.min(3,raw.help[id])) : 0]));
  session.solved = snackStepIds.filter(id => Array.isArray(raw.solved) && raw.solved.includes(id) && checkSnackStep(id, session));
  const requested = Number.isInteger(raw.stage) && raw.stage >= 0 && raw.stage <= 6 ? raw.stage : 0;
  const firstUnsolved = snackStepIds.findIndex(id => !session.solved.includes(id));
  session.stage = firstUnsolved < 0 ? requested : Math.min(requested, firstUnsolved + 3);
  return session;
}
export function changeSnackPlate(plates, index, delta) {
  if (!Number.isInteger(index) || index < 0 || index > 2 || ![-1,1].includes(delta)) return plates;
  if (delta < 0 && plates[index] === 0 || delta > 0 && plates.reduce((a,b)=>a+b,0) === 6) return plates;
  return plates.map((n,i) => i === index ? n + delta : n);
}
export function snackHint(step, level, session) {
  const hints = {
    cesta: ["Vuelve a mirar la nota: dice qué llevar y cuánto.", "Cuenta las manzanas y busca el agua. Toca lo que sobra para quitarlo.", "Por ejemplo, si una nota pidiera un plátano, pondríamos un plátano. Ahora mira nuestra nota."],
    reparto: ["Mira los tres platos: todos deben tener lo mismo.", "Prueba a dar un trozo a cada amigo y luego otra vuelta.", "Si hubiera tres trozos, tocaría uno a cada amigo. Aquí tenemos seis."],
    cuidado: ["Piensa qué hacemos antes de tocar la comida.", "Primero nos lavamos las manos. La merienda va al final.", "Toca un dibujo de tu fila para cambiarlo. Primero manos limpias, después mesa y al final compartir."],
  };
  if (step === "reparto" && session.plates.reduce((a,b)=>a+b,0) < 6 && level === 1) return "Todavía quedan trozos en la cesta. Repártelos y compara los platos.";
  return hints[step]?.[Math.min(2, Math.max(0, level-1))] || "Mira con calma y vuelve a probar.";
}
