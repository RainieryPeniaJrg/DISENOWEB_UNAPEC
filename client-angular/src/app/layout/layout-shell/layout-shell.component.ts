import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ThemeService } from "../../core/state/theme.service";
import { AuthService } from "../../core/state/auth.service";
import { ApiHealthService } from "../../core/state/api-health.service";
import { AuthPanelComponent } from "../auth-panel/auth-panel.component";
import { environment } from "../../../environments/environment";

type NavItem = {
  to: string;
  label: string;
  description: string;
  badge?: string;
};

@Component({
  selector: "app-layout-shell",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, AuthPanelComponent],
  template: `
    <div class="app-shell">
      <div class="shell-backdrop" aria-hidden="true"></div>

      <header class="topbar">
        <div class="topbar-panel">
          <div class="brand">
            <button class="icon-btn hide-desktop" type="button" (click)="sidebarOpen = !sidebarOpen" aria-label="Abrir menú">
              {{ sidebarOpen ? "Cerrar" : "Menú" }}
            </button>
            <div class="brand-mark" aria-hidden="true"></div>
            <div class="brand-copy">
              <p class="eyebrow">DisenoWeb</p>
              <h2>Turismo dominicano con datos reales</h2>
              <p class="muted small">UI centralizada para explorar, comparar y preparar reservas.</p>
            </div>
          </div>

          <div class="topbar-actions">
            <span class="status-pill" [ngClass]="apiHealth.status()">
              {{ healthLabel }}
            </span>
            <span class="pill pill-ghost hide-mobile">{{ sessionLabel }}</span>
            <button class="icon-btn" type="button" (click)="apiHealth.refresh()" aria-label="Verificar API">API</button>
            <button class="icon-btn" type="button" (click)="theme.toggle()" aria-label="Cambiar tema">
              {{ theme.theme() === "dark" ? "Claro" : "Oscuro" }}
            </button>
          </div>
        </div>
      </header>

      <div class="layout">
        <aside class="sidebar" [class.open]="sidebarOpen">
          <section class="sidebar-panel">
            <p class="eyebrow">Navegación</p>
            <ul class="nav-list">
              <li *ngFor="let item of navItems">
                <a
                  [routerLink]="item.to"
                  routerLinkActive="nav-link active"
                  [routerLinkActiveOptions]="{ exact: item.to === '/' }"
                  class="nav-link"
                  (click)="handleNavClick()"
                >
                  <div class="nav-link-main">
                    <span class="nav-link-title">{{ item.label }}</span>
                    <span class="micro muted">{{ item.description }}</span>
                  </div>
                  <span *ngIf="item.badge" class="pill pill-ghost">{{ item.badge }}</span>
                </a>
              </li>
            </ul>
          </section>

          <section class="sidebar-panel">
            <p class="eyebrow">Estado de la app</p>
            <div class="stack-sm">
              <div class="summary-card">
                <p class="small">Sesión</p>
                <strong>{{ sessionLabel }}</strong>
                <p class="micro muted">{{ sessionHint }}</p>
              </div>
              <div class="summary-card">
                <p class="small">API</p>
                <strong>{{ healthLabel }}</strong>
                <p class="micro muted">Última verificación: {{ checkedAtLabel }}</p>
              </div>
            </div>
          </section>

          <app-auth-panel />
        </aside>

        <main class="main">
          <router-outlet />
        </main>
      </div>

      <footer class="footer">
        <div class="footer-panel">
          <p class="small">DisenoWeb 2026 · Front Angular alineado con la API de turismo.</p>
          <div class="footer-links">
            <a class="pill pill-ghost" [href]="apiRootUrl" target="_blank" rel="noreferrer">API Root</a>
            <a class="pill pill-ghost" [href]="apiHotelesUrl" target="_blank" rel="noreferrer">Hoteles API</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LayoutShellComponent {
  sidebarOpen = false;

  constructor(
    public readonly theme: ThemeService,
    public readonly auth: AuthService,
    public readonly apiHealth: ApiHealthService,
  ) {}

  get navItems(): NavItem[] {
    const items: NavItem[] = [
      { to: "/", label: "Inicio", description: "Resumen de destinos y actividad" },
      { to: "/sitios", label: "Sitios", description: "Descubrimiento y comentarios" },
      { to: "/hoteles", label: "Hoteles", description: "Comparación de estadías" },
      { to: "/reservas", label: "Reservas", description: "Gestión de reservaciones", badge: "API" },
      { to: "/pagos", label: "Pagos", description: "Historial, estados y gestión", badge: "API" },
      { to: "/perfil", label: "Perfil", description: "Cuenta, sesión y reservaciones" },
    ];

    if (this.auth.isAdmin()) {
      items.push({ to: "/admin", label: "Admin", description: "CRUD central por módulos", badge: "CRUD" });
    }

    return items;
  }

  get apiRootUrl(): string {
    return environment.apiBaseUrl;
  }

  get apiHotelesUrl(): string {
    return `${environment.apiBaseUrl}/api/hoteles`;
  }

  get healthLabel(): string {
    switch (this.apiHealth.status()) {
      case "online":
        return "API disponible";
      case "offline":
        return "API no disponible";
      default:
        return "Verificando API";
    }
  }

  get checkedAtLabel(): string {
    const value = this.apiHealth.lastCheckedAt();
    return value ? new Date(value).toLocaleTimeString() : "pendiente";
  }

  get sessionLabel(): string {
    const user = this.auth.user();
    return user ? `Sesión activa: ${user.name}` : "Invitado";
  }

  get sessionHint(): string {
    return this.auth.user()
      ? "Puedes comentar, editar perfil y revisar tu actividad."
      : "Accede para comentar y personalizar tu experiencia.";
  }

  handleNavClick(): void {
    if (window.innerWidth <= 1080) {
      this.sidebarOpen = false;
    }
  }
}
