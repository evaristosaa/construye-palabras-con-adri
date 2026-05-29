import assert from "node:assert/strict";
import test from "node:test";
import { awardGameCompletion, awardLevelCompletion, normalizeProgress } from "../src/hooks/progressModel.js";

test("normalizes legacy pieces from unique completed games", () => {
  const progress = normalizeProgress({
    pieces: 192,
    stars: 136,
    completedGames: ["letra-b-letter", "letra-b-letter", "letra-b-image"],
    completedLevels: ["letra-b"],
  });

  assert.equal(progress.pieces, 2);
  assert.deepEqual(progress.completedGames, ["letra-b-letter", "letra-b-image"]);
});

test("awards one piece for a newly completed game only", () => {
  const first = awardGameCompletion(normalizeProgress({ completedGames: [] }), "game-1", { stars: 1 });
  const repeated = awardGameCompletion(first, "game-1", { stars: 1 });

  assert.equal(first.pieces, 1);
  assert.equal(repeated.pieces, 1);
  assert.equal(repeated.stars, 1);
});

test("completing a level never adds construction pieces and rewards stars once", () => {
  const start = normalizeProgress({ completedGames: ["game-1"], stars: 1 });
  const finished = awardLevelCompletion(start, "letra-b");
  const replayed = awardLevelCompletion(finished, "letra-b");

  assert.equal(finished.pieces, 1);
  assert.equal(finished.stars, 4);
  assert.equal(replayed.pieces, 1);
  assert.equal(replayed.stars, 4);
});

test("migrates completed vowel and combined N missions to individual alphabet tiles", () => {
  const migrated = normalizeProgress({
    completedLevels: ["vocales", "letra-n", "letra-b"],
    completedGames: ["vocales-letter", "letra-n-letter", "letra-b-letter"],
  });

  assert.deepEqual(migrated.completedLevels, [
    "letra-a", "letra-e", "letra-i", "letra-o", "letra-u",
    "letra-n", "letra-enye", "letra-b",
  ]);
  assert.equal(migrated.pieces, 3);
  assert.deepEqual(migrated.completedGames, ["vocales-letter", "letra-n-letter", "letra-b-letter"]);
});

test("does not confuse a newly completed N mission with the old combined N and Ñ mission", () => {
  const current = normalizeProgress({
    progressVersion: 2,
    completedLevels: ["letra-n"],
  });

  assert.deepEqual(current.completedLevels, ["letra-n"]);
});
