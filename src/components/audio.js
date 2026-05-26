import { resultAudioKeys } from "../data/adriAudioCatalog.js";
import { retryFeedback, successFeedback } from "../data/voiceScripts.js";

let activeRecording = null;

function getVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function getAvailableSpanishVoices() {
  return getVoices().filter((voice) => voice.lang?.toLowerCase().startsWith("es"));
}

function pickAdriVoice(preferredVoiceURI) {
  const voices = getVoices();
  const spanishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("es"));
  const preferredNames = [
    /pablo/i,
    /alvaro|álvaro/i,
    /jorge/i,
    /diego/i,
    /antonio/i,
    /carlos/i,
    /miguel/i,
    /raul|raúl/i,
    /google.*español/i,
    /microsoft.*spanish/i,
  ];
  const avoidNames = /monica|mónica|helena|laura|sabina|paulina|elvira|female|mujer/i;

  return (
    spanishVoices.find((voice) => preferredNames.some((pattern) => pattern.test(voice.name))) ||
    voices.find((voice) => voice.voiceURI === preferredVoiceURI && !avoidNames.test(voice.name)) ||
    spanishVoices.find((voice) => !avoidNames.test(voice.name)) ||
    spanishVoices[0] ||
    voices[0] ||
    null
  );
}

export function getRecordedAudioSrc(audioKey, baseUrl = "/") {
  return `${baseUrl}audio/adri/${audioKey}.mp3`;
}

function speakNow(text, preferredVoiceURI, { rate = 0.98, pitch = 1.45 } = {}) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;
  utterance.voice = pickAdriVoice(preferredVoiceURI);
  window.speechSynthesis.speak(utterance);
}

function cancelSpeech() {
  if (activeRecording) {
    activeRecording.pause();
    activeRecording.currentTime = 0;
    activeRecording = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakWithBrowser(text, preferredVoiceURI, options) {
  if (!("speechSynthesis" in window)) return;

  if (getVoices().length) {
    speakNow(text, preferredVoiceURI, options);
    return;
  }

  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.onvoiceschanged = null;
    speakNow(text, preferredVoiceURI, options);
  };

  window.setTimeout(() => {
    if (!window.speechSynthesis.speaking) {
      speakNow(text, preferredVoiceURI, options);
    }
  }, 250);
}

export function speak(text, enabled = true, preferredVoiceURI = "", options = {}) {
  if (!enabled) return;
  cancelSpeech();

  if (options.audioKey && "Audio" in window) {
    const recording = new Audio(getRecordedAudioSrc(options.audioKey, import.meta.env.BASE_URL));
    let fallbackPlayed = false;
    const fallback = () => {
      if (fallbackPlayed || activeRecording !== recording) return;
      fallbackPlayed = true;
      activeRecording = null;
      speakWithBrowser(text, preferredVoiceURI, options);
    };
    recording.onerror = fallback;
    activeRecording = recording;
    const playing = recording.play();
    if (playing?.catch) playing.catch(fallback);
    return;
  }

  speakWithBrowser(text, preferredVoiceURI, options);
}

function playToneSequence(enabled, notes, type = "sine") {
  if (!enabled || !("AudioContext" in window || "webkitAudioContext" in window)) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const context = new AudioCtx();

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gain.gain.setValueAtTime(0.001, context.currentTime + index * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + index * 0.09 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.09 + 0.18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + index * 0.09);
    oscillator.stop(context.currentTime + index * 0.09 + 0.2);
  });
}

export function playPositive(enabled = true) {
  playToneSequence(enabled, [523.25, 659.25, 783.99], "sine");
}

export function playRetry(enabled = true) {
  playToneSequence(enabled, [392, 330], "triangle");
}

export function speakResult(kind, voiceEnabled = true, soundEnabled = true, preferredVoiceURI = "") {
  if (kind === "success") {
    playPositive(soundEnabled);
    speak(successFeedback, voiceEnabled, preferredVoiceURI, {
      audioKey: resultAudioKeys.success,
      rate: 1.05,
      pitch: 1.6,
    });
    return;
  }
  playRetry(soundEnabled);
  speak(retryFeedback, voiceEnabled, preferredVoiceURI, {
    audioKey: resultAudioKeys.retry,
    rate: 1.02,
    pitch: 1.45,
  });
}
