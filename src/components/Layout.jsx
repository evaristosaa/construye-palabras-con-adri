import { Link, NavLink } from "react-router-dom";

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
      <NavLink to="/niveles">Misiones</NavLink>
      <NavLink to="/coleccion">Construcciones</NavLink>
      <NavLink to="/personajes">Adris</NavLink>
      <NavLink to="/progreso">Progreso</NavLink>
      <NavLink to="/ajustes">Ajustes</NavLink>
    </nav>
  );
}

export function PageShell({ children, progress, updateSettings, hideNav = false }) {
  return (
    <main className="app-shell">
      <TopBar progress={progress} onSoundToggle={() => updateSettings({ sound: !progress.sound })} />
      {children}
      {!hideNav && <BottomNav />}
    </main>
  );
}
