# Corrección del abecedario · 27/10/2026

Problema reproducido: el ejercicio de formar «waterpolo» tenía nueve bloques y el panel recortaba los inferiores en un móvil de 320×568. La anchura reservada al acompañante y al dibujo, los mínimos de las columnas y la altura de los bloques no dejaban sitio al contenido.

Cambios:

- La partida usa el alto disponible y un acceso directo a Abecedario. Las piezas se distribuyen en tres columnas en móvil y cinco en apaisado; los controles conservan al menos 44 píxeles y no requieren desplazar la partida.
- La instrucción queda visible aunque el personaje acompañante se oculte en pantallas pequeñas. Los dibujos de apoyo no muestran etiquetas genéricas que contradigan la palabra; waterpolo tiene su propio pictograma.
- Cada bloque representa una pieza concreta. Las dos O de waterpolo son dos piezas distintas; una pieza usada no se vuelve a consumir. Quitar última letra devuelve la pieza a su sitio.
- Un error conserva el prefijo correcto. Las respuestas quedan bloqueadas durante el breve avance automático y el temporizador se cancela al salir: los toques rápidos no saltan dos retos.
- La voz aprobada y los identificadores de premios se conservan.

Comprobación: 101 pruebas automatizadas y compilación de producción correctas. Construcción verificada para las 27 palabras del catálogo, incluidas letras repetidas y entradas no válidas. «Waterpolo» completado mediante interfaz, con prueba de deshacer; sus nueve piezas y el botón de deshacer se comprobaron por posición, tamaño y recepción del toque en 320×568, 390×844, 667×375, 568×320 y 1280×720. «Unicornio» y «zanahoria» comprobados también en 320×568. Se recorrieron los ocho formatos de juego de la W.
