import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto,createHash} from 'node:crypto';
const source=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const scope='https://example.test/app/';
function fixture({broken=false}={}) {
  const stores=new Map(), handlers={}, body='example resource';
  const resource={url:'audio/test.wav',bytes:Buffer.byteLength(body),sha256:createHash('sha256').update(body).digest('hex')};
  const data={version:'test',label:'Piloto',core:[{...resource,url:'./'}],resources:[resource],bytes:32};
  const cacheFor=name=>{
    if(!stores.has(name)) stores.set(name,new Map());
    const entries=stores.get(name);
    return {async match(key){return entries.get(String(key))?.clone();}, async put(key,response){entries.set(String(key),response.clone());},async delete(key){return entries.delete(key);}};
  };
  const context=vm.createContext({URL,Response,Headers,Request,Uint8Array,Number,Error,crypto:webcrypto,
    caches:{open:async name=>cacheFor(name),delete:async name=>stores.delete(name),keys:async()=>[...stores.keys()]},
    fetch:async url=>String(url).includes('offline-package.json')?Response.json(data):new Response(broken&&String(url).endsWith('test.wav')?'truncated':body),
    self:{registration:{scope},location:{origin:'https://example.test'},addEventListener:(name,fn)=>handlers[name]=fn,clients:{claim:async()=>{},matchAll:async()=>[]},skipWaiting:async()=>{}}
  });
  vm.runInContext(source.replaceAll('__ADRI_RELEASE__','test'),context);
  return {context,stores,handlers,data,cacheFor};
}
test('an interrupted or corrupt pack never reports ready; retry commits all resources',async()=>{
  const fail=fixture({broken:true});
  await assert.rejects(vm.runInContext('downloadPack()',fail.context),/incompleta/);
  assert.equal(await vm.runInContext('manifest().then(completeStatus)',fail.context),false);
  assert.equal(fail.stores.has('adri-primaria-pack-test-staging'),false);
  const ok=fixture();
  assert.equal((await vm.runInContext('downloadPack()',ok.context)).ready,true);
  assert.equal(await vm.runInContext('manifest().then(completeStatus)',ok.context),true);
  await ok.cacheFor('adri-primaria-pack-test').delete(scope+'audio/test.wav');
  assert.equal(await vm.runInContext('manifest().then(completeStatus)',ok.context),false);
});
test('cached audio supports explicit and suffix byte ranges, and rejects invalid ranges',async()=>{
  const {context}=fixture();
  for(const [range,status,expected] of [['bytes=1-3',206,'bcd'],['bytes=4-',206,'ef'],['bytes=-2',206,'ef'],['bytes=20-',416,''],['bytes=3-1',416,''],['bytes=-0',416,''],['invalid',416,''],['bytes=0-1,3-4',416,'']]) {
    context.request=new Request(scope+'audio/test.wav',{headers:{Range:range}});context.response=new Response('abcdef');
    const result=await vm.runInContext('rangeResponse(request,response)',context);
    assert.equal(result.status,status,range);assert.equal(await result.text(),expected,range);
  }
});
test('updates cannot interrupt a game or another open tab',async()=>{
  const f=fixture();let output;
  const message=async (url,fromFamily=false)=>{
    let waiting;
    f.handlers.message({data:{type:'ACTIVATE_UPDATE',fromFamily},ports:[{postMessage:value=>output=value}],source:{url},waitUntil:promise=>waiting=promise});
    await waiting;return output;
  };
  assert.equal((await message(scope+'#/primaria/merienda')).type,'error');
  assert.equal((await message(scope+'#/',true)).updating,true);
  vm.runInContext(`self.clients.matchAll=async()=>[{url:'${scope}'},{url:'${scope}'}]`,f.context);
  assert.equal((await message(scope+'#/ajustes',true)).type,'error');
});

test('download markers are independent for each subject and corrupted resources invalidate only their own package',async()=>{
 const f=fixture();f.data.packs={merienda:{label:'Merienda',resources:f.data.resources,bytes:32},matematicas:{label:'Mates',resources:[{...f.data.resources[0],url:'audio/math.wav'}],bytes:32}};
 assert.equal((await vm.runInContext("downloadPack(null,'matematicas')",f.context)).ready,true);
 assert.equal(await vm.runInContext("manifest().then(d=>completeStatus(selectedPack(d,'merienda'),'merienda'))",f.context),false);
 assert.equal((await vm.runInContext("downloadPack(null,'merienda')",f.context)).ready,true);
 await f.cacheFor('adri-primaria-pack-test').delete(scope+'audio/math.wav');
 assert.equal(await vm.runInContext("manifest().then(d=>completeStatus(selectedPack(d,'matematicas'),'matematicas'))",f.context),false);
 assert.equal(await vm.runInContext("manifest().then(d=>completeStatus(selectedPack(d,'merienda'),'merienda'))",f.context),true);
 assert.throws(()=>vm.runInContext("selectedPack({packs:{}},'unknown')",f.context),/disponible/);
});
