# Construye ideas con Adri · 1.º de Primaria

App educativa para acompañar a Adrián en 1.º de Primaria con Lengua, Matemáticas y Conocimiento del Medio.

## Recorrido de Primaria

24 misiones, ocho por materia, y 144 retos con dos ejemplos cada uno: 288 presentaciones de elegir, ordenar, escribir, clasificar dibujos, resolver con fichas, construir decenas y contar sílabas con palmadas. Tres etapas orientativas permiten avanzar a su ritmo. La portada abre `/primaria`; el abecedario anterior sigue disponible en `/niveles` como repaso.

«Jugar con amigos» abre una aventura de tres retos, uno de cada materia, priorizando repaso pendiente. Las actividades de Matemáticas incluyen un tablero de veinte fichas y todos los retos permiten pedir una pista sin registrar un error. El repaso inmediato sale de la prioridad tras dos aciertos consecutivos. Los repasos posteriores se programan a 1, 3 y 7 días; repetir en la misma fecha no alarga el intervalo. Comparativa y decisiones de diseño: [docs/comparativa-apps-primaria.md](docs/comparativa-apps-primaria.md).

Cada reto nuevo suma una pieza y una estrella; cada misión nueva añade tres estrellas. El progreso de Primaria se guarda en `primaryCompletedLevels` y los intentos en `primaryAttempts`, dentro del objeto de progreso existente. No se borran los logros del abecedario. Las actividades retomadas empiezan en el primer reto pendiente.

Las ayudas usan 275 grabaciones con la nueva voz de Adri, generadas localmente a partir de la referencia real aprobada. La intro conserva exactamente la toma aceptada; menús, las tres materias, cuentos, talleres y abecedario usan el perfil `adri-approved-v1`. El proceso y la comprobación se documentan en [docs/voz-adri-completa.md](docs/voz-adri-completa.md). En Primaria explican qué hacer sin leer la respuesta correcta. «Mis logros» muestra un álbum completo sin páginas: Lengua, Matemáticas, Mi mundo, Juegos de mates y las 27 letras. Las 63 pegatinas distinguen lo conseguido, lo empezado y lo pendiente; un acceso propone la siguiente recompensa. «Familia» reúne lectura, sonido, repaso y datos, sin duplicar el panel de logros. Los enlaces antiguos de Progreso y Construcciones redirigen a Mis logros. Cada acierto muestra una explicación específica; 24 consejos hablados por unidad usan la voz elegida. El botón Aa facilita lectura por frases y hay letra redonda, tamaño grande y pistas iniciales opcionales.

Contenido, referencias educativas y límites de esta selección: [docs/primaria.md](docs/primaria.md). Instalación y generación de voz local: [docs/voz-local.md](docs/voz-local.md).

Además, Lengua incluye «Crear cuento», un taller libre con 27 combinaciones iniciales, sin calificaciones ni premios. Las misiones proponen continuar fuera de la pantalla. La segunda revisión y las prioridades de contenido están en [docs/analisis-jugabilidad-primaria.md](docs/analisis-jugabilidad-primaria.md).

Matemáticas incorpora «Juegos de mates» en `/primaria/mates`: seis recorridos originales de tres retos con cantidades hasta 10 o 20 y un cierre para contar cómo se ha resuelto. Incluye recta numérica, composición en dos grupos, patrones, medida, datos y figuras. Empieza hasta 10 y recomienda continuar o repasar sin duplicar premios. El análisis del programa usado en el colegio y su adaptación están en [docs/emat-y-adaptacion.md](docs/emat-y-adaptacion.md). La extensión a las demás materias se detalla a continuación.

El enfoque práctico se extiende a todas las materias: Lengua y Medio ofrecen «Juegos variados» en `/primaria/taller/lengua` y `/primaria/taller/medio`. Cada recorrido alterna tres temas, incluye una actividad central de construir, clasificar u ordenar, y prioriza dificultades, repasos y retos pendientes. Todas las misiones de Primaria terminan con una reflexión adaptada a la materia y una propuesta fuera de la pantalla. El taller de cuentos permite elegir a **Adri, Juan y Cayetana**; se accede desde Juegos de Lengua → Crear cuento. Se conserva el progreso y la referencia de voz. Con las guías de las aventuras hay **275 audios locales**.

Las misiones tienen metas narrativas y una construcción que crece con los aciertos: biblioteca del zorro, puente del robot y jardín de la rana. Mi obra abre un visor opcional con explicación hablada. Las 24 misiones tienen un propósito relacionado con su tema; reanudar y repetir conserva los premios anteriores. Detalles: [docs/aventuras-construcciones.md](docs/aventuras-construcciones.md).

## Arquitectura general

Adri, Juan y Cayetana tienen personajes de cómic: se eligen en los cuentos y se alternan como acompañantes de los retos. La portada tiene una bienvenida propia (`home-welcome`) que invita a aprender jugando con los tres; la guía de Misiones conserva `primary-intro`. Los dibujos de los amigos se guardan en `public/assets/characters/`; referencias, prompts y comprobaciones en [docs/personajes-clase.md](docs/personajes-clase.md).

La revisión visual añade tres mundos ilustrados propios, tarjetas de materias con escenas, ambientación de misiones y talleres, pictogramas en conjuntos completos de respuestas y celebraciones breves. Las imágenes se reutilizan localmente y suman 0,93 MB. Referencias, recursos, prompts y comprobaciones: [docs/mundos-visuales-primaria.md](docs/mundos-visuales-primaria.md).

La app es una SPA creada con React + Vite y preparada como web estática para GitHub Pages. Usa `HashRouter` para que las rutas funcionen al recargar la página en Pages. Toda la lógica vive en el navegador: no hay backend, Firebase, APIs de pago ni base de datos externa.

## Estructura de carpetas

- `src/main.jsx`: arranque de React, router y registro opcional de PWA.
- `src/App.jsx`: rutas principales y composición de pantallas.
- `src/data/learningData.js`: módulos, niveles, palabras, frases y juegos.
- `src/data/primaryData.js`: las 24 misiones y las reglas de respuesta de Primaria.
- `src/data/primaryVoiceLines.js`: ayudas de audio compartidas por tipo de actividad.
- `src/components/PrimaryHub.jsx`, `PrimaryGame.jsx`, `Achievements.jsx`: recorrido, juegos y logros de Primaria.
- `src/data/primaryExtensions.js`, `primaryPractice.js`: explicaciones, ejemplos alternativos y selección de repasos.
- `src/components/PictureSort.jsx`, `ReadingSupport.jsx`: clasificación con dibujos y lectura por pasos.
- `src/components/ManipulativeGames.jsx`, `StoryStudio.jsx`, `src/data/primaryPlayDesign.js`: fichas, valor posicional, palmadas, creación y propuestas fuera de pantalla.
- `src/hooks/useProgress.js`: lectura/escritura de progreso con `localStorage`.
- `src/components/`: pantallas, botones, tarjetas, personaje, minijuegos y recompensas.
- `src/styles/app.css`: diseño responsive, cartoon/cómic, bloques, animaciones y accesibilidad táctil.
- `public/assets/`: imágenes locales de Adri y referencia visual.
- `public/manifest.webmanifest` y `public/sw.js`: PWA opcional.

## Componentes principales

- `Home`: portada con Adri, bocadillo y botones grandes.
- `LevelSelect`: mapa de misiones con bloques desbloqueados.
- `GameScreen`: motor sencillo de minijuegos.
- `RewardScreen`: estrellas, piezas y desbloqueos.
- `Collection`: construcciones hechas con piezas.
- `ProgressProfile`: perfil, racha, estrellas, piezas y niveles completados.
- `Characters`: variantes desbloqueables de Adri.
- `Settings`: sonido, voz y reinicio de progreso.

## Guardado de progreso

El hook `useProgress` guarda un único objeto JSON en `localStorage` bajo la clave `adri-reading-progress-v1`. Incluye estrellas, piezas, niveles completados, construcciones, personajes desbloqueados, sonido, voz y racha.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite, normalmente `http://localhost:5173`.

## Crear build

```bash
npm run build
npm run preview
```

## Crear repositorio GitHub

1. Crea un repositorio nuevo llamado `construye-palabras-con-adri`.
2. En `package.json`, revisa que `homepage` apunte a tu usuario de GitHub.
3. En terminal:

```bash
git init
git add .
git commit -m "Crear app Construye palabras con Adri"
git branch -M main
git remote add origin https://github.com/evaristosaa/construye-palabras-con-adri.git
git push -u origin main
```

## Desplegar en GitHub Pages

Opción con script:

```bash
npm run deploy
```

Después entra en GitHub, abre `Settings > Pages` y selecciona la rama `gh-pages`.

Opción con GitHub Actions:

1. Ejecuta `npm run build`.
2. Sube el proyecto a GitHub.
3. Configura Pages para publicar la carpeta generada por tu flujo de build.

## Plan y primera aventura

El [plan de mejoras](docs/plan-mejoras-primaria.md) deriva de la [revisión de aplicaciones educativas](docs/revision-apps-primaria-2026-10-26.md). La primera entrega incluye **La merienda de Adri, Juan y Cayetana**, accesible desde Inicio: un minicuento narrado, lectura de una nota, reparto de cantidades y una secuencia de higiene.

La partida continúa después de recargar. Familia → Datos permite exportar y recuperar una copia del progreso. En producción, Familia → Sin conexión descarga Inicio y La merienda; el resto de materias necesita conexión. Las actualizaciones esperan a que se cierre la app o se apliquen explícitamente desde Familia.

Lengua → Juegos variados → Leer cuentos reúne La merienda y La semilla de Cayetana. Las actividades de lectura permiten escuchar el pasaje por separado de la ayuda. Matemáticas → Juegos variados incluye el puente del diez y un constructor de patrones con piezas que se ponen y se quitan mediante toques. Las palmadas de sílabas tienen un efecto propio que respeta el ajuste de sonido.

Verificación: `node --test tests/*.test.mjs`, `npm run build` y `node scripts/check-voice-assets.mjs URL_DE_LA_APP`. El build genera el manifiesto de recursos offline con sus tamaños y huellas; no se deben editar manualmente los archivos de `dist`.

## Recursos visuales

Las imágenes proporcionadas se usan como inspiración y como activo local de Adri. Las variantes del personaje se construyen con el mismo retrato y accesorios visuales generados con CSS para mantener una app ligera y estática.


### Nuevos talleres y continuidad

- Matemáticas → Juegos variados → **Figuras · Camino · Tienda**: tocar, girar, programar y pagar con varias soluciones; partida y semilla guardadas.
- Misiones → **Mi álbum y diario**: cómic de tres viñetas, dibujo, observación con fecha/tiempo y grabación voluntaria local. Copia del álbum con sus archivos, independiente de la copia de progreso.
- Familia → **Aprendizaje**: práctica por habilidades y apoyos, sin notas ni diagnósticos. **Sin conexión** permite elegir Merienda, Lengua y cuentos, Matemáticas o Medio.
- La voz aprobada conserva sus WAV originales y usa copias MP3 ligeras al reproducir. Ilustraciones WebP; huellas y duraciones en los manifiestos de distribución.

Plan actualizado: [tareas](docs/plan-mejoras-primaria.md). [Decisiones sobre sincronización, app nativa y reconocimiento oral](docs/decisiones-tecnicas-2026-10-27.md). La observación familiar con Adri y el ensayo de habla infantil requieren uso real; no se sustituyen por pruebas automáticas.
