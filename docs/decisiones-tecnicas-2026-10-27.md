# Decisiones técnicas y ampliaciones · 27/10/2026

## T27 · Sincronización privada entre dispositivos — evaluación terminada

Decisión: mantener los datos en el dispositivo y el traslado mediante copias. Se puede exportar/importar el progreso desde Familia y el álbum completo (incluidas grabaciones) desde Mi álbum. No hay cuentas, seguimiento remoto ni envío automático de voces.

No se ha comunicado una necesidad concreta de sincronización simultánea. Añadirla exigiría identidad familiar, autorización por hogar, almacenamiento privado de archivos, reglas de acceso verificadas y resolución de cambios concurrentes. GitHub Pages por sí solo no proporciona ese servicio. No se crea un backend público ni se simula sincronización con una clave compartida.

Criterio para activarla: necesidad confirmada de continuar habitualmente en dos dispositivos. Diseño propuesto: registro de eventos con identificadores únicos para unir intentos y premios de forma idempotente; versiones por obra para detectar ediciones simultáneas y conservar ambas; borrado propagado mediante marcas de eliminación. Las grabaciones requieren una decisión expresa sobre alojamiento y acceso. La copia manual ya permite cambiar de equipo sin ese servicio.

## T28 · Android/iOS — evaluación terminada

Decisión: distribuir la PWA existente con iconos cuadrados reales de 192 y 512 píxeles, cuatro paquetes offline verificables y actualización explícita desde Familia. Las instalaciones nativas no aportan ahora contenido educativo adicional.

[Capacitor](https://capacitorjs.com/docs) permite alojar una app web y añadir plataformas nativas. Un contenedor exigiría ajustar la base de Vite, probar rutas, almacenamiento, ciclo de vida, micrófono y funcionamiento sin service worker bajo el protocolo nativo. Android necesita su entorno de compilación; iOS requiere el entorno de Apple y pruebas en dispositivo. No se publica un APK/IPA sin estas pruebas ni se considera probado porque la web compile.

Criterio para retomar: necesidad de tienda, gestión escolar o una función nativa que la PWA no cubra. El código actual sigue siendo reutilizable; no se añaden dependencias nativas que la app publicada no utiliza.

## T29 · Reconocimiento oral — evaluación limitada; prueba infantil pendiente

Decisión: ofrecer grabación, escucha y borrado locales sin puntuación de pronunciación. Las grabaciones no se transcriben ni se envían. El permiso se solicita únicamente al pulsar Grabar y las pistas del micrófono se cierran al terminar, salir o fallar. Un minuto y 5 MiB son los límites por obra.

[SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) tiene disponibilidad limitada y algunos navegadores realizan reconocimiento mediante un servicio remoto. Su disponibilidad no acredita que interprete bien el habla infantil ni el seseo sevillano. Los errores de transcripción encontrados durante la preparación de voz de este proyecto tampoco constituyen un ensayo con niños.

El ensayo con habla infantil real no se da por realizado. Antes de cualquier evaluación automática: reunir muestras voluntarias con autorización familiar, vocabulario de 1.º y acento local; comparar transcripción con una revisión humana; registrar omisiones y falsos errores, diferenciando lectura, ortografía y pronunciación; comprobar el tratamiento de seseo y variantes locales; separar fallos de micrófono de respuestas del niño. Una decisión de evaluación requeriría resultados suficientes y un modo de abstenerse cuando haya duda. No se usa como nota ni bloquea recompensas.

## T11 · Cuentos piloto

Los dos cuentos están implementados y narrados. Se conserva la condición original de observar su uso con Adri antes de multiplicar la biblioteca a ocho–doce títulos. La observación familiar no puede sustituirse por una prueba de interfaz. No se declara realizada.

## T26 · Grabación local

Implementación mediante [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), con alternativa cuando falta soporte o permiso. El archivo se conserva en IndexedDB junto con la obra y se incluye solo si la familia exporta el álbum. El navegador puede borrar almacenamiento local; la exportación es la copia transportable. La prueba de un micrófono físico y de la voz real del niño queda para uso voluntario, no se activa durante las comprobaciones automáticas.
