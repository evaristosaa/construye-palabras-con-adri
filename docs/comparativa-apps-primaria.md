# Comparativa de apps y mejoras para Adri

Revisión: 24 de octubre de 2026. Se contrastó documentación pública de los fabricantes, no suscripciones ni pruebas completas de las apps instaladas. Las características descritas por sus proveedores sirven como referencias de diseño; no demuestran por sí mismas una mejora del aprendizaje en Adri.

Esta comparativa documenta la primera ampliación. La revisión posterior, con nuevos formatos de juego y las cifras actuales, está en [analisis-jugabilidad-primaria.md](analisis-jugabilidad-primaria.md).

## Qué aporta cada referencia

| Referencia | Qué describe la fuente oficial | Aplicación a Adri |
| --- | --- | --- |
| [Khan Academy Kids: recorrido](https://khankids.zendesk.com/hc/en-us/articles/360048828572-Learn-more-about-the-Learning-Path) | Botón de inicio, alternancia de materias y adaptación de práctica según respuestas. El currículo de referencia es estadounidense. | Entrada directa a tres retos, uno de cada materia; prioridad a actividades con varios errores, usando los contenidos españoles existentes. |
| [Smartick: sesiones](https://support.smartickmethod.com/es/articles/9948011-como-se-desarrolla-una-sesion) | Sesiones diarias de 15 minutos con principio y final. | Tomar la idea de una sesión acotada: tres retos y cierre voluntario. No trasladar el límite diario ni un cronómetro. |
| [Innovamat: fundamentos](https://www.innovamat.com/wp-content/uploads/2025/02/Libro-blanco-aprendizaje-matematicas-Innovamat.pdf) | Itinerarios individualizados y ayudas didácticas progresivas en su práctica digital. | Apoyo matemático manipulable y posibilidad de pedir pista antes de equivocarse. La implementación de fichas es una propuesta propia, no una réplica del ejemplo del documento. |
| [Leo con Grin](https://www.educaplanet.com/educaplanet/producto/leo-con-grin/) y [configuración de niveles](https://www.educaplanet.com/educaplanet_test/2014/09/preguntas-frecuentes-y-configuracion-leo-con-grin/) | Lectoescritura en español, dos niveles, sílabas y construcción de frases; el primer nivel incorpora referencias visuales. | Conservar sílabas y frases manipulables; reforzar el acceso voluntario a la pista. Se incorporan opciones de letra, tamaño y pista inicial. |
| [Smile and Learn](https://www.smileandlearn.com/) | Actividades visuales e interactivas en varias áreas y personalización para distintos ritmos. | Favorecer acciones de tocar y construir frente a añadir más texto. Más juegos de clasificación y observación son la siguiente ampliación recomendada. |

## Diagnóstico de la app actual

Adri ya tiene 24 misiones, 144 retos, tres materias y pantallas de juego breves. La mayoría de los retos son de elegir respuesta; hay menos interacción manipulativa. Se puede elegir cualquier misión y conservar el progreso, pero faltaba un inicio directo con variedad. Las pistas estaban disponibles al fallar y las recomendaciones familiares se basaban en errores acumulados, de modo que podían seguir señalando una dificultad después de practicarla.

El primer cambio debe reducir decisiones y mejorar el apoyo al razonar. Añadir muchos ejercicios sin cambiar las interacciones no resolvería esos puntos.

## Cambios aplicados

1. **Jugar con Adri:** botón en Primaria que prepara tres retos reales, uno por materia. Empieza con repaso pendiente y, después, la siguiente actividad sin completar de cada materia. Al terminar todo el catálogo sigue ofreciendo práctica. La selección se fija durante cada juego para que las respuestas no cambien el recorrido en marcha.
2. **Repaso con salida:** se prioriza una actividad después de dos o más errores acumulados mientras no se hayan registrado dos aciertos consecutivos. Un nuevo error reinicia esa secuencia. Los históricos antiguos se conservan y entran en la práctica sin inventar aciertos previos. También se actualizan las recomendaciones familiares con este criterio. Es una regla sencilla de práctica, no una medida de dominio, un diagnóstico ni un sistema adaptativo equivalente a las plataformas comparadas.
3. **Fichas de Matemáticas:** tablero de dos grupos de diez. Se toca cada casilla para añadir o quitar una ficha. El tablero conserva el trabajo mientras se permanece en ese reto, permite borrar y devuelve al ejercicio sin introducir la respuesta. Los grupos ayudan a representar cantidades hasta veinte; no sustituyen los bloques de decenas para cantidades mayores.
4. **Pista voluntaria:** botón de bombilla que muestra la pista sin registrar un error. Se conserva el botón de audio con la voz existente.
5. **Cierre breve:** la aventura termina tras tres retos y permite parar. Los retos nuevos mantienen las piezas habituales, repetir no duplica premios y la aventura no concede un bonus de misión completa de seis retos.

No se añadieron servicios, cuentas ni dependencias. Los resultados siguen guardándose en este navegador. La voz y las misiones existentes se conservan.

## Mejoras pendientes implementadas el 24 de octubre

| Mejora | Resultado |
| --- | --- |
| Clasificación visual | Tres actividades con tres dibujos cada una: seres vivos y objetos; materiales transparentes y opacos; hábitos que nos cuidan o no. Se elige una categoría por dibujo. |
| Ejemplos alternativos | 144 retos con un segundo ejemplo equivalente: 288 presentaciones. Cambian palabras, situaciones, cantidades y textos. Comparten identificador y premios. |
| Explicación al acertar | Una explicación específica para cada presentación, más 24 consejos generales grabados por unidad con la voz sintética elegida. El consejo de audio está rotulado por separado; no se presenta como lectura literal de la explicación. |
| Apoyos de lectura | Aa divide texto y pregunta en frases. Familia permite letra imprenta o redonda, tamaño grande y pista al empezar. No se cambia el uso de mayúsculas que se evalúa. |
| Logros sin duplicación | Una única pantalla Mis logros, con tres materias y el abecedario en cuatro páginas. Familia reúne lectura, sonido, repaso y datos. Las rutas antiguas redirigen a Mis logros. |
| Repaso espaciado | Se registran fecha, aciertos y ejemplo utilizado. Tras practicar en fechas distintas, el intervalo pasa de 1 a 3 y 7 días; repetir el mismo día no lo alarga. Las dificultades actuales tienen prioridad, después los repasos vencidos y luego lo nuevo. |

Los registros históricos se conservan. El sistema no inventa fechas de actividad pasada ni convierte las piezas en una calificación. Dos ejemplos no constituyen un catálogo ilimitado; el repaso vuelve a alternarlos.

## Verificación

43 pruebas automatizadas cubren los 288 ejemplos, respuestas, explicaciones, ordenación, clasificación, alternancia sin imágenes heredadas de otro ejemplo, premios únicos, conservación de datos, fechas e intervalos, y los 24 nuevos audios con su texto correspondiente. Los 256 audios responden con tipo de contenido de audio.

Se recorrieron los 144 retos con letra grande en 320 × 568 y sus otros ejemplos en 667 × 375, además de revisar logros y las páginas de Familia en esos tamaños y en 1280 × 720. Los casos de lectura larga e instrucciones ordenables se reajustaron y se volvieron a probar. También se probaron clasificación con error y pista, lectura por pasos, acceso a un reto concreto desde Familia y cancelación del reinicio de datos. El progreso de prueba usa el puerto 5199, separado del usuario en 5173. Son simulaciones de tamaño, no pruebas en dispositivos físicos ni una validación pedagógica con Adri.
