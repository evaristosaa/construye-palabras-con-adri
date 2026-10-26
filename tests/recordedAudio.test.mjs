import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { getRecordedAudioSrc } from "../src/components/audio.js";
import { voiceLines } from "../src/data/adriAudioCatalog.js";
import { primaryVoiceTexts } from "../src/data/primaryVoiceLines.js";
import { voiceCatalog } from "../src/data/voiceCatalog.js";

test("home welcomes all three friends with its own recording, separate from the mission guide", () => {
  const home = getRecordedAudioSrc("home-welcome");
  assert.notEqual(home, getRecordedAudioSrc("primary-intro"));
  const manifest = JSON.parse(readFileSync(new URL("../public/audio/adri-local/manifest.json", import.meta.url), "utf8"));
  const entry = manifest.files.find(line => line.key === "home-welcome");
  assert.equal(entry.reusedApprovedHome, true);
  assert.equal(entry.sha256, createHash("sha256").update(readFileSync(new URL("../public/audio/adri-local/home-intro-adri-v3.wav", import.meta.url))).digest("hex"));
  assert.equal(entry?.text, primaryVoiceTexts["home-welcome"]);
  assert.notEqual(entry.text, primaryVoiceTexts["primary-intro"]);
  for (const name of ["Adri", "Juan", "Cayetana"]) assert.ok(entry.text.includes(name));
  assert.ok(entry.durationSeconds > 3 && entry.durationSeconds < 25);
  assert.equal(readFileSync(new URL(`../public${home}`, import.meta.url)).subarray(0, 4).toString(), "RIFF");
});

test("constructs GitHub Pages-safe paths for Adri recorded audio", () => {
  assert.equal(
    getRecordedAudioSrc("game-letra-a-letter", "/construye-palabras-con-adri/"),
    "/construye-palabras-con-adri/audio/adri-local/adri-v1-game-letra-a-letter.wav"
  );
});

test("home and settings use the approved voice while original assets remain recoverable", () => {
  const base = "/construye-palabras-con-adri/";
  assert.equal(getRecordedAudioSrc("screen-home", base), `${base}audio/adri-local/adri-v1-screen-home.wav`);
  assert.equal(getRecordedAudioSrc("screen-settings-sample", base), `${base}audio/adri-local/adri-v1-screen-settings-sample.wav`);
  for (const key of ["screen-home", "screen-settings-sample"])
    assert.ok(statSync(new URL(`../public/audio/adri/${key}.mp3`, import.meta.url)).size > 44);
});

test("every instruction resolves to an existing recording", () => {
  for (const line of voiceLines) {
    const source = getRecordedAudioSrc(line.key);
    const file = new URL(`../public${source}`, import.meta.url);
    assert.ok(statSync(file).size > 44, `Missing or empty audio: ${line.key}`);
  }
});

test("every catalog recording uses the approved Adri profile and matches its verified asset", () => {
  const manifest = JSON.parse(readFileSync(new URL("../public/audio/adri-local/manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.voiceProfile, "adri-approved-v1");
  assert.equal(manifest.referenceOrigin, "user-approved-local-reference");
  assert.equal(manifest.files.length, voiceCatalog.length);
  assert.equal(new Set(manifest.files.map(entry=>entry.key)).size, voiceCatalog.length);
  assert.equal("referenceSha256" in manifest, false);
  assert.equal("referenceText" in manifest, false);
  for (const line of voiceCatalog) {
    const entry=manifest.files.find(file=>file.key===line.key);
    assert.equal(entry?.text,line.text,line.key);
    assert.equal(entry.referenceOrigin,"user-approved-local-reference",line.key);
    assert.ok(["pass","approved-home","pass-second-asr","phonetic-equivalent"].includes(entry.verification),line.key);
    const source=getRecordedAudioSrc(line.key);
    assert.equal(source,`/audio/adri-local/${entry.filename}`,line.key);
    const bytes=readFileSync(new URL(`../public${source}`,import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"),entry.sha256,line.key);
    assert.equal("referenceText" in entry,false,line.key);
    assert.equal("referenceSha256" in entry,false,line.key);
  }
});
