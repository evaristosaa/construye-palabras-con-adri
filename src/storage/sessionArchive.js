const prefix='adri-session-v1:';
export function validateSessionArchive(value={}){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>500||JSON.stringify(value).length>1000000)throw Error('La copia de las partidas no es válida.');
  for(const [key,text] of Object.entries(value)){
    if(!key.startsWith(prefix)||key.length>250||typeof text!=='string'||text.length>300000)throw Error('Una partida de la copia no es válida.');
    let parsed;try{parsed=JSON.parse(text);}catch{throw Error('Una partida no contiene datos válidos.');}
    if(parsed?.version!==1||parsed.data===undefined||parsed.data===null)throw Error('La versión de una partida no es válida.');
    if(key.includes('prepared:')){const data=parsed.data;if(!data||typeof data.id!=='string'||!Array.isArray(data.activities)||!data.activities.length||data.activities.length>6||data.activities.some(a=>!a||typeof a.id!=='string'||typeof a.question!=='string'||typeof a.answer!=='string'||!['choice','order','write','quantity','place-value','syllables','sort'].includes(a.type)))throw Error('El contenido de una misión guardada no es válido.');}
  }
  return {...value};
}
export function collectSessionDrafts(storage){const result={};for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key?.startsWith(prefix))result[key]=storage.getItem(key);}return validateSessionArchive(result);}
export function replaceSessionDrafts(storage,value){
  const next=validateSessionArchive(value),previous=collectSessionDrafts(storage);
  try{for(const key of Object.keys(previous))storage.removeItem(key);for(const [key,text] of Object.entries(next))storage.setItem(key,text);}
  catch(error){try{for(const key of Object.keys(next))storage.removeItem(key);for(const [key,text] of Object.entries(previous))storage.setItem(key,text);}catch{}throw Error('No se han podido recuperar las partidas. Conserva tu archivo de copia.');}
}
