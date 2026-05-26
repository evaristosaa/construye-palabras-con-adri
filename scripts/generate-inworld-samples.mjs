import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const apiUrl = "https://api.inworld.ai/voices/v1/voices:design";
const outputDirectory = path.resolve("tmp", "inworld-voice-samples");

export function buildVoiceDesignRequest() {
  return {
    designPrompt:
      "A cheerful Spanish-speaking boy, about eight years old, natural and warm, with clear pronunciation for early readers. Friendly, playful and encouraging.",
    previewText:
      "Soy Adri. ¿Te animas a construir palabras conmigo? ¡Vamos a jugar!",
    langCode: "ES_ES",
    voiceDesignConfig: {
      numberOfSamples: 3,
    },
  };
}

export function extensionForAudio(bytes) {
  const signature = bytes.subarray(0, 12).toString("ascii");
  if (signature.startsWith("RIFF") && signature.includes("WAVE")) return ".wav";
  if (signature.startsWith("ID3") || bytes[0] === 0xff) return ".mp3";
  return ".audio";
}

export function getPreviews(response) {
  return response.previewVoices || response.previews || response.voicePreviews || response.samples || [];
}

export function getAudioContent(preview) {
  return preview.previewAudio || preview.audioContent || preview.audio || preview.audioData || preview.audioBytes;
}

async function generateSamples() {
  const apiKey = process.env.INWORLD_API_KEY;
  if (!apiKey) {
    throw new Error("No se encuentra INWORLD_API_KEY en el entorno de esta ejecucion.");
  }

  const request = buildVoiceDesignRequest();
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const body = await response.json();
  if (!response.ok) {
    const detail = body.message || body.error?.message || JSON.stringify(body);
    throw new Error(`Inworld respondio ${response.status}: ${detail}`);
  }

  const previews = getPreviews(body);
  if (!previews.length) {
    throw new Error(`Inworld no devolvio muestras. Campos recibidos: ${Object.keys(body).join(", ")}`);
  }

  await mkdir(outputDirectory, { recursive: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    prompt: request.designPrompt,
    previewText: request.previewText,
    files: [],
  };

  for (let index = 0; index < previews.length; index += 1) {
    const audioContent = getAudioContent(previews[index]);
    if (!audioContent) {
      throw new Error(`La muestra ${index + 1} no contiene audio reconocible.`);
    }
    const bytes = Buffer.from(audioContent, "base64");
    const filename = `adri-voz-${index + 1}${extensionForAudio(bytes)}`;
    await writeFile(path.join(outputDirectory, filename), bytes);
    manifest.files.push({
      filename,
      voiceId: previews[index].voiceId || previews[index].id || null,
    });
  }

  await writeFile(
    path.join(outputDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  console.log(`Generadas ${manifest.files.length} muestras en ${outputDirectory}`);
  manifest.files.forEach(({ filename }) => console.log(`- ${filename}`));
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  generateSamples().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
