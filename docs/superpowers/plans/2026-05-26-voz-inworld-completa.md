# Voz Inworld Completa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Incorporar la voz Inworld elegida para todos los mensajes hablados de la app como audio estatico compatible con GitHub Pages.

**Architecture:** Los textos de voz fijos se centralizan y un catalogo asigna claves a pantallas, resultados y los 88 juegos. Un script de generacion crea MP3 estaticos con Inworld; el reproductor del navegador usa esos MP3 y recurre a `speechSynthesis` solo si falta un recurso.

**Tech Stack:** React, Vite, Node.js, Inworld TTS REST, MP3, `node:test`.

---

### Task 1: Catalogo completo de lineas

**Files:**
- Modify: `src/data/voiceScripts.js`
- Create: `src/data/adriAudioCatalog.js`
- Create: `tests/adriAudioCatalog.test.mjs`

- [ ] Escribir un test que exija claves unicas para pantallas, resultados y cada `game.id`, y verificar que falla al no existir el catalogo.
- [ ] Implementar los textos fijos y `voiceLines` combinando esos textos con `levelsById`.
- [ ] Ejecutar `node --test tests\adriAudioCatalog.test.mjs` y comprobar que pasa.

### Task 2: Generacion Inworld en MP3

**Files:**
- Create: `scripts/generate-inworld-library.mjs`
- Create: `tests/inworldLibrary.test.mjs`

- [ ] Escribir tests que exijan `audioEncoding: "MP3"`, `modelId: "inworld-tts-2"`, `deliveryMode: "CREATIVE"` y `speakingRate: 1.08`.
- [ ] Implementar generacion secuencial de `public/audio/adri/<clave>.mp3` reutilizando la voz publicada localmente.
- [ ] Ejecutar los tests y, una vez verdes, generar los audios mediante la clave de entorno local.

### Task 3: Reproductor y componentes

**Files:**
- Modify: `src/components/audio.js`
- Modify: `src/components/VoiceGuide.jsx`
- Modify: `src/components/Home.jsx`
- Modify: `src/components/LevelSelect.jsx`
- Modify: `src/components/Collection.jsx`
- Modify: `src/components/ProgressProfile.jsx`
- Modify: `src/components/Settings.jsx`
- Modify: `src/components/RewardScreen.jsx`
- Modify: `src/components/GameScreen.jsx`
- Create: `tests/recordedAudio.test.mjs`

- [ ] Escribir test de ruta de audio y claves de resultados, y verificar fallo inicial.
- [ ] Añadir reproduccion MP3 con respaldo `speechSynthesis`.
- [ ] Pasar `audioKey` desde guias, juegos y resultados.
- [ ] Ejecutar todos los tests.

### Task 4: Verificacion local

**Files:**
- Build output only: `dist/`

- [ ] Ejecutar `npm.cmd run build`.
- [ ] Abrir Inicio y una mision en el navegador local y comprobar que los controles siguen visibles y reproducen recursos estaticos.
- [ ] Informar del resultado sin desplegar a GitHub Pages hasta recibir la orden expresa de la usuaria.
