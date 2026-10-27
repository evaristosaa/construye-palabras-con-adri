export const patternSymbols=[{id:'circle',label:'Círculo',glyph:'●'},{id:'triangle',label:'Triángulo',glyph:'▲'},{id:'square',label:'Cuadrado',glyph:'■'}];
export function patternContinuation(unit,offset,length){
  if(!Array.isArray(unit)||unit.length<1||!unit.every(id=>patternSymbols.some(s=>s.id===id)))throw Error('Patrón no válido');
  if(!Number.isInteger(offset)||offset<0||!Number.isInteger(length)||length<1||length>12)throw Error('Longitud no válida');
  return Array.from({length},(_,i)=>unit[(offset+i)%unit.length]);
}
export function patternAnswer(pieces){return pieces.join('|');}
export function placePatternPiece(pieces,id){
  if(!patternSymbols.some(s=>s.id===id))return pieces;
  const empty=pieces.indexOf(null);
  return empty<0?pieces:pieces.map((old,i)=>i===empty?id:old);
}
export function removePatternPiece(pieces,index){return pieces.map((old,i)=>i===index?null:old);}
export function bridgeGroups(total,left){
  if(![10,20].includes(total)||!Number.isInteger(left)||left<0||left>total)throw Error('Reparto no válido');
  return Array.from({length:total},(_,i)=>i<left?'blue':'yellow');
}
