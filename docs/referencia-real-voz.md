# Prueba local con la grabación aportada

El usuario ha adjuntado una grabación para preparar una muestra con el timbre y el acento reales de Adri. La referencia anterior del catálogo era sintética; las dos muestras de VoiceDesign no fueron aprobadas por timbre o acento.

La grabación recibida dura 26,91 segundos a 48 kHz. Dos transcripciones locales permiten seleccionar un fragmento coherente entre 8,6 y 20,4 segundos. El fragmento se convierte a mono a 24 kHz y se ajusta la ganancia solo para evitar saturación al guardarlo. No se altera el tono ni se acelera.

`scripts/preview-reference-voice.py` carga Qwen3-TTS 0.6B Base en float32 y utiliza el audio y su transcripción como referencia de voz. La ejecución usa CPU, cuatro hilos y modo de texto completo. Guarda un WAV nuevo y sus parámetros, sin actualizar el catálogo ni las rutas de la app.

```powershell
.\.venv-voice\Scripts\python.exe -u scripts/preview-reference-voice.py --reference-config tmp/adri-reference-review/reference-config.json
```

El JSON privado contiene `audio`, `startSeconds`, `endSeconds` y `text`. La referencia preparada, el JSON y la muestra permanecen en `tmp/adri-reference-review/`, excluido de Git. La grabación original no se copia a `public/`. Antes de conectar la nueva voz a la app se debe valorar la muestra con el usuario: duración y transcripción automática no certifican naturalidad, parecido ni acento sevillano.

La muestra `home-real-reference-v1.wav` dura 11,6 segundos a 24 kHz; se generó en 83,22 segundos y terminó antes del límite de tokens. Las muestras son finitas, con pico 0,765 y RMS 0,087. Whisper Base transcribe correctamente la frase completa, incluidos Adri, Juan y Cayetana. La valoración auditiva del usuario queda pendiente. Esta prueba no se ha publicado ni conectado a la portada.

El usuario valora esta muestra como «mucho mejor», pero pide algo más de ritmo. Se crea `tmp/adri-reference-review/home-real-reference-v2-ritmo.wav` con FFmpeg `atempo=1.12`: dura 10,36 segundos, mantiene el tono y conserva el original sin cambios. Su pico es 0,763, el RMS 0,087 y las muestras son finitas. El ajuste no regenera el timbre ni sustituye todavía los audios publicados. Parámetros en `preview-reference-v2-ritmo.json`; FFmpeg se utiliza desde `imageio-ffmpeg==0.6.0` del entorno local de voz.

## Intro conectada a la home local

Tras aprobar el tono y pedir un arranque más ágil, el usuario solicita preparar la intro de la portada. Texto: «¡Vamos a jugar! Soy Adri. Con Juan y Cayetana descubriremos palabras, números y un montón de sorpresas. ¿Te apuntas?».

La toma original `home-intro-real-v3.wav` dura 10,96 segundos. Whisper Base reconoce la frase completa y sitúa el final de «Soy Adri» en 2,88 s. Se aplica `atempo=1.20` hasta ese punto y `atempo=1.12` al resto, sin modificar el tono. La versión final dura 9,64 segundos, con pico 0,912, RMS 0,071 y muestras finitas.

Solo la intro generada se conecta a `home-welcome`, con el archivo versionado `public/audio/adri-local/home-intro-adri-v3.wav` para evitar reutilizar el audio anterior en caché. El manifiesto registra su origen como referencia local aprobada; su referencia por defecto sigue correspondiendo a los demás audios sintéticos existentes. No se incluyen la grabación original, su transcripción ni su huella en los metadatos públicos de la intro. Misiones conserva `primary-intro`. La prueba está en la home local y no se ha desplegado esta voz en GitHub Pages. Las 68 pruebas y la compilación pasan.

## Extensión al catálogo completo, 26 de octubre de 2026

Tras aprobar la intro, el usuario solicita usar esa voz en todas las locuciones. Se han conectado las 275 grabaciones con el perfil `adri-approved-v1`, conservando la intro aceptada sin regenerar. Misiones, Ajustes, abecedario, las tres materias, cuentos, consejos y talleres utilizan la misma referencia. Pasan 69 pruebas de la app, 23 pruebas del comprobador, la compilación y las 275 rutas HTTP de audio. El registro de preparación anterior describe la prueba inicial; el estado actual está en [voz-adri-completa.md](voz-adri-completa.md).
