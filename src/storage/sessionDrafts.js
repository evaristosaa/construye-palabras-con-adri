import {useEffect,useState} from "react";
const prefix='adri-session-v1:';
export function readSession(key,fallback){try{const text=localStorage.getItem(prefix+key);if(!text||text.length>300000)return fallback;const value=JSON.parse(text);return value&&value.version===1&&value.data!==undefined&&value.data!==null&&((Array.isArray(fallback)&&Array.isArray(value.data))||(!Array.isArray(fallback)&&typeof fallback===typeof value.data))?value.data:fallback;}catch{return fallback;}}
export function writeSession(key,data){try{localStorage.setItem(prefix+key,JSON.stringify({version:1,data}));return true;}catch{if(typeof window!=='undefined')window.dispatchEvent(new Event('adri-draft-error'));return false;}}
export function clearSession(key){try{localStorage.removeItem(prefix+key);}catch{}}

export function useSessionState(key,initial){
  const [value,setValue]=useState(()=>readSession(key,typeof initial==='function'?initial():initial));
  useEffect(()=>{writeSession(key,value);},[key,value]);
  return [value,setValue];
}
