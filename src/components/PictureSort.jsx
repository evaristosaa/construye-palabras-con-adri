import { useState } from "react";

export default function PictureSort({ activity, solved, onComplete, onWrong }) {
  const [position,setPosition] = useState(0);
  const [answers,setAnswers] = useState([]);
  const item = activity.items[position];
  function choose(category) {
    if (solved) return;
    if (category !== item.category) { onWrong(); return; }
    const next = [...answers,category];
    setAnswers(next);
    if (position === activity.items.length - 1) onComplete(next.join("|"));
    else setPosition(value=>value+1);
  }
  return <div className="picture-sort"><p className="sort-step">Dibujo {position+1} de {activity.items.length}</p><div className="sort-picture" aria-live="polite"><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></div><div className="sort-categories">{activity.categories.map((category,index)=><button key={category} className="primary-secondary-button" disabled={solved} onClick={()=>choose(index)}>{category}</button>)}</div></div>;
}
