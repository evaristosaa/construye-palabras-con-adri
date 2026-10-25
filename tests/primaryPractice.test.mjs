import assert from "node:assert/strict";
import test from "node:test";
import { buildPrimaryAdventure, needsPrimaryPractice } from "../src/data/primaryPractice.js";
import { primaryMissions } from "../src/data/primaryData.js";
import { normalizeProgress, recordPrimaryAttempt, awardGameCompletion } from "../src/hooks/progressModel.js";

test("short practice mixes one real activity per subject and keeps the source answers", () => {
  const progress = normalizeProgress();
  const session = buildPrimaryAdventure(progress);
  assert.deepEqual(session.map(a => a.subject), ["lengua", "matematicas", "medio"]);
  assert.equal(new Set(session.map(a => a.id)).size, 3);
  for (const a of session) assert.equal(primaryMissions.flatMap(m => m.activities).find(b => b.id === a.id).answer, a.answer);
});

test("practice prioritizes repeated mistakes, including already completed activities", () => {
  const target = primaryMissions[1].activities[0];
  let progress = normalizeProgress();
  progress = recordPrimaryAttempt(progress, target.id, false);
  progress = recordPrimaryAttempt(progress, target.id, false);
  progress = awardGameCompletion(recordPrimaryAttempt(progress, target.id, true), target.id);
  const session = buildPrimaryAdventure(progress);
  assert.equal(session[0].id, target.id);
  assert.equal(session[0].practice, true);
  assert.equal(progress.primaryCompletedLevels.length, 0);
});

test("two consecutive correct answers clear review priority without erasing history", () => {
  const id = primaryMissions[0].activities[0].id;
  let progress = normalizeProgress({primaryAttempts:{[id]:{attempts:3,mistakes:2}},completedGames:[id],stars:5});
  assert.equal(needsPrimaryPractice(progress.primaryAttempts[id]), true);
  progress = recordPrimaryAttempt(progress,id,true);
  assert.equal(needsPrimaryPractice(progress.primaryAttempts[id]), true);
  progress = recordPrimaryAttempt(progress,id,true);
  assert.equal(needsPrimaryPractice(progress.primaryAttempts[id]), false);
  assert.equal(progress.primaryAttempts[id].mistakes, 2);
  assert.notEqual(buildPrimaryAdventure(progress)[0].id, id);
  assert.equal(progress.stars,5);
  progress = recordPrimaryAttempt(progress,id,false);
  assert.equal(needsPrimaryPractice(progress.primaryAttempts[id]), true);
});

test("completed curriculum remains playable and replay never duplicates rewards", () => {
  const all = primaryMissions.flatMap(m => m.activities.map(a => a.id));
  const progress = normalizeProgress({completedGames:all,stars:20});
  const session = buildPrimaryAdventure(progress);
  assert.equal(session.length,3);
  const replayed = session.reduce((p,a) => awardGameCompletion(p,a.id),progress);
  assert.equal(replayed.stars,20);
  assert.equal(replayed.pieces,all.length);
});
