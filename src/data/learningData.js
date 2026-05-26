const lessonCatalog = [
  {
    id: "vocales",
    title: "Vocales",
    badge: "AEI",
    color: "green",
    focus: "vocales",
    intro: "Escuchamos las vocales y las encontramos dentro de palabras cortas.",
    syllables: ["a", "e", "i", "o", "u"],
    words: [
      { text: "ala", drawing: "wing", clue: "Tiene plumas" },
      { text: "oso", drawing: "bear", clue: "Animal grande" },
      { text: "uva", drawing: "grape", clue: "Fruta morada" },
      { text: "ola", drawing: "wave", clue: "Está en el mar" },
    ],
    sentences: [
      { text: "El oso mira.", drawing: "bear" },
      { text: "La uva es morada.", drawing: "grape" },
    ],
  },
  {
    id: "letra-m",
    title: "Letra M",
    badge: "M",
    color: "yellow",
    focus: "m",
    intro: "La M suena como mmm. Vamos a leer ma, me, mi, mo y mu.",
    syllables: ["ma", "me", "mi", "mo", "mu"],
    words: [
      { text: "mamá", drawing: "mom", clue: "Nos cuida" },
      { text: "mesa", drawing: "table", clue: "Sirve para comer" },
      { text: "mono", drawing: "monkey", clue: "Animal que trepa" },
      { text: "maleta", drawing: "bag", clue: "Para viajar" },
      { text: "moto", drawing: "motorbike", clue: "Tiene dos ruedas" },
    ],
    sentences: [
      { text: "La mesa es mía.", drawing: "table" },
      { text: "El mono mira.", drawing: "monkey" },
    ],
  },
  {
    id: "letra-p",
    title: "Letra P",
    badge: "P",
    color: "blue",
    focus: "p",
    intro: "Con la P leemos pa, pe, pi, po y pu. Escucha el primer sonido.",
    syllables: ["pa", "pe", "pi", "po", "pu"],
    words: [
      { text: "pato", drawing: "duck", clue: "Nada en el agua" },
      { text: "pipa", drawing: "pipe", clue: "Empieza por pi" },
      { text: "papá", drawing: "dad", clue: "Persona de la familia" },
      { text: "piano", drawing: "piano", clue: "Instrumento musical" },
      { text: "piña", drawing: "pineapple", clue: "Fruta tropical" },
    ],
    sentences: [
      { text: "El piano suena.", drawing: "piano" },
      { text: "El pato pasea.", drawing: "duck" },
    ],
  },
  {
    id: "letra-l",
    title: "Letra L",
    badge: "L",
    color: "green",
    focus: "l",
    intro: "La L se lee la, le, li, lo y lu. Vamos a mirar bien las palabras.",
    syllables: ["la", "le", "li", "lo", "lu"],
    words: [
      { text: "luna", drawing: "moon", clue: "Sale de noche" },
      { text: "lupa", drawing: "lens", clue: "Sirve para mirar" },
      { text: "lila", drawing: "flower", clue: "Color y flor" },
      { text: "limón", drawing: "lemon", clue: "Fruta amarilla" },
      { text: "lana", drawing: "wool", clue: "Es suave" },
    ],
    sentences: [
      { text: "La luna sale.", drawing: "moon" },
      { text: "Lola usa la lupa.", drawing: "lens" },
    ],
  },
  {
    id: "letra-s",
    title: "Letra S",
    badge: "S",
    color: "purple",
    focus: "s",
    intro: "La S suena como sss. Leemos sa, se, si, so y su.",
    syllables: ["sa", "se", "si", "so", "su"],
    words: [
      { text: "sapo", drawing: "frog", clue: "Salta en la charca" },
      { text: "sopa", drawing: "bowl", clue: "Se come con cuchara" },
      { text: "sol", drawing: "sun", clue: "Brilla de día" },
      { text: "silla", drawing: "chair", clue: "Sirve para sentarse" },
      { text: "sandía", drawing: "watermelon", clue: "Fruta grande" },
    ],
    sentences: [
      { text: "Sale el sol.", drawing: "sun" },
      { text: "La sopa está sola.", drawing: "bowl" },
    ],
  },
  {
    id: "letra-t",
    title: "Letra T",
    badge: "T",
    color: "red",
    focus: "t",
    intro: "La T toca fuerte: ta, te, ti, to y tu.",
    syllables: ["ta", "te", "ti", "to", "tu"],
    words: [
      { text: "taza", drawing: "cup", clue: "Sirve para beber" },
      { text: "tela", drawing: "cloth", clue: "Es de ropa" },
      { text: "toro", drawing: "bull", clue: "Animal fuerte" },
      { text: "tomate", drawing: "tomato", clue: "Rojo y redondo" },
      { text: "tijera", drawing: "scissors", clue: "Sirve para cortar" },
    ],
    sentences: [
      { text: "Tito toma té.", drawing: "cup" },
      { text: "El tomate está rojo.", drawing: "tomato" },
    ],
  },
  {
    id: "letra-b",
    title: "Letra B",
    badge: "B",
    color: "orange",
    focus: "b",
    intro: "La B construye ba, be, bi, bo y bu.",
    syllables: ["ba", "be", "bi", "bo", "bu"],
    words: [
      { text: "bebé", drawing: "baby", clue: "Es pequeño" },
      { text: "bola", drawing: "ball", clue: "Rueda y bota" },
      { text: "boca", drawing: "mouth", clue: "Sirve para hablar" },
      { text: "bota", drawing: "boot", clue: "Se pone en el pie" },
      { text: "burro", drawing: "donkey", clue: "Animal con orejas largas" },
    ],
    sentences: [
      { text: "La bola bota.", drawing: "ball" },
      { text: "Bebé bebe.", drawing: "baby" },
    ],
  },
  {
    id: "letra-n",
    title: "Letra N y Ñ",
    badge: "NÑ",
    color: "blue",
    focus: "n",
    extraFocus: "ñ",
    intro: "La N y la Ñ se parecen, pero suenan distinto: na y ña.",
    syllables: ["na", "ne", "ni", "no", "nu", "ña", "ñe", "ñi", "ño", "ñu"],
    words: [
      { text: "nube", drawing: "cloud", clue: "Está en el cielo" },
      { text: "nido", drawing: "nest", clue: "Casa de pájaro" },
      { text: "niña", drawing: "girl", clue: "Persona pequeña" },
      { text: "piña", drawing: "pineapple", clue: "Fruta con hojas" },
      { text: "pañuelo", drawing: "cloth", clue: "Tela pequeña" },
    ],
    sentences: [
      { text: "La niña mira la piña.", drawing: "pineapple" },
      { text: "La nube sube.", drawing: "cloud" },
    ],
  },
  {
    id: "letra-d",
    title: "Letra D",
    badge: "D",
    color: "purple",
    focus: "d",
    intro: "La D guarda da, de, di, do y du.",
    syllables: ["da", "de", "di", "do", "du"],
    words: [
      { text: "dado", drawing: "dice", clue: "Tiene puntos" },
      { text: "dedo", drawing: "finger", clue: "Está en la mano" },
      { text: "duende", drawing: "wizard", clue: "Personaje pequeño" },
      { text: "dominó", drawing: "domino", clue: "Juego de fichas" },
      { text: "diana", drawing: "target", clue: "Se apunta al centro" },
    ],
    sentences: [
      { text: "Dani da dados.", drawing: "dice" },
      { text: "El duende pide dominó.", drawing: "domino" },
    ],
  },
  {
    id: "letra-j",
    title: "Letra J",
    badge: "J",
    color: "green",
    focus: "j",
    intro: "La J es jardinera. Riega ja, je, ji, jo y ju.",
    syllables: ["ja", "je", "ji", "jo", "ju"],
    words: [
      { text: "Julia", drawing: "girl", clue: "Nombre de persona" },
      { text: "jarra", drawing: "jug", clue: "Tiene agua" },
      { text: "jeringa", drawing: "syringe", clue: "La usa la doctora" },
      { text: "jardín", drawing: "flower", clue: "Tiene flores" },
      { text: "jirafa", drawing: "giraffe", clue: "Cuello largo" },
    ],
    sentences: [
      { text: "Julia juega.", drawing: "girl" },
      { text: "El jardinero riega.", drawing: "jug" },
    ],
  },
  {
    id: "letra-r",
    title: "Letra R",
    badge: "R",
    color: "red",
    focus: "r",
    intro: "La R ruge fuerte al principio y suena suave dentro de palabras.",
    syllables: ["ra", "re", "ri", "ro", "ru"],
    words: [
      { text: "rana", drawing: "frog", clue: "Salta y croa" },
      { text: "rosa", drawing: "flower", clue: "Flor con olor" },
      { text: "risa", drawing: "smile", clue: "Sale cuando algo divierte" },
      { text: "rueda", drawing: "wheel", clue: "Gira" },
      { text: "ratón", drawing: "mouse", clue: "Animal pequeño" },
    ],
    sentences: [
      { text: "Rita ríe.", drawing: "smile" },
      { text: "La rana salta.", drawing: "frog" },
    ],
  },
];

const colors = ["red", "yellow", "blue", "green", "purple", "orange"];

function cleanWord(word) {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function seededShuffle(items, seed) {
  const copy = [...items];
  let value = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = value % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function ensureNotFirst(options, answer, seed) {
  const shuffled = seededShuffle(options, seed);
  if (shuffled[0] === answer && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function unique(items) {
  return items.filter((item, index, array) => array.indexOf(item) === index);
}

function letterOptions(letter, extraLetter, seed) {
  if (letter === "vocales") return ensureNotFirst(["A", "E", "I", "O", "U"], "A", seed);
  const pool = ["B", "D", "P", "M", "L", "S", "T", "N", "Ñ", "J", "R", "A", "E"];
  const correct = letter.toUpperCase();
  const extra = extraLetter ? extraLetter.toUpperCase() : undefined;
  const distractors = pool.filter((item) => item !== correct && item !== extra).slice(0, extra ? 3 : 4);
  return ensureNotFirst(unique(extra ? [correct, extra, ...distractors] : [correct, ...distractors]), correct, seed);
}

function wrongWords(word, lesson) {
  const plain = cleanWord(word);
  const sameLesson = lesson.words.map((item) => item.text).filter((item) => item !== word);
  const variants = [
    `${plain.slice(0, -1)}a`,
    plain.replace(lesson.focus, lesson.syllables[1]?.[0] || "l"),
    plain.replace(/[aeiou]$/, "o"),
  ].filter((item) => item && item !== plain);
  return unique([...sameLesson, ...variants]).slice(0, 3);
}

function wordWithSyllable(word, syllable) {
  const plain = cleanWord(word);
  return plain.includes(cleanWord(syllable));
}

function missingSyllableFor(word, lesson) {
  return lesson.syllables.find((syllable) => wordWithSyllable(word, syllable)) || lesson.syllables[0];
}

function buildGames(lesson) {
  const isVowels = lesson.focus === "vocales";
  const letter = isVowels ? "A" : lesson.focus.toUpperCase();
  const syllables = lesson.syllables.slice(0, isVowels ? 5 : 5);
  const words = lesson.words;
  const sentence = lesson.sentences[0];
  const secondSentence = lesson.sentences[1] || sentence;
  const buildWord = words[3] || words[0];
  const missingWord = words[1] || words[0];
  const missingSyllable = missingSyllableFor(missingWord.text, lesson);
  const hiddenWord = cleanWord(missingWord.text).replace(cleanWord(missingSyllable), "__");
  const answerWord = cleanWord(buildWord.text);
  const answerLetters = answerWord.split("");
  const imageTargets = words.slice(0, 4);
  const soundTarget = words[2] || words[0];
  const miniTarget = words[4] || words[0];

  return [
    {
      id: `${lesson.id}-letter`,
      title: "Busca la letra",
      prompt: isVowels ? "Toca la vocal que escuchas" : `¿Dónde está la letra ${letter}?`,
      type: "choice",
      speak: isVowels
        ? "Escucha: A. Toca la vocal A."
        : `Mira bien y toca la letra ${letter}.`,
      options: letterOptions(lesson.focus, lesson.extraFocus, `${lesson.id}-letter`),
      answer: letter,
      character: "pointing",
      progressBuild: 1,
    },
    {
      id: `${lesson.id}-sound-picture`,
      title: "Escucha y elige dibujo",
      prompt: `Toca el dibujo de ${soundTarget.text}`,
      type: "imageChoice",
      speak: `Escucha: ${soundTarget.text}. Toca el dibujo de ${soundTarget.text}.`,
      options: ensureNotFirst(imageTargets, soundTarget, `${lesson.id}-image`).map((item) => ({
        label: item.text,
        drawing: item.drawing,
      })),
      answer: soundTarget.text,
      character: "audio",
      progressBuild: 2,
    },
    {
      id: `${lesson.id}-syllable-hunt`,
      title: "Rodea la sílaba",
      prompt: `Busca ${syllables[2] || syllables[0]}`,
      type: "syllableHunt",
      speak: `Como en el libro. Busca la sílaba ${syllables[2] || syllables[0]} y tócala.`,
      options: ensureNotFirst(unique([...syllables, ...(lesson.syllables.slice(5, 8) || [])]).map((item) => item.toUpperCase()), (syllables[2] || syllables[0]).toUpperCase(), `${lesson.id}-hunt`),
      answer: (syllables[2] || syllables[0]).toUpperCase(),
      targetColor: lesson.color,
      character: "detective",
      progressBuild: 3,
    },
    {
      id: `${lesson.id}-missing`,
      title: "Completa la palabra",
      prompt: `¿Qué falta en ${missingWord.text}?`,
      type: "missing",
      speak: `A esta palabra le falta una sílaba. Mira el dibujo de ${missingWord.text} y toca la pieza que falta.`,
      word: hiddenWord,
      fullWord: missingWord.text,
      drawing: missingWord.drawing,
      options: ensureNotFirst(unique([missingSyllable.toUpperCase(), ...syllables.map((item) => item.toUpperCase())]).slice(0, 5), missingSyllable.toUpperCase(), `${lesson.id}-missing`),
      answer: missingSyllable.toUpperCase(),
      character: "helmet",
      progressBuild: 4,
    },
    {
      id: `${lesson.id}-picture-word`,
      title: "Une dibujo y palabra",
      prompt: `Elige la palabra ${words[3]?.text || words[0].text}`,
      type: "pictureWord",
      speak: `Mira el dibujo y toca su palabra. Es ${words[3]?.text || words[0].text}.`,
      drawing: (words[3] || words[0]).drawing,
      options: ensureNotFirst(words.slice(0, 5).map((item) => item.text), (words[3] || words[0]).text, `${lesson.id}-picture-word`),
      answer: (words[3] || words[0]).text,
      character: "pointing",
      progressBuild: 5,
    },
    {
      id: `${lesson.id}-word`,
      title: "Ordena la palabra",
      prompt: `Forma ${buildWord.text}`,
      type: "build",
      speak: `Ahora construimos una palabra más larga. Toca los bloques en orden para formar ${buildWord.text}.`,
      blocks: ensureNotFirst(answerLetters, answerLetters[0], `${lesson.id}-blocks`),
      answer: answerWord,
      drawing: buildWord.drawing,
      character: "builder",
      progressBuild: 6,
    },
    {
      id: `${lesson.id}-sentence`,
      title: "Frase del dibujo",
      prompt: "Toca la frase que corresponde al dibujo",
      type: "sentenceChoice",
      speak: `Mira el dibujo y escucha las frases. Toca la que corresponde: ${sentence.text}`,
      drawing: sentence.drawing,
      options: ensureNotFirst(
        unique([
          sentence.text,
          secondSentence.text,
          `${words[1]?.text || words[0].text} mira.`,
          `${words[2]?.text || words[0].text} salta.`,
        ]),
        sentence.text,
        `${lesson.id}-sentence`
      ),
      answer: sentence.text,
      character: "reader",
      progressBuild: 7,
    },
    {
      id: `${lesson.id}-final`,
      title: "Mini reto final",
      prompt: `Escucha y elige ${miniTarget.text}`,
      type: "finalChoice",
      speak: `Mini reto final. Escucha la pista: ${miniTarget.clue}. Ahora toca la palabra ${miniTarget.text}.`,
      clue: miniTarget.clue,
      drawing: miniTarget.drawing,
      options: ensureNotFirst(unique([miniTarget.text, ...wrongWords(miniTarget.text, lesson)]), miniTarget.text, `${lesson.id}-final`),
      answer: miniTarget.text,
      character: "teacher",
      progressBuild: 8,
    },
  ];
}

export const modules = lessonCatalog.map((lesson, index) => ({
  id: lesson.id,
  title: lesson.title,
  badge: lesson.badge,
  color: lesson.color,
  unlocked: true,
  unlockedAfter: index === 0 ? undefined : lessonCatalog[index - 1].id,
  lessons: lesson.syllables,
  words: lesson.words.slice(0, 3).map((item) => item.text),
}));

export const levelsById = Object.fromEntries(
  lessonCatalog.map((lesson) => [
    lesson.id,
    {
      ...lesson,
      subtitle:
        lesson.focus === "vocales"
          ? "Vocales en palabras"
          : `Leemos ${lesson.syllables.slice(0, 5).join(", ")}`,
      games: buildGames(lesson),
    },
  ])
);

export const totalMissions = lessonCatalog.length;

export const constructionGoal = lessonCatalog.length * 8;

export const constructionSteps = [
  "Base",
  "Paredes",
  "Puerta",
  "Ventanas",
  "Tejado",
  "Chimenea",
  "Jardín",
  "Bandera",
  "Camino",
  "Letrero",
  "Bandera final",
];

export const rewards = [
  { id: "reading-house", title: "Casa de las palabras", pieces: constructionGoal },
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

export const positiveMessages = ["¡Bien!", "¡Muy bien!", "¡Lo has conseguido!", "¡Sigue así!"];

export { colors };
