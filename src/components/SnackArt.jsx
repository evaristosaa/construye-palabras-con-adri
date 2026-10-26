export function SnackIcon({ kind, className = "" }) {
  const line = { stroke: "#653b25", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
  return <svg className={`snack-icon ${className}`} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
    {kind === "apple" && <g {...line}><path d="M40 23C10 7 4 49 23 66c9 9 13 4 17 4s10 5 18-4C78 47 69 9 40 23Z" fill="#ff6e60"/><path d="m40 24 2-13" fill="none"/><path d="M43 17c2-12 18-11 19-9-1 9-12 13-19 9Z" fill="#92ce54"/><path d="M22 33c-4 7-5 14-1 19" stroke="#ffd8b8" strokeWidth="5"/><circle cx="33" cy="47" r="1.5"/><circle cx="50" cy="47" r="1.5"/><path d="M36 56q6 5 11-1" fill="none"/></g>}
    {kind === "water" && <g {...line}><path d="M31 8h18v13l8 10v35q0 8-8 8H31q-8 0-8-8V31l8-10Z" fill="#d7f4ff"/><rect x="29" y="6" width="22" height="10" rx="3" fill="#78b5f6"/><path d="M24 43q9-6 17 0t15 0v22q0 7-7 7H31q-7 0-7-7Z" fill="#6acfe8" stroke="none"/><path d="M31 30v9m0 11v12" stroke="white" strokeWidth="5"/><circle cx="40" cy="54" r="1.5"/><circle cx="49" cy="54" r="1.5"/><path d="M41 61q4 3 7-1" fill="none"/></g>}
    {kind === "banana" && <g {...line}><path d="M18 16q-8 34 27 40 17 3 24-12-2 25-25 27C12 72 2 38 12 18Z" fill="#ffe16a"/><path d="M18 16q-1 35 28 40" fill="none" stroke="#e5a532"/><path d="m12 19 3-9 7 2-4 8M67 45l7-2-2 7" fill="#a27646"/><circle cx="36" cy="58" r="1.5"/><circle cx="48" cy="60" r="1.5"/></g>}
    {kind === "piece" && <g {...line}><path d="M10 53 58 15q24 47-28 55Z" fill="#fff0b0"/><path d="M10 53q15 24 38 8 25-16 10-46l7-5q22 40-13 61Q24 86 6 59Z" fill="#ff6d5c"/><path d="m40 35 1 8m7-15 2 8" stroke="#91613a"/></g>}
    {kind === "wash" && <g {...line}><rect x="7" y="12" width="49" height="9" rx="4" fill="#80bacc"/><path d="M50 20v9h15V14q0-8-10-8H41" fill="#a3d5df"/><path d="M57 36v9m8-7v8m-15-8v8" stroke="#159dcf"/><path d="m13 59 14-7 14 6 14-7 10 8-14 12-22-2Z" fill="#ffd1b2"/><circle cx="18" cy="44" r="5" fill="white"/><circle cx="31" cy="38" r="7" fill="white"/><circle cx="43" cy="48" r="5" fill="white"/></g>}
    {kind === "table" && <g {...line}><path d="M8 34 26 19h43v22H8Z" fill="#ffd183"/><path d="M8 41v26m16-26v23m39-23v26" fill="none" strokeWidth="6"/><ellipse cx="42" cy="28" rx="14" ry="6" fill="#fff9ef"/><path d="M64 14v10m5-9v8" stroke="#7b9db3"/></g>}
    {kind === "eat" && <g {...line}><ellipse cx="40" cy="42" rx="31" ry="24" fill="#a6dfb3"/><ellipse cx="40" cy="42" rx="23" ry="17" fill="#fffaf0"/><path d="m30 42 8-13 11 12-9 13Z" fill="#ffb75b"/><path d="m22 55 5-9m28-9 4-4"/><path d="M13 10v14m-5-14v11q5 9 10 0V10m-5 20v10m52-30v30" fill="none"/></g>}
  </svg>;
}

export function PicnicScene({ scene = "friends", complete = false }) {
  return <div className={`snack-world scene-${scene} ${complete ? "is-ready" : ""}`} aria-hidden="true">
    <img className="snack-garden" src={`${import.meta.env.BASE_URL}assets/worlds/discovery-garden.jpg`} alt="" draggable="false"/>
    <div className="snack-picnic-blanket"/><div className="snack-picnic-basket"><SnackIcon kind="apple"/><SnackIcon kind="water"/></div>
    <svg className="snack-park" viewBox="0 0 800 360" preserveAspectRatio="xMidYMid slice"><rect width="800" height="360" fill="#dff5ff"/><circle cx="686" cy="68" r="38" fill="#ffdc75"/><path d="M0 258Q180 166 360 257T800 232V360H0Z" fill="#b7df8a"/><path d="M0 304Q192 224 450 307T800 294V360H0Z" fill="#84c78a"/><path d="M79 267V135m-20 49 20 26 21-29" stroke="#a47a4a" strokeWidth="18" strokeLinecap="round"/><circle cx="79" cy="125" r="65" fill="#75bd8c"/><circle cx="38" cy="150" r="39" fill="#8dce96"/><path d="M559 325 488 259h173l88 66Z" fill="#ffcba9"/><path d="M549 275h121m-105 15h125m-108 16h122" stroke="#fff6e1" strokeWidth="8"/><path d="m50 320 3-8m-16 7 7-3m679 18 6-12" stroke="#367756" strokeWidth="5"/></svg>
    {scene === "note" ? <div className="snack-illustrated-note"><strong>La merienda</strong><div><SnackIcon kind="apple"/><SnackIcon kind="apple"/><SnackIcon kind="water"/></div><span>Para compartir</span></div> : <img className="snack-friends" src={`${import.meta.env.BASE_URL}assets/characters/amigos-comic-unificado-v1.png`} alt="" draggable="false"/>}
    {complete && <div className="snack-feast">{[0,1,2].map(i=><span className="tiny-plate" key={i}><SnackIcon kind="piece"/><SnackIcon kind="piece"/></span>)}</div>}
  </div>;
}
