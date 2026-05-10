import { useEffect } from "react";
import { speak } from "./audio";

export default function VoiceGuide({ text, enabled = true, auto = true, compact = false }) {
  useEffect(() => {
    if (auto) {
      speak(text, enabled);
    }
  }, [auto, enabled, text]);

  return (
    <button
      className={`voice-guide ${compact ? "voice-guide-compact" : ""}`}
      onClick={() => speak(text, enabled)}
      aria-label="Escuchar la instrucción"
    >
      <span>🔊</span>
      <strong>{compact ? "Escuchar" : text}</strong>
    </button>
  );
}
