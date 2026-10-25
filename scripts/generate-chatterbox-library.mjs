import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { voiceLines } from '../src/data/adriAudioCatalog.js';

const base = 'https://resembleai-chatterbox-multilingual-tts-v3.hf.space';
const reference = JSON.parse(await readFile('tmp/qwen-six-sevilla/manifest.json', 'utf8'));
const directory = 'public/audio/adri-chatterbox';
await mkdir(directory, { recursive: true });
const form = new FormData();
form.append('files', new Blob([await readFile('tmp/qwen-six-sevilla/adri-sevilla.wav')], {type:'audio/wav'}), 'reference.wav');
const uploaded = await fetch(`${base}/gradio_api/upload`, {method:'POST',body:form,signal:AbortSignal.timeout(30000)});
if (!uploaded.ok) throw new Error(`Upload: ${uploaded.status}`);
const [referencePath] = await uploaded.json();
for (const line of voiceLines) {
  const filename = `${directory}/${line.key}.wav`;
  try { await access(filename); continue; } catch {}
  const response = await fetch(`${base}/gradio_api/call/generate_tts_audio`, {
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({data:[line.text,{path:referencePath,meta:{_type:'gradio.FileData'}},'es',0.35,0.7,42,0.5]}),
    signal:AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Chatterbox: ${response.status}`);
  const job = await response.json();
  const result = await fetch(`${base}/gradio_api/call/generate_tts_audio/${job.event_id}`,{signal:AbortSignal.timeout(180000)});
  const events = await result.text();
  const complete = events.match(/event: complete\r?\ndata: (.+)/);
  if (!complete) throw new Error(`Chatterbox no generó ${line.key}: ${events.slice(-1500)}`);
  const [audio, status] = JSON.parse(complete[1]);
  if (!audio) throw new Error(`Chatterbox: ${status}`);
  const wav = await fetch(audio.url || `${base}/gradio_api/file=${audio.path}`);
  if (!wav.ok) throw new Error(`Audio: ${wav.status}`);
  await writeFile(filename, Buffer.from(await wav.arrayBuffer()));
  console.log(`Generado ${line.key}`);
}
