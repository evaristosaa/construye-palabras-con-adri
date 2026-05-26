# Voz Inworld completa de Adri

## Objetivo

Sustituir la lectura robotica del navegador por audios estaticos de Inworld con la variante elegida por la usuaria: voz infantil alegre y con un ritmo ligeramente mas rapido.

## Alcance

- Generar audio para las 88 actividades de las 11 misiones.
- Generar audio para Inicio, Misiones, Construcciones, Progreso, Ajustes, Recompensa, prueba de voz, acierto y reintento.
- Mantener `Soy Adri` unicamente en el saludo de Inicio.
- No desplegar a GitHub Pages en esta fase.

## Arquitectura

`src/data/voiceScripts.js` centraliza los textos fijos de pantallas y resultados. Un nuevo catalogo puro, `src/data/adriAudioCatalog.js`, asigna una clave estable a cada texto fijo y a cada instruccion de juego (`game-<id>`). El generador Node lee ese catalogo, usa la voz publicada `Adri - prueba` con `inworld-tts-2`, modo `CREATIVE`, ritmo `1.08`, y guarda ficheros `MP3` en `public/audio/adri/`.

En navegador, `src/components/audio.js` intenta reproducir primero el MP3 asociado mediante la clave de audio. Si el fichero no existe o falla la reproduccion, conserva la sintesis de voz actual como respaldo. `VoiceGuide` y `GameScreen` entregan la clave adecuada sin duplicar la logica de reproduccion.

## Peso y compatibilidad

Los audios se sirven como recursos estaticos y solo se descargan al reproducirse. Se usa `MP3` por su compatibilidad con Chrome, Edge y Safari y por ser mas ligero que los WAV empleados en la prueba inicial.

## Pruebas

- El catalogo contiene todas las lineas previstas, con claves y nombres de fichero unicos.
- La peticion de generacion conserva el perfil elegido y formato MP3.
- El reproductor calcula rutas estaticas correctas y recibe claves en pantallas, juegos y mensajes de resultado.
- Se ejecutan tests, build de Vite y comprobacion visual local antes de ofrecer un despliegue.
