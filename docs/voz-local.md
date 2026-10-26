# Voz local de Adri

Estado actual, 26 de octubre de 2026: las 275 locuciones locales utilizan la referencia real aprobada y el perfil `adri-approved-v1`. La intro mantiene la misma toma y el mismo ritmo aceptados. Ver [proceso completo y comprobaciones](voz-adri-completa.md). Las comparaciones y comandos del generador anterior que siguen se conservan como histórico; ese generador bloquea la sustitución del perfil aprobado.

Comparación revisada el 20 de octubre de 2026. El 21 de octubre se seleccionó como voz preferida la grabación **sintética de Inworld de Construcciones**, en lugar de la prueba de Qwen. Se conservan las grabaciones originales de esa voz y se usa la de Construcciones como referencia para completar instrucciones sin audio.

| Alternativa | Ventaja para esta app | Límite práctico |
| --- | --- | --- |
| [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) | Español, diseño de voz y generación desde una referencia; modelos 0.6B y 1.7B; licencia Apache 2.0 | El acento debe evaluarse escuchando; CPU más lenta que GPU |
| [Chatterbox Multilingual](https://github.com/resemble-ai/chatterbox) | Español y reproducción del timbre de una referencia; alternativa de motor | Windows y CPU requieren comprobar dependencias y rendimiento; Turbo y Nano son para inglés |
| [NeuTTS Nano Spanish](https://huggingface.co/neuphonic/neutts-nano-spanish) | Modelo dedicado a español, pensado para CPU y dispositivos pequeños | Requiere cuenta y aceptar condiciones de acceso del modelo, además de eSpeak NG |
| [Spanish-F5](https://github.com/jpgallegoar/Spanish-F5) | Alternativa especializada en español con referencia de voz | Revisar los términos concretos de los pesos; instalación y prueba adicionales |

Selección inicial: Qwen3-TTS 0.6B ejecutado localmente. Las demos públicas de Qwen y Chatterbox devolvieron errores sin detalle al intentar generar frases. Una comprobación posterior con el cliente oficial de Gradio identificó el motivo en Qwen: cuota ZeroGPU agotada (90 segundos solicitados, 0 disponibles). Esto no demuestra que fallen los motores locales.

## Instalación aislada

El entorno está en `.venv-voice`; los pesos, en `.voice-cache/models/qwen-0.6b`. Ambos se excluyen de Git. No se cambia el Python del sistema.

```powershell
.\.venv-voice\Scripts\python.exe -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
.\.venv-voice\Scripts\python.exe -m pip install qwen-tts==0.1.1
node scripts/download-local-voice-model.mjs
```

El descargador consulta el listado oficial del modelo y comprueba el tamaño de cada archivo y la suma SHA-256 de los pesos. Necesita conexión para descargar los pesos; la generación posterior usa modo sin conexión cuando se carga el modelo de la carpeta local.

## Generar

Comprobar el saludo (se reutiliza su grabación original si el texto coincide):

```powershell
.\.venv-voice\Scripts\python.exe scripts/generate-local-voice.py
```

Completar el catálogo: se conservan los MP3 originales cuyo texto coincide y los WAV locales ya generados con el mismo texto, modelo y referencia:

```powershell
.\.venv-voice\Scripts\python.exe scripts/generate-local-voice.py --all
```

La referencia es `public/audio/adri/screen-collection.mp3` y su transcripción está en `reference.json` de esa carpeta. Los archivos nuevos se escriben en `public/audio/adri-local/`, separados de los originales. El generador actualiza `src/data/localVoiceFiles.js` con las frases completadas para que la app las reproduzca. Probar voz conserva su MP3 original de Inworld; la intro actual de la portada se detalla más abajo.

## Prueba realizada

En la prueba inicial del 20 de octubre con Qwen3-TTS 0.6B, CPU con seis hilos y la referencia sintética anterior, el saludo se generó correctamente: 5,5 segundos de audio en 47,7 segundos de generación, sin contar el arranque. Este dato es una medición de una frase, no una estimación fiable de todo el catálogo. Ese saludo experimental ya no está conectado a la portada.

La comprobación `pip check` no detectó dependencias rotas. Las versiones instaladas están registradas en `scripts/voice-requirements.lock.txt`. El aviso de SoX ausente y el de Flash Attention no impidieron generar el saludo en CPU.

## Catálogo con la voz de Construcciones, 21 de octubre

Se han conservado 197 MP3 originales y se han generado las 28 instrucciones que faltaban (Misiones y 27 búsquedas de sílabas), usando `screen-collection.mp3` como referencia. Las nuevas grabaciones suman 12,4 minutos de generación en CPU; duran entre 1,76 y 8,72 segundos cada una.

Las 225 instrucciones del catálogo tienen un archivo de audio disponible. Se verificó por HTTP que las 225 rutas responden con tipo de contenido de audio, y se comprobaron los 28 WAV nuevos: 24 kHz, muestras válidas, sin archivos silenciosos ni picos próximos al recorte. Pasan las 27 pruebas y la compilación de producción.

Para comprobar las rutas con el servidor local arrancado:

```powershell
node scripts/check-voice-assets.mjs
```

## Alcance actual

Las 275 entradas de `src/data/voiceCatalog.js` tienen su grabación con la voz aprobada. Las rutas usan archivos `adri-v1-*.wav`; `home-welcome` reutiliza sin alteraciones el audio de la intro aceptada, mientras que Misiones tiene una locución independiente. Las grabaciones anteriores se conservan para recuperación. La referencia original y su transcripción permanecen fuera de los recursos públicos.

Se han comprobado 275 respuestas HTTP de audio, 69 pruebas de la app, 23 pruebas de validación del texto y la compilación de producción. La compilación para GitHub Pages incluye las mismas 275 grabaciones del catálogo local.

La valoración del tono y del ritmo procede de la muestra aprobada por el usuario. Las transcripciones automáticas comprueban contenido y objetivos de enseñanza; no certifican por sí solas naturalidad o acento en cada frase.
