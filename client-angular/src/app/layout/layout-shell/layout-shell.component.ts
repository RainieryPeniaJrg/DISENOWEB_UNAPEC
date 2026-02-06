import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ThemeService } from "../../core/state/theme.service";
import { AuthService } from "../../core/state/auth.service";
import { AuthPanelComponent } from "../auth-panel/auth-panel.component";

type NavItem = { to: string; label: string; badge?: string | null };

@Component({
  selector: "app-layout-shell",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, AuthPanelComponent],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <p class="eyebrow">DisenoWeb</p>
            <h1>Experiencias turísticas</h1>
          </div>
        </div>
        <div class="top-links">
          <button class="icon-btn" (click)="sidebarOpen = !sidebarOpen" title="Toggle menú">
            {{ sidebarOpen ? "☰" : "☷" }}
          </button>
          <button class="icon-btn" (click)="theme.toggle()" title="Cambiar tema">
            {{ theme.theme() === "dark" ? "🌙" : "☀️" }}
          </button>
          <span class="status-dot online" aria-label="API status"></span>
          <p class="muted">{{ greeting }}</p>
        </div>
      </header>

      <div class="layout">
        <aside class="sidebar" [class.collapsed]="!sidebarOpen">
          <nav>
            <p class="muted">Navegación</p>
            <ul>
              <li *ngFor="let item of navItems">
                <a [routerLink]="item.to" routerLinkActive="nav-link active" [routerLinkActiveOptions]="{ exact: item.to === '/' }" class="nav-link">
                  <span>{{ item.label }}</span>
                  <span *ngIf="item.badge" class="pill pill-ghost">{{ item.badge }}</span>
                </a>
              </li>
            </ul>
          </nav>
          <div class="sidebar-card">
            <p class="eyebrow">Contexto actual</p>
            <p class="muted">Frontend Angular en migración paridad 1:1</p>
            <p class="small">Usa el menú para explorar. Las vistas marcadas como WIP muestran placeholder listo para integrar.</p>
          </div>
          <app-auth-panel />
        </aside>

        <main class="main">
          <router-outlet />
        </main>
      </div>

      <footer class="footer">
        <div>© 2026 DisenoWeb · Demo front conectado a API JSON</div>
        <div class="footer-links">
          <a href="https://localhost:7057/swagger" target="_blank" rel="">Swagger</a>
          <span aria-hidden="true">•</span>
          <a href="https://localhost:7057/api" target="_blank" rel="">API base</a>
        </div>
      </footer>
    </div>
  `,
})
export class LayoutShellComponent {
  sidebarOpen = true;

  readonly navItems: NavItem[] = [
    { to: "/", label: "Inicio" },
    { to: "/sitios", label: "Sitios" },
    { to: "/hoteles", label: "Hoteles" },
    { to: "/reservas", label: "Reservas", badge: "WIP" },
    { to: "/pagos", label: "Pagos", badge: "WIP" },
    { to: "/perfil", label: "Perfil", badge: "WIP" },
  ];

  constructor(
    public readonly theme: ThemeService,
    public readonly auth: AuthService,
  ) {}

  get greeting(): string {
    const user = this.auth.user();
    return user ? `Hola, ${user.name}` : "API conectada";
  }
}
