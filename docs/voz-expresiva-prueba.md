# Prueba de interpretación expresiva

La bienvenida anterior se generó con Qwen3-TTS 0.6B Base, a partir de la referencia sintética elegida. Ese modo conserva una referencia de timbre, pero no admite instrucciones de emoción. La prueba de servicio Inworld devolvió HTTP 402 por falta de créditos.

Se instala localmente **Qwen3-TTS 1.7B VoiceDesign**, que sí admite instrucciones de interpretación y español, según la [documentación oficial](https://qwen.ai/blog?id=qwen3tts-0115). Es una voz sintética nueva; no es una clonación de los niños. La descripción pide una voz infantil de España, seseo suave de Sevilla, sonrisa, curiosidad en la pregunta, variación de ritmo y claridad. Estas instrucciones no garantizan por sí mismas un acento o una naturalidad concretos: se deben valorar escuchando la muestra.

Los pesos están en `.voice-cache/models/qwen-1.7b-voicedesign`, fuera de Git. El descargador comprueba tamaño y SHA-256 del repositorio oficial y permite reanudar archivos parciales. La CPU disponible es AVX2. La ejecución final usa float32 y cuatro hilos. La primera prueba íntegra en bfloat16 se interrumpió por su lentitud; una segunda ejecución con capas lineales int8 generó un audio que no pasó la comprobación de inteligibilidad. Se descartó. El script usa precisión completa por defecto y registra pasos de generación para seguir el avance; `--int8-experimental` solo permite reproducir el experimento fallido.

```powershell
node scripts/download-local-voice-model.mjs --expressive
.\.venv-voice\Scripts\python.exe -u scripts/preview-expressive-voice.py --full-precision
```

La muestra válida para evaluación y sus instrucciones exactas se guardan en `tmp/expressive-voice/home-expressive-v2.wav` y `tmp/expressive-voice/preview-v2.json`. El script no modifica el catálogo ni la web publicada, de forma que se puede valorar el cambio de timbre antes de extenderlo a toda la app. No usar `home-expressive-v1.wav`: corresponde al experimento int8 descartado.

La versión v2 dura 6,72 segundos y requirió 73,11 segundos de generación, sin incluir la carga del modelo. Es un WAV de 24 kHz, con muestras finitas, pico absoluto 0,751 y RMS 0,086. Una transcripción local con Whisper Tiny reconoce la invitación completa, pero segmenta incorrectamente parte de los nombres propios («Juanica y Etana»). La transcripción no demuestra que el acento o la expresividad sean los deseados: la valoración auditiva del usuario sigue pendiente.

Texto: «¡Eh! ¿Te vienes a jugar? Adri, Juan y Cayetana te esperan. ¡Vamos a descubrir cosas juntos!».

## Valoración del usuario

La muestra v1 sigue sonando artificial y con acento latino. La v2 mejora la naturalidad, pero su timbre y acento no encajan. Ninguna está aprobada para la app. El objetivo sigue siendo un niño de seis años de Sevilla capital, con seseo. La referencia actual del catálogo es sintética; no se ha encontrado en el proyecto un archivo del audio real de Adri. En el historial se conserva una transcripción del audio de la sesión en tiempo real, que no permite recuperar sus características acústicas. El siguiente paso requiere una grabación de referencia auténtica para evaluar el acento antes de regenerar el catálogo.
