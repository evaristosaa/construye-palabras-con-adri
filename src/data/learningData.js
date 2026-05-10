const lessonCatalog = [
  {
    id: "vocales",
    title: "Vocales",
    badge: "AEI",
    color: "green",
    focus: "vocales",
    syllables: ["a", "e", "i", "o", "u"],
    words: [
      { text: "ala", drawing: "wing" },
      { text: "oso", drawing: "bear" },
      { text: "uva", drawing: "grape" },
    ],
    phrases: ["Ana oye.", "El oso va."],
  },
  {
    id: "letra-m",
    title: "Letra M",
    badge: "M",
    color: "yellow",
    focus: "m",
    syllables: ["ma", "me", "mi", "mo", "mu"],
    words: [
      { text: "mamá", drawing: "heart" },
      { text: "mesa", drawing: "table" },
      { text: "mono", drawing: "monkey" },
    ],
    phrases: ["Mamá mima.", "Mi mono mira."],
  },
  {
    id: "letra-p",
    title: "Letra P",
    badge: "P",
    color: "blue",
    focus: "p",
    syllables: ["pa", "pe", "pi", "po", "pu"],
    words: [
      { text: "pato", drawing: "duck" },
      { text: "pipa", drawing: "pipe" },
      { text: "papá", drawing: "heart" },
    ],
    phrases: ["Papá pisa.", "El pato pasa."],
  },
  {
    id: "letra-l",
    title: "Letra L",
    badge: "L",
    color: "green",
    focus: "l",
    syllables: ["la", "le", "li", "lo", "lu"],
    words: [
      { text: "luna", drawing: "moon" },
      { text: "lupa", drawing: "lens" },
      { text: "lila", drawing: "flower" },
    ],
    phrases: ["Lola lee.", "La luna sale."],
  },
  {
    id: "letra-s",
    title: "Letra S",
    badge: "S",
    color: "purple",
    focus: "s",
    syllables: ["sa", "se", "si", "so", "su"],
    words: [
      { text: "sapo", drawing: "frog" },
      { text: "sopa", drawing: "bowl" },
      { text: "sol", drawing: "sun" },
    ],
    phrases: ["Susi suma.", "Sale el sol."],
  },
  {
    id: "letra-t",
    title: "Letra T",
    badge: "T",
    color: "red",
    focus: "t",
    syllables: ["ta", "te", "ti", "to", "tu"],
    words: [
      { text: "taza", drawing: "cup" },
      { text: "tela", drawing: "cloth" },
      { text: "toro", drawing: "bull" },
    ],
    phrases: ["Tito toma té.", "Tu taza está."],
  },
  {
    id: "letra-b",
    title: "Letra B",
    badge: "B",
    color: "orange",
    focus: "b",
    syllables: ["ba", "be", "bi", "bo", "bu"],
    words: [
      { text: "bebé", drawing: "baby" },
      { text: "bola", drawing: "ball" },
      { text: "boca", drawing: "mouth" },
      { text: "bota", drawing: "boot" },
      { text: "burro", drawing: "donkey" },
    ],
    phrases: ["La bola bota.", "Bebé bebe."],
  },
  {
    id: "letra-n",
    title: "Letra N",
    badge: "N",
    color: "blue",
    focus: "n",
    syllables: ["na", "ne", "ni", "no", "nu"],
    words: [
      { text: "nube", drawing: "cloud" },
      { text: "nido", drawing: "nest" },
      { text: "nena", drawing: "baby" },
    ],
    phrases: ["Nina nada.", "La nube sube."],
  },
  {
    id: "letra-d",
    title: "Letra D",
    badge: "D",
    color: "purple",
    focus: "d",
    syllables: ["da", "de", "di", "do", "du"],
    words: [
      { text: "dado", drawing: "dice" },
      { text: "dedo", drawing: "finger" },
      { text: "duna", drawing: "hill" },
    ],
    phrases: ["Dani da dados.", "El dado duda."],
  },
  {
    id: "letra-r",
    title: "Letra R",
    badge: "R",
    color: "red",
    focus: "r",
    syllables: ["ra", "re", "ri", "ro", "ru"],
    words: [
      { text: "rana", drawing: "frog" },
      { text: "rosa", drawing: "flower" },
      { text: "risa", drawing: "smile" },
    ],
    phrases: ["Rita ríe.", "La rana salta."],
  },
];

const colors = ["red", "yellow", "blue", "green", "purple"];

function similarLetters(letter) {
  const pool = ["B", "D", "P", "M", "L", "S", "T", "N", "R", "A", "E", "I", "O", "U"];
  return [letter.toUpperCase(), ...pool.filter((item) => item !== letter.toUpperCase()).slice(0, 3)].sort();
}

function buildGames(lesson) {
  const letter = lesson.focus === "vocales" ? "A" : lesson.focus.toUpperCase();
  const firstSyllable = lesson.syllables[0].toUpperCase();
  const secondSyllable = lesson.syllables[1]?.toUpperCase() || firstSyllable;
  const firstWord = lesson.words[0];
  const secondWord = lesson.words[1] || lesson.words[0];
  const phrase = lesson.phrases[0];
  const wordBlocks = firstWord.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split("");

  return [
    {
      id: `${lesson.id}-letter`,
      title: "Toca la letra",
      prompt: lesson.focus === "vocales" ? "¿Dónde está la vocal A?" : `¿Dónde está la letra ${letter}?`,
      type: "choice",
      speak: lesson.focus === "vocales" ? "Busca la vocal A" : `Busca la letra ${letter}`,
      options: similarLetters(letter),
      answer: letter,
      character: "pointing",
    },
    {
      id: `${lesson.id}-sound`,
      title: "Escucha y elige",
      prompt: "Escucha a Adri y toca el bloque",
      type: "choice",
      speak: lesson.syllables[0],
      options: lesson.syllables.slice(0, 4).map((item) => item.toUpperCase()),
      answer: firstSyllable,
      character: "audio",
    },
    {
      id: `${lesson.id}-syllable`,
      title: "Construye sílabas",
      prompt: `${letter} + A = ?`,
      type: "choice",
      speak: `Construye ${lesson.syllables[0]}`,
      options: [firstSyllable, secondSyllable, lesson.syllables[2]?.toUpperCase() || "LA"],
      answer: firstSyllable,
      character: "helmet",
    },
    {
      id: `${lesson.id}-picture`,
      title: "Palabra y dibujo",
      prompt: `¿Cómo se llama este dibujo?`,
      type: "choice",
      speak: secondWord.text,
      options: lesson.words.slice(0, 3).map((item) => item.text),
      answer: secondWord.text,
      drawing: secondWord.drawing,
      character: "detective",
    },
    {
      id: `${lesson.id}-word`,
      title: "Ordena la palabra",
      prompt: `Forma ${firstWord.text}`,
      type: "build",
      speak: firstWord.text,
      blocks: wordBlocks.sort(() => 0.5 - Math.random()),
      answer: wordBlocks.join(""),
      drawing: firstWord.drawing,
      character: "builder",
    },
    {
      id: `${lesson.id}-phrase`,
      title: "Lee con Adri",
      prompt: phrase,
      type: "phrase",
      speak: phrase,
      answer: "leida",
      phrase,
      character: "reader",
    },
    {
      id: `${lesson.id}-test`,
      title: "Mini reto",
      prompt: "Elige la palabra correcta",
      type: "choice",
      speak: firstWord.text,
      options: [firstWord.text, `${firstWord.text}a`, secondWord.text],
      answer: firstWord.text,
      character: "teacher",
    },
  ];
}

export const modules = lessonCatalog.map((lesson, index) => ({
  id: lesson.id,
  title: lesson.title,
  badge: lesson.badge,
  color: lesson.color,
  unlocked: true,
  unlockedAfter: undefined,
  lessons: lesson.syllables,
}));

export const levelsById = Object.fromEntries(
  lessonCatalog.map((lesson) => [
    lesson.id,
    {
      ...lesson,
      subtitle:
        lesson.focus === "vocales"
          ? "Primero escuchamos y tocamos vocales"
          : `Leemos ${lesson.syllables.join(", ")}`,
      games: buildGames(lesson),
    },
  ])
);

export const rewards = [
  { id: "house", title: "Casa de lectura", pieces: 20 },
  { id: "car", title: "Coche de sílabas", pieces: 40 },
  { id: "tower", title: "Torre de palabras", pieces: 60 },
  { id: "school", title: "Escuela de Adri", pieces: 90 },
];

export const characters = [
  { id: "classic", title: "Adri lector", unlock: 0, variant: "reader" },
  { id: "builder", title: "Adri construyendo", unlock: 10, variant: "builder" },
  { id: "helmet", title: "Adri con casco", unlock: 18, variant: "helmet" },
  { id: "pointer", title: "Adri señala letras", unlock: 24, variant: "pointing" },
  { id: "detective", title: "Adri con lupa", unlock: 32, variant: "detective" },
  { id: "audio", title: "Adri escucha", unlock: 42, variant: "audio" },
  { id: "celebrating", title: "Adri celebrando", unlock: 54, variant: "celebrating" },
  { id: "reward", title: "Adri desbloquea premios", unlock: 66, variant: "reward" },
  { id: "teacher", title: "Maestro constructor", unlock: 80, variant: "teacher" },
];

export const positiveMessages = [
  "¡Genial Adri!",
  "¡Has colocado una pieza!",
  "¡Construcción completada!",
  "¡Nivel superado!",
  "¡Sigue así!",
];

export { colors };
