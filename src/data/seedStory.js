export const seedStory={
  id:'semilla-v1',title:'La semilla de Cayetana',
  pages:[
    {text:'Cayetana trae una semilla al cole. Adri y Juan preparan una maceta con tierra.',audioKey:'seed-story-1'},
    {text:'Los tres ponen la semilla en la tierra. La riegan un poquito y dejan la maceta cerca de la ventana.',audioKey:'seed-story-2'},
    {text:'Pasan unos días y aparece una hoja verde. Los amigos miran cómo crece y siguen cuidando su planta.',audioKey:'seed-story-3'},
  ],
  questions:[
    {id:'semilla-v1-1',question:'¿Qué plantaron los amigos?',options:[{text:'Una semilla',icon:'🌰'},{text:'Una piedra',icon:'🪨'},{text:'Una pelota',icon:'⚽'}],answer:'Una semilla',hint:'Cayetana llevó algo pequeño que podía crecer.',explanation:'Plantaron una semilla en una maceta con tierra.'},
    {id:'semilla-v1-2',question:'¿Qué necesitaba la planta?',options:[{text:'Un abrigo',icon:'🧥'},{text:'Agua y luz',icon:'☀️💧'},{text:'Caramelos',icon:'🍬'}],answer:'Agua y luz',hint:'Recuerda por qué regaron la maceta y la dejaron junto a la ventana.',explanation:'La planta necesita agua y luz para crecer.'},
    {id:'semilla-v1-3',question:'¿Cómo cuidaron su planta?',options:[{text:'La pisaron',icon:'👟'},{text:'La guardaron sin luz',icon:'📦'},{text:'La miraron y la regaron',icon:'🌱💧'}],answer:'La miraron y la regaron',hint:'Los amigos siguieron observando y cuidando su planta.',explanation:'Observaron cómo crecía y siguieron regándola con cuidado.'},
  ],
};
export const seedVoiceLines=[
 ...seedStory.pages.map(page=>({key:page.audioKey,text:page.text,filename:`${page.audioKey}.wav`})),
 ...seedStory.questions.map((q,i)=>({key:`seed-question-${i+1}`,text:q.question,filename:`seed-question-${i+1}.wav`})),
];
