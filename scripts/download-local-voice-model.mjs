import { mkdir, stat, rename } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const repository = 'Qwen/Qwen3-TTS-12Hz-0.6B-Base';
const directory = path.resolve('.voice-cache/models/qwen-0.6b');
const listing = await fetch(`https://huggingface.co/api/models/${repository}/tree/main?recursive=true`);
if (!listing.ok) throw new Error(`Model listing: HTTP ${listing.status}`);
const files = (await listing.json())
  .filter(file => file.type === 'file' && !['README.md', '.gitattributes'].includes(file.path));
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
    const response = await fetch(`https://huggingface.co/${repository}/resolve/main/${file.path}`, {signal:AbortSignal.timeout(1200000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${file.path}`);
    await pipeline(Readable.fromWeb(response.body), createWriteStream(target + '.partial'));
    if (!(await verify(target + '.partial', file))) throw new Error(`Incomplete or corrupt file: ${file.path}`);
    await rename(target + '.partial', target);
    console.log(`Downloaded ${file.path}`);
  }
}
await Promise.all([worker(), worker()]);
console.log(`Model ready: ${directory}`);
