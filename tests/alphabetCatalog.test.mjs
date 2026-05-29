import assert from "node:assert/strict";
import test from "node:test";
import {
  getRecommendedMission,
  learningOrder,
  levelsById,
  modules,
  totalMissions,
} from "../src/data/learningData.js";

const alphabet = [..."ABCDEFGHIJKLMN", "Ñ", ..."OPQRSTUVWXYZ"];

test("offers the complete Spanish alphabet as 27 letter missions", () => {
  assert.equal(totalMissions, 27);
  assert.equal(modules.length, 27);
  assert.deepEqual(modules.map((module) => module.badge), alphabet);
  assert.equal(Object.values(levelsById).flatMap((level) => level.games).length, 216);
});

test("keeps an early-reading recommendation order while displaying alphabetical tiles", () => {
  assert.deepEqual(learningOrder.slice(0, 11), [
    "letra-a", "letra-e", "letra-i", "letra-o", "letra-u",
    "letra-m", "letra-p", "letra-l", "letra-s", "letra-t", "letra-b",
  ]);
  assert.equal(new Set(learningOrder).size, 27);
  assert.equal(getRecommendedMission([]), "letra-a");
  assert.equal(
    getRecommendedMission(["letra-a", "letra-e", "letra-i", "letra-o", "letra-u"]),
    "letra-m"
  );
});

test("includes adapted syllables for special Spanish letter missions", () => {
  assert.deepEqual(levelsById["letra-c"].syllables, ["ca", "co", "cu", "ce", "ci"]);
  assert.deepEqual(levelsById["letra-g"].syllables, ["ga", "go", "gu", "ge", "gi"]);
  assert.deepEqual(levelsById["letra-q"].syllables, ["que", "qui"]);
  assert.deepEqual(levelsById["letra-enye"].syllables.slice(0, 5), ["ña", "ñe", "ñi", "ño", "ñu"]);
  assert.match(levelsById["letra-h"].intro, /no suena/i);
  ["letra-y", "letra-x", "letra-k", "letra-w"].forEach((id) => {
    assert.equal(levelsById[id].games.length, 8);
  });
});

test("every multiple-choice game exposes one valid visible answer", () => {
  Object.values(levelsById).forEach((level) => {
    level.games.filter((game) => Array.isArray(game.options)).forEach((game) => {
      const labels = game.options.map((option) => option.label || option);
      assert.ok(labels.includes(game.answer), `${game.id} must offer its answer`);
      assert.ok(new Set(labels).size >= 2, `${game.id} must offer alternatives`);
    });
  });
});
