# Recorrido de 1.º de Primaria

Adaptación del 23 de octubre de 2026. Se mantiene el personaje, la voz elegida y la recompensa mediante bloques. La entrada principal es ahora Primaria y el abecedario queda como repaso.

## Selección de contenidos

La ampliación del 24 de octubre añade un recorrido original de [Juegos de mates inspirado en el análisis de EMAT](emat-y-adaptacion.md): seis juegos breves, cantidades hasta 10 o 20, recta numérica, composiciones, patrones, medida, datos y figuras. Sus 36 retos adicionales usan identificadores propios y recompensas que no se duplican. La entrada inicial se mantiene hasta 10, según la preferencia de la familia.

La siguiente ampliación extiende las ideas de manipular, intercalar y explicar a Lengua y Medio mediante «Juegos variados»: tres retos de temas diferentes, con una actividad central manipulativa. Estos recorridos reutilizan los identificadores y las variantes existentes; contribuyen a las pegatinas de las misiones sin duplicar premios. Se incorporan clasificación de propiedades mediante tacto/vista y ordenación de pasos para investigar una planta. El cierre reflexivo es común a todas las misiones de Primaria. El taller de cuentos tiene como protagonistas a Adri, Juan y Cayetana. EMAT es el programa de matemáticas; esta extensión es una aplicación propia de esas ideas didácticas a otras materias.

| Área | Ocho misiones |
| --- | --- |
| Lengua | Palabras y sílabas; frases; comprensión; mayúscula y punto; vocabulario y descripción; grupos consonánticos; cuentos; notas, listas e instrucciones. |
| Matemáticas | Números hasta 20; suma hasta 10; resta hasta 10; decenas y unidades hasta 99; cálculo hasta 20; problemas; formas y series; tiempo, medidas y euros. |
| Conocimiento del Medio | Cuerpo y sentidos; hábitos; emociones y convivencia; animales; plantas; materiales y observación; barrio y cuidado del entorno; tiempo atmosférico y cambios. |

Hay seis retos por misión, 24 misiones y 144 identificadores de reto con dos ejemplos cada uno (288 presentaciones). Las etapas «Empezamos», «Seguimos aprendiendo» y «Un paso más» son una propuesta de orden, no trimestres obligatorios. Todas las misiones están disponibles, para que la familia pueda adaptarse a lo trabajado en el colegio.

## Referencias

Se consultaron los contenidos oficiales de **primer ciclo**, que agrupa primero y segundo. Esta app selecciona práctica inicial adecuada para primero; no pretende cubrir todo el currículo, establecer una programación escolar oficial ni sustituir las actividades de aula.

- [Lengua Castellana y Literatura: primer ciclo, Ministerio de Educación](https://educagob.educacionfpydeportes.gob.es/en/curriculo/curriculo-lomloe/menu-curriculos-basicos/ed-primaria/areas/lengua-castellana/criterios-evaluacion-primer-ciclo.html): comprensión de textos breves, escritura inicial, convenciones del código escrito y vocabulario.
- [Matemáticas: primer ciclo, Ministerio de Educación](https://educagob.educacionfpydeportes.gob.es/va/curriculo/curriculo-lomloe/menu-curriculos-basicos/ed-primaria/areas/matematicas/criterios-evaluacion-primer-ciclo.html): conteo, representación de cantidades, suma, resta y problemas cotidianos. Para esta selección se reduce el rango numérico a 20 y 99 según la misión.
- [Conocimiento del Medio: primer ciclo, Ministerio de Educación](https://educagob.educacionfpydeportes.gob.es/va/curriculo/curriculo-lomloe/menu-curriculos-basicos/ed-primaria/areas/conocimiento-medio/criterios-evaluacion-primer-ciclo.html): observación, seres vivos, hábitos saludables, emociones y cuidado del entorno.

## Diseño de las actividades

Las [aventuras y construcciones](aventuras-construcciones.md) añaden una meta narrativa a cada misión: ayudar al zorro, al robot o a la rana. El dibujo crece con los aciertos, y el botón Mi obra permite verlo ampliado. Reanudar una misión recupera sus retos completados; una repetición construye de nuevo sin borrar ni duplicar premios.

Las ayudas habladas describen la tarea y no anuncian cuál es la respuesta correcta. La selección muestra primero tres materias y después una misión por pantalla, con flechas grandes para elegir otra. El juego ocupa la pantalla, sin la navegación general. Los textos de comprensión tienen su propio paso de lectura y un botón permite volver al texto desde la pregunta. Las respuestas se barajan de forma estable. Las pistas y los aciertos aparecen en una tarjeta central; no se resta puntuación y no hay límite de tiempo. Tras acertar se bloquea la respuesta y Adri decide cuándo pasar al siguiente reto.

En escritura se admiten diferencias de mayúsculas cuando no son el contenido evaluado. En la misión de mayúsculas se exige la forma correcta. La escritura se practica con teclado; no se evalúa la caligrafía ni la producción oral.

## Progreso y continuidad

Se conserva la clave `adri-reading-progress-v1`. Los logros del abecedario permanecen en `completedLevels`; los de Primaria usan `primaryCompletedLevels`. Los identificadores de las nuevas actividades empiezan por `primaria-`, y sus piezas y estrellas se suman a los contadores generales sin duplicar premios al repetir.

Cada área tiene su recomendación independiente. Se registra el número de intentos y errores por actividad, y una secuencia de aciertos consecutivos para sugerir repaso acompañado. La aventura de tres retos prioriza dificultades actuales, después repasos cuya fecha ha llegado y después actividades pendientes. Se guardan fechas, aciertos, ejemplo utilizado y próximo repaso. Los intervalos pasan de uno a tres y siete días con aciertos en fechas distintas; los errores reinician el intervalo. Los históricos antiguos se conservan sin inventar fechas. El indicador cuenta práctica completada; no es una nota ni una evaluación diagnóstica del niño. La familia puede reiniciar el progreso mediante el ajuste existente.

Mis logros muestra todo a la vez en un álbum de pegatinas: tres áreas de Primaria (24 misiones), Juegos de mates (12 recorridos) y abecedario (27 letras). Cada pegatina se corresponde con un logro concreto, sin inventar premios ni modificar el progreso. Las colecciones son accesos grandes al juego; los dibujos pequeños son indicadores, no botones diminutos. La recomendación retoma primero una misión empezada y después equilibra las colecciones pendientes. Las rutas antiguas de colección y progreso redirigen a esta única pantalla. Familia ofrece los repasos en tarjetas individuales, además de ajustes de lectura y sonido.

## Voz y validación

Se añadieron siete grabaciones compartidas, generadas con el modelo local ya instalado y la grabación sintética de Construcciones como referencia. Se reutilizan los 225 audios anteriores. Se añadieron además 24 consejos por unidad con la misma referencia sintética: con las cuatro guías de juego y las seis palabras añadidas en la segunda revisión hay 266 grabaciones disponibles. Las 288 explicaciones específicas se muestran por escrito; «Escuchar consejo» reproduce el refuerzo general de esa unidad, no una lectura distinta del texto mostrado.

La comprobación automatizada cubre respuestas válidas, piezas ordenables, recomendaciones por materia, conservación de logros y premios únicos. En navegador se probó una misión completa de Matemáticas, errores con pista, formación de palabras, respuesta escrita, reanudación y progreso separado. Las pruebas de juego se hicieron en el puerto 5199, separado del progreso del usuario en el puerto 5173.


## Ampliación del 24 de octubre

Las actividades de seres vivos, materiales y hábitos incluyen tres dibujos para clasificar tocando una categoría. Los ejemplos alternativos se eligen al iniciar el juego y no cambian al equivocarse. Comparten identificador con el reto original para no duplicar premios. Aa presenta el texto por frases; Familia permite elegir imprenta o redonda, tamaño normal o grande y pista inicial opcional. Se conservan las mayúsculas y los signos del contenido.

## Revisión de jugabilidad

48 presentaciones pasan a resolución manipulativa: 36 de cálculo con fichas, seis de valor posicional y seis de sílabas con palmadas. Los identificadores y premios se mantienen. Crear cuento, dentro de Lengua, permite 27 combinaciones iniciales sin evaluación ni premios; el texto se mantiene solo mientras se está en ese taller. Las piezas colocadas pueden quitarse tocándolas otra vez. Cada misión incluye una propuesta de transferencia fuera de pantalla. Véase [análisis de jugabilidad](analisis-jugabilidad-primaria.md).
