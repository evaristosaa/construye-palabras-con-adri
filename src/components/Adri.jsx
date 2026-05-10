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

export default function Adri({ variant = "reader", size = "large", bubble }) {
  const image = size === "full" ? "adri-clean.png" : "adri.png";

  return (
    <div className={`adri adri-${size} adri-${variant}`} aria-label={`Adri ${labels[variant] || ""}`}>
      <div className="adri-frame">
        <img src={`${import.meta.env.BASE_URL}assets/${image}`} alt="Adri, personaje principal" />
        <span className="adri-accessory hat" aria-hidden="true" />
        <span className="adri-accessory lens" aria-hidden="true" />
        <span className="adri-accessory headphones" aria-hidden="true" />
        <span className="adri-accessory badge" aria-hidden="true">
          B
        </span>
      </div>
      {bubble && <div className="speech-bubble">{bubble}</div>}
    </div>
  );
}
