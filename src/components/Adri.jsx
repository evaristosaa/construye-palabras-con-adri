const labels = {
  reader: "Leyendo",
  builder: "Constructor",
  detective: "Detective",
  pointing: "Señalando",
  audio: "Escuchando",
  teacher: "Maestro",
  celebrating: "Celebrando",
  thinking: "Pensando",
  helmet: "Con casco constructor",
  reward: "Desbloqueando premios",
};

const variantImages = {
  audio: "adri-audio.png",
  builder: "adri-builder.png",
  helmet: "adri-builder.png",
  teacher: "adri-reader.png",
  reader: "adri-reader.png",
  celebrating: "adri-celebrating.png",
  reward: "adri-celebrating.png",
  detective: "adri-detective.png",
  thinking: "adri-detective.png",
  pointing: "adri-clean.png",
};

export default function Adri({ variant = "reader", size = "large", bubble }) {
  const image = size === "full" ? "adri-clean.png" : variantImages[variant] || "adri-clean.png";

  return (
    <div className={`adri adri-${size} adri-${variant}`} aria-label={`Adri ${labels[variant] || ""}`}>
      <div className="adri-frame">
        <img src={`${import.meta.env.BASE_URL}assets/${image}`} alt="Adri, personaje principal" />
      </div>
      {bubble && <div className="speech-bubble">{bubble}</div>}
    </div>
  );
}
