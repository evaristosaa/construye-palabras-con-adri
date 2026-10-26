export const defaultProgress = {
  progressVersion: 2,
  stars: 0,
  pieces: 0,
  completedLevels: [],
  completedGames: [],
  primaryCompletedLevels: [],
  primaryAttempts: {},
  adventures: {},
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
    primaryCompletedLevels: uniqueIds(saved.primaryCompletedLevels),
    primaryAttempts: saved.primaryAttempts && typeof saved.primaryAttempts === "object" && !Array.isArray(saved.primaryAttempts) ? saved.primaryAttempts : {},
    adventures: saved.adventures && typeof saved.adventures === "object" && !Array.isArray(saved.adventures) ? saved.adventures : {},
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

// A mission can be finished through its own screen or through mixed practice.
// Award both in one state update, so the last challenge never loses its sticker.
export function awardGameWithMissionCompletion(current, gameId, missions, options) {
  const progress=awardGameCompletion(current,gameId,options);
  const mission=missions.find(m=>m.activities.some(a=>a.id===gameId));
  return mission?awardPrimaryCompletion(progress,mission.id,mission.activities.map(a=>a.id)):progress;
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

export function awardPrimaryCompletion(current, missionId, activityIds) {
  const progress = normalizeProgress(current);
  if (!activityIds.length || !activityIds.every(id => progress.completedGames.includes(id))) return progress;
  const alreadyCompleted = progress.primaryCompletedLevels.includes(missionId);
  return { ...progress,
    primaryCompletedLevels: alreadyCompleted ? progress.primaryCompletedLevels : [...progress.primaryCompletedLevels, missionId],
    stars: progress.stars + (alreadyCompleted ? 0 : 3),
    lastPlayed: new Date().toISOString(),
  };
}

export function recordPrimaryAttempt(current, activityId, correct, { now = new Date(), variantKey = "original" } = {}) {
  const progress = normalizeProgress(current);
  const previous = progress.primaryAttempts[activityId] || { attempts: 0, mistakes: 0 };
  const previousDay = previous.lastCorrectAt ? new Date(previous.lastCorrectAt).toDateString() : null;
  const today = new Date(now).toDateString();
  const reviewStage = correct ? Math.min(3, (previous.reviewStage || 0) + (previousDay === today ? 0 : 1)) : 0;
  const due = new Date(now);
  // Calendar days, not 24-hour durations, so local DST changes do not shift review days.
  due.setDate(due.getDate() + (correct ? [1,1,3,7][reviewStage] : 1));
  due.setHours(0,0,0,0);
  return { ...progress, primaryAttempts: { ...progress.primaryAttempts,
    [activityId]: { ...previous, attempts: previous.attempts + 1, mistakes: previous.mistakes + (correct ? 0 : 1), correctStreak: correct ? (previous.correctStreak || 0) + 1 : 0,
      successes:(previous.successes ?? Math.max(0,previous.attempts-previous.mistakes)) + (correct ? 1 : 0),
      lastAttemptAt:new Date(now).toISOString(), lastCorrectAt:correct ? new Date(now).toISOString() : previous.lastCorrectAt || null,
      lastVariant:variantKey, reviewStage, reviewDue:due.toISOString() },
  } };
}
