import assert from "node:assert/strict";
import test from "node:test";
import {
  buildVoiceDesignRequest,
  extensionForAudio,
  getAudioContent,
  getPreviews,
} from "../scripts/generate-inworld-samples.mjs";

test("builds a Spanish three-sample Inworld voice design request", () => {
  const request = buildVoiceDesignRequest();

  assert.equal(request.langCode, "ES_ES");
  assert.equal(request.voiceDesignConfig.numberOfSamples, 3);
  assert.match(request.designPrompt, /Spanish-speaking boy/);
  assert.match(request.previewText, /Soy Adri/);
});

test("selects a useful extension for preview audio bytes", () => {
  assert.equal(extensionForAudio(Buffer.from("RIFF0000WAVE")), ".wav");
  assert.equal(extensionForAudio(Buffer.from("ID3test")), ".mp3");
});

test("reads preview voices returned by the Inworld design endpoint", () => {
  const previews = [{ voiceId: "voice-one" }];

  assert.deepEqual(getPreviews({ previewVoices: previews }), previews);
});

test("reads preview audio returned by Inworld voice design", () => {
  assert.equal(getAudioContent({ previewAudio: "encoded-audio" }), "encoded-audio");
});
