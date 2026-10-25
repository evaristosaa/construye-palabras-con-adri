import { useEffect, useRef } from "react";

export default function CountingBoard({ question, tokens, setTokens, onClose }) {
  const close = useRef(null);
  useEffect(() => { close.current?.focus(); }, []);
  const count = tokens.filter(Boolean).length;
  function keyDown(event) {
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
    if (event.key !== "Tab") return;
    const buttons = [...event.currentTarget.querySelectorAll("button:not(:disabled)")];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <div className="primary-feedback-shade"><div className="counting-board" role="dialog" aria-modal="true" aria-labelledby="counting-title" onKeyDown={keyDown}>
    <h2 id="counting-title">Mis fichas para pensar</h2><p className="counting-question">{question}</p>
    <p className="counting-instruction">Toca para poner o quitar fichas.</p>
    <div className="counting-frames">{[0, 10].map(start => <div className="counting-frame" key={start} role="group" aria-label={`Grupo de diez ${start ? 2 : 1}`}>{tokens.slice(start, start + 10).map((active, i) => <button key={i} className={active ? "has-token" : ""} aria-pressed={active} aria-label={`Ficha ${start + i + 1}`} onClick={() => setTokens(current => current.map((value, index) => index === start + i ? !value : value))}><span aria-hidden="true" /></button>)}</div>)}</div>
    <p className="counting-total" role="status" aria-live="polite">{count} {count === 1 ? "ficha" : "fichas"}</p>
    <div className="primary-actions"><button className="primary-secondary-button" onClick={() => setTokens(Array(20).fill(false))}>Borrar fichas</button><button ref={close} className="primary-main-button" onClick={onClose}>Volver al reto</button></div>
  </div></div>;
}
