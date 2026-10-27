export const learningWorlds=Object.freeze({
  lengua:{title:"El pueblo de los cuentos",file:"reading-village.webp",friend:"Un zorro lector",position:"35% 60%"},
  matematicas:{title:"La isla de los números",file:"number-island.webp",friend:"Un robot constructor",position:"36% 50%"},
  medio:{title:"El jardín de los descubrimientos",file:"discovery-garden.webp",friend:"Una rana exploradora",position:"35% 58%"},
});
export function worldFor(subject){return learningWorlds[subject]||learningWorlds.matematicas;}
export function worldAsset(subject,base="/"){return `${base}assets/worlds/${worldFor(subject).file}`;}
