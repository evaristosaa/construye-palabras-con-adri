import {skillsForActivity} from "./learningSkills.js";
import { extendPrimaryActivity } from "./primaryExtensions.js";
// A guided practice selection for year 1, not a complete school curriculum.
export const primarySubjects = [
  { id: "lengua", title: "Lengua", icon: "📖", color: "blue", description: "Leo, comprendo y escribo" },
  { id: "matematicas", title: "Matemáticas", icon: "🔢", color: "orange", description: "Cuento, calculo y resuelvo" },
  { id: "medio", title: "Conocimiento del Medio", icon: "🌱", color: "green", description: "Observo, cuido y descubro" },
];
export const primaryStages = ["Empezamos", "Seguimos aprendiendo", "Un paso más"];
const choice = (question, answer, wrong, hint, extra = {}) => ({ type: "choice", question, answer: String(answer), options: [String(answer), ...wrong.map(String)], hint, ...extra });
const read = (passage, question, answer, wrong, hint) => choice(question, answer, wrong, hint, { passage });
const order = (question, pieces, answer, hint) => ({ type: "order", question, pieces, answer, hint });
const write = (question, answer, hint, extra = {}) => ({ type: "write", question, answer, hint, ...extra });
const unit = (id, title, goal, activities) => ({ id, title, goal, activities });

const lengua = [
  unit("palabras", "Palabras y sílabas", "Separar sílabas y formar palabras.", [
    choice("¿Cuántas sílabas tiene ca-sa?", "2", ["1", "3"], "Da una palmada por cada parte: ca / sa."),
    choice("¿Qué palabra tiene tres sílabas?", "pelota", ["sol", "mesa"], "Separa las palabras con palmadas."),
    order("Forma el nombre de algo que llevas de viaje.", ["ma", "le", "ta"], "maleta", "Empieza por ma. Separa la palabra en tres partes."),
    choice("¿Qué palabra rima con gato?", "pato", ["mesa", "luna"], "Escucha cómo termina cada palabra."),
    write("Escribe el nombre del astro que nos da luz durante el día.", "sol", "Tiene tres letras y empieza por s."),
    choice("¿Cuál está separada en sílabas correctamente?", "ca-mi-sa", ["cam-is-a", "c-ami-sa"], "Pronuncia despacio el nombre de la prenda."),
  ]),
  unit("frases", "Construyo frases", "Ordenar palabras para expresar una idea.", [
    order("Ordena la frase.", ["El", "gato", "duerme."], "El gato duerme.", "Empieza por El. El punto va al final."),
    choice("Completa: La niña ___ agua.", "bebe", ["vuela", "ladra"], "Piensa qué hacemos con el agua cuando tenemos sed."),
    choice("¿Qué frase tiene sentido?", "El perro corre.", ["La mesa ladra.", "La nube lee."], "Piensa qué puede hacer cada ser u objeto."),
    order("Ordena la frase.", ["Ana", "lee", "un", "cuento."], "Ana lee un cuento.", "Primero va quién hace la acción."),
    choice("¿Cuántas palabras tiene «Mi perro juega»?", "3", ["2", "4"], "Cuenta los grupos separados por espacios."),
    write("¿Cómo se llaman las partes que usa un pájaro para volar?", "alas", "Tiene dos. La palabra empieza por a."),
  ]),
  unit("comprendo", "Leo y comprendo", "Encontrar información en un texto breve.", [
    read("Lola tiene una mochila roja. Dentro lleva un cuento y una manzana.", "¿De qué color es la mochila?", "Roja", ["Azul", "Verde"], "Busca la palabra que acompaña a mochila."),
    read("Lola tiene una mochila roja. Dentro lleva un cuento y una manzana.", "¿Qué fruta lleva Lola?", "Una manzana", ["Una pera", "Una naranja"], "Vuelve a leer la segunda frase."),
    read("Pablo va al parque con su abuelo. Llevan una pelota. Después vuelven a casa.", "¿Con quién va Pablo al parque?", "Con su abuelo", ["Con su vecina", "Con su hermana"], "La primera frase dice quién lo acompaña."),
    read("Pablo va al parque con su abuelo. Llevan una pelota. Después vuelven a casa.", "¿Qué hacen al final?", "Vuelven a casa", ["Van al colegio", "Compran pan"], "Busca la palabra Después."),
    read("Hoy llueve. Inés se pone las botas y coge el paraguas antes de salir.", "¿Por qué coge Inés el paraguas?", "Porque llueve", ["Porque va a dormir", "Porque hace mucho calor"], "Relaciona lo que pasa al principio con lo que hace Inés."),
    choice("Para entender mejor un texto puedo…", "Volver a leerlo", ["Mirar solo la última letra", "Elegir sin leer"], "Leer otra vez nos ayuda a encontrar pistas."),
  ]),
  unit("puntuacion", "Mayúscula y punto", "Reconocer nombres propios y frases bien escritas.", [
    choice("¿Cómo se escribe este nombre?", "Adrián", ["adrián", "ADrián"], "Los nombres de personas empiezan por mayúscula."),
    choice("¿Qué frase empieza y termina bien?", "La luna brilla.", ["la luna brilla", "La luna brilla"], "Busca una mayúscula al principio y un punto al final."),
    order("Construye una frase bien escrita.", ["Mi", "amiga", "salta."], "Mi amiga salta.", "La palabra con mayúscula inicia la frase."),
    choice("¿Qué signo cierra una pregunta?", "?", [".", ","], "Piensa en el signo que usamos al preguntar."),
    choice("¿Cuál es una pregunta bien escrita?", "¿Dónde está mi libro?", ["Dónde está mi libro.", "¡Dónde está mi libro!"], "En español ponemos un signo al abrir y otro al cerrar la pregunta."),
    write("Escribe el nombre Ana empezando con mayúscula.", "Ana", "La primera letra es A.", { caseSensitive: true }),
  ]),
  unit("describo", "Así es y así se llama", "Usar vocabulario para describir y relacionar palabras.", [
    choice("Una pelota que no pesa mucho es…", "ligera", ["pesada", "cuadrada"], "Piensa en lo contrario de pesada."),
    choice("¿Qué palabra significa lo contrario de grande?", "pequeño", ["enorme", "alto"], "Busca una palabra que exprese el tamaño opuesto."),
    choice("¿Qué palabra pertenece a la familia de pan?", "panadero", ["zapatero", "jardinero"], "Busca una palabra que comparta una parte y se relacione con pan."),
    read("Mi gato es pequeño, blanco y muy tranquilo.", "¿Qué palabras nos dicen cómo es el gato?", "Pequeño, blanco y tranquilo", ["Mi gato", "Es y muy"], "Busca las palabras que describen su aspecto y su carácter."),
    order("Describe la flor.", ["La", "flor", "es", "amarilla."], "La flor es amarilla.", "Primero presenta el objeto y después di cómo es."),
    choice("¿Qué palabra nombra una acción?", "saltar", ["mesa", "verde"], "Busca algo que puedas hacer."),
  ]),
  unit("grupos", "Palabras con dos consonantes", "Leer y formar palabras con pr, pl, br, tr y fl.", [
    choice("Completa: ___ato. Es un objeto para servir comida.", "pl", ["tr", "br"], "Piensa en lo que pones sobre la mesa para comer."),
    order("Forma el nombre de un transporte que va por vías.", ["t", "r", "e", "n"], "tren", "Empieza por tr."),
    choice("¿Cuál empieza por br?", "brazo", ["pluma", "fruta"], "Mira las dos primeras letras de cada palabra."),
    choice("¿Cuál está escrita correctamente?", "flor", ["folr", "flro"], "Pronuncia la palabra antes de elegir."),
    write("Une pra y do y escribe la palabra completa.", "prado", "Primero escribe pra y después do."),
    read("Bruno planta una flor blanca junto al árbol.", "¿Qué planta Bruno?", "Una flor blanca", ["Un árbol rojo", "Una piedra"], "Busca la acción planta y lo que viene después."),
  ]),
  unit("cuentos", "Un cuento en tres pasos", "Reconocer personajes y ordenar lo que sucede.", [
    read("Un ratón encontró una semilla. La plantó y la regó. Al cabo de unos días nació una planta.", "¿Quién encontró la semilla?", "Un ratón", ["Una tortuga", "Una niña"], "Busca el personaje en la primera frase."),
    read("Un ratón encontró una semilla. La plantó y la regó. Al cabo de unos días nació una planta.", "¿Qué hizo después de encontrarla?", "La plantó y la regó", ["La tiró al río", "Se fue a dormir"], "Lee la segunda frase."),
    order("Ordena lo que sucede.", ["Primero planta.", "Después riega.", "Al final crece."], "Primero planta. Después riega. Al final crece.", "Fíjate en Primero, Después y Al final."),
    choice("¿Qué suele aparecer al principio de un cuento?", "Los personajes y el lugar", ["Siempre una receta", "Solo la última palabra"], "El comienzo nos ayuda a saber quién participa y dónde está."),
    read("Mara no encontraba su gorro. Buscó bajo la cama y allí lo encontró.", "¿Cómo resolvió Mara su problema?", "Buscando bajo la cama", ["Comprando un helado", "Abriendo el paraguas"], "Piensa qué acción le permitió encontrarlo."),
    choice("¿Qué título encaja con el cuento del ratón y la semilla?", "La semilla del ratón", ["Una carrera de coches", "El pez del mar"], "Un título se relaciona con lo más importante del cuento."),
  ]),
  unit("cotidianos", "Leo para hacer cosas", "Comprender notas, listas e instrucciones sencillas.", [
    read("NOTA: Adri, tu merienda está en la mochila. Nos vemos en el parque. Mamá.", "¿Dónde está la merienda?", "En la mochila", ["En el parque", "Debajo de la cama"], "Busca la frase que habla de la merienda."),
    read("LISTA DE LA COMPRA: pan, leche, tomates.", "¿Qué hay que comprar?", "Tomates", ["Zapatos", "Un balón"], "Lee los tres elementos de la lista."),
    order("Ordena estas instrucciones para lavarte las manos.", ["Moja las manos.", "Usa jabón.", "Aclara y seca."], "Moja las manos. Usa jabón. Aclara y seca.", "Primero usamos agua; al final nos secamos."),
    read("BIBLIOTECA: devolvemos los libros el viernes.", "¿Cuándo se devuelven los libros?", "El viernes", ["El lunes", "El domingo"], "Busca el día de la semana."),
    choice("¿Qué escribirías para recordar qué llevar de excursión?", "Una lista", ["Una suma", "Un número suelto"], "Necesitas anotar varios objetos."),
    write("Completa esta nota con cinco letras: Por favor, trae mi ___ para leer.", "libro", "Tiene páginas. Empieza por li."),
  ]),
];

const matematicas = [
  unit("numeros", "Números hasta el 20", "Contar, comparar y ordenar cantidades pequeñas.", [
    choice("¿Cuántas estrellas hay?", 6, [5, 7], "Cuenta cada estrella una sola vez.", { visual: "⭐ ⭐ ⭐\n⭐ ⭐ ⭐" }),
    choice("¿Qué número viene después del 12?", 13, [11, 14], "Avanza un paso desde el 12."),
    choice("¿Qué número va antes del 20?", 19, [18, 21], "Retrocede un paso desde el 20."),
    choice("¿Cuál es el mayor?", 17, [9, 12], "Piensa cuál está más lejos del cero."),
    choice("Completa: 6, 7, __, 9.", 8, [5, 10], "La serie avanza de uno en uno."),
    choice("¿Qué cantidad es igual a diez?", "10", ["1", "20"], "Diez unidades forman una decena."),
  ]),
  unit("sumas", "Junto y sumo", "Comprender la suma con resultados hasta 10.", [
    choice("2 + 3 =", 5, [4, 6], "Empieza en 2 y cuenta tres más.", { visual: "🟡 🟡  +  🟡 🟡 🟡" }),
    choice("4 + 1 =", 5, [3, 6], "Sumar uno es avanzar un número."),
    choice("3 + 3 =", 6, [5, 7], "Junta dos grupos de tres."),
    choice("5 + 0 =", 5, [0, 6], "Si no añades nada, la cantidad no cambia."),
    choice("¿Qué falta? 4 + __ = 7.", 3, [2, 4], "Cuenta cuántos pasos hay de 4 a 7."),
    choice("Tienes 6 piezas y consigues 2 más. ¿Cuántas tienes?", 8, [4, 7], "Conseguir más piezas significa sumar."),
  ]),
  unit("restas", "Quito y resto", "Comprender la resta con números hasta 10.", [
    choice("5 − 2 =", 3, [2, 4], "Imagina cinco objetos y aparta dos."),
    choice("7 − 1 =", 6, [5, 8], "Restar uno es retroceder un número."),
    choice("8 − 3 =", 5, [4, 6], "Retrocede tres pasos desde el ocho."),
    choice("6 − 0 =", 6, [0, 5], "Si no quitas nada, no cambia la cantidad."),
    choice("4 − 4 =", 0, [1, 4], "Si quitas todos los objetos, ¿cuántos quedan?"),
    choice("Hay 9 lápices. Guardas 3 en una caja. ¿Cuántos quedan fuera?", 6, [5, 12], "Quita del grupo los lápices que guardas."),
  ]),
  unit("decenas", "Decenas y unidades", "Representar y comparar números hasta 99.", [
    choice("Una decena son…", "10 unidades", ["1 unidad", "100 unidades"], "Forma un grupo con diez objetos."),
    choice("2 decenas y 4 unidades forman…", 24, [42, 6], "Cada decena vale diez."),
    choice("El número 35 tiene…", "3 decenas y 5 unidades", ["5 decenas y 3 unidades", "3 unidades"], "La primera cifra cuenta las decenas."),
    choice("¿Cuál es mayor?", 52, [25, 49], "Compara primero las decenas."),
    choice("Completa: 10, 20, 30, __.", 40, [31, 50], "Cada salto añade una decena."),
    choice("¿Qué número está entre 68 y 70?", 69, [67, 71], "Cuenta de uno en uno desde el 68."),
  ]),
  unit("calculo", "Calculo hasta el 20", "Sumar y restar usando el diez como apoyo.", [
    choice("10 + 6 =", 16, [6, 15], "Una decena y seis unidades."),
    choice("12 + 3 =", 15, [9, 16], "Desde 12 avanza tres pasos."),
    choice("18 − 5 =", 13, [12, 14], "Quita cinco unidades sin cambiar la decena."),
    choice("8 + 2 =", 10, [9, 11], "Piensa cuánto le falta al ocho para llegar al diez."),
    choice("9 + 4 =", 13, [12, 14], "Puedes hacer 9 + 1 y después sumar lo que queda."),
    choice("15 − 5 =", 10, [5, 11], "Quita las cinco unidades y conserva la decena."),
  ]),
  unit("problemas", "Problemas de cada día", "Elegir una operación y comprobar el resultado.", [
    choice("En una caja hay 4 coches y en otra 5. ¿Cuántos hay en total?", 9, [1, 8], "En total significa juntar los dos grupos."),
    choice("Tienes 12 pegatinas y regalas 2. ¿Cuántas conservas?", 10, [14, 9], "Regalar hace que tengas menos."),
    choice("Hay 6 niñas y 7 niños en el patio. ¿Cuántas personas hay?", 13, [12, 14], "Cuenta los dos grupos juntos."),
    choice("Un libro tiene 10 páginas. Has leído 4. ¿Cuántas te faltan?", 6, [4, 14], "Quita del total las páginas ya leídas."),
    choice("Tienes 3 canicas y quieres llegar a 8. ¿Cuántas te faltan?", 5, [4, 11], "Cuenta desde tres hasta ocho."),
    choice("Para comprobar 9 − 4 = 5 puedo hacer…", "5 + 4 = 9", ["5 − 4 = 1", "9 + 4 = 13"], "Junta lo que queda con lo que has quitado."),
  ]),
  unit("formas", "Formas, lugares y series", "Reconocer figuras, posiciones y patrones.", [
    choice("¿Qué figura tiene tres lados?", "Triángulo", ["Cuadrado", "Círculo"], "Cuenta los lados de cada figura."),
    choice("Un cuadrado tiene…", "4 lados iguales", ["3 lados", "Ningún lado recto"], "Imagina el borde de una baldosa cuadrada."),
    choice("¿Qué sigue? 🔴 🔵 🔴 🔵 __", "🔴", ["🔵", "🟡"], "Se repiten dos colores, siempre en el mismo orden."),
    choice("Un lápiz guardado en una caja está…", "Dentro", ["Fuera", "Encima"], "La caja rodea al lápiz."),
    choice("¿Qué objeto tiene forma de esfera?", "Una pelota", ["Un dado", "Una hoja de papel"], "Busca el objeto redondo que puede rodar en muchas direcciones."),
    choice("Completa la serie: 2, 4, 6, __.", 8, [7, 9], "Cada salto suma dos."),
  ]),
  unit("vida", "Tiempo, medidas y monedas", "Usar números para organizar situaciones cotidianas.", [
    choice("¿Qué día viene después del martes?", "Miércoles", ["Lunes", "Jueves"], "Recita los días de la semana en orden."),
    choice("¿Qué hacemos normalmente antes: desayunar o cenar?", "Desayunar", ["Cenar", "Siempre a la vez"], "Piensa en el comienzo del día."),
    choice("¿Qué usarías para medir el largo de un lápiz?", "Una regla", ["Una balanza", "Un reloj"], "Necesitas una herramienta que mida longitudes."),
    choice("¿Qué recipiente suele contener más agua?", "Un cubo", ["Una cucharilla", "Un tapón"], "Compara el espacio que hay dentro."),
    choice("Tienes una moneda de 2 euros y otra de 1 euro. ¿Cuánto dinero tienes?", "3 euros", ["1 euro", "2 euros"], "Suma el valor de las dos monedas."),
    choice("Un cuento cuesta 5 euros. Pagas con 10 euros. ¿Cuánto deben devolverte?", "5 euros", ["10 euros", "15 euros"], "Quita del dinero que entregas el precio del cuento."),
  ]),
];

const medio = [
  unit("cuerpo", "Mi cuerpo y mis sentidos", "Relacionar sentidos, partes del cuerpo y cuidados.", [
    choice("¿Con qué sentido escuchamos música?", "Oído", ["Vista", "Gusto"], "Piensa en la parte del cuerpo que escucha."),
    choice("¿Qué parte del cuerpo usamos para ver?", "Ojos", ["Orejas", "Rodillas"], "Es la parte que cubrimos al jugar a la gallinita ciega."),
    choice("¿Qué sentido nos ayuda a notar si algo es suave?", "Tacto", ["Olfato", "Gusto"], "Podemos notarlo al tocar con la piel."),
    choice("¿Qué ayuda a proteger la piel del sol?", "Sombra, ropa y protección solar", ["Mirar al sol", "No beber agua"], "La piel necesita protección cuando el sol es fuerte."),
    choice("¿Qué parte se dobla cuando flexionas una pierna?", "Rodilla", ["Codo", "Cuello"], "Está entre el muslo y la parte baja de la pierna."),
    choice("Si algo desconocido huele raro, debo…", "Avisar a una persona adulta", ["Probarlo", "Acercarlo mucho a la nariz"], "Podemos observar sin ponernos en peligro."),
  ]),
  unit("habitos", "Me cuido cada día", "Reconocer hábitos de higiene, alimentación y descanso.", [
    choice("¿Cuándo conviene lavarse las manos?", "Antes de comer", ["Solo cuando llueve", "Nunca después de jugar"], "Antes de tocar la comida, las manos deben estar limpias."),
    choice("¿Qué ayuda a tener una alimentación variada?", "Comer alimentos de distintos grupos", ["Comer siempre lo mismo", "Tomar solo dulces"], "Nuestro cuerpo necesita alimentos diferentes."),
    choice("¿Qué bebida elegimos normalmente para calmar la sed?", "Agua", ["Refresco azucarado", "Bebida energética"], "Es la bebida sencilla que nuestro cuerpo necesita cada día."),
    choice("¿Qué ayuda a descansar por la noche?", "Tener una rutina tranquila", ["Jugar con pantallas hasta muy tarde", "No dormir"], "Antes de acostarnos podemos bajar el ritmo."),
    choice("Mover el cuerpo y jugar al aire libre…", "Ayuda a cuidarnos", ["No sirve para nada", "Sustituye siempre al descanso"], "El movimiento y el descanso son importantes."),
    choice("¿Para qué nos cepillamos los dientes?", "Para mantenerlos limpios", ["Para cambiar su número", "Para no volver a comer"], "Quitamos restos de comida y cuidamos la boca."),
  ]),
  unit("convivo", "Emociones y convivencia", "Identificar emociones y resolver pequeños conflictos.", [
    choice("Si una actividad me cuesta, puedo…", "Pedir ayuda y volver a probar", ["Decir que nunca aprenderé", "Romper el material"], "Equivocarse forma parte de aprender."),
    choice("Si alguien está hablando, es respetuoso…", "Escuchar y esperar el turno", ["Gritar más fuerte", "Interrumpir siempre"], "Todas las personas necesitan poder expresarse."),
    choice("Si estoy enfadado, puede ayudarme…", "Parar y respirar despacio", ["Empujar a alguien", "Tirar objetos"], "Primero calmamos el cuerpo; después hablamos."),
    choice("Un compañero está solo y quiere jugar. Puedo…", "Invitarlo a participar", ["Reírme de él", "Esconder sus cosas"], "Piensa qué le ayudaría a sentirse incluido."),
    choice("Cuando necesito un material de otra persona, debo…", "Pedirlo y respetar su respuesta", ["Cogerlo sin preguntar", "Esconderlo después"], "Podemos pedir las cosas con respeto."),
    choice("Las familias…", "Pueden ser diferentes y merecen respeto", ["Son todas iguales", "Solo tienen una forma"], "Hay muchas maneras de vivir y cuidarse en familia."),
  ]),
  unit("animales", "Seres vivos y animales", "Distinguir seres vivos y observar características de animales.", [
    choice("¿Cuál es un ser vivo?", "Un caracol", ["Una piedra", "Una silla"], "Los seres vivos crecen y tienen necesidades."),
    choice("¿Qué necesita un pez para respirar y vivir?", "Agua adecuada a su especie", ["Un cajón seco", "Solo arena"], "Piensa en su hábitat."),
    choice("¿Qué animal tiene plumas?", "Un gorrión", ["Un gato", "Una rana"], "Las plumas cubren el cuerpo de las aves."),
    choice("¿Qué animal es mamífero?", "Un perro", ["Una mariposa", "Una sardina"], "Sus crías se alimentan de leche materna."),
    choice("¿Cómo cuidamos a un animal?", "Respetando sus necesidades", ["Dándole cualquier comida", "Molestándolo cuando descansa"], "Cada especie necesita alimento, agua y un entorno adecuados."),
    choice("Una mariposa es…", "Un insecto", ["Un pez", "Un mamífero"], "Tiene seis patas en su etapa adulta."),
  ]),
  unit("plantas", "Plantas y sus cuidados", "Reconocer partes de una planta y lo que necesita.", [
    choice("¿Qué parte de la planta suele absorber agua del suelo?", "La raíz", ["La flor", "El fruto"], "Está normalmente bajo la tierra."),
    choice("¿Qué parte sostiene las hojas?", "El tallo", ["La semilla", "El fruto"], "Une la raíz con las partes que vemos arriba."),
    choice("Para crecer, una planta necesita…", "Agua, luz y aire", ["Solo juguetes", "Oscuridad constante"], "Piensa en lo que recibe una planta en un jardín."),
    choice("Dentro de muchos frutos encontramos…", "Semillas", ["Piedras de metal", "Tornillos"], "A partir de ellas pueden crecer nuevas plantas."),
    choice("Para saber si una semilla crece podemos…", "Observarla y anotar los cambios", ["Arrancarla cada día", "Adivinar sin mirar"], "La ciencia empieza observando con cuidado."),
    choice("¿Cómo cuidamos las plantas de un parque?", "Respetándolas sin arrancarlas", ["Pisándolas", "Rompiendo sus ramas"], "Las plantas forman parte del entorno de todos."),
  ]),
  unit("materiales", "Materiales y descubrimientos", "Observar propiedades, luz y cambios sencillos.", [
    choice("¿Qué material deja pasar la luz y permite ver a través?", "Vidrio transparente", ["Madera", "Cartón"], "Piensa en el material de muchas ventanas."),
    choice("¿Qué objeto suele ser flexible?", "Una goma elástica", ["Un ladrillo", "Una piedra"], "Flexible significa que se puede doblar o estirar con facilidad."),
    choice("¿Qué ocurre con un hielo si se calienta?", "Se derrite y pasa a agua líquida", ["Se vuelve madera", "Siempre queda igual"], "Observa qué pasa con un cubito fuera del congelador."),
    choice("¿Cuál es una fuente natural de luz?", "El Sol", ["Una linterna", "Una bombilla"], "Busca la que no ha fabricado una persona."),
    choice("Un imán atrae con facilidad…", "Un clip de hierro", ["Un papel", "Una pieza de madera"], "No todos los materiales son atraídos por un imán."),
    choice("Antes de hacer un experimento debo…", "Seguir las indicaciones y pedir ayuda si hace falta", ["Probar sustancias desconocidas", "Usar cualquier herramienta sin preguntar"], "Investigar también implica cuidar nuestra seguridad."),
  ]),
  unit("entorno", "Mi barrio y el planeta", "Cuidar espacios compartidos y actuar con responsabilidad.", [
    choice("Para cruzar una calle debo…", "Usar un paso seguro y mirar con atención", ["Correr sin mirar", "Mirar solo el móvil"], "Cruzar requiere comprobar que sea seguro, aunque haya paso de peatones."),
    choice("¿Qué ayuda a ahorrar agua?", "Cerrar el grifo mientras me enjabono", ["Dejarlo abierto sin usarlo", "Abrir todos los grifos"], "Usamos solo el agua que necesitamos."),
    choice("Si vemos basura en un parque, lo adecuado es…", "Usar las papeleras y avisar si es peligrosa", ["Tirarla al río", "Esconderla bajo una planta"], "Cuidamos los espacios comunes sin tocar residuos peligrosos."),
    choice("¿Qué profesión ayuda a cuidar nuestra salud?", "Personal de enfermería", ["Personal de jardinería", "Personal de panadería"], "Piensa en las personas que trabajan en un centro de salud."),
    choice("Si una prenda aún se puede usar, podemos…", "Cuidarla, repararla o reutilizarla", ["Tirarla siempre", "Romperla"], "Reutilizar ayuda a reducir residuos."),
    choice("¿Qué hacemos si aparece un mensaje extraño en una pantalla?", "Avisar a una persona adulta de confianza", ["Dar nuestra dirección", "Aceptar todo"], "En internet también necesitamos ayuda y cuidados."),
  ]),
  unit("tiempo", "El tiempo y los cambios", "Observar el tiempo atmosférico y ordenar cambios cotidianos.", [
    choice("Si vemos gotas caer de las nubes, está…", "Lloviendo", ["Nevando siempre", "Haciendo viento necesariamente"], "Observa cómo es el agua que cae."),
    choice("¿Qué instrumento mide la temperatura?", "Un termómetro", ["Una regla", "Una brújula"], "Su escala nos dice si hace más frío o calor."),
    choice("¿Qué estación viene después de la primavera?", "Verano", ["Invierno", "Otoño"], "Recita las cuatro estaciones en orden."),
    choice("¿Qué ocurrió antes en tu vida?", "Nacer", ["Empezar Primaria", "Aprender a escribir tu nombre"], "Ordena los hechos desde el principio."),
    choice("Para comparar cómo ha cambiado una calle podemos…", "Mirar fotos antiguas y actuales", ["Mirar solo una piedra", "Inventar los cambios"], "Busca pruebas que muestren dos momentos diferentes."),
    choice("Para saber si una planta crece más durante una semana conviene…", "Medirla y anotar la fecha", ["Mirarla una vez sin anotar", "Cambiar de planta cada día"], "Compara observaciones de la misma planta en distintos días."),
  ]),
];

function mixed(items, seed) {
  const result = [...items];
  let value = [...seed].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 17);
  for (let index = result.length - 1; index > 0; index -= 1) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const other = value % (index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export const primaryMissions = Object.entries({ lengua, matematicas, medio }).flatMap(([subject, units]) =>
  units.map((entry, unitIndex) => {
    const id = `primaria-${subject}-${entry.id}`;
    return { ...entry, id, subject, stage: unitIndex < 3 ? 0 : unitIndex < 6 ? 1 : 2, number: unitIndex + 1,
      activities: entry.activities.map((raw, index) => { const activity = extendPrimaryActivity(raw, entry.id, index); return ({ ...activity, id: `${id}-${index + 1}`, skills:skillsForActivity(`${id}-${index + 1}`),
        ...(activity.options ? { options: mixed(activity.options, `${id}-${index}`) } : {}),
        ...(activity.pieces ? { pieces: mixed(activity.pieces, `${id}-${index}`) } : {}),
      }); }),
    };
  })
);
export const primaryMissionsById = Object.fromEntries(primaryMissions.map(mission => [mission.id, mission]));
export const primaryActivityCount = primaryMissions.reduce((total, mission) => total + mission.activities.length, 0);

export function normalizePrimaryAnswer(value) {
  return String(value).normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
}
export function isPrimaryAnswerCorrect(activity, value) {
  if (activity.type !== "write" || activity.caseSensitive) return String(value).trim() === activity.answer;
  return normalizePrimaryAnswer(value) === normalizePrimaryAnswer(activity.answer);
}
export function assembledPrimaryAnswer(activity, indices) {
  const pieces = indices.map(index => activity.pieces[index]);
  return pieces.join(activity.answer.includes(" ") ? " " : "");
}
export function getPrimaryRecommendation(subject, completed = []) {
  return primaryMissions.find(mission => mission.subject === subject && !completed.includes(mission.id));
}
