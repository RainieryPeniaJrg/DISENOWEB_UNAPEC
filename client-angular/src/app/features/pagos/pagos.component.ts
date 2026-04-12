import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { finalize, forkJoin } from "rxjs";
import { PagosApiService } from "../../core/api/pagos-api.service";
import { ReservacionesApiService } from "../../core/api/reservaciones-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Pago, Reservacion } from "../../core/models/domain.models";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: "app-pagos",
  standalone: true,
  imports: [CommonModule, HeroComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <app-hero
        eyebrow="Pagos"
        title="Pagos conectados al API y sincronizados con reservaciones."
        description="La vista consume pagos reales, los cruza con reservaciones y refleja la gestión operativa desde el panel administrativo."
        [chips]="['Backend real', 'Cruce con reservaciones', 'Gestión sincronizada']"
        [metrics]="heroMetrics"
        noteTitle="Estado actual"
        [noteItems]="['Se muestra historial y estados reales.', 'Las operaciones CRUD se concentran en el panel admin.']"
      />

      <app-empty-state
        *ngIf="!loading && !error && !visiblePagos.length"
        eyebrow="Pagos"
        title="No hay pagos para mostrar"
        description="La pantalla ya está conectada; aparecerán registros cuando el backend tenga pagos asociados."
      />

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Consultando pagos y reservaciones.</h3>
      </div>

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No pudimos cargar los pagos.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <section class="grid-3" *ngIf="!loading && !error && visiblePagos.length">
        <article class="summary-card" *ngFor="let pago of visiblePagos">
          <p class="small">{{ pago.estado }}</p>
          <strong>{{ currency(pago.monto) }}</strong>
          <p class="micro muted">Método: {{ pago.metodoPago }}</p>
          <p class="micro muted">Fecha: {{ pago.fechaPago | date: "mediumDate" }}</p>
          <p class="micro muted">Reservación: {{ pago.reservacionId }}</p>
        </article>
      </section>
    </div>
  `,
})
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  reservaciones: Reservacion[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private readonly pagosApi: PagosApiService,
    private readonly reservacionesApi: ReservacionesApiService,
    public readonly auth: AuthService,
  ) {}

  get visiblePagos(): Pago[] {
    const userId = this.auth.user()?.userId;
    if (!userId) return this.pagos;

    const reservacionesUsuario = new Set(this.reservaciones.filter((item) => item.usuarioId === userId).map((item) => item.id));
    return this.pagos.filter((item) => reservacionesUsuario.has(item.reservacionId));
  }

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    return [
      { label: "Pagos", value: this.visiblePagos.length, hint: "Mostrados en pantalla" },
      { label: "Monto", value: this.currency(this.visiblePagos.reduce((sum, item) => sum + item.monto, 0)), hint: "Total visible" },
      { label: "Sesión", value: this.auth.user() ? "Filtrada" : "Global", hint: "Criterio de lectura" },
    ];
  }

  ngOnInit(): void {
    forkJoin({
      pagos: this.pagosApi.list(),
      reservaciones: this.reservacionesApi.list(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ pagos, reservaciones }) => {
          this.pagos = pagos;
          this.reservaciones = reservaciones;
        },
        error: (err) => {
          console.error(err);
          this.error = "No se pudo consultar el endpoint de pagos.";
        },
      });
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }
}
