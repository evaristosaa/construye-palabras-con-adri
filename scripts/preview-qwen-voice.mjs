import { mkdir, writeFile } from 'node:fs/promises';

const base = 'https://qwen-qwen3-tts.hf.space';
const text = '¡Hola! Soy Adri. ¿Empezamos a jugar? Vamos a construir una casa. Busca la letra ce. Ahora toca el zapato azul. ¡Muy bien! Lo has hecho genial.';
const instruction = 'Un niño de seis años de Sevilla capital habla en su español nativo. Su voz es infantil, suave y espontánea. Acento andaluz sevillano urbano, con seseo. Entonación española y vocales españolas puras, cortas y claras. Habla con naturalidad, como jugando con un amigo, a un ritmo fluido y tranquilo.';
const response = await fetch(`${base}/gradio_api/call/generate_voice_design`, {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({data: [text, 'Spanish', instruction]}), signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`Qwen: HTTP ${response.status}: ${await response.text()}`);
const job = await response.json();
console.log(`Solicitud enviada: ${job.event_id}`);
const result = await fetch(`${base}/gradio_api/call/generate_voice_design/${job.event_id}`, {signal: AbortSignal.timeout(180000)});
const events = await result.text();
const complete = events.match(/event: complete\r?\ndata: (.+)/);
if (!complete) throw new Error(`No se ha generado audio: ${events.slice(-1800)}`);
const [audio] = JSON.parse(complete[1]);
const url = audio.url || `${base}/gradio_api/file=${audio.path}`;
await mkdir('tmp/qwen-six-sevilla-es', {recursive:true});
await writeFile('tmp/qwen-six-sevilla-es/manifest.json', JSON.stringify({text,instruction,audio,url}, null, 2));
console.log(`Audio generado: ${url}`);

