export const clubPath='/primaria/club';
export const clubSections=[
  {id:'cuentos',title:'Cuentos',icon:'📚',cards:[
    {id:'merienda',title:'La merienda',description:'Un cuento y tres retos juntos',to:'/primaria/merienda',subject:'lengua',icon:'🧺'},
    {id:'semilla',title:'La semilla de Cayetana',description:'Escucha y descubre qué pasa',to:'/primaria/cuentos/semilla',subject:'medio',icon:'🌱'},
  ]},
  {id:'juegos',title:'Juegos',icon:'🎲',cards:[
    {id:'palabras',title:'Juego con palabras',description:'Sílabas, frases y pistas',to:'/primaria/taller/lengua',subject:'lengua',icon:'🔤'},
    {id:'numeros',title:'Juego con números',description:'Cantidades, figuras, caminos y monedas',to:'/primaria/mates',subject:'matematicas',icon:'🔢'},
    {id:'mundo',title:'Exploro mi mundo',description:'Observar, ordenar y descubrir',to:'/primaria/taller/medio',subject:'medio',icon:'🔎'},
    {id:'tres',title:'El reto de los tres',description:'Un reto de cada materia',to:'/primaria/aventura',subject:'matematicas',icon:'🤝'},
  ]},
  {id:'crear',title:'Crear',icon:'🎨',cards:[
    {id:'cuento',title:'Invento un cuento',description:'Elige personajes y cuenta tu historia',to:'/primaria/crea',subject:'lengua',icon:'✨'},
    {id:'album',title:'Mi álbum y diario',description:'Cómics, dibujos y descubrimientos',to:'/primaria/album',subject:'medio',icon:'🖼️'},
  ]},
];
export function clubSectionFor(value){return clubSections.find(section=>section.id===value)||clubSections[0];}
export function clubReturn(section){return `${clubPath}?zona=${clubSectionFor(section).id}`;}
