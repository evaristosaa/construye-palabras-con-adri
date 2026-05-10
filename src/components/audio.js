function getVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function getAvailableSpanishVoices() {
  return getVoices().filter((voice) => voice.lang?.toLowerCase().startsWith("es"));
}

function pickAdriVoice(preferredVoiceURI) {
  const voices = getVoices();
  const savedVoice = voices.find((voice) => voice.voiceURI === preferredVoiceURI);
  if (savedVoice) return savedVoice;

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
    spanishVoices.find((voice) => !avoidNames.test(voice.name)) ||
    spanishVoices[0] ||
    voices[0] ||
    null
  );
}

function speakNow(text, preferredVoiceURI) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.94;
  utterance.pitch = 1.38;
  utterance.volume = 1;
  utterance.voice = pickAdriVoice(preferredVoiceURI);
  window.speechSynthesis.speak(utterance);
}

export function speak(text, enabled = true, preferredVoiceURI = "") {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  if (getVoices().length) {
    speakNow(text, preferredVoiceURI);
    return;
  }

  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.onvoiceschanged = null;
    speakNow(text, preferredVoiceURI);
  };

  window.setTimeout(() => {
    if (!window.speechSynthesis.speaking) {
      speakNow(text, preferredVoiceURI);
    }
  }, 250);
}

export function playPositive(enabled = true) {
  if (!enabled || !("AudioContext" in window || "webkitAudioContext" in window)) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const context = new AudioCtx();
  const notes = [523.25, 659.25, 783.99];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, context.currentTime + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.08 + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + index * 0.08);
    oscillator.stop(context.currentTime + index * 0.08 + 0.18);
  });
}
