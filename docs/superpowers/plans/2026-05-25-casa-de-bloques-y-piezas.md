# Casa de Bloques y Contador de Piezas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar un maximo real de 88 piezas y una casa de bloques que se completa por las 11 misiones.

**Architecture:** Extraer el calculo canonico de piezas a funciones puras de progreso, usarlas al leer y actualizar `localStorage`, y hacer que la vista de construcciones pinte once capas de bloques activadas por `completedLevels`. La interfaz solo muestra datos derivados del progreso normalizado.

**Tech Stack:** React, Vite, CSS, Node `node:test`.

---

### Task 1: Progreso canonico de piezas

**Files:**
- Create: `src/hooks/progressModel.js`
- Create: `tests/progressModel.test.mjs`
- Modify: `src/hooks/useProgress.js`

- [ ] **Step 1: Write the failing test**

Crear una prueba con un progreso heredado de `pieces: 192` y tres juegos unicos que exija `pieces: 3`, y otra que compruebe que una recompensa de nivel no anade piezas.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/progressModel.test.mjs`
Expected: FAIL porque `progressModel.js` todavia no existe.

- [ ] **Step 3: Write minimal implementation**

Crear `normalizeProgress`, `awardGameCompletion` y `awardLevelCompletion`; deduplicar `completedGames`, obtener `pieces` de su longitud y aplicar bonificacion de estrellas de nivel solo la primera vez.

- [ ] **Step 4: Connect the hook**

Usar las funciones puras al leer progreso y dentro de `completeGame` y `completeLevel`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test tests/progressModel.test.mjs`
Expected: PASS.

### Task 2: Casa de bloques por misiones

**Files:**
- Modify: `src/data/learningData.js`
- Modify: `src/components/Collection.jsx`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Define eleven visual phases**

Actualizar `constructionSteps` a once hitos correspondientes a las once misiones y pintar once capas en `BigConstruction`.

- [ ] **Step 2: Build the block-styled house**

Cambiar la ilustracion por capas de bloques con tetones, tejado escalonado, ventanas, puerta, jardin y bandera, manteniendo estados no construidos discretos.

- [ ] **Step 3: Bind displayed count to normalized pieces**

Mostrar `{progress.pieces}/{constructionGoal} piezas colocadas` y conservar el avance de misiones como control de fases visuales.

### Task 3: Verificacion y publicacion

**Files:**
- Verify: `dist/`
- Publish: `scripts/publish-source-api.mjs`, `scripts/deploy-gh-pages-api.mjs`

- [ ] **Step 1: Build**

Run: `npm.cmd run build`
Expected: Vite compila sin errores.

- [ ] **Step 2: Verify visually**

Abrir `/coleccion` con progreso completo simulado y comprobar escritorio, tablet y movil: `88/88`, casa completa visible y Adri sin tapar la obra.

- [ ] **Step 3: Publish**

Run: `node scripts\publish-source-api.mjs` y `node scripts\deploy-gh-pages-api.mjs`
Expected: GitHub Pages entrega los nuevos assets compilados.
