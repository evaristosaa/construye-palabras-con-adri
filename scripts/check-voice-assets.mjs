import { voiceCatalog as voiceLines } from '../src/data/voiceCatalog.js';
import { getRecordedAudioSrc } from '../src/components/audio.js';

const base = process.argv[2] || 'http://127.0.0.1:5173/construye-palabras-con-adri/';
let cursor = 0;
const failures = [];
async function worker() {
  while (cursor < voiceLines.length) {
    const line = voiceLines[cursor++];
    const url = new URL(getRecordedAudioSrc(line.key, ''), base);
    try {
      const response = await fetch(url, {method:'HEAD', signal:AbortSignal.timeout(10000)});
      if (!response.ok || !response.headers.get('content-type')?.startsWith('audio/')) {
        failures.push(`${line.key}: HTTP ${response.status}, ${response.headers.get('content-type')}`);
      }
    } catch (error) {
      failures.push(`${line.key}: ${error.message}`);
    }
  }
}
await Promise.all(Array.from({length:8}, worker));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`OK: ${voiceLines.length} audio files are served with an audio content type.`);
}
