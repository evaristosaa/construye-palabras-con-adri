const dbName='adri-creations-v1';
let opening;
function database(){
  if(!opening)opening=new Promise((resolve,reject)=>{
    const request=indexedDB.open(dbName,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('works',{keyPath:'id'});
    request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();opening=null;};resolve(request.result);};
    request.onerror=()=>{opening=null;reject(Error('No se puede abrir el álbum en este navegador.'));};
  });
  return opening;
}
export function validateCreation(value){
  if(!value||typeof value!=='object'||!['comic','observation','story'].includes(value.kind)||typeof value.id!=='string'||(!value.id.length||value.id.length>100)||typeof value.title!=='string'||value.title.length>100||!Number.isFinite(Date.parse(value.date)))throw Error('La obra no es válida.');
  if((!Array.isArray(value.frames)||value.frames.length!==3||value.frames.some(f=>!f||!['Adri','Juan','Cayetana'].includes(f.friend)||typeof f.text!=='string'||f.text.length>240)))throw Error('Las viñetas no son válidas.');
  if(value.note!==undefined&&(typeof value.note!=='string'||value.note.length>500))throw Error('La nota es demasiado larga.');
  if((!Array.isArray(value.strokes)||value.strokes.length>150||value.strokes.some(s=>!s||!['#17405c','#db3853','#308d4b','#e49d00','#3873ce'].includes(s.color)||!Array.isArray(s.points)||s.points.length>400||s.points.some(p=>!Array.isArray(p)||p.length!==2||p.some(n=>!Number.isFinite(n)||n<0||n>1000)))))throw Error('El dibujo no es válido.');
  if(value.audio!==undefined&&(!(value.audio instanceof Blob)||value.audio.size>5*1024*1024||!/^audio\//.test(value.audio.type)))throw Error('La grabación no es válida.');
  if(value.weather!==undefined&&!['☀️','⛅','☁️','🌧️','🌬️'].includes(value.weather))throw Error('El tiempo no es válido.');
  if(value.height!==undefined&&(typeof value.height!=='string'||value.height.length>5||value.height!==''&&!/^\d{1,3}(\.\d)?$/.test(value.height)))throw Error('La medida no es válida.');
  return structuredClone({id:value.id,kind:value.kind,title:value.title,date:new Date(value.date).toISOString(),frames:value.frames.map(f=>({friend:f.friend,text:f.text})),strokes:value.strokes.map(s=>({color:s.color,points:s.points})),note:value.note||'',...(value.audio?{audio:value.audio}:{}),...(value.kind==='observation'?{weather:value.weather||'☀️',height:value.height||''}:{})});
}
async function transaction(mode,operation){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('works',mode);const request=operation(tx.objectStore('works'));let result;request.onsuccess=()=>{result=request.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(Error('No se ha podido guardar. Exporta tus obras antes de cerrar.'));tx.onabort=()=>reject(Error('No se ha podido guardar el álbum.'));});}
export async function listCreations(){return (await transaction('readonly',store=>store.getAll())).map(validateCreation).sort((a,b)=>b.date.localeCompare(a.date));}
export async function saveCreation(value){const clean=validateCreation(value);await transaction('readwrite',store=>store.put(clean));return clean;}
export async function saveCreationBatch(values){const clean=values.map(validateCreation);await transaction('readwrite',store=>{for(const row of clean)store.put(row);return store.count();});}
export async function removeCreation(id){await transaction('readwrite',store=>store.delete(id));}
export function blankCreation(kind,now=new Date()){
  return {id:crypto.randomUUID(),kind,title:kind==='comic'?'Mi cómic':kind==='observation'?'Mi planta y el tiempo':'Mi cuento',date:now.toISOString(),note:'',strokes:[],frames:['Adri','Juan','Cayetana'].map(friend=>({friend,text:''})),...(kind==='observation'?{weather:'☀️',height:''}:{})};
}
export async function exportCreations(works){
  const rows=await Promise.all(works.map(async raw=>{const work=validateCreation(raw);if(work.audio){const bytes=new Uint8Array(await work.audio.arrayBuffer());let data='';for(let i=0;i<bytes.length;i+=8192)data+=String.fromCharCode(...bytes.subarray(i,i+8192));work.recording={type:work.audio.type,base64:btoa(data)};delete work.audio;}return work;}));
  const text=JSON.stringify({format:'adri-creative-album',version:1,works:rows});if(text.length>40*1024*1024)throw Error('El álbum supera 40 MB. Conserva las grabaciones en copias más pequeñas antes de añadir más.');return text;
}
export function importCreations(text){
  if(typeof text!=='string'||text.length>40*1024*1024)throw Error('La copia del álbum es demasiado grande.');
  const archive=JSON.parse(text);
  if(archive?.format!=='adri-creative-album'||archive.version!==1||!Array.isArray(archive.works)||archive.works.length>5000)throw Error('Elige una copia del álbum de esta app.');
  return archive.works.map(row=>{const work={...row};if(work.recording){if(typeof work.recording.base64!=='string'||work.recording.base64.length>7*1024*1024)throw Error('La grabación de la copia no es válida.');const bytes=Uint8Array.from(atob(work.recording.base64),c=>c.charCodeAt(0));work.audio=new Blob([bytes],{type:work.recording.type});delete work.recording;}return validateCreation(work);});
}
