import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const samplesDirectory = path.resolve("tmp", "inworld-voice-samples");
const outputDirectory = path.resolve("tmp", "inworld-voice-variants");
const publishUrl = (voiceId) =>
  `https://api.inworld.ai/voices/v1/voices/${encodeURIComponent(voiceId)}:publish`;
const synthesisUrl = "https://api.inworld.ai/tts/v1/voice";
const sampleText = "Soy Adri. ¿Te animas a construir palabras conmigo? ¡Vamos a jugar!";

export function buildPublishRequest() {
  return {
    displayName: "Adri - prueba",
    description:
      "Voz infantil ficticia en español para probar la app educativa Construye palabras con Adri.",
    tags: ["adri", "educacion", "espanol", "prueba"],
  };
}

function synthesisRequest(voiceId, text, deliveryMode, speakingRate = 1) {
  return {
    text,
    voiceId,
    modelId: "inworld-tts-2",
    language: "es-ES",
    audioConfig: {
      audioEncoding: "LINEAR16",
      sampleRateHertz: 48000,
      speakingRate,
    },
    deliveryMode,
    applyTextNormalization: "ON",
  };
}

export function buildSynthesisVariants(voiceId) {
  return [
    {
      filename: "adri-natural.wav",
      label: "Natural",
      request: synthesisRequest(voiceId, sampleText, "BALANCED"),
    },
    {
      filename: "adri-alegre.wav",
      label: "Mas alegre",
      request: synthesisRequest(
        voiceId,
        `[habla con alegría juguetona, entusiasmo y una sonrisa; pronuncia muy claro] ${sampleText}`,
        "CREATIVE"
      ),
    },
    {
      filename: "adri-alegre-rapido.wav",
      label: "Mas alegre y un poco mas rapido",
      request: synthesisRequest(
        voiceId,
        `[habla con alegría y energía, a un ritmo un poco más rápido, manteniendo claridad] ${sampleText}`,
        "CREATIVE",
        1.08
      ),
    },
  ];
}

export function readAudioContent(response) {
  return response.audioContent || response.audio || response.audioData;
}

async function requestJson(url, apiKey, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();
  if (!response.ok) {
    const detail = body.message || body.error?.message || JSON.stringify(body);
    throw new Error(`Inworld respondio ${response.status}: ${detail}`);
  }
  return body;
}

async function getChosenDraftVoiceId() {
  const manifest = JSON.parse(
    await readFile(path.join(samplesDirectory, "manifest.json"), "utf8")
  );
  const selected = manifest.files?.[0]?.voiceId;
  if (!selected) throw new Error("No se encuentra el identificador de la muestra 1.");
  return selected;
}

async function loadOrPublishVoice(apiKey) {
  const savedVoicePath = path.join(outputDirectory, "published-voice.json");
  try {
    const savedVoice = JSON.parse(await readFile(savedVoicePath, "utf8"));
    if (savedVoice.voiceId) return savedVoice;
  } catch {
    // The chosen preview has not been published yet.
  }

  const draftVoiceId = await getChosenDraftVoiceId();
  const publishedVoice = await requestJson(publishUrl(draftVoiceId), apiKey, {
    method: "POST",
    body: JSON.stringify(buildPublishRequest()),
  });
  await writeFile(savedVoicePath, `${JSON.stringify(publishedVoice, null, 2)}\n`, "utf8");
  return publishedVoice;
}

async function generateVariants() {
  const apiKey = process.env.INWORLD_API_KEY;
  if (!apiKey) {
    throw new Error("No se encuentra INWORLD_API_KEY en el entorno de esta ejecucion.");
  }

  await mkdir(outputDirectory, { recursive: true });
  const voice = await loadOrPublishVoice(apiKey);
  const variants = buildSynthesisVariants(voice.voiceId);
  const manifest = {
    generatedAt: new Date().toISOString(),
    voiceId: voice.voiceId,
    displayName: voice.displayName,
    files: [],
  };

  for (const variant of variants) {
    const response = await requestJson(synthesisUrl, apiKey, {
      method: "POST",
      body: JSON.stringify(variant.request),
    });
    const audioContent = readAudioContent(response);
    if (!audioContent) {
      throw new Error(`La variante ${variant.label} no contiene audio reconocible.`);
    }
    await writeFile(path.join(outputDirectory, variant.filename), Buffer.from(audioContent, "base64"));
    manifest.files.push({ filename: variant.filename, label: variant.label });
  }

  await writeFile(
    path.join(outputDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  console.log(`Voz publicada: ${voice.displayName || "Adri - prueba"}`);
  manifest.files.forEach(({ filename, label }) => console.log(`- ${label}: ${filename}`));
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  generateVariants().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
