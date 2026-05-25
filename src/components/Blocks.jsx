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
  baby: ["👶", "bebé"],
  bag: ["🧳", "maleta"],
  ball: ["⚽", "bola"],
  bear: ["🐻", "oso"],
  boot: ["🥾", "bota"],
  bowl: ["🍲", "sopa"],
  bull: ["🐂", "toro"],
  chair: ["🪑", "silla"],
  cloth: ["🧣", "tela"],
  cloud: ["☁️", "nube"],
  cup: ["☕", "taza"],
  dad: ["👨", "papá"],
  dice: ["🎲", "dado"],
  domino: ["🁢", "dominó"],
  donkey: ["🫏", "burro"],
  duck: ["🦆", "pato"],
  finger: ["☝️", "dedo"],
  flower: ["🌷", "flor"],
  frog: ["🐸", "sapo"],
  giraffe: ["🦒", "jirafa"],
  girl: ["👧", "niña"],
  grape: ["🍇", "uva"],
  heart: ["❤️", "familia"],
  hill: ["⛰️", "monte"],
  jug: ["🏺", "jarra"],
  lemon: ["🍋", "limón"],
  lens: ["🔍", "lupa"],
  mom: ["👩", "mamá"],
  monkey: ["🐒", "mono"],
  moon: ["🌙", "luna"],
  motorbike: ["🏍️", "moto"],
  mouth: ["👄", "boca"],
  mouse: ["🐭", "ratón"],
  nest: ["🪺", "nido"],
  piano: ["🎹", "piano"],
  pineapple: ["🍍", "piña"],
  pipe: ["🫧", "pipa"],
  scissors: ["✂️", "tijera"],
  smile: ["😄", "risa"],
  sun: ["☀️", "sol"],
  syringe: ["💉", "jeringa"],
  table: ["🟫", "mesa"],
  target: ["🎯", "diana"],
  tomato: ["🍅", "tomate"],
  watermelon: ["🍉", "sandía"],
  wave: ["🌊", "ola"],
  wheel: ["🛞", "rueda"],
  wing: ["🪽", "ala"],
  wizard: ["🧝", "duende"],
  wool: ["🧶", "lana"],
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
