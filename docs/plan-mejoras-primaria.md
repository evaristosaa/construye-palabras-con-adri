# Plan de tareas · Construye ideas con Adri

Origen: [análisis del 26 de octubre de 2026](revision-apps-primaria-2026-10-26.md).

Se desarrolla por entregas jugables. Cada tarea se marca terminada únicamente tras comprobar su funcionamiento. La voz aprobada, el progreso existente y los premios únicos son requisitos de todas las entregas.

## Entrega 1 · La merienda de los tres amigos — implementada

- [x] T01. Convertir el análisis en este plan y fijar la primera entrega.
- [x] T02. Proteger el guardado: copia local recuperable, errores de almacenamiento y exportación/importación validada desde Familia.
- [x] T03. Crear una aventura coherente con tres retos: preparar una cesta leyendo una nota, repartir seis trozos entre tres amigos y ordenar acciones de higiene.
- [x] T04. Introducir un minicuento ilustrado de tres páginas, narración con la voz aprobada y resaltado de la frase durante su reproducción.
- [x] T05. Añadir ayuda gradual dentro de la escena; conservar el trabajo al equivocarse y registrar si se utilizó apoyo.
- [x] T06. Recuperar la aventura después de cerrar o recargar; conceder cada premio una sola vez.
- [x] T07. Dar acceso directo desde Inicio y conservar la elección de materias y el abecedario.
- [x] T08. Preparar y comprobar las nuevas locuciones con la referencia aprobada, sin regenerar las anteriores.
- [x] T09. Ofrecer la descarga de la aplicación y de los recursos de esta aventura para jugar sin conexión, con actualización controlada.
- [x] T10. Comprobar datos, premios, copias, audio y compilación; recorrer la aventura en móvil, paisaje y escritorio.

Criterios de aceptación: todos los objetos se pueden poner y quitar mediante toques; los tres platos conservan la cantidad total; no es posible terminar sin resolver los tres retos; la ayuda no suma errores; repetir no duplica premios; los controles principales no requieren desplazamiento; el paquete solo figura descargado cuando sus recursos están completos.

## Entrega 2 · Más lectura y variedad de acciones

- [ ] T11. Añadir un segundo cuento piloto y validar ambos con observación familiar antes de ampliar a ocho–doce cuentos.
- [ ] T12. Separar escuchar el texto y escuchar la ayuda en las actividades de lectura existentes.
- [ ] T13. Incorporar el puente del diez y un constructor de patrones.
- [ ] T14. Incorporar composición de figuras y el camino de flechas de Juan, con alternativa al arrastre.
- [ ] T15. Incorporar la tienda con monedas y varias soluciones correctas.
- [ ] T16. Preparar variantes matemáticas acotadas con semilla estable; verificar dibujos, solución, pistas y explicación.
- [ ] T17. Optimizar imágenes y audio de distribución conservando los originales; medir tamaño y calidad antes/después.

## Entrega 3 · Adaptación y continuidad del aprendizaje

- [ ] T18. Etiquetar habilidades y prerrequisitos en el contenido existente.
- [ ] T19. Registrar apoyos y resolución independiente, separando esa evidencia de los premios.
- [ ] T20. Seleccionar práctica por habilidad, ejemplos diferentes y fechas distintas, manteniendo elección libre.
- [ ] T21. Mostrar en Familia un resumen comprensible de lo practicado y de los apoyos útiles, sin notas ni diagnósticos.
- [ ] T22. Ampliar paquetes offline por materia y recuperación de sesiones a los recorridos existentes.

## Entrega 4 · Crear, observar y compartir el juego

- [ ] T23. Guardar los cuentos creados; añadir un cómic editable de tres viñetas y dibujo propio.
- [ ] T24. Incorporar un diario de observación de plantas y tiempo con fechas y comparación de registros.
- [ ] T25. Incorporar turnos cooperativos en el mismo dispositivo y nuevas expresiones coherentes de los personajes.
- [ ] T26. Permitir una narración grabada voluntariamente, con escucha y borrado locales.

## Ampliaciones condicionadas a una necesidad real

- [ ] T27. Evaluar sincronización privada entre dispositivos si la familia la necesita; requiere servicio e identidad adicionales.
- [ ] T28. Evaluar distribución Android/iOS con un contenedor nativo después de comprobar la PWA.
- [ ] T29. Ensayar reconocimiento oral con habla infantil y acento local antes de utilizarlo como evaluación. No bloquea las entregas anteriores.

## Seguimiento

Las comprobaciones y decisiones de cada entrega se anotan aquí. El análisis describe objetivos y posibilidades; esta lista distingue lo implementado de lo pendiente.

### Entrega 1 · 26/10/2026

- Se conserva la clave y versión del progreso anterior; una copia automática permite recuperar un guardado ilegible. La importación exige formato válido y confirmación explícita de sustitución.
- Tres páginas de cuento y tres retos manipulativos con solución verificable. La cesta, los platos, el orden y los apoyos se guardan; los tres premios son únicos aunque se repita la aventura.
- Siete grabaciones añadidas al catálogo aprobado: 282 en total. Se mantienen las anteriores, incluida la bienvenida. Se valida texto y huella de cada grabación; el reparto se contrastó con un segundo transcriptor por una discrepancia del primero sobre «seis trozos».
- Narración con pausa, continuación y resaltado de la frase completa durante reproducción real. No se simula sincronización palabra a palabra.
- Familia → Sin conexión descarga Inicio y La merienda (aproximadamente 10,3 MiB). Cada recurso se verifica por tamaño y SHA-256 antes de dar la descarga por completa. Las otras materias siguen necesitando conexión.
- Comprobados recorrido, corrección de respuestas, recuperación tras recarga y exportación/importación mediante interfaz. Revisados 320×568, 390×844, 667×375 y 1280×720; controles principales visibles sin desplazar la partida.
- Comprobada recarga y reproducción de la voz con el servidor de pruebas apagado. Comprobada actualización explícita desde Familia; una nueva versión no fuerza una recarga durante el juego.
- Pruebas automatizadas: 82 de la app y 23 del validador de voz superadas. Cubren catálogo, cantidades, premios, recuperación, importación, descargas incompletas, audio por rangos y actualizaciones. Compilación de producción y 282 rutas de audio comprobadas.
- La medición por habilidades y apoyos en diferentes fechas queda para T18–T21. Los apoyos de este piloto se conservan en su partida; no constituyen una evaluación del aprendizaje.

Siguiente bloque: T11–T17, empezando por el segundo cuento piloto y la separación entre escuchar texto y pedir ayuda. Las observaciones reales de Adri servirán para ajustar el piloto antes de multiplicar contenidos.

### Ajustes tras probar la primera entrega

- Portada «¡Aventuras con Adri, Juan y Cayetana!». Se recupera Misiones como entrada principal y Abecedario utiliza el mismo botón grande que el resto.
- El enlace de salida del cuento es un botón «Menú»; se elimina Atrás entre fragmentos del cuento.
- El cuento reproduce seguidas las tres grabaciones aprobadas, cambia de escena y pasa al primer reto al terminar. Se puede pausar, continuar o empezar a jugar directamente. Si el navegador bloquea el arranque automático, un único toque inicia la narración completa.
- El parque utiliza el jardín ilustrado existente con manta y cesta de picnic; se incluye ese fondo en el paquete sin conexión.
- Comprobados pausa y continuación durante el segundo fragmento, avance automático a la cesta y botones visibles en móvil de 320×568. Se mantienen las 282 grabaciones anteriores sin regenerarlas.
- Corrección de reentrada: el cuento se presenta en cada visita a La merienda, también con una partida guardada. Al terminar se recupera el reto pendiente con sus objetos y ayudas. Si la aventura ya estaba resuelta, empieza una nueva vuelta después del cuento, sin repetir premios. Verificados una salida con una manzana en la cesta, el cuento automático al volver y la recuperación de esa manzana al acabar; 83 pruebas de la app superadas.
- Rediseño visual de los retos: escenario ilustrado por asignatura, los tres amigos en la escena, tarjeta cálida para jugar y botones de respuesta con color. El reto de sílabas incluye dibujo literal de la palabra, un botón de palmadas mayor y marcas de las palmadas dadas, sin mostrar cuántas se necesitan. Revisadas las siete mecánicas en 320×568 y 667×375, además de escritorio de 1280×800. La lectura, las decenas, el teclado y los tableros de veinte fichas ceden espacio decorativo a sus controles en pantallas pequeñas.
- Ajuste de altura en escritorio de 1280×720: la tarjeta conserva el espacio de su contenido y la escena ilustrada se reduce primero. Verificados los siete tipos de reto y los casos de lectura, opciones largas y veinte fichas, sin botones recortados por el contenedor.
