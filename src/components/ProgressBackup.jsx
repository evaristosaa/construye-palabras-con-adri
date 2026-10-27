import {collectSessionDrafts} from "../storage/sessionArchive.js";
import { useRef, useState } from "react";
import { exportProgressBackup, importProgressBackup } from "../storage/progressStorage.js";
export default function ProgressBackup({ progress, restoreProgress, storageIssue }) {
  const input = useRef(null);
  const [pending, setPending] = useState(null);
  const [message, setMessage] = useState("");
  function download() {try{
    const url = URL.createObjectURL(new Blob([exportProgressBackup(progress,new Date(),collectSessionDrafts(localStorage))], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = `adri-progreso-${new Date().toISOString().slice(0,10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Copia preparada con el progreso y las partidas. El álbum tiene su propia copia.");
    }catch(error){setMessage(error.message);}
  }
  async function choose(event) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("El archivo es demasiado grande.");
      setPending(importProgressBackup(await file.text())); setMessage("");
    } catch (error) { setPending(null); setMessage(error.message); }
  }
  return <div className="progress-backup">
    {storageIssue && <p role="status" className="storage-notice">{storageIssue}</p>}
    <input ref={input} type="file" accept=".json,application/json" hidden onChange={choose}/>
    {pending ? <div className="backup-confirm"><p>La copia tiene <strong>{pending.progress.completedGames.length} retos completados</strong>. Sustituirá el progreso y las partidas de este navegador. El álbum se conserva.</p><div className="backup-actions"><button className="primary-main-button" onClick={() => { try{restoreProgress(pending.progress,pending.sessions); setPending(null); setMessage("Copia recuperada.");}catch(error){setMessage(error.message);} }}>Recuperar copia</button><button className="primary-secondary-button" onClick={()=>setPending(null)}>Cancelar</button></div></div> : <div className="backup-actions"><button className="primary-secondary-button" onClick={download}>Guardar copia</button><button className="primary-secondary-button" onClick={()=>input.current.click()}>Elegir copia</button></div>}
    {message && <p role="status" className="backup-message">{message}</p>}
  </div>;
}
