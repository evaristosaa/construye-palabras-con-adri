import { useEffect } from "react";
import { speak } from "./audio";

export default function VoiceGuide({ text, audioKey = "", enabled = true, voiceURI = "", auto = true, compact = false }) {
  useEffect(() => {
    if (auto) {
      speak(text, enabled, voiceURI, { audioKey });
    }
  }, [audioKey, auto, enabled, text, voiceURI]);

  return (
    <button
      className={`voice-guide ${compact ? "voice-guide-compact" : ""}`}
      onClick={() => speak(text, enabled, voiceURI, { audioKey })}
      aria-label="Escuchar la instrucción"
    >
      <span>🔊</span>
      <strong>{compact ? "Escuchar" : text}</strong>
    </button>
  );
}
