// Small, bounded templates. A saved seed identifies the entire example.
export function seededNumber(seed) {
  let value=2166136261;
  for(const char of String(seed)) value=Math.imul(value^char.charCodeAt(0),16777619)>>>0;
  return value;
}
export const explorationGames=[{id:'figuras',title:'El mosaico de Adri',icon:'🧩'},{id:'camino',title:'El camino de Juan',icon:'🧭'},{id:'tienda',title:'La tienda de Cayetana',icon:'🪙'}];
export function buildExploration(id,seed=1){
  const n=seededNumber(seed);
  if(id==='figuras') {
    const targets=[[0,90,180,270],[90,180,270,0],[180,270,0,90]];
    return {id,seed,rotations:targets[n%3],question:'Completa el molinillo de cuatro triángulos.',hint:'Elige una pieza, gírala y toca un hueco. Las puntas se unen en el centro.',explanation:'Cuatro triángulos componen este molinillo. Girarlos cambia su posición, no sus lados.'};
  }
  if(id==='camino') {
    const goals=[[2,2],[3,1],[1,3]],goal=goals[n%goals.length];
    return {id,seed,start:[0,0],goal,size:4,maxSteps:8,question:'Lleva a Juan hasta la mochila.',hint:'Empieza arriba a la izquierda. Cada flecha mueve una casilla. Puedes quitar flechas y probar.',explanation:'Una secuencia de flechas puede llevar al mismo lugar por distintos caminos.'};
  }
  return {id:'tienda',seed,price:3+n%6,question:'Prepara el pago exacto para la fruta.',hint:'Cada moneda vale 1 o 2 euros. Toca una para ponerla y tócala en la bandeja para quitarla.',explanation:'Podemos pagar la misma cantidad con monedas diferentes. Importa cuánto valen juntas.'};
}
export function tracePath(arrows,size=4){
  let x=0,y=0; const trail=[[x,y]];
  for(const arrow of arrows){const delta={right:[1,0],left:[-1,0],down:[0,1],up:[0,-1]}[arrow];if(!delta)return {valid:false,trail}; x+=delta[0];y+=delta[1]; if(x<0||y<0||x>=size||y>=size)return {valid:false,trail}; trail.push([x,y]);}
  return {valid:true,trail,end:[x,y]};
}
export function explorationCorrect(activity,work){
  if(activity.id==='figuras')return work.tiles?.length===4&&work.tiles.every((r,i)=>r===activity.rotations[i]);
  if(activity.id==='camino'){const result=tracePath(work.arrows||[],activity.size);return result.valid&&result.end.every((v,i)=>v===activity.goal[i]);}
  return Array.isArray(work.coins)&&work.coins.length>0&&work.coins.every(n=>n===1||n===2)&&work.coins.reduce((a,b)=>a+b,0)===activity.price;
}
