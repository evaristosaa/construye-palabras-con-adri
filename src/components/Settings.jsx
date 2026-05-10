import VoiceGuide from "./VoiceGuide";

export default function Settings({ progress, updateSettings, resetProgress }) {
  return (
    <section className="settings-screen comic-panel">
      <VoiceGuide
        text="En ajustes puedes activar sonidos, activar la voz o reiniciar el progreso."
        enabled={progress.voice}
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
      <button className="danger-button" onClick={resetProgress}>Reiniciar progreso</button>
    </section>
  );
}
