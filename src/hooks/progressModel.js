export const defaultProgress = {
  progressVersion: 2,
  stars: 0,
  pieces: 0,
  completedLevels: [],
  completedGames: [],
  sound: true,
  voice: true,
  streak: 1,
  lastPlayed: null,
};

function uniqueIds(values) {
  return [...new Set(Array.isArray(values) ? values : [])];
}

function migrateLegacyLevels(levels) {
  return uniqueIds(levels).flatMap((levelId) => {
    if (levelId === "vocales") return ["letra-a", "letra-e", "letra-i", "letra-o", "letra-u"];
    if (levelId === "letra-n") return ["letra-n", "letra-enye"];
    return [levelId];
  }).filter((levelId, index, values) => values.indexOf(levelId) === index);
}

export function normalizeProgress(saved = {}) {
  const completedGames = uniqueIds(saved.completedGames);
  const completedLevels = saved.progressVersion === 2
    ? uniqueIds(saved.completedLevels)
    : migrateLegacyLevels(saved.completedLevels);

  return {
    ...defaultProgress,
    ...saved,
    progressVersion: 2,
    completedGames,
    completedLevels,
    pieces: completedGames.length,
  };
}

export function awardGameCompletion(current, gameId, { stars = 1 } = {}) {
  const progress = normalizeProgress(current);
  const alreadyCompleted = progress.completedGames.includes(gameId);
  const completedGames = alreadyCompleted ? progress.completedGames : [...progress.completedGames, gameId];

  return {
    ...progress,
    stars: progress.stars + (alreadyCompleted ? 0 : stars),
    pieces: completedGames.length,
    completedGames,
    lastPlayed: new Date().toISOString(),
  };
}

export function awardLevelCompletion(current, levelId) {
  const progress = normalizeProgress(current);
  const alreadyCompleted = progress.completedLevels.includes(levelId);

  return {
    ...progress,
    completedLevels: alreadyCompleted ? progress.completedLevels : [...progress.completedLevels, levelId],
    stars: progress.stars + (alreadyCompleted ? 0 : 3),
    lastPlayed: new Date().toISOString(),
  };
}
