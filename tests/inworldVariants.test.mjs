import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPublishRequest,
  buildSynthesisVariants,
  readAudioContent,
} from "../scripts/generate-inworld-variants.mjs";

test("publishes the chosen Adri voice with local-friendly metadata", () => {
  assert.deepEqual(buildPublishRequest(), {
    displayName: "Adri - prueba",
    description: "Voz infantil ficticia en español para probar la app educativa Construye palabras con Adri.",
    tags: ["adri", "educacion", "espanol", "prueba"],
  });
});

test("generates a natural, energetic and quicker energetic TTS-2 comparison", () => {
  const variants = buildSynthesisVariants("voice-1");

  assert.equal(variants.length, 3);
  assert.equal(variants[0].request.voiceId, "voice-1");
  assert.equal(variants[0].request.modelId, "inworld-tts-2");
  assert.equal(variants[0].request.language, "es-ES");
  assert.equal(variants[1].request.deliveryMode, "CREATIVE");
  assert.match(variants[1].request.text, /alegr/i);
  assert.match(variants[2].request.text, /rápido/i);
});

test("reads base64 audio from synthesis response", () => {
  assert.equal(readAudioContent({ audioContent: "audio-data" }), "audio-data");
});
