import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { snackVoiceLines } from '../src/data/snackAdventure.js';
import { localVoiceFiles } from '../src/data/localVoiceFiles.js';

export function offlinePackagePlugin() {
  let outDir;
  return {
    name: 'adri-offline-package', apply: 'build',
    configResolved(config) { outDir = resolve(config.root, config.build.outDir); },
    async closeBundle() {
      const assetNames = (await readdir(resolve(outDir, 'assets'))).filter(name => /\.(js|css)$/.test(name));
      const corePaths = ['index.html', 'manifest.webmanifest', 'assets/adri.png', 'assets/worlds/reading-village.jpg', ...assetNames.map(name => `assets/${name}`),
        'assets/characters/amigos-comic-unificado-v1.png', 'audio/adri-local/' + localVoiceFiles['home-welcome']];
      const packPaths = ['assets/adri-clean.png', 'assets/characters/juan-comic-v1.png', 'assets/characters/cayetana-comic-v2.png',
        ...[...snackVoiceLines.map(line => line.key), 'result-success', 'result-retry'].map(key => {
          if (!localVoiceFiles[key]) throw new Error(`Falta la voz aprobada: ${key}`);
          return 'audio/adri-local/' + localVoiceFiles[key];
        })];
      async function describe(path) {
        const bytes = await readFile(resolve(outDir, path));
        return { url: path === 'index.html' ? './' : path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
      }
      const core = await Promise.all(corePaths.map(describe));
      const resources = await Promise.all([...new Set(packPaths)].map(describe));
      const template = await readFile(resolve('public/sw.js'), 'utf8');
      const version = createHash('sha256').update(JSON.stringify({core, resources})).update(template).digest('hex').slice(0, 16);
      const manifest = { version, label: 'Inicio y La merienda', core, resources, bytes: [...core, ...resources].reduce((n,r) => n+r.bytes,0) };
      await writeFile(resolve(outDir, 'offline-package.json'), JSON.stringify(manifest));
      await writeFile(resolve(outDir, 'sw.js'), template.replaceAll('__ADRI_RELEASE__', version));
    }
  };
}
