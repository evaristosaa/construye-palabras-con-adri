# Abecedario completo con Adri

## Objetivo

Ampliar `Construye palabras con Adri` a las 27 letras del abecedario español y sustituir la seleccion de misiones por un tablero visual inspirado en la lamina aportada: letra mayuscula y minuscula, dibujo, palabra y progreso.

## Selector de misiones

La pantalla `Misiones` mostrara las 27 casillas en orden alfabetico, incluida `Ñ`. Cada casilla presentara:

- letra mayuscula y minuscula;
- una imagen o icono claro asociado a una palabra inicial;
- el nombre de esa palabra;
- una estrella cuando se ha completado;
- una marca `AHORA` en la mision recomendada.

Todas las casillas estaran disponibles para explorar. La recomendacion orienta sin bloquear. Adri seguira visible en el lateral en pantallas amplias; en movil se reducira el lateral y el tablero tendra tres columnas con desplazamiento interno.

## Orden de aprendizaje

La visualizacion es alfabetica, pero la recomendacion sigue una progresion lectora:

`A, E, I, O, U, M, P, L, S, T, B, N, D, J, R, F, C, Q, G, V, Z, Ñ, H, Y, X, K, W`.

Cada letra tiene ocho actividades. Las consonantes regulares reutilizan el modelo actual. Las letras con lectura especial se adaptan:

- `C`: `ca, co, cu` y `ce, ci`.
- `G`: `ga, go, gu` y `ge, gi`.
- `Q`: `que, qui`.
- `H`: reconocer que no suena en palabras sencillas.
- `Y`: sonido inicial en `yo`, `yate`, `yema` y uso como palabra.
- `Ñ`: `ña, ñe, ñi, ño, ñu`.
- `X`, `K`, `W`: palabras familiares o prestamos de lectura guiada.

## Contenido y progreso

Se reemplaza la mision conjunta `Vocales` por cinco misiones individuales. La antigua mision `N y Ñ` pasa a dos misiones. La migracion de `localStorage` preserva logros:

- `vocales` completada marca `A`, `E`, `I`, `O` y `U` completadas.
- `letra-n` completada del formato anterior marca `N` y `Ñ`.
- los juegos ya completados y sus piezas se conservan; no se regalan cinco veces las piezas de una mision antigua.

El perfil contara letras completadas de `27`. La Casa de las Palabras avanzara en `27` pasos, uno por letra, y el objetivo de piezas pasara a `216` juegos.

## Voz

Los audios existentes siguen utilizandose donde coincidan las claves de juego actuales. El catalogo de voz se ampliara a todas las instrucciones necesarias para las nuevas letras y para las letras ahora separadas. Los MP3 nuevos se generaran con la voz Inworld seleccionada, alegre y algo mas rapida, y se cargaran bajo demanda en GitHub Pages.

## Validacion

Se añadiran pruebas de:

- catalogo con exactamente `27` misiones y `216` juegos;
- orden recomendado y presencia de las letras especiales;
- migracion de progreso antiguo;
- catalogo de audios completo y claves unicas;
- componentes del selector con estados de progreso.

Tambien se verificaran build y visualmente las vistas de escritorio y movil antes de cualquier publicacion.
