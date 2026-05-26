import assert from "node:assert/strict";
import test from "node:test";
import { homeGreeting, missionInstructions, settingsVoiceSample } from "../src/data/voiceScripts.js";
import { levelsById } from "../src/data/learningData.js";

test("Adri only introduces himself on the home screen", () => {
  assert.match(homeGreeting, /^Soy Adri\./);
  assert.doesNotMatch(missionInstructions, /Soy Adri/i);
  assert.doesNotMatch(settingsVoiceSample, /Soy Adri/i);

  const gameScripts = Object.values(levelsById).flatMap((level) =>
    level.games.map((game) => game.speak)
  );

  gameScripts.forEach((script) => assert.doesNotMatch(script, /Soy Adri/i));
});
