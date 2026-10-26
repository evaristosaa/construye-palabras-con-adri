import { useEffect, useRef, useState } from "react";
import { speak, stopSpeaking } from "./audio.js";

export default function NarrationButton({ audioKey, text, progress, label = "Escuchar", onListen, onPlayingChange }) {
  const track = useRef(null), ticket = useRef(0);
  const [playback, setPlayback] = useState("idle");
  useEffect(() => {
    setPlayback("idle"); onPlayingChange?.(false);
    return () => {
      ticket.current++;
      if (track.current) stopSpeaking(track.current);
      track.current = null;
    };
  }, [audioKey, progress.voice]);
  function update(state, id) {
    if (ticket.current !== id) return;
    setPlayback(state); onPlayingChange?.(state === "playing");
  }
  function toggle() {
    if (playback === "playing") { track.current?.pause(); return; }
    onListen?.();
    const id = ticket.current;
    if (playback === "paused" && track.current?.currentTime > 0 && !track.current.ended) {
      track.current.play().catch(() => update("blocked", id));
      return;
    }
    track.current = speak(text, progress.voice, progress.voiceURI, { audioKey, recordingOnly: true, onPlaybackChange: state => update(state, id) });
  }
  return <span className="narration-control"><button className="primary-secondary-button narration-button" disabled={!progress.voice} onClick={toggle} aria-label={playback === "playing" ? "Pausar narración" : playback === "paused" ? "Seguir escuchando" : label}>{playback === "playing" ? "⏸ Pausar" : playback === "paused" ? "▶ Seguir" : `🔊 ${label}`}</button>{["error","blocked"].includes(playback) && <small role="status">Toca escuchar para intentarlo otra vez.</small>}</span>;
}
