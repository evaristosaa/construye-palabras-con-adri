# Mundos ilustrados para primero: revisión y cambios

24 de octubre de 2026. Revisión de fuentes y capturas oficiales, contrastada con las pantallas de Adri. Se han tomado referencias consolidadas de educación infantil y primeros cursos; no se ha elaborado una clasificación de ventas ni se han probado sus aplicaciones completas desde una cuenta infantil.

## Qué aportan las referencias

| Referencia | Evidencia consultada | Decisión para Adri |
| --- | --- | --- |
| [Khan Academy Kids](https://khankids.zendesk.com/hc/en-us/articles/360014856151-Learning-Topics-Using-Khan-Academy-Kids-in-Educational-Settings) | Entrada directa al recorrido con Kodi y alternativa de biblioteca/salas; alternancia de contenidos y nivel ajustado a la práctica. | Mantener «Jugar con Adri» como acceso sencillo, con mundos que permitan reconocer las materias antes de leer sus nombres. |
| [Teach Your Monster](https://www.teachyourmonster.org/press-centre/press-centre-teach-your-monster-to-read/) | Personajes, escenarios y minijuegos que dan un propósito a leer. Su [balance de 2025](https://www.teachyourmonster.org/monster-news/2025-impact-report/) declara seis millones de niños y más de cincuenta millones de partidas en el conjunto de sus juegos durante ese año. Son cifras de la propia organización. | Dar una identidad visual a cada zona y hacer que acertar produzca una respuesta visible. La popularidad no demuestra por sí sola eficacia pedagógica. |
| [DragonBox Numbers](https://dragonbox.com/products/numbers) | Los Nooms representan cantidades y se manipulan; cuatro actividades trabajan el sentido numérico. La página enumera premios de 2016. | Conservar fichas, recta y descomposición como acciones con significado. Dar expresión a las fichas sin cambiar la unidad que representan. |
| [Duolingo ABC, documentación de Duolingo for Schools](https://duolingoschools.zendesk.com/hc/en-us/articles/4418426863373-What-else-can-duolingo-do-for-your-class) | Aprendizaje de lectura inicial mediante juego, fonética, escritura y vocabulario. | Mantener sesiones cortas y una acción fácil de reconocer. El contenido de lectura sigue pensado para español; no se traslada una secuencia fonética inglesa. |

Mi conclusión de diseño es que faltaba una ambientación reconocible y una respuesta visual más expresiva. Muchas pantallas tenían grandes superficies vacías y dependían de texto y unos pocos emojis. Las ilustraciones deben invitar a entrar y acompañar, mientras la evidencia necesaria para responder permanece clara.

## Cambios aplicados

- **Tres mundos propios:** pueblo de los cuentos con un zorro lector; isla de los números con un robot constructor; jardín de los descubrimientos con una rana exploradora. Los personajes de otras apps no se han reutilizado.
- **Selección de materias:** tarjetas ilustradas grandes, en columnas en escritorio y filas cómodas en móvil. El escenario y el nombre de la asignatura se ven juntos.
- **Misiones:** una escena sustituye al símbolo genérico. Los objetivos y botones se mantienen sobre superficies opacas; en pantallas de poca altura se priorizan título, imagen, avance y acción.
- **Portada:** fondo ilustrado suave que acompaña a Adri y conserva los botones y rótulos legibles.
- **Talleres y cuentos:** imágenes de entrada, opciones de cuento con aspecto de fichas y retratos de emoji más grandes. Adri, Juan y Cayetana siguen siendo los protagonistas elegibles.
- **Durante el juego:** escenario junto a Adri en escritorio, un pequeño apoyo visual de la materia en móvil y pictogramas literales en 16 presentaciones de respuestas. Solo se ilustran conjuntos completos de alternativas; no se dibuja exclusivamente la respuesta correcta.
- **Matemáticas:** las fichas activas tienen una expresión simpática. Cada ficha sigue representando una unidad y conserva su color, posición y botón.
- **Aciertos:** una pequeña postal con estrella y destellos acompaña la explicación. La animación es breve y respeta la preferencia de reducir movimiento.
- **Cierre y álbum:** el mundo acompaña la reflexión final y aparece suavemente en las colecciones, con el contenido por delante.

Actualización del 25 de octubre: se han incorporado metas narrativas por misión y tres construcciones visuales que crecen al resolver retos. El visor es opcional y los premios mantienen sus reglas anteriores. La implementación y sus comprobaciones están en [Aventuras y construcciones](aventuras-construcciones.md).

## Recursos y carga

Las imágenes se generaron con la herramienta integrada `image_gen`, siguiendo la habilidad imagegen. Los PNG originales se conservan en la carpeta de imágenes generadas de Codex. Para la app se exportaron JPEG a calidad 87, sin modificar la composición ni sus dimensiones de 1536 × 1024.

| Archivo final en el proyecto | Tamaño |
| --- | --- |
| `public/assets/worlds/reading-village.jpg` | 326 100 bytes |
| `public/assets/worlds/number-island.jpg` | 291 227 bytes |
| `public/assets/worlds/discovery-garden.jpg` | 314 979 bytes |

Total: 932 306 bytes, aproximadamente 0,93 MB. Los mismos archivos se reutilizan entre pantallas y se sirven desde la app; no se han añadido bibliotecas, peticiones a un proveedor de imágenes durante el juego ni servicios de pago. Las rutas respetan la base de GitHub Pages. Las imágenes ambientales son decorativas para lectores de pantalla y no sustituyen el texto accesible.

## Comprobación

Pasan las 62 pruebas de contenido, voz y progreso y la compilación de producción. Se revisaron 14 rutas en 320 × 568, 667 × 375 y 1280 × 720: 42 vistas sin desbordamientos ni imágenes rotas tras ajustar la tarjeta de Medio. Se repitieron las 42 con letra redonda y grande, y se comprobaron 20 vistas de preguntas con pictogramas en móvil y horizontal. También se completó un recorrido de Lengua y se comprobaron la celebración y el cierre en esos tamaños. Se conservan la voz elegida, las respuestas, las recompensas y los datos guardados.

Estas comprobaciones confirman el funcionamiento y el encaje visual. La respuesta de Adri al jugar permitirá valorar qué escenarios le motivan y si los dibujos le ayudan a comprender o le distraen.

## Prompts finales utilizados

### Pueblo de los cuentos

> Use case: illustration-story. Asset type: landscape illustrated world card for an educational Spanish app for children age 6, first grade. Create an ORIGINAL cheerful high-quality playful tactile 3D clay/paper children's storybook illustration, wide landscape composition approximately 3:2. A cozy tiny magical reading village: a large friendly open book forms a little house, curving path made of blank colorful page tiles, a small smiling orange fox with a backpack carrying an unmarked picture book, rounded pastel trees, a pencil-shaped tower, little clouds. Objects big, expressive, appealing, clean readable silhouettes, rich teal/coral/honey yellow color palette, soft warm light and subtle handmade texture. The whole scene should be self contained like a polished game level postcard; keep the fox and book house centrally framed with clear safe margins for mobile cropping. No human children. No letters, numbers, words, writing, logos, watermarks, UI controls or borders. Not a screenshot. No imitation of any existing app's mascot or art.

### Isla de los números

> Use case: illustration-story. Asset type: landscape game-world illustration for a first-grade educational app, children age six. Create an original richly appealing 3D clay/paper storybook scene, wide 3:2 landscape. A whimsical toy construction island with a tiny smiling turquoise robot, expressive friendly round eyes, no mouth details needed, building a colorful bridge with large chunky wooden cubes and rounded arches. Friendly geometric houses, a little toy rocket, rolling rounded hills, warm orange and cream sky. Soft crafted textures and warm lighting, polished children's game art, large simple silhouettes, primary focus robot and bridge in central safe area so mobile crops still read well. Cozy playful, not technical or industrial. Color palette golden yellow, turquoise, coral, lavender. Keep mathematical marks out of the image: no numbers, letters, text, equations, logos, watermarks, UI controls or borders. This is atmospheric game-world art, not an exercise or diagram. No humans, no imitation of existing mascots.

### Jardín de los descubrimientos

> Use case: illustration-story. Asset type: landscape game-world card for an educational app for six-year-old first graders. Original playful polished 3D clay/paper storybook illustration, wide landscape 3:2, matching cozy tactile children's game aesthetic. A curious round little green frog explorer with small yellow backpack and magnifying glass, looking gently at a large butterfly hovering beside a colorful blooming flower and seedling, a friendly garden pond, round leafy trees, small wooden footbridge, soft sunny mint blue sky and puffy clouds. Frog face and flower central safe area for mobile crops. Expressive friendly animals, rich lively but soft coral/yellow/leaf green/aqua palette, large clean silhouettes, subtle handmade textures and warm light. An inviting exploration world rather than a science diagram. No text, letters, numbers, logos, watermark, UI controls or frame. No humans, no existing franchise characters.
