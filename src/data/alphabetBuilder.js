export function placeAlphabetBlock(game,indices,index){
  if(!Number.isInteger(index)||index<0||index>=game.blocks.length||indices.includes(index))return {indices,accepted:false,complete:false};
  const next=[...indices,index],text=next.map(i=>game.blocks[i]).join('');
  if(!game.answer.startsWith(text))return {indices,accepted:false,complete:false};
  return {indices:next,accepted:true,complete:text===game.answer};
}
