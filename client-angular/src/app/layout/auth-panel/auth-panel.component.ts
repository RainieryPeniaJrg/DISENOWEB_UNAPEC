import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/state/auth.service";

@Component({
  selector: "app-auth-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sidebar-panel" *ngIf="auth.user() as user; else authFormTpl">
      <p class="eyebrow">Sesión</p>
      <div class="stack-sm">
        <div class="summary-card">
          <strong>{{ user.name }}</strong>
          <p class="small muted">{{ user.email }}</p>
        </div>
        <div class="chip-row">
          <span class="pill pill-primary">Autenticado</span>
          <span class="pill pill-ghost">Perfil listo</span>
        </div>
        <button class="btn ghost" type="button" (click)="auth.logout()">Cerrar sesión</button>
      </div>
    </div>

    <ng-template #authFormTpl>
      <div class="sidebar-panel">
        <div class="tabs">
          <button class="btn ghost" type="button" [class.active]="mode === 'login'" (click)="mode = 'login'">Acceder</button>
          <button class="btn ghost" type="button" [class.active]="mode === 'register'" (click)="mode = 'register'">
            Registrarse
          </button>
        </div>

        <form class="stack-sm" (submit)="onSubmit($event)">
          <div class="form-field" *ngIf="mode === 'register'">
            <label class="small muted" for="auth-name">Nombre</label>
            <input id="auth-name" class="form-input" [(ngModel)]="name" name="name" placeholder="Tu nombre" required />
          </div>

          <div class="form-field">
            <label class="small muted" for="auth-email">Email</label>
            <input id="auth-email" class="form-input" [(ngModel)]="email" name="email" type="email" placeholder="tu@email.com" required />
          </div>

          <div class="form-field">
            <label class="small muted" for="auth-password">Password</label>
            <input
              id="auth-password"
              class="form-input"
              [(ngModel)]="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p *ngIf="auth.error()" class="small error-text">{{ auth.error() }}</p>

          <div class="action-row">
            <button class="btn primary" type="submit" [disabled]="auth.loading()">
              {{ auth.loading() ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta" }}
            </button>
            <span class="micro muted">Demo: admin@demo.local / admin123 o julia@demo.local / julia123</span>
          </div>
        </form>
      </div>
    </ng-template>
  `,
})
export class AuthPanelComponent {
  mode: "login" | "register" = "login";
  name = "";
  email = "julia@demo.local";
  password = "julia123";

  constructor(public readonly auth: AuthService) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.mode === "login") {
      this.auth.login(this.email, this.password).subscribe();
      return;
    }
    this.auth.register(this.name || "Usuario", this.email, this.password).subscribe();
  }
}
