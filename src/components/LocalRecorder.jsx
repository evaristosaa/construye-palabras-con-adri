import {useEffect,useRef,useState} from 'react';
export default function LocalRecorder({audio,onChange,muted=false}){
  const [recording,setRecording]=useState(false),[message,setMessage]=useState(''),[url,setUrl]=useState('');
  const recorder=useRef(null),stream=useRef(null),timer=useRef(null),mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;clearTimeout(timer.current);if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());};},[]);
  useEffect(()=>{if(!audio){setUrl('');return;}const objectURL=URL.createObjectURL(audio);setUrl(objectURL);return()=>URL.revokeObjectURL(objectURL);},[audio]);
  async function start(){
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setMessage('Este navegador no permite grabar. Puedes contar el cuento a alguien.');return;}
    try{stream.current=await navigator.mediaDevices.getUserMedia({audio:true});if(!mounted.current){stream.current.getTracks().forEach(t=>t.stop());return;}
      const r=new MediaRecorder(stream.current),parts=[];recorder.current=r;
      r.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};
      r.onstop=()=>{clearTimeout(timer.current);stream.current?.getTracks().forEach(t=>t.stop());if(mounted.current){setRecording(false);const blob=new Blob(parts,{type:r.mimeType||'audio/webm'});if(blob.size>0&&blob.size<=5*1024*1024){onChange(blob);setMessage('Grabación lista. Pulsa Guardar para conservarla.');}else setMessage('La grabación es demasiado grande. Prueba con una más corta.');}};
      r.onerror=()=>{stream.current?.getTracks().forEach(t=>t.stop());setRecording(false);setMessage('No se ha podido grabar. Puedes intentarlo otra vez.');};
      r.start();setRecording(true);setMessage('Te escuchamos. Máximo un minuto.');timer.current=setTimeout(()=>{if(r.state==='recording')r.stop();},60000);
    }catch{stream.current?.getTracks().forEach(t=>t.stop());setRecording(false);setMessage('No se ha activado el micrófono. El resto del taller sigue disponible.');}
  }
  return <div className="local-recorder"><p>🎙️ Cuenta tu historia. La grabación se guarda solo aquí.</p><div className="piece-tool">{recording?<button className="primary-main-button" onClick={()=>recorder.current?.stop()}>■ Terminar</button>:<button className="primary-secondary-button" onClick={start}>{audio?'Grabar otra vez':'Grabar mi voz'}</button>}{audio&&!recording&&<button className="primary-secondary-button" onClick={()=>{onChange(undefined);setMessage('Grabación quitada. Guarda la obra para confirmar el cambio.');}}>Quitar grabación</button>}</div>{url&&<audio controls src={url} muted={muted}/>}<small role="status">{message}</small></div>;
}
