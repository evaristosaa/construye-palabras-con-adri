import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function TopBar({ progress, onSoundToggle }) {
  return (
    <header className="topbar">
      <Link className="round-button home-link" to="/" aria-label="Inicio">
        ⌂
      </Link>
      <button className="round-button" onClick={onSoundToggle} aria-label="Activar o desactivar sonido">
        {progress.sound ? "🔊" : "🔇"}
      </button>
      <div className="score-pill">
        <span>★</span>
        <strong>{progress.stars}</strong>
      </div>
      <div className="score-pill brick-score">
        <span className="tiny-brick" />
        <strong>{progress.pieces}</strong>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <NavLink to="/primaria">Misiones</NavLink>
      <NavLink to="/logros">Mis logros</NavLink>
      <NavLink to="/ajustes">Familia</NavLink>
    </nav>
  );
}

export function PageShell({ children, progress, updateSettings, hideNav = false, hideTopBar = false, primaryLayout = false, screenLayout = false }) {
  const main = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { if (main.current) main.current.scrollTop = 0; }, [pathname]);
  useEffect(() => {
    if (!screenLayout || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const resize = () => {
      main.current?.style.setProperty("--play-height", `${viewport.height}px`);
      main.current?.classList.toggle("keyboard-open", window.innerHeight - viewport.height > 120);
    };
    resize();
    viewport.addEventListener("resize", resize);
    return () => { viewport.removeEventListener("resize", resize); main.current?.style.removeProperty("--play-height"); main.current?.classList.remove("keyboard-open"); };
  }, [screenLayout]);
  return (
    <main ref={main} data-reading-font={progress.readingFont || "print"} data-reading-size={progress.readingSize || "normal"} className={`app-shell ${primaryLayout ? "primary-layout" : ""} ${screenLayout ? "screen-layout" : ""} ${hideNav ? "without-nav" : ""}`}>
      {!hideTopBar && <TopBar progress={progress} onSoundToggle={() => updateSettings({ sound: !progress.sound })} />}
      {children}
      {!hideNav && <BottomNav />}
    </main>
  );
}
