import VoiceGuide from "./VoiceGuide";
import { useEffect, useState } from "react";
import { getAvailableSpanishVoices, speak } from "./audio";

export default function Settings({ progress, updateSettings, resetProgress }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    function loadVoices() {
      setVoices(getAvailableSpanishVoices());
    }

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  return (
    <section className="settings-screen comic-panel">
      <VoiceGuide
        text="Estos son los ajustes. Puedes poner o quitar sonidos, activar mi voz o reiniciar la aventura."
        enabled={progress.voice}
        voiceURI={progress.voiceURI}
        compact
      />
      <h2>Ajustes</h2>
      <label className="setting-row">
        <span>Sonidos positivos</span>
        <input
          type="checkbox"
          checked={progress.sound}
          onChange={(event) => updateSettings({ sound: event.target.checked })}
        />
      </label>
      <label className="setting-row">
        <span>Lectura en voz alta</span>
        <input
          type="checkbox"
          checked={progress.voice}
          onChange={(event) => updateSettings({ voice: event.target.checked })}
        />
      </label>
      <label className="setting-row voice-select-row">
        <span>Voz de Adri</span>
        <select
          value={progress.voiceURI || ""}
          onChange={(event) => updateSettings({ voiceURI: event.target.value })}
        >
          <option value="">Automática infantil</option>
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </label>
      <button
        className="test-voice-button"
        onClick={() =>
          speak(
            "Soy Adri. ¿Te animas a construir palabras conmigo? Vamos a jugar.",
            progress.voice,
            progress.voiceURI
          )
        }
      >
        🔊 Probar voz
      </button>
      <button className="danger-button" onClick={resetProgress}>Reiniciar progreso</button>
    </section>
  );
}
