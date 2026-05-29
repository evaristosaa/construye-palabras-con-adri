import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLibraryRequest,
  recordedText,
  shouldReuseRecording,
} from "../scripts/generate-inworld-library.mjs";

test("builds the chosen lively and faster MP3 synthesis request", () => {
  const request = buildLibraryRequest("adri-voice-id", "Toca la letra B.");
  assert.equal(request.voiceId, "adri-voice-id");
  assert.equal(request.modelId, "inworld-tts-2");
  assert.equal(request.deliveryMode, "CREATIVE");
  assert.equal(request.audioConfig.audioEncoding, "MP3");
  assert.equal(request.audioConfig.speakingRate, 1.08);
  assert.match(request.text, /energ/i);
});

test("keeps audio directions separate from the spoken catalog text", () => {
  assert.equal(recordedText("Toca la letra B."), "Toca la letra B.");
});

test("only reuses an existing recording while its spoken text is unchanged", () => {
  const previous = new Map([["game-letra-m-letter", "Toca la letra M."]]);

  assert.equal(
    shouldReuseRecording({ key: "game-letra-m-letter", text: "Toca la letra M." }, previous),
    true
  );
  assert.equal(
    shouldReuseRecording({ key: "game-letra-m-letter", text: "Ahora toca la M." }, previous),
    false
  );
});
