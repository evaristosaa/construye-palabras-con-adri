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

export function Drawing({ type = "ball" }) {
  return <div className={`drawing drawing-${type}`} aria-label={`Dibujo ${type}`} />;
}
