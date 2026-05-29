import { levelsById } from "./learningData.js";
import {
  collectionGuide,
  homeGreeting,
  missionInstructions,
  progressGuide,
  rewardGuide,
  retryFeedback,
  settingsGuide,
  settingsVoiceSample,
  successFeedback,
} from "./voiceScripts.js";

export const screenAudioKeys = Object.freeze({
  home: "screen-home",
  missions: "",
  collection: "screen-collection",
  progress: "screen-progress",
  settings: "screen-settings",
  settingsSample: "screen-settings-sample",
  reward: "screen-reward",
});

export const resultAudioKeys = Object.freeze({
  success: "result-success",
  retry: "result-retry",
});

export function gameAudioKey(gameId) {
  if (gameId.endsWith("-syllable-hunt")) return "";
  return `game-${gameId}`;
}

function recordedLine(key, text) {
  return { key, filename: `${key}.mp3`, text };
}

const screenVoiceLines = [
  recordedLine(screenAudioKeys.home, homeGreeting),
  recordedLine(screenAudioKeys.collection, collectionGuide),
  recordedLine(screenAudioKeys.progress, progressGuide),
  recordedLine(screenAudioKeys.settings, settingsGuide),
  recordedLine(screenAudioKeys.settingsSample, settingsVoiceSample),
  recordedLine(screenAudioKeys.reward, rewardGuide),
];

const resultVoiceLines = [
  recordedLine(resultAudioKeys.success, successFeedback),
  recordedLine(resultAudioKeys.retry, retryFeedback),
];

const gameVoiceLines = Object.values(levelsById).flatMap((level) =>
  level.games
    .map((game) => {
      const key = gameAudioKey(game.id);
      return key ? recordedLine(key, game.speak || game.prompt) : null;
    })
    .filter(Boolean)
);

export const voiceLines = [...screenVoiceLines, ...resultVoiceLines, ...gameVoiceLines];
