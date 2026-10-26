import { defaultProgress, normalizeProgress } from "../hooks/progressModel.js";
export const progressStorageKey = "adri-reading-progress-v1";
export const progressBackupKey = `${progressStorageKey}:backup`;
const limit = 2 * 1024 * 1024;
const record = value => value && typeof value === "object" && !Array.isArray(value);
function checkTree(value, depth = 0) {
  if (depth > 20) throw new Error("La copia tiene una estructura no válida.");
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("La copia contiene datos no permitidos.");
    checkTree(child, depth + 1);
  }
}
export function validateProgressSnapshot(value) {
  if (!record(value)) throw new Error("No es una copia de progreso válida.");
  checkTree(value);
  if (value.progressVersion !== undefined && ![1, 2].includes(value.progressVersion)) throw new Error("Esta versión de la copia todavía no es compatible.");
  for (const field of ["completedGames", "completedLevels", "primaryCompletedLevels"]) if (value[field] !== undefined && (!Array.isArray(value[field]) || value[field].length > 10000 || value[field].some(id => typeof id !== "string" || id.length > 150))) throw new Error("La lista de actividades no es válida.");
  for (const field of ["stars", "pieces", "streak"]) if (value[field] !== undefined && (!Number.isSafeInteger(value[field]) || value[field] < 0)) throw new Error("Los contadores de la copia no son válidos.");
  for (const field of ["sound", "voice", "readingGuidance"]) if (value[field] !== undefined && typeof value[field] !== "boolean") throw new Error("Los ajustes de la copia no son válidos.");
  if (value.readingFont !== undefined && !["print", "round"].includes(value.readingFont)) throw new Error("El tipo de letra no es válido.");
  if (value.readingSize !== undefined && !["normal", "large"].includes(value.readingSize)) throw new Error("El tamaño de letra no es válido.");
  if (value.voiceURI !== undefined && typeof value.voiceURI !== "string") throw new Error("El ajuste de voz no es válido.");
  if (value.primaryAttempts !== undefined) {
    if (!record(value.primaryAttempts) || Object.keys(value.primaryAttempts).length > 10000) throw new Error("Los intentos guardados no son válidos.");
    for (const attempt of Object.values(value.primaryAttempts)) {
      if (!record(attempt)) throw new Error("Un intento guardado no es válido.");
      for (const field of ["attempts", "mistakes", "correctStreak", "successes", "reviewStage"]) if (attempt[field] !== undefined && (!Number.isSafeInteger(attempt[field]) || attempt[field] < 0)) throw new Error("Los intentos contienen un contador no válido.");
    }
  }
  if (value.adventures !== undefined && !record(value.adventures)) throw new Error("Las aventuras guardadas no son válidas.");
  return normalizeProgress(value);
}
export function loadStoredProgress(storage) {
  let issue = "";
  for (const key of [progressStorageKey, progressBackupKey]) {
    try {
      const text = storage.getItem(key);
      if (!text) continue;
      if (text.length > limit) throw new Error("Progreso demasiado grande.");
      return { progress: validateProgressSnapshot(JSON.parse(text)), recovered: key === progressBackupKey, issue: key === progressBackupKey ? "Se ha recuperado la copia automática de este dispositivo." : "" };
    } catch { issue = "No se ha podido leer el progreso. Puedes recuperar una copia desde Familia."; }
  }
  return { progress: normalizeProgress(defaultProgress), recovered: false, issue };
}
export function saveStoredProgress(storage, progress) {
  try {
    const text = JSON.stringify(validateProgressSnapshot(progress));
    if (text.length > limit) throw new Error("Progreso demasiado grande.");
    const old = storage.getItem(progressStorageKey);
    if (old === text) return { ok: true };
    let backup = text;
    if (old) { try { validateProgressSnapshot(JSON.parse(old)); backup = old; } catch { /* Do not back up corrupted bytes. */ } }
    try { storage.setItem(progressBackupKey, backup); } catch { /* Saving the main state still takes priority. */ }
    storage.setItem(progressStorageKey, text);
    return { ok: true };
  } catch { return { ok: false, issue: "No se ha podido guardar en este navegador. Exporta una copia desde Familia antes de cerrar." }; }
}
export function clearStoredProgress(storage) {
  let failure;
  for (const key of [progressStorageKey,progressBackupKey]) { try { storage.removeItem(key); } catch(error) { failure=error; } }
  if(failure) throw failure;
}
export function exportProgressBackup(progress, now = new Date()) {
  return JSON.stringify({ format: "adri-progress-backup", version: 1, exportedAt: now.toISOString(), progress: validateProgressSnapshot(progress) }, null, 2);
}
export function importProgressBackup(text) {
  if (typeof text !== "string" || text.length > limit) throw new Error("El archivo es demasiado grande.");
  let backup;
  try { backup = JSON.parse(text); } catch { throw new Error("El archivo no contiene una copia JSON válida."); }
  if (!record(backup) || backup.format !== "adri-progress-backup" || backup.version !== 1) throw new Error("Elige una copia de progreso de esta app.");
  return { progress: validateProgressSnapshot(backup.progress), exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : "" };
}
