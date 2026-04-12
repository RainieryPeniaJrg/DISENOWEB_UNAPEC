import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { finalize } from "rxjs";
import { ReservacionesApiService } from "../../core/api/reservaciones-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Reservacion } from "../../core/models/domain.models";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-reservas",
  standalone: true,
  imports: [CommonModule, HeroComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <app-hero
        eyebrow="Reservas"
        title="Reservaciones conectadas al API y sincronizadas con la gestión."
        description="La pantalla consume reservaciones reales, filtra por sesión y refleja cambios hechos desde el panel administrativo."
        [chips]="['API conectada', 'Filtrado por sesión', 'Gestión sincronizada']"
        [metrics]="heroMetrics"
        noteTitle="Estado de la funcionalidad"
        [noteItems]="['La administración completa vive en el panel admin.', 'Aquí se mantiene la lectura enfocada en la experiencia del usuario.']"
      />

      <app-empty-state
        *ngIf="!loading && !error && !visibleReservas.length"
        eyebrow="Reservas"
        title="No hay reservaciones para mostrar"
        description="Si inicias sesión se filtrarán las tuyas; sin sesión se mostrarán todas las disponibles."
      />

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Consultando reservaciones desde el API.</h3>
      </div>

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No pudimos cargar las reservaciones.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <section class="grid-3" *ngIf="!loading && !error && visibleReservas.length">
        <article class="summary-card" *ngFor="let reserva of visibleReservas">
          <p class="small">{{ reserva.estado }}</p>
          <strong>{{ reserva.fechaInicio | date: "mediumDate" }} → {{ reserva.fechaFin | date: "mediumDate" }}</strong>
          <p class="micro muted">Usuario: {{ reserva.usuarioId }}</p>
          <p class="micro muted">Hotel: {{ reserva.hotelId }}</p>
          <p class="micro muted">Total: {{ currency(reserva.total) }}</p>
        </article>
      </section>
    </div>
  `,
})
export class ReservasComponent implements OnInit {
  reservas: Reservacion[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private readonly reservacionesApi: ReservacionesApiService,
    public readonly auth: AuthService,
  ) {}

  get visibleReservas(): Reservacion[] {
    const userId = this.auth.user()?.userId;
    return userId ? this.reservas.filter((item) => item.usuarioId === userId) : this.reservas;
  }

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    return [
      { label: "Reservas", value: this.visibleReservas.length, hint: "Filtradas por sesión" },
      { label: "Sesión", value: this.auth.user() ? "Activa" : "Invitado", hint: "Afecta el filtro" },
      { label: "Monto", value: this.currency(this.visibleReservas.reduce((sum, item) => sum + item.total, 0)), hint: "Suma visible" },
    ];
  }

  ngOnInit(): void {
    this.reservacionesApi
      .list()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (reservas) => {
          this.reservas = reservas;
        },
        error: (err) => {
          console.error(err);
          this.error = "No se pudo consultar el endpoint de reservaciones.";
        },
      });
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }
}
