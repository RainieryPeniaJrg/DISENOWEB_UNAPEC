import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { StatCardComponent } from "../../shared/components/stat-card/stat-card.component";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { HotelesApiService } from "../../core/api/hoteles-api.service";
import { ReaccionesApiService } from "../../core/api/reacciones-api.service";
import { SitiosApiService } from "../../core/api/sitios-api.service";
import { ValoracionesApiService } from "../../core/api/valoraciones-api.service";
import {
  Comentario,
  HotelConImagenes,
  ReaccionStats,
  SitioConImagenes,
  ValoracionStats,
} from "../../core/models/domain.models";

type SitioView = {
  sitio: SitioConImagenes["sitio"];
  imagenes: SitioConImagenes["imagenes"];
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
  comentarios: Comentario[];
};

type HotelView = {
  hotel: HotelConImagenes["hotel"];
  imagenes: HotelConImagenes["imagenes"];
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
  comentarios: Comentario[];
};

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, HeroComponent, StatCardComponent, ImageStripComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <app-hero
        eyebrow="Explora"
        title="Descubre destinos, hoteles y señales reales del API."
        description="La portada funciona como dashboard de descubrimiento: combina imágenes, comentarios y métricas para orientar la navegación."
        [chips]="heroChips"
        [metrics]="heroMetrics"
        noteTitle="Qué puedes hacer"
        [noteItems]="heroNotes"
      />

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No pudimos cargar la experiencia inicial.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Sincronizando destinos, hoteles y actividad reciente.</h3>
      </div>

      <ng-container *ngIf="!loading && !error">
        <section class="stats-grid">
          <app-stat-card title="Sitios activos" [value]="sitios.length" hint="Catálogo turístico visible" />
          <app-stat-card title="Hoteles listados" [value]="hoteles.length" hint="Opciones para planificar estadía" />
          <app-stat-card title="Comentarios recientes" [value]="comentariosRecientes.length" hint="Actividad social agregada" />
          <app-stat-card title="Promedio general" [value]="overallRatingLabel" hint="Combinado entre sitios y hoteles" />
        </section>

        <section class="surface-card featured" *ngIf="featuredSitio as item">
          <div class="section-head">
            <div class="stack-sm">
              <p class="eyebrow">Destino destacado</p>
              <h3>{{ item.sitio.nombre }}</h3>
              <p class="muted">{{ item.sitio.descripcion }}</p>
            </div>
            <div class="chip-row">
              <span class="pill pill-primary">{{ item.sitio.ubicacion }}</span>
              <span class="pill pill-ghost">{{ item.valoraciones.total }} valoraciones</span>
            </div>
          </div>

          <app-image-strip [images]="item.imagenes" />

          <div class="grid-3">
            <article class="summary-card">
              <p class="small">Valoración</p>
              <strong>{{ ratingLabel(item.valoraciones) }}</strong>
              <p class="micro rating-stars">{{ stars(item.valoraciones.promedio) }}</p>
            </article>
            <article class="summary-card">
              <p class="small">Reacciones</p>
              <strong>{{ item.reacciones.likes }} positivas</strong>
              <p class="micro muted">{{ item.reacciones.dislikes }} negativas</p>
            </article>
            <article class="summary-card">
              <p class="small">Comentarios</p>
              <strong>{{ item.comentarios.length }}</strong>
              <p class="micro muted">Historias compartidas por viajeros</p>
            </article>
          </div>
        </section>

        <section class="content-grid">
          <article class="surface-card" *ngFor="let item of topSitios; trackBy: trackSitio">
            <div class="card-head">
              <div class="card-copy">
                <p class="eyebrow">Sitio turístico</p>
                <h3>{{ item.sitio.nombre }}</h3>
                <p class="muted">{{ item.sitio.ubicacion }}</p>
              </div>
              <span class="pill pill-primary">{{ ratingLabel(item.valoraciones) }}</span>
            </div>
            <p class="small">{{ item.sitio.descripcion }}</p>
            <app-image-strip [images]="item.imagenes" />
            <ul class="detail-list">
              <li>Likes: {{ item.reacciones.likes }} · Dislikes: {{ item.reacciones.dislikes }}</li>
              <li>Comentarios: {{ item.comentarios.length }}</li>
            </ul>
          </article>
        </section>

        <section class="content-grid">
          <article class="surface-card" *ngFor="let item of topHoteles; trackBy: trackHotel">
            <div class="card-head">
              <div class="card-copy">
                <p class="eyebrow">Hotel recomendado</p>
                <h3>{{ item.hotel.nombre }}</h3>
                <p class="muted">{{ item.hotel.direccion }}</p>
              </div>
              <span class="badge">{{ currency(item.hotel.precioNoche) }} / noche</span>
            </div>
            <app-image-strip [images]="item.imagenes" />
            <div class="meta-row">
              <span class="pill pill-primary">{{ ratingLabel(item.valoraciones) }}</span>
              <span class="pill pill-ghost">{{ item.reacciones.likes }} likes</span>
              <span class="pill pill-ghost">{{ item.comentarios.length }} comentarios</span>
            </div>
          </article>
        </section>

        <section class="grid-2">
          <article class="surface-card">
            <div class="section-head">
              <div class="stack-sm">
                <p class="eyebrow">Actividad reciente</p>
                <h3>Comentarios más nuevos</h3>
              </div>
            </div>

            <app-empty-state
              *ngIf="!comentariosRecientes.length"
              eyebrow="Comentarios"
              title="Todavía no hay comentarios recientes"
              description="Cuando el API reciba nuevas opiniones, aparecerán aquí."
            />

            <ul *ngIf="comentariosRecientes.length" class="mini-comments">
              <li *ngFor="let comentario of comentariosRecientes">
                <p class="small">{{ comentario.texto }}</p>
                <p class="micro muted">Usuario {{ comentario.usuarioId }} · {{ comentario.fecha | date: "mediumDate" }}</p>
              </li>
            </ul>
          </article>

          <article class="surface-card">
            <p class="eyebrow">Siguiente paso</p>
            <h3>Reservas y pagos ya están enlazados al backend.</h3>
            <p class="muted small">
              En esta etapa se muestran como vistas conectadas al API, listas para evolucionar a flujo completo en la siguiente iteración.
            </p>
            <ul class="detail-list">
              <li>Perfil ya resume la actividad del usuario autenticado.</li>
              <li>Sitios y hoteles consumen respuestas normalizadas del backend.</li>
              <li>La UI comparte un solo sistema visual y de estados.</li>
            </ul>
          </article>
        </section>
      </ng-container>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  sitios: SitioView[] = [];
  hoteles: HotelView[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private readonly comentariosApi: ComentariosApiService,
    private readonly hotelesApi: HotelesApiService,
    private readonly reaccionesApi: ReaccionesApiService,
    private readonly sitiosApi: SitiosApiService,
    private readonly valoracionesApi: ValoracionesApiService,
  ) {}

  get heroChips(): string[] {
    return ["UI centralizada", "API normalizada", "Comentarios en vivo", "Métricas agregadas"];
  }

  get heroNotes(): string[] {
    return [
      "Comparar destinos con señales sociales y visuales.",
      "Entrar al perfil para revisar reservaciones del usuario.",
      "Navegar a Reservas y Pagos para validar lectura del backend.",
    ];
  }

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    return [
      { label: "Sitios", value: this.sitios.length, hint: "Con imágenes y comentarios" },
      { label: "Hoteles", value: this.hoteles.length, hint: "Con precio por noche" },
      { label: "Actividad", value: this.comentariosRecientes.length, hint: "Comentarios recientes" },
    ];
  }

  get comentariosRecientes(): Comentario[] {
    return [...this.sitios.flatMap((item) => item.comentarios), ...this.hoteles.flatMap((item) => item.comentarios)]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  get featuredSitio(): SitioView | null {
    return this.topSitios[0] ?? null;
  }

  get topSitios(): SitioView[] {
    return [...this.sitios]
      .sort((a, b) => this.scoreItem(b.valoraciones, b.reacciones, b.comentarios) - this.scoreItem(a.valoraciones, a.reacciones, a.comentarios))
      .slice(0, 2);
  }

  get topHoteles(): HotelView[] {
    return [...this.hoteles]
      .sort((a, b) => this.scoreItem(b.valoraciones, b.reacciones, b.comentarios) - this.scoreItem(a.valoraciones, a.reacciones, a.comentarios))
      .slice(0, 2);
  }

  get overallRatingLabel(): string {
    const values = [...this.sitios.map((item) => item.valoraciones.promedio), ...this.hoteles.map((item) => item.valoraciones.promedio)].filter(
      (value) => value > 0,
    );
    if (!values.length) return "0.0";
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return avg.toFixed(1);
  }

  async ngOnInit(): Promise<void> {
    try {
      const [sitiosData, hotelesData] = await Promise.all([this.sitiosApi.list(), this.hotelesApi.list()]);

      this.sitios = await Promise.all(
        sitiosData.map(async ({ sitio, imagenes }) => {
          const [valoraciones, reacciones, comentarios] = await Promise.all([
            this.valoracionesApi.statsSitio(sitio.id),
            this.reaccionesApi.statsSitio(sitio.id),
            this.comentariosApi.listBySitio(sitio.id),
          ]);
          return { sitio, imagenes, valoraciones, reacciones, comentarios };
        }),
      );

      this.hoteles = await Promise.all(
        hotelesData.map(async ({ hotel, imagenes }) => {
          const [valoraciones, reacciones, comentarios] = await Promise.all([
            this.valoracionesApi.statsHotel(hotel.id),
            this.reaccionesApi.statsHotel(hotel.id),
            this.comentariosApi.listByHotel(hotel.id),
          ]);
          return { hotel, imagenes, valoraciones, reacciones, comentarios };
        }),
      );
    } catch {
      this.error = "Revisa que la API esté ejecutándose en https://localhost:7057.";
    } finally {
      this.loading = false;
    }
  }

  ratingLabel(stats: ValoracionStats): string {
    return stats.total ? `${stats.promedio.toFixed(1)} / 5` : "Sin puntuar";
  }

  stars(score: number): string {
    const rounded = Math.max(0, Math.min(5, Math.round(score)));
    return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }

  trackSitio(_: number, item: SitioView): string {
    return item.sitio.id;
  }

  trackHotel(_: number, item: HotelView): string {
    return item.hotel.id;
  }

  private scoreItem(valoraciones: ValoracionStats, reacciones: ReaccionStats, comentarios: Comentario[]): number {
    return valoraciones.promedio * 10 + reacciones.likes * 2 + comentarios.length;
  }
}
