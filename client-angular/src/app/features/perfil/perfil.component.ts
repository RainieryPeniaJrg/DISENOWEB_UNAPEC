import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReservacionesApiService } from "../../core/api/reservaciones-api.service";
import { UsuariosApiService } from "../../core/api/usuarios-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Reservacion, User } from "../../core/models/domain.models";

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="!auth.user()" class="panel">Accede para ver tu perfil.</div>

    <div *ngIf="auth.user() && !form" class="panel">Cargando perfil...</div>

    <div *ngIf="auth.user() && form" class="stack-md">
      <h2>Mi perfil</h2>
      <div class="panel stack-sm">
        <label class="muted small">Nombre</label>
        <input [(ngModel)]="form.name" name="name" />
        <label class="muted small">Email</label>
        <input [(ngModel)]="form.email" name="email" />
        <label class="muted small">Password</label>
        <input [(ngModel)]="form.passwordHash" name="passwordHash" type="password" />
        <p *ngIf="auth.error()" class="error-text small">{{ auth.error() }}</p>
        <p *ngIf="status" class="small" style="color: #46c2b3">{{ status }}</p>
        <button class="btn primary" (click)="handleSave()" [disabled]="auth.loading()">
          {{ auth.loading() ? "Guardando..." : "Guardar" }}
        </button>
      </div>

      <div class="panel">
        <h4>Mis reservaciones</h4>
        <p *ngIf="!reservas.length" class="muted small">No tienes reservaciones aún.</p>
        <ul class="mini-comments">
          <li *ngFor="let r of reservas">
            <p class="small">
              {{ r.fechaInicio | date }} → {{ r.fechaFin | date }} · Estado: {{ r.estado }} · Total {{ r.total }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class PerfilComponent implements OnInit {
  reservas: Reservacion[] = [];
  form: User | null = null;
  status: string | null = null;

  constructor(
    private readonly reservacionesApi: ReservacionesApiService,
    private readonly usuariosApi: UsuariosApiService,
    public readonly auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.user();
    if (!user) return;

    const [perfil, reservas] = await Promise.all([
      this.usuariosApi.get(user.userId),
      this.reservacionesApi.list(),
    ]);
    this.form = perfil;
    this.reservas = reservas.filter((item) => item.usuarioId === user.userId);
  }

  async handleSave(): Promise<void> {
    if (!this.form) return;
    this.status = null;
    await this.auth.updateProfile({
      name: this.form.name,
      email: this.form.email,
      passwordHash: this.form.passwordHash,
    });
    if (!this.auth.error()) {
      this.status = "Datos actualizados";
    }
  }
}
