import {bridgeGroups} from '../data/patternBuilder.js';

export default function TenBridge({left,total}){
 return <div className="ten-bridge" role="img" aria-label={`Puente de ${total}: ${left} fichas azules y ${total-left} amarillas`}>
  <span className="bridge-bank bank-left">{left}</span><div className="bridge-deck">{bridgeGroups(total,left).map((color,i)=><span key={i} className={`bridge-board ${color}`}/>)}</div><span className="bridge-bank bank-right">{total-left}</span><div className="bridge-river" aria-hidden="true">≈ ≈ ≈</div>
 </div>;
}
