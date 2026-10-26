import { useCallback, useEffect, useMemo, useState } from "react";
import { characters, rewards } from "../data/learningData";
import { awardGameWithMissionCompletion, awardLevelCompletion, awardPrimaryCompletion, recordPrimaryAttempt, defaultProgress, normalizeProgress } from "./progressModel";
import { primaryMissions } from "../data/primaryData.js";
import { snackId, cleanSnackSession } from "../data/snackAdventure.js";
import { loadStoredProgress, saveStoredProgress, clearStoredProgress, validateProgressSnapshot } from "../storage/progressStorage.js";

function readProgress() {
  try {
    return loadStoredProgress(localStorage);
  } catch {
    return { progress: normalizeProgress(defaultProgress), issue: "El navegador no permite guardar. Puedes exportar una copia desde Familia." };
  }
}

export function useProgress() {
  const [initial] = useState(readProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageIssue, setStorageIssue] = useState(initial.issue || "");

  useEffect(() => {
    try { const result = saveStoredProgress(localStorage, progress); if (!result.ok) setStorageIssue(result.issue); }
    catch { setStorageIssue("El navegador no permite guardar. Exporta una copia desde Familia."); }
  }, [progress]);

  const unlockedCharacters = useMemo(
    () => characters.filter((character) => progress.pieces >= character.unlock).map((character) => character.id),
    [progress.pieces]
  );

  const completedRewards = useMemo(
    () => rewards.filter((reward) => progress.pieces >= reward.pieces).map((reward) => reward.id),
    [progress.pieces]
  );

  function completeGame(gameId, { stars = 1 } = {}) {
    setProgress((current) => awardGameWithMissionCompletion(current, gameId, primaryMissions, { stars }));
  }

  function completeLevel(levelId) {
    setProgress((current) => awardLevelCompletion(current, levelId));
  }

  function completePrimaryMission(missionId, activityIds) {
    setProgress(current => awardPrimaryCompletion(current, missionId, activityIds));
  }

  function attemptPrimaryActivity(activityId, correct, options) {
    setProgress(current => recordPrimaryAttempt(current, activityId, correct, options));
  }

  function updateSettings(settings) {
    setProgress((current) => ({ ...current, ...settings }));
  }

  function resetProgress() {
    let issue="";
    try { clearStoredProgress(localStorage); } catch { issue="El navegador no permite borrar los datos guardados. El reinicio solo afecta a esta sesión."; }
    setProgress(normalizeProgress(defaultProgress));
    setStorageIssue(issue);
  }

  const saveSnackSession = useCallback(session => {
    const cleaned = cleanSnackSession(session);
    setProgress(current => JSON.stringify(current.adventures?.[snackId]) === JSON.stringify(cleaned) ? current : ({ ...current, adventures: { ...current.adventures, [snackId]: cleaned } }));
  }, []);

  function restoreProgress(snapshot) { setProgress(validateProgressSnapshot(snapshot)); setStorageIssue(""); }

  return {
    progress,
    unlockedCharacters,
    completedRewards,
    completeGame,
    completeLevel,
    completePrimaryMission,
    attemptPrimaryActivity,
    updateSettings,
    resetProgress,
    restoreProgress,
    saveSnackSession,
    storageIssue,
  };
}
