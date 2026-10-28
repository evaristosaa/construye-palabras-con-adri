# Nuevas ilustraciones del club

Cayetana lleva polo celeste, pichi de cuadros, calcetines azul marino, zapatos negros y lazo azul. Su cara se ha simplificado expresamente tras la revisión de la familia: contornos de tinta, ojos de dibujo y sombras planas, sin acabado fotográfico. Las referencias reales se usan solo para generar los dibujos y no se añaden al repositorio ni a la distribución.

## Recursos finales

- `public/assets/characters/amigos-bienvenida-v2.webp`: portada. Orden visual y etiquetas: Adri, Cayetana, Juan.
- `public/assets/characters/amigos-actividades-v2.webp`: cuatro escenas, leyendo, investigando una planta, compartiendo la merienda y celebrando.
- `public/assets/characters/cayetana-colegio-v3.webp`: retrato individual de Cayetana.
- `public/assets/characters/amigos-expresiones-v2.webp`: nueve expresiones, tres por personaje (pensar, idea y celebrar).

Generación con la herramienta integrada `image_gen`, usando los dibujos anteriores como referencia de estilo y la foto nueva como referencia de Cayetana. Los PNG generados se han convertido a WebP conservando la transparencia; sin recortar o reconstruir rostros por código. Los originales anteriores se conservan.

## Prompts finales

Se generaron primero versiones con el uniforme y después se corrigió el acabado de las caras. Especificación aplicada a las cuatro imágenes finales:

> Cayetana must be a simplified 2D hand-drawn comic child matching Adri and Juan. Bold dark ink contours, expressive cartoon eyes with black pupils and white highlights, tiny nose drawn with small lines, clean flat peach skin with only two-tone cel shading. No photographic skin, portrait rendering, realistic eyelashes or airbrushed realism. Keep her identity cues, side-parted tied-back dark blonde hair and navy ribbon, light-blue polo, navy grey white red plaid school pinafore, navy knee socks and black Mary Jane shoes. Same apparent age, scale and level of detail as the boys. Actual transparent alpha background; no scenery, logos or text.

Variantes de composición usadas:

1. Welcome group, full body, Adri left inviting with open hand, Cayetana center holding a book, Juan right waving. All hands and shoes visible.
2. Activity atlas 1536 by 1024, two columns and two rows: reading one open book together; using a magnifier beside a seedling; sharing apples by a picnic basket; cheering with raised arms. Change positions and poses between groups. Keep complete groups and empty gutters.
3. Single full-body Cayetana holding a book to chest with an open inviting hand, with the same cartoon face and school uniform.
4. Square expression atlas with three equal columns Adri/Juan/Cayetana and three equal rows: thinking with hand on chin; idea with raised finger; cheering with raised arms. Keep complete heads and hands in their cells.

## Uso en la app

`FriendScene` muestra una escena de la lámina mediante una ventana SVG con recorte explícito y escala proporcional; el contenido sigue siendo el dibujo raster generado. No se deforma la ilustración ni aparecen partes de otra celda al cambiar la relación de aspecto.

- Portada: bienvenida y nombres en el orden correcto.
- Club: escena relacionada con cada tarjeta.
- Misiones: lectura o exploración según materia y reto; estable mientras se responde.
- Merienda: compartir y celebrar.
- Semilla: investigar y celebrar cuando crece.
- Retratos y ayudas: nueva Cayetana y nuevas expresiones.

Las imágenes nuevas se incluyen en los paquetes sin conexión. La bienvenida sustituye a la imagen anterior en el núcleo; las otras tres se incluyen en los paquetes de juego. Se conservan las voces aprobadas y los datos de progreso.

## Comprobaciones

106 pruebas automatizadas superadas. Compilación de producción comprobada. Revisión visual en escritorio, móvil de 320 × 568 y horizontal de 667 × 375: nombres, escala, transparencia, distintas escenas y ausencia de desplazamiento en las pantallas revisadas.
