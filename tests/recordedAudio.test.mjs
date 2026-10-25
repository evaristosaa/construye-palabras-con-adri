import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { getRecordedAudioSrc } from "../src/components/audio.js";
import { voiceLines } from "../src/data/adriAudioCatalog.js";

test("constructs GitHub Pages-safe paths for Adri recorded audio", () => {
  assert.equal(
    getRecordedAudioSrc("game-vocales-letter", "/construye-palabras-con-adri/"),
    "/construye-palabras-con-adri/audio/adri/game-vocales-letter.mp3"
  );
});

test("keeps the original home and settings recordings available", () => {
  const base = "/construye-palabras-con-adri/";
  assert.equal(getRecordedAudioSrc("screen-home", base), `${base}audio/adri/screen-home.mp3`);
  assert.equal(getRecordedAudioSrc("screen-settings-sample", base), `${base}audio/adri/screen-settings-sample.mp3`);
});

test("every instruction resolves to an existing recording", () => {
  for (const line of voiceLines) {
    const source = getRecordedAudioSrc(line.key);
    const file = new URL(`../public${source}`, import.meta.url);
    assert.ok(statSync(file).size > 44, `Missing or empty audio: ${line.key}`);
  }
});

test("local instructions use the selected collection recording as their reference", () => {
  const reference = readFileSync(new URL("../public/audio/adri/screen-collection.mp3", import.meta.url));
  const manifest = JSON.parse(readFileSync(new URL("../public/audio/adri-local/manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.referenceSha256, createHash("sha256").update(reference).digest("hex"));
});
