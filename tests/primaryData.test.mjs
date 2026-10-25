import assert from "node:assert/strict";
import test from "node:test";
import { primarySubjects, primaryMissions, primaryActivityCount, assembledPrimaryAnswer, isPrimaryAnswerCorrect, getPrimaryRecommendation } from "../src/data/primaryData.js";
import { primaryVoiceTexts, primaryAudioKey } from "../src/data/primaryVoiceLines.js";

test("offers three subjects, 24 missions and 144 distinct activities", () => {
  assert.equal(primarySubjects.length, 3);
  assert.equal(primaryMissions.length, 24);
  assert.equal(primaryActivityCount, 144);
  assert.equal(new Set(primaryMissions.flatMap(mission => mission.activities.map(activity => activity.id))).size, 144);
  for (const subject of primarySubjects) {
    assert.equal(primaryMissions.filter(mission => mission.subject === subject.id).length, 8);
  }
});

function permutations(indices) {
  return indices.length ? indices.flatMap((index, position) => permutations(indices.filter((_, other) => position !== other)).map(rest => [index, ...rest])) : [[]];
}

test("every challenge has a valid answer, a useful hint and a recorded help instruction", () => {
  for (const mission of primaryMissions) {
    assert.equal(mission.activities.length, 6);
    for (const activity of mission.activities) {
      assert.ok(activity.question && activity.hint && activity.answer, activity.id);
      assert.ok(primaryVoiceTexts[primaryAudioKey(activity, mission.subject)], activity.id);
      if (activity.type === "choice") {
        assert.equal(new Set(activity.options).size, activity.options.length, activity.id);
        assert.equal(activity.options.filter(option => isPrimaryAnswerCorrect(activity, option)).length, 1, activity.id);
      }
      if (activity.type === "order") {
        const orders = permutations(activity.pieces.map((_, index) => index));
        assert.ok(orders.some(indices => assembledPrimaryAnswer(activity, indices) === activity.answer), activity.id);
      }
    }
  }
});

test("answer checking handles whitespace but still teaches the initial capital", () => {
  assert.ok(isPrimaryAnswerCorrect({type:"write", answer:"sol"}, " SOL "));
  assert.ok(isPrimaryAnswerCorrect({type:"write", answer:"Ana", caseSensitive:true}, "Ana"));
  assert.equal(isPrimaryAnswerCorrect({type:"write", answer:"Ana", caseSensitive:true}, "ana"), false);
});

test("recommendations use each subject's own completion history", () => {
  const first = getPrimaryRecommendation("matematicas");
  assert.equal(first.number, 1);
  assert.equal(getPrimaryRecommendation("matematicas", [first.id]).number, 2);
  assert.equal(getPrimaryRecommendation("lengua", [first.id]).number, 1);
  assert.equal(getPrimaryRecommendation("medio", primaryMissions.map(mission => mission.id)), undefined);
});
