import { useEffect, useRef, useState } from 'react';

function askWorker(worker, type, onProgress) {
  return new Promise((resolve,reject)=>{
    const channel = new MessageChannel();
    let timer;
    function close() { clearTimeout(timer); channel.port1.close(); }
    function arm() { clearTimeout(timer); timer=setTimeout(()=>{close();reject(Error('No se pudo conectar con la descarga. Cierra y abre la app con conexión.'));},30000); }
    channel.port1.onmessage = ({data}) => {
      arm();
      if(data.type==='progress') onProgress?.(data);
      else { close(); if(data.type==='error') reject(Error(data.message)); else resolve(data); }
    };
    arm(); worker.postMessage({type,fromFamily:type==='ACTIVATE_UPDATE'},[channel.port2]);
  });
}
export default function OfflinePackPanel() {
  const [state,setState]=useState({loading:true}), [busy,setBusy]=useState(false), [message,setMessage]=useState('');
  const mounted=useRef(true);
  useEffect(()=>{
    mounted.current=true;
    if(!import.meta.env.PROD || !('serviceWorker' in navigator)) { setState({unavailable:true}); return; }
    let registration;
    async function refresh() {
      try {
        registration=await navigator.serviceWorker.ready;
        if(registration.waiting) { if(mounted.current)setState({update:true}); return; }
        const status=await askWorker(registration.active,'GET_STATUS');
        if(mounted.current)setState(status);
      } catch(error) { if(mounted.current){setState({});setMessage(error.message);} }
    }
    refresh();
    return ()=>{mounted.current=false;};
  },[]);
  async function download() {
    setBusy(true);setMessage('Preparando la descarga…');
    try {
      const registration=await navigator.serviceWorker.ready;
      if(registration.waiting) {setState({update:true});setMessage('Actualiza antes de descargar esta versión.');return;}
      const status=await askWorker(registration.active,'DOWNLOAD_PACK',data=>setMessage(`Descargando ${data.done} de ${data.total} recursos…`));
      setState(status);setMessage(status.ready?'¡Lista para jugar sin conexión!':'La descarga no está completa. Vuelve a intentarlo.');
    } catch(error) {setMessage(error.message);} finally {setBusy(false);}
  }
  async function update() {
    setBusy(true);
    try {
      const registration=await navigator.serviceWorker.ready;
      if(!registration.waiting) {setMessage('Cierra y abre la app para comprobar la versión.');return;}
      const reload=()=>window.location.reload();
      navigator.serviceWorker.addEventListener('controllerchange',reload,{once:true});
      try {await askWorker(registration.waiting,'ACTIVATE_UPDATE');}
      catch(error) {navigator.serviceWorker.removeEventListener('controllerchange',reload);throw error;}
    } catch(error) {setMessage(error.message);} finally {setBusy(false);}
  }
  return <div className="offline-panel"><h2>Jugar sin conexión</h2><p>Descarga Inicio y <strong>La merienda</strong>, con sus dibujos y la voz de Adri.</p><p className="family-note">Las demás actividades necesitan conexión. El navegador puede liberar descargas si falta espacio; comprueba aquí antes de salir.</p>
    {state.unavailable ? <p>La descarga está disponible en la app publicada.</p> : state.loading ? <p role="status">Comprobando la descarga…</p> : state.update ? <button className="primary-main-button" disabled={busy} onClick={update}>Actualizar desde Familia</button> : <button className="primary-main-button" disabled={busy} onClick={download}>{busy?'Descargando…':state.ready?'Comprobar y descargar de nuevo':'Descargar para jugar'}{state.bytes?` · ${(state.bytes/1048576).toFixed(1)} MB`:''}</button>}
    <p role="status" className="family-note">{message || (state.ready?'✓ Paquete completo y disponible en este navegador.':'')}</p>
  </div>;
}
