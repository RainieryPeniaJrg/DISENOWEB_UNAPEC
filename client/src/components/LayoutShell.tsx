import { NavLink, useLocation } from "react-router-dom";
import { PropsWithChildren, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { AuthPanel } from "./AuthPanel";
import { useTheme } from "../state/ThemeContext";

const navItems = [
  { to: "/", label: "Inicio", badge: null },
  { to: "/sitios", label: "Sitios", badge: null },
  { to: "/hoteles", label: "Hoteles", badge: null },
  { to: "/reservas", label: "Reservas", badge: "WIP" },
  { to: "/pagos", label: "Pagos", badge: "WIP" },
  { to: "/perfil", label: "Perfil", badge: "WIP" },
];

export function LayoutShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden />
          <div>
            <p className="eyebrow">DisenoWeb</p>
            <h1>Experiencias turísticas</h1>
          </div>
        </div>
        <div className="top-links">
          <button className="icon-btn" onClick={() => setSidebarOpen((s) => !s)} title="Toggle menú">
            {sidebarOpen ? "☰" : "☷"}
          </button>
          <button className="icon-btn" onClick={toggle} title="Cambiar tema">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <span className="status-dot online" aria-label="API status" />
          <p className="muted">{user ? `Hola, ${user.name}` : "API conectada"}</p>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <nav>
            <p className="muted">Navegación</p>
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    <span>{item.label}</span>
                    {item.badge && <span className="pill pill-ghost">{item.badge}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-card">
            <p className="eyebrow">Contexto actual</p>
            <p className="muted">{pathname}</p>
            <p className="small">Usa el menú para explorar. Las vistas marcadas como WIP muestran placeholder listo para integrar.</p>
          </div>
          <AuthPanel />
        </aside>

        <main className="main">{children}</main>
      </div>

      <footer className="footer">
        <div>© 2026 DisenoWeb · Demo front conectado a API JSON</div>
        <div className="footer-links">
          <a href="https://localhost:7057/swagger" target="_blank" rel="">
            Swagger
          </a>
          <span aria-hidden>•</span>
          <a href="https://localhost:7057/api" target="_blank" rel="">
            API base
          </a>
        </div>
      </footer>
    </div>
  );
}
