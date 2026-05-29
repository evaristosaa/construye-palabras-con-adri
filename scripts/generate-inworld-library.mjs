import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { voiceLines } from "../src/data/adriAudioCatalog.js";

const outputDirectory = path.resolve("public", "audio", "adri");
const publishedVoicePath = path.resolve("tmp", "inworld-voice-variants", "published-voice.json");
const synthesisUrl = "https://api.inworld.ai/tts/v1/voice";

export function recordedText(text) {
  return text;
}

export function shouldReuseRecording(line, previousTexts) {
  return previousTexts.get(line.key) === line.text;
}

export function buildLibraryRequest(voiceId, text) {
  return {
    text: `[habla con alegría y energía, a un ritmo un poco más rápido, manteniendo claridad] ${recordedText(text)}`,
    voiceId,
    modelId: "inworld-tts-2",
    language: "es-ES",
    audioConfig: {
      audioEncoding: "MP3",
      sampleRateHertz: 48000,
      speakingRate: 1.08,
    },
    deliveryMode: "CREATIVE",
    applyTextNormalization: "ON",
  };
}

function audioContent(response) {
  return response.audioContent || response.audio || response.audioData;
}

async function synthesize(apiKey, voiceId, text) {
  const response = await fetch(synthesisUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildLibraryRequest(voiceId, text)),
  });
  const body = await response.json();
  if (!response.ok) {
    const detail = body.message || body.error?.message || JSON.stringify(body);
    throw new Error(`Inworld respondio ${response.status}: ${detail}`);
  }
  const encodedAudio = audioContent(body);
  if (!encodedAudio) throw new Error("Inworld no devolvio audio reconocible.");
  return Buffer.from(encodedAudio, "base64");
}

async function exists(filepath) {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function existingTexts() {
  try {
    const manifest = JSON.parse(await readFile(path.join(outputDirectory, "manifest.json"), "utf8"));
    return new Map((manifest.files || []).map((line) => [line.key, line.text]));
  } catch {
    return new Map();
  }
}

async function generateLibrary() {
  const apiKey = process.env.INWORLD_API_KEY;
  if (!apiKey) throw new Error("No se encuentra INWORLD_API_KEY en el entorno de esta ejecucion.");

  const publishedVoice = JSON.parse(await readFile(publishedVoicePath, "utf8"));
  if (!publishedVoice.voiceId) throw new Error("No se encuentra la voz publicada de Adri.");

  const force = process.argv.includes("--force");
  const previousTexts = await existingTexts();
  const manifest = {
    generatedAt: new Date().toISOString(),
    displayName: publishedVoice.displayName,
    files: [],
  };

  await mkdir(outputDirectory, { recursive: true });
  for (const [index, line] of voiceLines.entries()) {
    const target = path.join(outputDirectory, line.filename);
    if (!force && shouldReuseRecording(line, previousTexts) && await exists(target)) {
      manifest.files.push({ ...line, status: "reused" });
      console.log(`[${index + 1}/${voiceLines.length}] Reutilizado ${line.filename}`);
      continue;
    }
    const bytes = await synthesize(apiKey, publishedVoice.voiceId, line.text);
    await writeFile(target, bytes);
    manifest.files.push({ ...line, status: "generated" });
    console.log(`[${index + 1}/${voiceLines.length}] Generado ${line.filename}`);
  }

  await writeFile(
    path.join(outputDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  console.log(`Biblioteca de Adri lista: ${voiceLines.length} audios.`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  generateLibrary().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
