export function Brick({ children, color = "blue", className = "", onClick, selected = false, draggable = false }) {
  return (
    <button
      className={`brick brick-${color} ${selected ? "is-selected" : ""} ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", String(children))}
    >
      <span className="studs" aria-hidden="true" />
      {children}
    </button>
  );
}

export function Stars({ count = 0, total = 3 }) {
  return (
    <div className="stars" aria-label={`${count} de ${total} estrellas`}>
      {Array.from({ length: total }).map((_, index) => (
        <span key={index} className={index < count ? "filled" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

const drawings = {
  apple: ["🍎", "manzana"],
  baby: ["👶", "bebé"],
  bag: ["🧳", "maleta"],
  ball: ["⚽", "bola"],
  bear: ["🐻", "oso"],
  bee: ["🐝", "abeja"],
  bird: ["🦤", "ñandú"],
  boat: ["⛵", "yate"],
  book: ["📖", "texto"],
  boot: ["🥾", "bota"],
  box: ["📦", "caja"],
  bowl: ["🍲", "sopa"],
  bull: ["🐂", "toro"],
  chair: ["🪑", "silla"],
  cheese: ["🧀", "queso"],
  church: ["⛪", "iglesia"],
  cinema: ["🎬", "cine"],
  coconut: ["🥥", "coco"],
  computer: ["💻", "web"],
  cow: ["🐄", "vaca"],
  crib: ["🛏️", "cuna"],
  cloth: ["🧣", "tela"],
  cloud: ["☁️", "nube"],
  cup: ["☕", "taza"],
  dad: ["👨", "papá"],
  dice: ["🎲", "dado"],
  domino: ["🁢", "dominó"],
  donkey: ["🫏", "burro"],
  duck: ["🦆", "pato"],
  ear: ["👂", "oreja"],
  egg: ["🥚", "yema"],
  elephant: ["🐘", "elefante"],
  eraser: ["🧽", "goma"],
  fairy: ["🧚", "hada"],
  fire: ["🔥", "fuego"],
  finger: ["☝️", "dedo"],
  flower: ["🌷", "flor"],
  frog: ["🐸", "sapo"],
  giraffe: ["🦒", "jirafa"],
  glass: ["🥛", "vaso"],
  glove: ["🥊", "boxeo"],
  gnu: ["🐃", "ñu"],
  girl: ["👧", "niña"],
  grape: ["🍇", "uva"],
  heart: ["❤️", "familia"],
  hedgehog: ["🦔", "erizo"],
  horse: ["🐴", "yegua"],
  house: ["🏠", "casa"],
  icecream: ["🍦", "helado"],
  igloo: ["🧊", "iglú"],
  island: ["🏝️", "isla"],
  jelly: ["🍮", "gelatina"],
  hill: ["⛰️", "monte"],
  jug: ["🏺", "jarra"],
  lemon: ["🍋", "limón"],
  leaf: ["🍃", "hoja"],
  letter: ["🔤", "zeta"],
  lighthouse: ["🗼", "faro"],
  magnet: ["🧲", "imán"],
  lens: ["🔍", "lupa"],
  mom: ["👩", "mamá"],
  monkey: ["🐒", "mono"],
  moon: ["🌙", "luna"],
  motorbike: ["🏍️", "moto"],
  mouth: ["👄", "boca"],
  music: ["🎵", "nota"],
  nail: ["💅", "uña"],
  mouse: ["🐭", "ratón"],
  nose: ["👃", "nariz"],
  nest: ["🪺", "nido"],
  piano: ["🎹", "piano"],
  pineapple: ["🍍", "piña"],
  plane: ["✈️", "avión"],
  pasta: ["🍝", "ñoqui"],
  pan: ["🍳", "wok"],
  paper: ["📝", "examen"],
  racket: ["🎾", "raqueta"],
  ring: ["💍", "anillo"],
  scale: ["⚖️", "kilo"],
  seal: ["🦭", "foca"],
  sheep: ["🐑", "oveja"],
  shoe: ["👟", "zapato"],
  pipe: ["🫧", "pipa"],
  scissors: ["✂️", "tijera"],
  smile: ["😄", "risa"],
  sun: ["☀️", "sol"],
  sunflower: ["🌻", "girasol"],
  surf: ["🏄", "windsurf"],
  strawberry: ["🍓", "fresa"],
  syringe: ["💉", "jeringa"],
  table: ["🟫", "mesa"],
  target: ["🎯", "diana"],
  tomato: ["🍅", "tomate"],
  taxi: ["🚕", "taxi"],
  thread: ["🧵", "hilo"],
  tree: ["🌳", "árbol"],
  unicorn: ["🦄", "unicornio"],
  violin: ["🎻", "violín"],
  volcano: ["🌋", "volcán"],
  watermelon: ["🍉", "sandía"],
  wave: ["🌊", "ola"],
  wheel: ["🛞", "rueda"],
  wing: ["🪽", "ala"],
  wizard: ["🧝", "duende"],
  wool: ["🧶", "lana"],
  worm: ["🪱", "gusano"],
  xylophone: ["🎼", "xilófono"],
  yogurt: ["🥣", "yogur"],
  yoyo: ["🪀", "yoyó"],
  zebra: ["🦓", "cebra"],
  carrot: ["🥕", "zanahoria"],
  fox: ["🦊", "zorro"],
  juice: ["🧃", "zumo"],
  kiwi: ["🥝", "kiwi"],
  koala: ["🐨", "koala"],
  karate: ["🥋", "karate"],
  kayak: ["🛶", "kayak"],
  one: ["1️⃣", "uno"],
  orangefruit: ["🍊", "naranja"],
  wifi: ["📶", "wifi"],
};

export function Drawing({ type = "ball", hideLabel = false }) {
  const [icon, label] = drawings[type] || ["🔹", type];
  return (
    <div className={`drawing drawing-${type}`} aria-label={`Dibujo ${label}`}>
      <span className="drawing-icon" aria-hidden="true">
        {icon}
      </span>
      {!hideLabel && <span className="drawing-label">{label}</span>}
    </div>
  );
}
