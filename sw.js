/* The build substitutes the version. Updates wait for closed games or an explicit Family action. */
const RELEASE = 'e0844be1bd8c02b3';
const CORE = `adri-primaria-core-${RELEASE}`;
const PACK = `adri-primaria-pack-${RELEASE}`;
const STAGING = `${PACK}-staging`;
const scope = self.registration.scope;
const manifestURL = new URL('offline-package.json', scope).href;
const markerURL = new URL('__offline_ready__', scope).href;
let downloading = false;
function resourceURL(path) {
  const url = new URL(path, scope);
  if (!url.href.startsWith(scope) || url.origin !== self.location.origin || url.search || url.hash) throw Error('Recurso fuera de la aplicación');
  return url.href;
}
async function manifest(fromNetwork = false) {
  const cache = await caches.open(CORE);
  let response = !fromNetwork && await cache.match(manifestURL);
  if (!response) response = await fetch(`${manifestURL}?release=${RELEASE}`, {cache:'no-store'});
  if (!response.ok) throw Error('No se pudo leer el paquete');
  const data = await response.json();
  if (data.version !== RELEASE || !Array.isArray(data.core) || !Array.isArray(data.resources)) throw Error('La descarga corresponde a otra versión. Recarga desde Familia.');
  [...data.core,...data.resources].forEach(item => resourceURL(item.url));
  await cache.put(manifestURL, new Response(JSON.stringify(data), {headers:{'Content-Type':'application/json'}}));
  return data;
}
async function verifiedResponse(item) {
  const response = await fetch(resourceURL(item.url), {cache:'reload'});
  if (!response.ok) throw Error('No se pudo descargar un recurso');
  const bytes = await response.clone().arrayBuffer();
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  if (bytes.byteLength !== item.bytes || hash !== item.sha256) throw Error('Descarga incompleta. Vuelve a intentarlo con conexión.');
  return response;
}
function selectedPack(data,id='merienda'){
  if(!data.packs){if(id!=='merienda')throw Error('Paquete no disponible');return data;}
  const pack=data.packs[id];if(!pack)throw Error('Paquete no disponible');return {...pack,core:data.core,version:data.version};
}
function packMarker(id){return id==='merienda'?markerURL:markerURL+'-'+id;}
async function completeStatus(data,id='merienda') {
  const core = await caches.open(CORE), pack = await caches.open(PACK);
  if (!(await pack.match(packMarker(id)))) return false;
  for (const item of data.core) if (!(await core.match(resourceURL(item.url)))) return false;
  for (const item of data.resources) if (!(await pack.match(resourceURL(item.url)))) return false;
  return true;
}
async function downloadPack(port,id='merienda') {
  if (downloading) throw Error('Ya hay una descarga en curso. Espera a que termine.');
  downloading = true;
  try {
    const data = selectedPack(await manifest(),id);
    const pack = await caches.open(PACK), core = await caches.open(CORE);
    await pack.delete(packMarker(id));
    await caches.delete(STAGING);
    const staging = await caches.open(STAGING);
    let done = 0;
    const resources = [...data.core, ...data.resources];
    for (const item of resources) {
      await staging.put(resourceURL(item.url), await verifiedResponse(item));
      port?.postMessage({type:'progress', done:++done, total:resources.length});
    }
    for (const item of data.core) await core.put(resourceURL(item.url), await staging.match(resourceURL(item.url)));
    for (const item of data.resources) await pack.put(resourceURL(item.url), await staging.match(resourceURL(item.url)));
    await pack.put(packMarker(id), new Response(RELEASE));
    return {ready:await completeStatus(data,id), version:RELEASE, label:data.label, bytes:data.bytes};
  } finally { downloading = false; await caches.delete(STAGING); }
}
async function rangeResponse(request, response) {
  const header = request.headers.get('range');
  if (!header) return response;
  const bytes = await response.arrayBuffer();
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  let start, end;
  if (match && (match[1] || match[2])) {
    start = match[1] ? Number(match[1]) : Math.max(0,bytes.byteLength-Number(match[2]));
    end = match[1] && match[2] ? Math.min(Number(match[2]),bytes.byteLength-1) : bytes.byteLength-1;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start>end || start>=bytes.byteLength || (match && !match[1] && Number(match[2])===0)) return new Response(null,{status:416,headers:{'Content-Range':`bytes */${bytes.byteLength}`}});
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.set('Content-Length',String(end-start+1));
  headers.set('Content-Range',`bytes ${start}-${end}/${bytes.byteLength}`);
  headers.set('Accept-Ranges','bytes');
  return new Response(bytes.slice(start,end+1), {status:206,headers});
}
self.addEventListener('install', event => event.waitUntil((async()=>{
  const data = await manifest(true), cache = await caches.open(CORE);
  for (const item of data.core) await cache.put(resourceURL(item.url), await verifiedResponse(item));
})()));
self.addEventListener('activate', event => event.waitUntil((async()=>{
  for (const key of await caches.keys()) if (/^(adri-lee-|adri-primaria-)/.test(key) && ![CORE,PACK].includes(key)) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('message', event => {
  const port = event.ports[0];
  event.waitUntil((async()=>{
    try {
      if (event.data?.type === 'DOWNLOAD_PACK') port?.postMessage({type:'done',...await downloadPack(port,event.data.packId||'merienda')});
      if (event.data?.type === 'GET_STATUS') { const all=await manifest(), id=event.data.packId||'merienda', data=selectedPack(all,id); port?.postMessage({type:'done',ready:await completeStatus(data,id),version:RELEASE,label:data.label,bytes:data.bytes,packs:Object.entries(all.packs||{merienda:all}).map(([id,p])=>({id,label:p.label,bytes:p.bytes}))}); }
      if (event.data?.type === 'ACTIVATE_UPDATE') {
        const windows = (await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(client=>client.url.startsWith(scope));
        // Client.url can retain an earlier hash after SPA navigation.
        if (windows.length>1 || event.data.fromFamily !== true || !event.source?.url.startsWith(scope)) throw Error('Cierra las otras pestañas de la app y actualiza desde Familia.');
        port?.postMessage({type:'done',updating:true});
        await self.skipWaiting();
      }
    } catch(error) { port?.postMessage({type:'error',message:error.message}); }
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(scope)) return;
  event.respondWith((async()=>{
    const core = await caches.open(CORE), pack = await caches.open(PACK);
    if (event.request.mode === 'navigate') return await core.match(scope) || fetch(event.request);
    const cached = await core.match(event.request.url) || await pack.match(event.request.url);
    return cached ? rangeResponse(event.request,cached) : fetch(event.request);
  })());
});
