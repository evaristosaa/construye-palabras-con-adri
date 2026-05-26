# Saludo unico de Adri

## Objetivo

Adri se presenta con la frase `Soy Adri` una sola vez: al entrar en Inicio. Las demas pantallas usan su voz para orientar el juego sin repetir la presentacion.

## Alcance

- Inicio conserva una bienvenida que empieza por `Soy Adri`.
- Misiones comienza directamente con `Elige una mision`.
- El primer ejercicio de cada mision explica la accion sin `Soy Adri`.
- El boton de prueba de voz en Ajustes reproduce una invitacion breve sin presentacion.
- No se modifica todavia el motor de audio ni se integra Inworld en la aplicacion.

## Diseno

Los textos comunes de pantalla se extraen a `src/data/voiceScripts.js`, de modo que exista una unica fuente revisable para la presentacion y las instrucciones principales. Los juegos generados mantienen sus instrucciones en `learningData.js`, eliminando solamente el prefijo duplicado del primer ejercicio.

Una prueba de regresion importa los guiones y todos los juegos generados, y comprueba que `Soy Adri` aparece en Inicio y no en Misiones, Ajustes ni en las instrucciones de juego.

## Verificacion

- Ejecutar la prueba automatica del guion.
- Ejecutar el build de Vite.
- Abrir localmente Inicio, Misiones y la primera actividad de una mision, comprobando que las instrucciones visibles y disparadas corresponden a los nuevos textos.

