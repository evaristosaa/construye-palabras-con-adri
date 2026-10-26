# Próxima evolución de Construye ideas con Adri

Revisión del 26 de octubre de 2026. Orientada a un niño de seis años que empieza 1.º de Primaria, con uso en móvil y con Adri, Juan y Cayetana como personajes.

## Alcance y criterio

El análisis combina documentación oficial de aplicaciones y programas educativos, referencias de aprendizaje y una revisión del código actual. Las funciones comerciales se describen como declaraciones de sus fabricantes; no se han probado sus suscripciones completas ni medido su eficacia con Adri. Esta selección responde a su utilidad para el proyecto, no es una clasificación por descargas o superioridad pedagógica demostrada.

Esta revisión aporta un plan. No cambia las actividades, los audios aprobados, el progreso ni la versión publicada.

El criterio central es que la acción del niño tenga relación con lo que aprende: repartir para comprender cantidades, ordenar para construir una explicación, leer para resolver una situación. La decoración debe ayudar a esa acción. El marco de aprendizaje activo, atento, significativo y social se describe en [Putting Education in Educational Apps, APS](https://www.psychologicalscience.org/publications/educational-apps.html). La [guía de Matemáticas de EEF para edades de tres a siete años](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/early-maths/) también conecta la enseñanza con representaciones, situaciones cotidianas y juegos. Estas referencias orientan el diseño; no prueban por sí mismas la eficacia de nuestra app.

## Estado actual comprobado

El recuento del catálogo principal mediante sus módulos JavaScript arroja:

| Elemento | Situación actual |
| --- | --- |
| Recorrido principal | Tres materias, 24 misiones, 144 actividades y 288 presentaciones contando sus variantes. |
| Elegir una respuesta | 207 presentaciones: 71,9 % del catálogo principal. |
| Otras interacciones | 36 de cantidades con fichas, seis de decenas y unidades, seis de sílabas, 18 de ordenar, diez de escritura y cinco de clasificación. |
| Lectura | 26 presentaciones contienen un texto de lectura. No equivalen a una biblioteca de cuentos graduados. |
| Otros recorridos | Abecedario, taller de Matemáticas con seis temas y dos rangos, talleres de materias, aventura mixta y creación de cuentos. No están incluidos todos en el porcentaje anterior. |
| Voz | 275 grabaciones con el perfil aprobado. Los archivos activos suman aproximadamente 74,3 MiB. La mayor parte de las ayudas explica el tipo de actividad; no narra literalmente cada pregunta o pasaje. |
| Portada | La ilustración unificada de los tres amigos ocupa 2,19 MiB. Es un archivo, no una medición completa del tiempo de carga. |
| Repaso | Dificultades por actividad, dos aciertos consecutivos e intervalos de uno, tres y siete días. Es una heurística de práctica, no una evaluación de dominio. |
| Creación | El taller combina personaje, lugar y suceso: 27 comienzos. El cuento no se conserva al salir. |
| Datos | Progreso agregado en `localStorage`, con migración y premios únicos. Familia permite revisar y borrar, pero no ofrece exportación/importación ni sincronización. |
| Sin conexión | El service worker precarga portada, manifiesto e imagen de Adri. No precarga los paquetes JavaScript/CSS y audios ni guarda las nuevas respuestas en su caché. No garantiza una partida completa sin red. |

Fuente del recuento: `primaryData.js`, `primaryExtensions.js`, catálogo de audio y tamaños de los archivos. Resultado reproducible guardado en `tmp/primary-improvements-audit-2026-10-26.json`.

Ya existen y conviene conservar: personajes coherentes, construcciones que crecen, logros reunidos, juegos breves, ayudas voluntarias, fichas, lectura por frases, propuestas fuera de pantalla y premios que no se duplican al repetir. No hace falta presentar estas funciones como novedades otra vez.

## Qué tomar de las referencias

| Referencia | Aportación documentada | Siguiente aplicación concreta a Adri |
| --- | --- | --- |
| [Khan Academy Kids](https://www.khanacademy.org/kids) | Personajes, libros, actividades creativas y recorrido personalizado para edades tempranas. | Un inicio directo y una pequeña aventura coherente, con elección libre disponible. Los personajes participan en lo que ocurre. |
| [Duolingo ABC](https://abc.duolingo.com/how-we-teach?trk=public_post-text) | Lecciones cortas, progresión lectora, cuentos con preguntas y lectura acompañada; uso sin conexión. | Minicuentos ilustrados y narrados, con texto resaltado y comprensión integrada. Su secuencia inglesa no se traslada literalmente al español. |
| [DragonBox Numbers](https://dragonbox.com/products/numbers) | Números del uno al diez representados por personajes manipulables; composición y exploración. | Unir, separar, repartir y comparar objetos con efectos visibles. El material representa la cantidad que se transforma. |
| [Smartick Lectura](https://www.smartick.es/blog/lectura/metodo-de-lectura-para-ninos/) | Punto de partida adaptado, tutoriales y progresión de habilidades lectoras. | Recomendaciones por habilidad y ayuda utilizada, con comprobaciones posteriores mediante ejemplos diferentes. |
| [Smile and Learn: rutas](https://www.smileandlearn.com/las-rutas-de-aprendizaje-de-smile-and-learn/) | Itinerarios personalizables por curso, materia y objetivos, con seguimiento adulto. | Familia elige qué reforzar; el niño ve un juego sencillo. Un informe breve identifica habilidades practicadas y apoyos útiles. |
| [Pok Pok](https://playpokpok.com/) | Juguetes digitales abiertos, construcción, dibujo y exploración con una presentación tranquila. | Un espacio creativo donde experimentar y deshacer, sin convertir cada decisión en acierto o error. |
| [ScratchJr / DevTech](https://sites.bc.edu/devtech/scratchjr/) | Niños de cinco a siete años crean historias y juegos mediante bloques gráficos. | Dar autoría real: dibujar una escena, colocar personajes, ordenar acciones y guardar el resultado. |
| [EMAT Primaria](https://www.tekmaneducation.com/programa/emat-primaria/) | Programa de Matemáticas con juego, cooperación, conexión cíclica de saberes y evaluación formativa. | Situaciones con distintos caminos de solución y paso entre objetos, dibujos y números. La extensión a otras materias es una decisión didáctica propia. |
| [Mathigon / Polypad](https://mathigon.org/teachers) | Herramientas de manipulación y exploración matemática. | Tangram, composiciones, simetría y patrones con una interfaz reducida para seis años. Es referencia de interacción; no se propone abrir al niño un escritorio completo de herramientas. |

Las decisiones propuestas son originales. No requieren copiar personajes, ejercicios o recursos de esas plataformas. EMAT es la referencia matemática del colegio; no identifica por sí solo el programa de Lengua o Medio.

## Jugabilidad: cambios con mayor recorrido

### 1. Aventuras en las que resolver cambia la escena

Las construcciones actuales son una buena base. El siguiente paso es que la escena responda a decisiones relacionadas con el contenido.

Ejemplo: **«La merienda de los tres amigos»**.

- Lengua: leer una nota breve y colocar en la cesta lo que pide.
- Matemáticas: repartir seis piezas entre tres platos y comprobar si todos tienen lo mismo. Todavía no hace falta introducir el símbolo de división.
- Medio: preparar la mesa y ordenar acciones de higiene.
- Cierre: los amigos utilizan lo que el niño ha preparado. Se ofrece parar o inventar otra merienda.

La aventura mixta actual ya alterna materias. La novedad sería compartir un propósito y mantener consecuencias entre sus retos. El objetivo es que Adri pueda contar qué ha conseguido y por qué.

Mantendría un acceso principal «Vamos a jugar» y la elección de materia como alternativa, sin añadir otro menú obligatorio. El recorrido tendría un principio y un final claros; su duración inicial sería una hipótesis de diseño a comprobar con Adri.

### 2. Nuevos juegos de acción matemática

| Juego | Acción del niño | Aprendizaje que permite observar |
| --- | --- | --- |
| Reparto de meriendas | Coloca y retira objetos en platos. | Correspondencia, conteo y reparto equitativo. |
| El puente del diez | Junta dos grupos para completar diez y después representar otra cantidad. | Descomposición y uso del diez como referencia. |
| Construcciones de figuras | Compone una silueta con piezas que puede girar. | Composición espacial y propiedades de figuras. |
| Detective de patrones | Construye y continúa una secuencia. | Reconocer la unidad que se repite y explicar la regla. |
| La tienda | Paga cantidades pequeñas con monedas de uno y dos euros. | Composición de cantidades y varias soluciones válidas. |
| El camino de Juan | Coloca flechas y ejecuta una secuencia corta. | Orientación, anticipación y revisión de instrucciones. |

Se introducirían progresivamente. La representación debe ser coherente con la operación: quitar objetos en una resta, conservar la cantidad al cambiar su disposición y aceptar varias composiciones correctas cuando proceda.

El arrastre puede ser divertido, pero cada acción tendría una alternativa de tocar pieza y destino. Esto facilita el uso móvil y se corresponde con la [recomendación de accesibilidad sobre arrastre de W3C](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements). El objetivo de controles de unos 48 píxeles sería una decisión de este proyecto para niños, no una cita del mínimo normativo.

### 3. Ayuda que permite seguir pensando

Actualmente un error muestra la pista de la actividad en un diálogo. Propondría una ayuda gradual dentro de la escena:

1. Repetir la consigna y señalar los objetos relevantes.
2. Mostrar el primer paso o una representación adicional.
3. Resolver juntos un ejemplo parecido y ofrecer otro intento.

Una respuesta como «seis» en una suma no siempre representa el mismo error. Los ejercicios nuevos pueden distinguir entre olvidar un objeto, contar dos veces o confundir la operación. Esos mensajes se prepararían con el contenido; no hace falta un modelo generativo durante la partida.

Las fichas colocadas se conservan para rectificar. Pedir ayuda continúa siendo una acción válida, sin perder premios. El acierto muestra la relación entre lo construido y su explicación. La celebración acompaña esa comprensión y deja visible el resultado.

### 4. Personajes que acompañan una acción

Prepararía unas pocas expresiones y poses coherentes por personaje: observar, proponer, señalar y celebrar. Reacciones breves vinculadas al juego aportan más que movimiento continuo de fondo.

Adri, Juan y Cayetana pueden tener papeles en cada aventura: uno presenta la situación, otro propone probar y otro invita a explicar. En modo compartido, estos papeles permiten turnarse entre niños o con un adulto en el mismo dispositivo. Elegir un personaje no debe cambiar o mezclar el perfil de progreso del jugador.

Se mantienen una opción de movimiento reducido, controles grandes y una sola zona principal de acción. No propondría carreras por velocidad, pérdida de rachas o comparaciones públicas entre niños como siguiente mejora.

## Educación y contenidos

### Biblioteca de lectura acompañada

Empezaría con dos cuentos piloto y después ampliaría a una colección de ocho a doce. Esa cantidad es una propuesta de alcance, no un requisito pedagógico.

Cada cuento tendría pocas páginas, una ilustración significativa y una o dos frases por pantalla. Incluiría:

- Escuchar el texto con la voz aprobada, pausar y volver a escuchar.
- Resaltar la frase o palabra según tiempos de audio revisados.
- Alternar escuchar y leer de manera autónoma.
- Preguntas sobre quién, dónde, qué sucedió y por qué; después ordenar o reconstruir la historia.
- Una ocasión de anticipar y otra de contar el final con palabras propias.

Los niveles se diseñarían por vocabulario, estructura de frase, longitud y correspondencias de lectura trabajadas, no solo por número de palabras. La secuencia debe ser española y adecuada al punto de partida del niño.

Separaría claramente «escuchar la ayuda» y «escuchar el texto»: actualmente son funciones distintas. Las grabaciones nuevas se prepararían con la misma referencia aprobada y su comprobación de contenido. Un generador automático de tiempos necesita revisión, especialmente en sonidos o palabras que ya han dado problemas al transcriptor.

### Progresión por habilidades

El repaso existente es útil, pero dos aciertos en una actividad no prueban que la habilidad se transfiera a otra situación. Conviene incorporar:

- Etiquetas de habilidad y prerrequisitos sencillos.
- Diferencia entre resolver con ayuda y resolver de forma independiente.
- Ejemplos nuevos en días diferentes y distintas representaciones de un concepto.
- Estados descriptivos como «lo estamos descubriendo», «practicamos» y «lo usa en situaciones nuevas».

La primera versión puede funcionar con reglas transparentes. Su umbral se probaría y ajustaría con observación, sin presentar un porcentaje de dominio como una medición científica del niño.

Los premios siguen indicando participación y finalización. La evidencia de aprendizaje se guarda por separado. La adaptación debe sugerir y apoyar, manteniendo la elección libre y un inicio progresivo cuando la familia no conoce la unidad escolar.

### Más variedad sin preguntas arbitrarias

Dos ejemplos por actividad permiten memorizar situaciones. Para Matemáticas propondría plantillas acotadas y verificadas que cambien cantidades, disposición y contexto. Cada partida conserva su semilla y sus datos hasta terminarla.

Las validaciones deben comprobar que cantidades, dibujos, solución, opciones, pista y explicación coincidan. En una resta inicial no aparecerían resultados negativos; un ejercicio con varias soluciones no se corregiría como si solo una fuera válida. Los premios no se multiplican por generar otra variante.

Lengua y Medio necesitan más autoría y revisión de contenido: los distractores, las ambigüedades y las relaciones causales no se garantizan sustituyendo palabras al azar.

### Medio como observación real

La app ya propone salir de la pantalla. Añadiría un pequeño cuaderno: dibujar una planta al empezar y unos días después; registrar el tiempo de una semana con pictogramas; predecir y comparar un cambio seguro.

El registro inicial puede usar dibujos, iconos y medidas sencillas. Una simulación se identifica como simulación, y una observación real conserva su fecha. La conclusión permite comparar lo esperado con lo observado, incluso cuando son diferentes.

### Taller creativo que deja algo propio

El taller actual ofrece comienzos preparados. Su evolución sería un cómic de tres viñetas con personajes, dibujos y bocadillos editables, guardado local y opción de continuar otro día. Una siguiente ampliación puede añadir bloques de acción y una grabación voluntaria de la narración.

Esta creación no necesita calificarse. Un pequeño álbum de obras tendría otra función que Mis logros: conservar producciones del niño. Podría integrarse en el espacio creativo, sin duplicar las pantallas de progreso que ya se simplificaron.

## Posibilidades técnicas y encaje con GitHub Pages

| Posibilidad | Propuesta técnica | ¿Necesita servicio adicional? | Prioridad |
| --- | --- | --- | --- |
| Juegos visuales e ilustraciones reactivas | Componentes React y SVG; Canvas para dibujo. Animaciones ligadas a acciones, con alternativa de movimiento reducido. | No. | Alta |
| Narración con seguimiento de texto | Audio existente/nuevo y archivo de tiempos revisado; sincronización con el tiempo real del reproductor. | No en la app; la preparación se hace antes de publicar. | Alta |
| Adaptación y variantes verificadas | Datos de habilidades, reglas locales y plantillas con semilla estable. | No. | Alta |
| Sin conexión completo | Service worker que cachee la aplicación y paquetes elegidos, con manifiesto de versión y actualización controlada. | No. | Alta |
| Creaciones, borradores y registros | IndexedDB para estructuras y archivos, con migraciones y recuperación. | No. | Alta/media |
| Copias de progreso | Exportar/importar JSON validado desde Familia. | No. | Alta |
| Lectura en voz alta grabada | MediaRecorder, permiso al pulsar, reproducción y borrado local. | No para grabar y escuchar. | Media |
| Sincronizar móvil y tableta | Identidad familiar privada, almacenamiento remoto y resolución de conflictos. | Sí; la interfaz puede seguir en Pages. | Según necesidad |
| Aplicación Android/iOS | Contenedor como Capacitor, con compilación y pruebas específicas por plataforma. | Herramientas de construcción/distribución adicionales. | Posterior |
| Tutor conversacional o corrección automática oral | Reconocimiento, control de contenido, evaluación y pruebas con habla infantil. | Depende de la solución; aumenta complejidad. | Experimental |

Fuentes técnicas: [service workers y caché, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [IndexedDB, MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [MediaRecorder, MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) y [Capacitor](https://capacitorjs.com/docs).

### Rendimiento y uso sin conexión

La distribución de audio puede comprimirse conservando los WAV maestros. Un objetivo inicial orientativo sería pasar de 74,3 MiB a unos 15–25 MiB, sujeto a una prueba real de codificación y escucha; no es un ahorro medido todavía. Se conservarían la voz y el ritmo elegidos.

La imagen principal admite versiones ajustadas al tamaño de pantalla y formatos de distribución más ligeros. Conviene descargar solo los recursos de la pantalla actual y un pequeño anticipo, y ofrecer paquetes de materias desde Familia con tamaño y progreso de descarga visibles.

Un paquete solo se marca «listo sin conexión» después de guardar todos sus recursos. Las actualizaciones no deben interrumpir una partida ni mezclar un texto nuevo con un audio antiguo. La prueba debe hacerse cerrando y abriendo la app sin red, no solo desconectando mientras una pantalla sigue cargada.

### Guardado y continuidad

Antes de la sincronización remota, añadiría exportación/importación y recuperación local. Importar requiere validar estructura, versiones, identificadores y premios; no basta con sustituir el objeto guardado.

El borrador de una sesión debe conservar actividad, variante o semilla, paso y trabajo colocado. Así, si el sistema cierra la pestaña, el niño puede volver al mismo reto. La selección de personaje y un eventual perfil de jugador serían datos distintos.

`useProgress.js` también merece gestión de errores de escritura y una copia recuperable. IndexedDB amplía las posibilidades de datos y archivos, pero sigue siendo almacenamiento del dispositivo: no es por sí mismo una copia en otro equipo.

### Voz e inteligencia artificial

Grabar para escucharse y conversar con un adulto es un primer uso razonable del micrófono. Calificar automáticamente a un niño exige otra validación: los propios transcriptores de este proyecto han confundido sílabas aisladas y grafías equivalentes.

[MDN documenta que SpeechRecognition tiene disponibilidad limitada y que algunas implementaciones envían audio a un servidor](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition). Por tanto, «funciona en el navegador» no demuestra que un reconocedor sea local, uniforme o apto para evaluar a Adri.

En ejercicios orales se deben distinguir lectura, ortografía y pronunciación. Su variedad sevillana no debe convertirse en un error automático. La IA aporta valor inmediato preparando borradores de textos, imágenes o ejercicios que se revisan antes de publicar. Un tutor abierto durante la partida requiere una fase experimental separada.

## Orden de implementación recomendado

| Fase | Entrega concreta | Comprobación para avanzar |
| --- | --- | --- |
| 1. Una experiencia completa | Una aventura como la merienda, un juego manipulativo nuevo, un minicuento narrado y ayudas dentro de la escena. Copia de progreso y preparación del paquete offline. | Adri puede iniciar, entender y corregir con poca intervención; el juego cabe en móvil y conserva su avance. |
| 2. Ampliar contenido con el mismo diseño | Más minicuentos, tres formatos de juego reutilizables y variantes matemáticas verificadas. | Un ejemplo distinto se resuelve sin depender de recordar una pantalla. Narración, dibujos y respuesta coinciden. |
| 3. Personalizar con evidencia | Habilidades, prerrequisitos, registro de apoyos y selección de práctica. Informe breve dentro de Familia. | La recomendación cambia por la habilidad y la ayuda utilizada, conservando premios y datos anteriores. |
| 4. Dar autoría y continuidad | Cómic guardable, diario de observación y turnos compartidos. | El niño puede explicar, recuperar o modificar lo creado. |
| 5. Ampliaciones según uso real | Sincronización, aplicación de tienda o ensayo de reconocimiento oral. | Existe una necesidad concreta que compensa su mantenimiento y sus limitaciones. |

Las fases expresan orden y alcance; no son una estimación cerrada de horas. La autoría de contenido, la preparación de audio y la comprobación con niños forman parte del trabajo.

## Cómo evaluar si la mejora merece quedarse

Propondría observar unas pocas sesiones breves, con posibilidad de parar. Se registra si Adri entiende la consigna, qué ayuda pide, cómo rectifica y si puede explicar la solución. Unos días después se ofrece un ejemplo nuevo del mismo concepto. Es una prueba exploratoria para este proyecto, no un estudio causal ni un diagnóstico.

Más minutos o más estrellas no bastan como criterio. Importan la autonomía, la comprensión y la transferencia. Las medidas de producto se mantienen separadas de la evaluación educativa.

La aceptación técnica incluye:

- Controles de tamaño cómodo, alternativa al arrastre y foco visible.
- Ningún control principal queda oculto por teclado, barras del navegador u orientación.
- Pruebas en 320 × 568, 390 × 844 y 667 × 375, además de teléfonos físicos cuando sea posible.
- Pistas que conservan el trabajo, premios únicos y recuperación después de cerrar la app.
- Instalación/actualización y partida completa sin red con el paquete descargado.
- Voz aprobada conservada y ninguna discrepancia entre consigna, ilustración y solución.

## Puntos de entrada para desarrollar

| Archivo o área | Cambio previsto |
| --- | --- |
| `src/data/primaryData.js`, `primaryExtensions.js` | Etiquetas de habilidad, prerrequisitos y contenido revisado. |
| `src/data/primaryPractice.js` | Selección por evidencia y variantes estables. |
| `src/components/PrimaryGame.jsx` | Renderizadores de nuevos juegos y apoyo gradual conservando los actuales. |
| `src/components/ReadingSupport.jsx` y nuevo lector | Narración del contenido, tiempos y comprensión. |
| `src/components/StoryStudio.jsx` | Autoría y guardado de escenas. |
| `src/hooks/progressModel.js`, `useProgress.js` | Migración compatible, registro de apoyos, borradores y recuperación. |
| `public/sw.js` | Caché completa, paquetes y actualización controlada. |
| `scripts/generate-approved-voice.py` | Preparación de nuevas narraciones con la referencia aprobada, conservando la original en privado. |
| `tests/` y pruebas de navegador | Mantener invariantes de datos/premios y añadir recorridos táctiles, guardado y offline. |

La base React/Vite actual permite esta evolución. La inversión principal debería centrarse en diseñar buenas actividades, ampliar contenidos revisados y hacer fiable su uso cotidiano.
