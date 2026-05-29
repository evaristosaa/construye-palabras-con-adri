# Abecedario Completo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliar la app a las 27 letras españolas mediante un tablero ilustrado de misiones, progreso migrado y voz de Adri para todo el nuevo contenido.

**Architecture:** `learningData.js` sera el origen del catalogo alfabetico y del orden recomendado. `progressModel.js` migrara identificadores antiguos sin perder recompensas; `LevelSelect.jsx` renderizara el tablero. El catalogo y generador de MP3 existente se reutilizaran para producir solo las claves ausentes.

**Tech Stack:** React, Vite, CSS responsive, localStorage, Node `node:test`, Inworld TTS MP3.

---

### Task 1: Catalogo del abecedario

**Files:**
- Modify: `src/data/learningData.js`
- Test: `tests/alphabetCatalog.test.mjs`

- [ ] Escribir pruebas que exijan `27` modulos, `216` juegos y las reglas especiales de `C`, `G`, `Q`, `H`, `Ñ`, `Y`, `X`, `K` y `W`.
- [ ] Ejecutar el test y comprobar que falla con las once misiones actuales.
- [ ] Ampliar el catalogo, exponer `learningOrder` y mantener ocho juegos por letra.
- [ ] Ejecutar el test hasta que pase.

### Task 2: Progreso heredado

**Files:**
- Modify: `src/hooks/progressModel.js`
- Test: `tests/progressModel.test.mjs`

- [ ] Escribir pruebas de migracion para `vocales` y la antigua `letra-n`.
- [ ] Ejecutar la prueba y observar el fallo esperado.
- [ ] Implementar la expansion de niveles antiguos conservando `completedGames` sin duplicar piezas.
- [ ] Ejecutar de nuevo las pruebas de progreso.

### Task 3: Tablero visual y construccion

**Files:**
- Modify: `src/components/LevelSelect.jsx`
- Modify: `src/components/Collection.jsx`
- Modify: `src/components/ProgressProfile.jsx`
- Modify: `src/components/Blocks.jsx`
- Modify: `src/styles/app.css`
- Test: `tests/alphabetCatalog.test.mjs`

- [ ] Extender la prueba con palabras ancla y recomendacion visible derivable.
- [ ] Renderizar casillas de letra, dibujo, palabra, estrella y estado `AHORA`.
- [ ] Ajustar construccion y textos a `27` letras.
- [ ] Verificar visualmente tablet/escritorio y movil.

### Task 4: Voz completa ampliada

**Files:**
- Modify: `src/data/adriAudioCatalog.js`
- Modify: `scripts/generate-inworld-library.mjs`
- Modify/Create: `public/audio/adri/*.mp3`
- Test: `tests/adriAudioCatalog.test.mjs`

- [ ] Actualizar el test para que el catalogo contenga los `216` juegos mas los mensajes globales.
- [ ] Comprobar el fallo frente a los `97` audios actuales.
- [ ] Ejecutar el generador reanudable para crear los audios que falten con el perfil seleccionado.
- [ ] Comprobar claves unicas y presencia de MP3.

### Task 5: Verificacion

**Files:**
- Build output only: `dist/`

- [ ] Ejecutar toda la bateria `node --test tests\*.test.mjs`.
- [ ] Ejecutar `npm.cmd run build`.
- [ ] Abrir Inicio, selector, una letra regular y una especial en navegador local.
- [ ] Mantener los cambios en local hasta una peticion expresa de publicar.
