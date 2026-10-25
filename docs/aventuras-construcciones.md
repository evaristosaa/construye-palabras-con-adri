# Aventuras y construcciones que crecen al aprender

25 de octubre de 2026. Continuación de la revisión visual y de jugabilidad. Las tres materias comparten una meta visible, además del objetivo de cada actividad:

| Materia | Personaje y meta | Partes que aparecen |
| --- | --- | --- |
| Lengua | Ayudar al zorro a abrir su biblioteca. | Suelo, paredes, tejado, puerta, ventana y libros. |
| Matemáticas | Ayudar al robot a construir un puente. | Orillas, pilares, arco, camino, barandilla y bandera. |
| Medio | Ayudar a la rana a crear su jardín. | Tierra, brote, flores, agua, mariposa y árbol. |

Cada una de las 24 misiones tiene una frase propia relacionada con su tema: ordenar los mensajes de la biblioteca, contar piezas del puente o descubrir animales del jardín, por ejemplo. Las entradas de las misiones y los talleres presentan la meta. Tres nuevas guías habladas usan la misma referencia de voz elegida anteriormente.

## Cómo se juega

La construcción empieza como un dibujo tenue que anticipa su forma. Cada reto resuelto da color a una parte. Las misiones de seis retos incorporan una de las seis partes en cada acierto; los recorridos de tres retos avanzan por las fases Preparar, Construir y Decorar, que muestran dos elementos por fase.

El botón **Mi obra** permite ampliar el dibujo, ver lo que falta y escuchar el objetivo. Consultarlo es opcional: no añade un paso obligatorio después de cada respuesta. La explicación del acierto incluye una miniatura actualizada y, al terminar, la obra completa continúa disponible en la pantalla de reflexión.

Las piezas se dibujan con SVG para que puedan aparecer por separado y ajustarse a móvil sin descargar nuevos paquetes de imágenes. Los escenarios ilustrados anteriores siguen en las entradas y otros apoyos de juego. La animación es breve y respeta la preferencia de reducir movimiento.

## Progreso sin penalizaciones

- Pedir una pista, responder mal o abrir Mi obra no elimina ninguna parte.
- Un mismo reto solo contribuye una vez a la obra de esa vuelta.
- Una misión a medias recupera las actividades realmente completadas. Abrir un enlace al quinto reto no inventa cuatro aciertos anteriores.
- Al repetir una misión ya conseguida se empieza una construcción nueva. La obra de esa repetición es temporal; las estrellas, piezas y pegatinas permanentes se conservan.
- Los recorridos cortos también empiezan una obra nueva y mantienen las reglas existentes de premios: repetir actividades conocidas no vuelve a premiarlas.
- No se ha cambiado el formato de los datos guardados ni se ha añadido otro contador de premios. La construcción representa el avance del juego, no piezas adicionales de la puntuación general.

## Accesibilidad y autonomía

El visor tiene botones de al menos 44 píxeles, título y descripción accesibles, estados textuales de los pasos y un dibujo que anuncia cuántos retos se han completado. Mientras está abierto, el contenido de detrás queda inactivo. El teclado permanece dentro del diálogo; Escape lo cierra y devuelve el foco a Mi obra. La explicación oral se puede escuchar desde el visor.

## Verificación

Pasan 67 pruebas automáticas, incluidas las nuevas comprobaciones de metas por tema, fases de tres y seis retos, reanudación real, repeticiones, ausencia de mutaciones y grabaciones. El catálogo contiene 274 audios locales.

En el navegador se completaron las tres construcciones. Se verificó que una pista y un error no cambian la obra, que el primer acierto añade su parte y que la biblioteca completa recibe la pegatina y los premios habituales: seis piezas y nueve estrellas. Al repetir, la construcción empieza de nuevo y la pegatina permanece.

Las entradas y ejercicios se revisaron en 320 × 568, 667 × 375 y 1280 × 720: 42 vistas con letra normal y otras 42 con letra redonda y grande. También se comprobaron visores parciales y completos, un cierre largo y la reanudación de una misión con dos retos conseguidos. El visor funciona con teclado y devuelve el foco al cerrarse. La respuesta motivacional del niño deberá observarse al jugar; estas comprobaciones verifican el funcionamiento, no miden resultados educativos.
