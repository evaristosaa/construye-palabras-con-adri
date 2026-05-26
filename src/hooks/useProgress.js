import { useEffect, useMemo, useState } from "react";
import { characters, rewards } from "../data/learningData";
import { awardGameCompletion, awardLevelCompletion, defaultProgress, normalizeProgress } from "./progressModel";

const STORAGE_KEY = "adri-reading-progress-v1";

function readProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeProgress(JSON.parse(saved)) : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
    setProgress((current) => awardGameCompletion(current, gameId, { stars }));
  }

  function completeLevel(levelId) {
    setProgress((current) => awardLevelCompletion(current, levelId));
  }

  function updateSettings(settings) {
    setProgress((current) => ({ ...current, ...settings }));
  }

  function resetProgress() {
    setProgress(defaultProgress);
  }

  return {
    progress,
    unlockedCharacters,
    completedRewards,
    completeGame,
    completeLevel,
    updateSettings,
    resetProgress,
  };
}
