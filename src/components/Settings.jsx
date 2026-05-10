import VoiceGuide from "./VoiceGuide";
import { speak } from "./audio";

export default function Settings({ progress, updateSettings, resetProgress }) {
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
      <button
        className="test-voice-button"
        onClick={() =>
          speak(
            "Soy Adri. ¿Te animas a construir palabras conmigo? Vamos a jugar.",
            progress.voice
          )
        }
      >
        🔊 Probar voz de Adri
      </button>
      <button className="danger-button" onClick={resetProgress}>Reiniciar progreso</button>
    </section>
  );
}
