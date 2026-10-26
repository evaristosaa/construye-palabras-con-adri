import { mkdir, stat, rename, writeFile } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const expressive = process.argv.includes('--expressive');
const spanishAsr = process.argv.includes('--spanish-asr');
if(expressive && spanishAsr)throw new Error('Choose one model type');
const repository = spanishAsr ? 'jonatasgrosman/wav2vec2-large-xlsr-53-spanish' : expressive ? 'Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign' : 'Qwen/Qwen3-TTS-12Hz-0.6B-Base';
const directory = path.resolve('.voice-cache/models', spanishAsr ? 'spanish-ctc' : expressive ? 'qwen-1.7b-voicedesign' : 'qwen-0.6b');
let revision='main';
if(spanishAsr){
  const metadata=await fetch(`https://huggingface.co/api/models/${repository}`);
  if(!metadata.ok)throw new Error(`Model metadata: HTTP ${metadata.status}`);
  revision=(await metadata.json()).sha;
  if(!/^[a-f0-9]{40}$/.test(revision))throw new Error('Invalid model revision');
}
const listing = await fetch(`https://huggingface.co/api/models/${repository}/tree/${revision}?recursive=true`);
if (!listing.ok) throw new Error(`Model listing: HTTP ${listing.status}`);
let files = (await listing.json())
  .filter(file => file.type === 'file' && !['README.md', '.gitattributes'].includes(file.path));
if(spanishAsr){
  const weight=files.some(file=>file.path==='model.safetensors')?'model.safetensors':'pytorch_model.bin';
  const selected=new Set(['config.json','preprocessor_config.json','tokenizer_config.json','vocab.json','special_tokens_map.json',weight]);
  files=files.filter(file=>selected.has(file.path));
}
let cursor = 0;
async function verify(target, file) {
  if ((await stat(target)).size !== file.size) return false;
  if (!file.lfs?.oid) return true;
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(target)) digest.update(chunk);
  return digest.digest('hex') === file.lfs.oid;
}
async function worker() {
  while (cursor < files.length) {
    const file = files[cursor++];
    const target = path.resolve(directory, file.path);
    if (!target.startsWith(directory + path.sep)) throw new Error('Unexpected model path');
    try { if (await verify(target, file)) { console.log(`Verified ${file.path}`); continue; } } catch {}
    await mkdir(path.dirname(target), {recursive:true});
    console.log(`Downloading ${file.path} (${Math.round(file.size/1048576)} MB)`);
    let offset = 0;
    try { const partial = await stat(target + '.partial'); if (partial.size < file.size) offset = partial.size; } catch {}
    const response = await fetch(`https://huggingface.co/${repository}/resolve/${revision}/${file.path}`, {
      headers:offset ? {Range:`bytes=${offset}-`} : {}, signal:AbortSignal.timeout(1200000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${file.path}`);
    const append = offset > 0 && response.status === 206;
    if (append && !response.headers.get('content-range')?.startsWith(`bytes ${offset}-`)) throw new Error('Unexpected download range');
    await pipeline(Readable.fromWeb(response.body), createWriteStream(target + '.partial', {flags:append?'a':'w'}));
    if (!(await verify(target + '.partial', file))) throw new Error(`Incomplete or corrupt file: ${file.path}`);
    await rename(target + '.partial', target);
    console.log(`Downloaded ${file.path}`);
  }
}
await Promise.all([worker(), worker()]);
if(spanishAsr)await writeFile(path.join(directory,'source.json'),JSON.stringify({repository,revision,files:files.map(file=>file.path)},null,2));
console.log(`Model ready: ${directory}`);
