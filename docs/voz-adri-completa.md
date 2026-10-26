# Sustitución del catálogo completo por la voz aprobada de Adri

Finalizado el 26 de octubre de 2026: 275 grabaciones conectadas con `adri-approved-v1`, sin incidencias pendientes. Pasan 69 pruebas de la app, 23 del comprobador de texto, la compilación y las 275 rutas HTTP de audio. La intro aprobada se conserva bit a bit. El código y los audios de esta versión están preparados para publicarse juntos en GitHub y GitHub Pages.

El usuario aprueba el timbre generado con su grabación real y el ritmo de la intro de la home, y solicita usarlo en todas las locuciones. El catálogo canónico `src/data/voiceCatalog.js` reúne 275 entradas de menús, abecedario, Primaria, consejos, palabras, talleres y construcciones. La intro aprobada se conserva sin regenerarla.

## Preparación y comprobación

`scripts/generate-approved-voice.py` carga una sola vez Qwen3-TTS 0.6B Base en float32 y reutiliza la misma referencia y transcripción privadas. Guarda el avance tras cada archivo y permite continuar sin repetir los audios terminados. Se probaron lotes de cuatro frases; al detectar algunos audios alargados hasta su límite, la generación restante se hace individualmente con semilla 42, como la intro aprobada. Las frases idénticas pueden reutilizar la misma generación. Usa `atempo=1.12` para conservar el tono con más ritmo; las instrucciones largas tienen un arranque a 1.20. Los archivos nuevos usan el prefijo `adri-v1-` para evitar caché antigua y conservar los originales.

La copia de referencia se conserva en `.voice-cache/references`; la configuración, la transcripción y su huella permanecen en `tmp/approved-voice-job`. Ambas carpetas se excluyen de Git. Los WAV generados se preparan en `public/audio/adri-local/`, pero las rutas activas se mantienen hasta finalizar el catálogo completo. Una comprobación local con Whisper Base revisa texto, duración, saturación y muestras inválidas; las discrepancias quedan pendientes de revisión o regeneración. Una transcripción correcta no certifica por sí sola el acento o la naturalidad; la referencia y el ritmo elegidos proceden de las muestras aprobadas por el usuario.

```powershell
.\.venv-voice\Scripts\python.exe -u scripts/generate-approved-voice.py --reference-config tmp/approved-voice-job/reference-config.json --threads 6 --batch-size 1 --seed 42
.\.venv-voice\Scripts\python.exe -u scripts/validate-approved-voice.py --watch
```

El estado privado está en `tmp/approved-voice-job/state.json` y la comprobación, en `validation.json`. Se pueden regenerar claves concretas con `--only-keys clave1,clave2 --batch-size 1 --seed 142`. Después se vuelve a ejecutar el verificador. Las letras se pronuncian por su nombre español; las sílabas se separan mediante pausas y, en una segunda repetición, se dicen dos veces para que el objetivo se oiga con claridad.

La comprobación distingue variantes de escritura que suenan igual en español con seseo, como «bota/vota», «zorro/sorro» o «waterpolo/water polo». Mantiene pendientes cambios de sonido o contenido, como «niña/niño», «eñe/ene», «fresa/presa», números distintos y pistas alteradas. La segunda transcripción usa el vocabulario completo de cada tipo de juego, sin proporcionarle únicamente la respuesta esperada. Las pruebas de `scripts/test_voice_validation.py` cubren esas diferencias.

También se contempla el [yeísmo descrito por la RAE](https://www.rae.es/dpd/ye%C3%ADsmo): una transcripción como «llegua» puede representar el sonido correcto de «yegua». Se conservan las vocales y el resto de los sonidos; «llego» sigue siendo una diferencia pendiente.

La sílaba inicial «xi» se prepara con el sonido /si/, como en «xilófono», de acuerdo con la [entrada x de la RAE](https://www.rae.es/dpd/x). Esta equivalencia se limita a las sílabas iniciales; no cambia la comprobación de palabras como «taxi» o «examen».

Para las dudas de fonética se añade un comprobador independiente [Wav2Vec2 español](https://huggingface.co/jonatasgrosman/wav2vec2-large-xlsr-53-spanish), sin modelo de lenguaje ni texto esperado como entrada. Se descarga con `node scripts/download-local-voice-model.mjs --spanish-asr`: comprueba el tamaño y SHA-256 de los pesos y guarda la revisión del modelo en la caché privada. `review-approved-voice.py` libera Whisper antes de cargar este modelo mediante `review-approved-voice-ctc.py`. Ambos se ejecutan localmente; no se envían las grabaciones a un servicio externo. La comprobación conserva pendientes sonidos distintos, como «di/ti» o «ñi/ni».

Algunas tomas alcanzaron el límite del generador después de completar la frase, con pausas largas y una cola silenciosa. `recover-approved-voice-tail.py` permite preparar una candidata recortando esos silencios, siempre que la cola tenga baja energía. No se recupera una toma que termine con actividad. La candidata no se acepta automáticamente: debe pasar las mismas comprobaciones de audio y contenido antes de conectar sus rutas. La intro aprobada está protegida contra esta operación.

`scripts/complete-approved-voice.py` supervisa el final de la primera pasada, contrasta las dudas con otro transcriptor local, repite los archivos que lo necesiten con otras semillas y ejecuta la conexión, las pruebas, la compilación y la comprobación HTTP. `node scripts/voice-job-status.mjs` muestra los contadores y las incidencias pendientes; las resoluciones de segunda revisión están en un archivo privado separado para no sobrescribir el informe que se actualiza durante la generación.

## Conexión del catálogo

`node scripts/finalize-approved-voice.mjs` exige que las 275 entradas coincidan con el texto actual, con su suma SHA-256 y con una verificación aceptada. Solo entonces actualiza el manifiesto público y todas las rutas de `localVoiceFiles.js`. Conserva copias privadas del manifiesto y de las rutas anteriores. El manifiesto público no contiene la transcripción ni la huella de la grabación de referencia.

```powershell
node scripts/finalize-approved-voice.mjs
node --test tests/*.test.mjs
npm.cmd run build
node scripts/check-voice-assets.mjs
```

El generador sintético anterior se bloquea si el catálogo ya utiliza el perfil aprobado, para impedir que una regeneración antigua revierta la nueva voz. El publicador de código excluye también `.voice-cache`, `.venv-voice`, `tmp`, cachés de Python y archivos de entorno: no debe subir modelos, grabaciones de referencia ni credenciales al repositorio.

## Indicaciones y servidor local

Para «ñi», las tomas del sonido aislado se confundían con «ni». La guía final dice «Busca la sílaba con eñe e i. Tócala», manteniendo el objetivo escrito «ñi». Se verifica la presencia de los dos nombres correctos; «ene e i» u otras vocales no se aceptan. La transcripción independiente que confirma esta guía está registrada por huella de archivo en la comprobación privada.

Vite ignora los cambios masivos de `public/audio` durante la generación para evitar recargar la app con cada archivo. Al conectar una biblioteca nueva hay que reiniciar Vite para que actualice su índice de archivos públicos y comprobar después las 275 rutas. Un HTTP 200 con `text/html` es un fallo de audio, no una verificación correcta. En esta entrega se reinició el servidor y todas las rutas devuelven contenido de audio.
