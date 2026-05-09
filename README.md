# Construye palabras con Adri

App web HTML5 educativa para que Adrián, de 6 años, aprenda a leer en español jugando con bloques de construcción.

## Arquitectura general

La app es una SPA creada con React + Vite y preparada como web estática para GitHub Pages. Usa `HashRouter` para que las rutas funcionen al recargar la página en Pages. Toda la lógica vive en el navegador: no hay backend, Firebase, APIs de pago ni base de datos externa.

## Estructura de carpetas

- `src/main.jsx`: arranque de React, router y registro opcional de PWA.
- `src/App.jsx`: rutas principales y composición de pantallas.
- `src/data/learningData.js`: módulos, niveles, palabras, frases y juegos.
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

## Nota visual

Las imágenes proporcionadas se usan como inspiración y como activo local de Adri. Las variantes del personaje se construyen con el mismo retrato y accesorios visuales generados con CSS para mantener una app ligera y estática.
