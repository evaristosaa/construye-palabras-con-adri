import assert from "node:assert/strict";
import test from "node:test";
import { getRecordedAudioSrc } from "../src/components/audio.js";

test("constructs GitHub Pages-safe paths for Adri recorded audio", () => {
  assert.equal(
    getRecordedAudioSrc("screen-home", "/construye-palabras-con-adri/"),
    "/construye-palabras-con-adri/audio/adri/screen-home.mp3"
  );
});
