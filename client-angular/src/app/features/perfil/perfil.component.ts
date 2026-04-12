import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { finalize, forkJoin } from "rxjs";
import { ReservacionesApiService } from "../../core/api/reservaciones-api.service";
import { UsuariosApiService } from "../../core/api/usuarios-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Reservacion, User, UsuarioConImagenes } from "../../core/models/domain.models";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent, ImageStripComponent, EmptyStateComponent],
  template: `
    <div class="page" *ngIf="auth.user(); else guestState">
      <app-hero
        eyebrow="Perfil"
        title="Gestiona tu cuenta y revisa tu actividad reciente."
        description="Esta vista consume tu perfil y tus reservaciones desde el API, con una edición básica consistente con el resto de la aplicación."
        [chips]="['Perfil editable', 'Reservaciones', 'Sesión persistida']"
        [metrics]="heroMetrics"
        noteTitle="Contexto"
        [noteItems]="['La sesión se conserva localmente.', 'La edición actualiza el usuario en el backend.', 'Las reservaciones se filtran por usuario autenticado.']"
      />

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Preparando tu perfil y tus reservaciones.</h3>
      </div>

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No pudimos cargar el perfil.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <ng-container *ngIf="!loading && !error && form">
        <section class="grid-2">
          <article class="surface-card">
            <div class="section-head">
              <div class="stack-sm">
                <p class="eyebrow">Cuenta</p>
                <h3>Información principal</h3>
              </div>
              <span class="pill pill-primary">Activa</span>
            </div>

            <app-image-strip *ngIf="perfil?.imagenes?.length" [images]="perfil!.imagenes" />

            <div class="field-grid">
              <div class="summary-card">
                <p class="small">Nombre actual</p>
                <strong>{{ form.name }}</strong>
              </div>
              <div class="summary-card">
                <p class="small">Email</p>
                <strong>{{ form.email }}</strong>
              </div>
            </div>
          </article>

          <article class="surface-card">
            <p class="eyebrow">Editar perfil</p>
            <h3>Actualiza tus datos</h3>

            <div class="field-grid">
              <label class="form-field">
                <span class="small muted">Nombre</span>
                <input class="form-input" [(ngModel)]="form.name" name="name" />
              </label>

              <label class="form-field">
                <span class="small muted">Email</span>
                <input class="form-input" [(ngModel)]="form.email" name="email" />
              </label>
            </div>

            <label class="form-field">
              <span class="small muted">Password</span>
              <input class="form-input" [(ngModel)]="form.passwordHash" name="passwordHash" type="password" />
            </label>

            <p *ngIf="auth.error()" class="error-text small">{{ auth.error() }}</p>
            <p *ngIf="status" class="small">{{ status }}</p>

            <div class="action-row">
              <button class="btn primary" type="button" (click)="handleSave()" [disabled]="auth.loading()">
                {{ auth.loading() ? "Guardando..." : "Guardar cambios" }}
              </button>
              <span class="micro muted">Se sincroniza con el endpoint usuarios por identificador.</span>
            </div>
          </article>
        </section>

        <section class="surface-card">
          <div class="section-head">
            <div class="stack-sm">
              <p class="eyebrow">Reservaciones</p>
              <h3>Historial del usuario</h3>
            </div>
            <span class="pill pill-ghost">{{ reservas.length }} registros</span>
          </div>

          <app-empty-state
            *ngIf="!reservas.length"
            eyebrow="Reservaciones"
            title="Aún no tienes reservaciones"
            description="Cuando el backend registre una reservación para tu usuario, aparecerá aquí."
          />

          <div *ngIf="reservas.length" class="grid-3">
            <article class="summary-card" *ngFor="let reserva of reservas">
              <p class="small">{{ reserva.estado }}</p>
              <strong>{{ reserva.fechaInicio | date: "mediumDate" }} → {{ reserva.fechaFin | date: "mediumDate" }}</strong>
              <p class="micro muted">Hotel: {{ reserva.hotelId }}</p>
              <p class="micro muted">Total: {{ currency(reserva.total) }}</p>
            </article>
          </div>
        </section>
      </ng-container>
    </div>

    <ng-template #guestState>
      <div class="page">
        <app-empty-state
          eyebrow="Perfil"
          title="Accede para ver y editar tu perfil"
          description="El perfil consume tu usuario autenticado, tus imágenes y tus reservaciones. Inicia sesión desde el panel lateral."
        />
      </div>
    </ng-template>
  `,
})
export class PerfilComponent implements OnInit {
  reservas: Reservacion[] = [];
  perfil: UsuarioConImagenes | null = null;
  form: User | null = null;
  status: string | null = null;
  error: string | null = null;
  loading = true;

  constructor(
    private readonly reservacionesApi: ReservacionesApiService,
    private readonly usuariosApi: UsuariosApiService,
    public readonly auth: AuthService,
  ) {}

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    return [
      { label: "Sesión", value: this.auth.user() ? "Activa" : "Invitado", hint: "Persistida localmente" },
      { label: "Reservas", value: this.reservas.length, hint: "Filtradas por usuario" },
      { label: "Total", value: this.currency(this.totalReservas), hint: "Monto agregado" },
    ];
  }

  get totalReservas(): number {
    return this.reservas.reduce((sum, item) => sum + item.total, 0);
  }

  ngOnInit(): void {
    const user = this.auth.user();
    if (!user) {
      this.loading = false;
      return;
    }

    forkJoin({
      perfil: this.usuariosApi.get(user.userId),
      reservas: this.reservacionesApi.list(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ perfil, reservas }) => {
          this.perfil = perfil;
          this.form = { ...perfil.usuario };
          this.reservas = reservas.filter((item) => item.usuarioId === user.userId);
        },
        error: (err) => {
          console.error(err);
          this.error = "No se pudo sincronizar tu información desde la API.";
        },
      });
  }

  handleSave(): void {
    if (!this.form) return;
    this.status = null;
    this.auth
      .updateProfile({
        name: this.form.name,
        email: this.form.email,
        passwordHash: this.form.passwordHash,
      })
      .subscribe({
        next: () => {
          if (!this.auth.error()) {
            this.status = "Datos actualizados correctamente.";
          }
        },
      });
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }
}
