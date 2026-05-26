# Casa de Bloques y Contador de Piezas

## Objetivo

Corregir el contador imposible de Construcciones y transformar la casa actual en una recompensa visual atractiva, coherente con la tematica de bloques de construccion.

## Progreso

Las piezas de construccion representan juegos distintos superados. Como existen 11 misiones con 8 juegos cada una, el maximo sera siempre 88. Al cargar progreso antiguo, `pieces` se recalculara desde los identificadores unicos guardados en `completedGames`, eliminando inflados de versiones anteriores y bonificaciones finales de nivel.

Superar un juego por primera vez anade una pieza. Repetirlo no suma piezas. Completar una mision puede conceder estrellas de celebracion una sola vez, pero no piezas adicionales.

## Construccion

La pantalla conserva una unica `Casa de las palabras`. La casa se forma en 11 fases, una por mision completada: terreno, base, paredes de bloques, puerta, ventanas, tejado, chimenea, camino, jardin, rotulo y bandera. Cada pieza sera una composicion de bloques genericos con tetones, colores vivos y contorno comic, sin usar marcas.

Adri constructor permanece a un lado de la obra. La barra muestra misiones completadas y el texto inferior muestra piezas colocadas sobre el total real de 88.

## Validacion

Se comprobara que un progreso heredado con `pieces` inflado se normaliza al numero de juegos unicos; que completar niveles no aumenta piezas; que la pantalla muestra `88/88` al completar todos los juegos; y que la casa se ve completa sin solapes en ordenador, tablet y movil.
