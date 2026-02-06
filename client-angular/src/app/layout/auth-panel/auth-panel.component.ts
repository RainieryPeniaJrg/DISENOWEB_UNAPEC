import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/state/auth.service";

@Component({
  selector: "app-auth-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="panel auth-panel" *ngIf="auth.user() as user; else authFormTpl">
      <p class="eyebrow">Sesión</p>
      <h4>{{ user.name }}</h4>
      <p class="muted small">{{ user.email }}</p>
      <button class="btn ghost" (click)="auth.logout()">⇦ Cerrar sesión</button>
    </div>

    <ng-template #authFormTpl>
      <div class="panel auth-panel">
        <div class="tabs">
          <button [class.active]="mode === 'login'" (click)="mode = 'login'">Acceder</button>
          <button [class.active]="mode === 'register'" (click)="mode = 'register'">Registrarse</button>
        </div>

        <form class="stack-sm" (submit)="onSubmit($event)">
          <input *ngIf="mode === 'register'" [(ngModel)]="name" name="name" placeholder="Nombre" required />
          <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
          <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
          <p *ngIf="auth.error()" class="small error-text">{{ auth.error() }}</p>
          <button class="btn primary" type="submit" [disabled]="auth.loading()">
            {{ auth.loading() ? "Enviando..." : mode === "login" ? "Acceder" : "Crear cuenta" }}
          </button>
        </form>
        <p class="micro muted">Demo: julia@demo.local / julia123</p>
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

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.mode === "login") {
      await this.auth.login(this.email, this.password);
      return;
    }
    await this.auth.register(this.name || "Usuario", this.email, this.password);
  }
}
