export const classmates=Object.freeze([
  {id:"adri",name:"Adri",icon:"🧒",image:"adri-clean.webp"},
  {id:"juan",name:"Juan",icon:"👦",image:"characters/juan-comic-v1.webp"},
  {id:"cayetana",name:"Cayetana",icon:"👧",image:"characters/cayetana-colegio-v3.webp"},
]);
export function classmateFor(name){return classmates.find(c=>c.name===name||c.id===name)||classmates[0];}
export function classmateAt(index){return classmates[((index%classmates.length)+classmates.length)%classmates.length]||classmates[0];}
export function classmateAsset(name,base="/"){return `${base}assets/${classmateFor(name).image}`;}
