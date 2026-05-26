# Saludo Unico de Adri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reservar la presentacion `Soy Adri` exclusivamente a la pantalla de Inicio.

**Architecture:** Centralizar los guiones fijos de pantallas en un pequeno modulo de datos e importar esas cadenas en los componentes existentes. Mantener la generacion de ejercicios actual, cambiando sus textos de instruccion y protegiendo el comportamiento con una prueba que inspecciona todos los juegos.

**Tech Stack:** React, Vite, Node test runner.

---

### Task 1: Prueba de regresion de guiones

**Files:**
- Create: `tests/voiceScripts.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { homeGreeting, missionInstructions, settingsVoiceSample } from "../src/data/voiceScripts.js";
import { levelsById } from "../src/data/learningData.js";

test("Adri only introduces himself on the home screen", () => {
  assert.match(homeGreeting, /^Soy Adri\./);
  assert.doesNotMatch(missionInstructions, /Soy Adri/i);
  assert.doesNotMatch(settingsVoiceSample, /Soy Adri/i);

  const gameScripts = Object.values(levelsById).flatMap((level) =>
    level.games.map((game) => game.speak)
  );
  gameScripts.forEach((script) => assert.doesNotMatch(script, /Soy Adri/i));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests\voiceScripts.test.mjs`
Expected: FAIL because `src/data/voiceScripts.js` does not yet exist.

### Task 2: Fuente unica de textos y eliminacion del saludo repetido

**Files:**
- Create: `src/data/voiceScripts.js`
- Modify: `src/components/Home.jsx`
- Modify: `src/components/LevelSelect.jsx`
- Modify: `src/components/Settings.jsx`
- Modify: `src/data/learningData.js`

- [ ] **Step 1: Create fixed screen scripts**

```js
export const homeGreeting =
  "Soy Adri. ¿Te animas a construir palabras conmigo? Toca Misiones y empezamos juntos.";
export const missionInstructions =
  "Elige una misión. Cada letra tiene juegos como los del libro: escuchar, buscar sílabas, completar palabras y leer frases.";
export const settingsVoiceSample = "¿Te animas a construir palabras conmigo? Vamos a jugar.";
```

- [ ] **Step 2: Reuse screen scripts and remove game prefix**

Import each fixed text into its corresponding component. In `buildGames`, set the first game's voice text to `Escucha: A. Toca la vocal A.` for Vocales and `Mira bien y toca la letra ${letter}.` for consonants.

- [ ] **Step 3: Run the regression test**

Run: `node --test tests\voiceScripts.test.mjs`
Expected: PASS.

### Task 3: Verification in the browser

**Files:**
- Verify only; no source edits expected.

- [ ] **Step 1: Build the static app**

Run: `npm.cmd run build`
Expected: Vite exits successfully and creates updated assets in `dist`.

- [ ] **Step 2: Inspect the local app**

Open Inicio, Misiones and `/juego/letra-b` in the local preview. Confirm that only Inicio invokes a script beginning `Soy Adri`, while the other screens immediately describe the task.

