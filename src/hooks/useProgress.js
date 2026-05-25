import { useEffect, useMemo, useState } from "react";
import { characters, rewards } from "../data/learningData";

const STORAGE_KEY = "adri-reading-progress-v1";

const initialProgress = {
  stars: 0,
  pieces: 0,
  completedLevels: [],
  completedGames: [],
  sound: true,
  voice: true,
  streak: 1,
  lastPlayed: null,
};

function readProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialProgress, ...JSON.parse(saved) } : initialProgress;
  } catch {
    return initialProgress;
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

  function completeGame(gameId, { pieces = 3, stars = 1 } = {}) {
    setProgress((current) => {
      const alreadyCompleted = current.completedGames.includes(gameId);
      return {
        ...current,
        stars: current.stars + (alreadyCompleted ? 0 : stars),
        pieces: current.pieces + (alreadyCompleted ? 0 : pieces),
        completedGames: alreadyCompleted ? current.completedGames : [...current.completedGames, gameId],
        lastPlayed: new Date().toISOString(),
      };
    });
  }

  function completeLevel(levelId) {
    setProgress((current) => ({
      ...current,
      completedLevels: current.completedLevels.includes(levelId)
        ? current.completedLevels
        : [...current.completedLevels, levelId],
      stars: current.stars + 3,
      pieces: current.pieces + 5,
      lastPlayed: new Date().toISOString(),
    }));
  }

  function updateSettings(settings) {
    setProgress((current) => ({ ...current, ...settings }));
  }

  function resetProgress() {
    setProgress(initialProgress);
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
