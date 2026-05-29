import assert from "node:assert/strict";
import test from "node:test";
import {
  resultAudioKeys,
  screenAudioKeys,
  voiceLines,
} from "../src/data/adriAudioCatalog.js";

test("provides recorded lines for all screens, results and lesson games", () => {
  assert.equal(Object.keys(screenAudioKeys).length, 7);
  assert.deepEqual(Object.keys(resultAudioKeys).sort(), ["retry", "success"]);
  assert.equal(voiceLines.length, 225);
});

test("uses stable unique keys and mp3 filenames for every recorded line", () => {
  const keys = voiceLines.map((line) => line.key);
  const filenames = voiceLines.map((line) => line.filename);
  assert.equal(new Set(keys).size, voiceLines.length);
  assert.equal(new Set(filenames).size, voiceLines.length);
  voiceLines.forEach((line) => {
    assert.ok(line.text.length > 0);
    assert.equal(line.filename, `${line.key}.mp3`);
  });
});
