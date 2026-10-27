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
  audio: "adri-audio.webp",
  builder: "adri-builder.webp",
  helmet: "adri-builder.webp",
  teacher: "adri-reader.webp",
  reader: "adri-reader.webp",
  celebrating: "adri-celebrating.webp",
  reward: "adri-celebrating.webp",
  detective: "adri-detective.webp",
  thinking: "adri-detective.webp",
  pointing: "adri-clean.webp",
};

export default function Adri({ variant = "reader", size = "large", bubble }) {
  const image = size === "full" ? "adri-clean.webp" : variantImages[variant] || "adri-clean.webp";

  return (
    <div className={`adri adri-${size} adri-${variant}`} aria-label={`Adri ${labels[variant] || ""}`}>
      <div className="adri-frame">
        <img src={`${import.meta.env.BASE_URL}assets/${image}`} alt="Adri, personaje principal" />
      </div>
      {bubble && <div className="speech-bubble">{bubble}</div>}
    </div>
  );
}
