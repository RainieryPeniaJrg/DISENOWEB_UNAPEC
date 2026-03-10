import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { HotelesApiService } from "../../core/api/hoteles-api.service";
import { ReaccionesApiService } from "../../core/api/reacciones-api.service";
import { ValoracionesApiService } from "../../core/api/valoraciones-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Comentario, HotelConImagenes, ReaccionStats, ValoracionStats } from "../../core/models/domain.models";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { QuickCommentComponent } from "../../shared/components/quick-comment/quick-comment.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

type HotelView = HotelConImagenes & {
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
};

@Component({
  selector: "app-hoteles",
  standalone: true,
  imports: [CommonModule, HeroComponent, ImageStripComponent, QuickCommentComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <app-hero
        eyebrow="Hoteles"
        title="Hoteles con precio, reputación y conversación visible."
        description="La vista prioriza comparación rápida entre estadías usando tarifas, imágenes, comentarios y señales sociales."
        [chips]="['Precio por noche', 'Valoraciones', 'Comentarios']"
        [metrics]="heroMetrics"
        noteTitle="Foco de la vista"
        [noteItems]="['Comparar hoteles en una sola pasada.', 'Detectar reputación promedio.', 'Validar actividad desde el API.']"
      />

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No se pudieron cargar los hoteles.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Consultando catálogo de hoteles y comentarios.</h3>
      </div>

      <app-empty-state
        *ngIf="!loading && !error && !hoteles.length"
        eyebrow="Hoteles"
        title="No hay hoteles disponibles"
        description="Cuando el backend publique hoteles activos, aparecerán aquí."
      />

      <section class="content-grid" *ngIf="!loading && !error && hoteles.length">
        <article *ngFor="let item of hoteles; trackBy: trackByHotel" class="surface-card">
          <div class="card-head">
            <div class="card-copy">
              <p class="eyebrow">Hotel</p>
              <h3>{{ item.hotel.nombre }}</h3>
              <p class="muted">{{ item.hotel.direccion }}</p>
            </div>
            <div class="stack-sm">
              <span class="badge">{{ currency(item.hotel.precioNoche) }} / noche</span>
              <span class="pill pill-primary">{{ ratingLabel(item.valoraciones) }}</span>
            </div>
          </div>

          <div class="chip-row">
            <span class="pill pill-ghost">{{ item.reacciones.likes }} likes</span>
            <span class="pill pill-ghost">{{ item.reacciones.dislikes }} dislikes</span>
            <span class="pill pill-ghost">{{ (comentarios[item.hotel.id] ?? []).length }} comentarios</span>
          </div>

          <app-image-strip [images]="item.imagenes" />

          <div class="stack-sm">
            <div class="section-head">
              <h4>Comentarios</h4>
              <span class="micro muted">Feedback reciente</span>
            </div>

            <app-empty-state
              *ngIf="!(comentarios[item.hotel.id] ?? []).length"
              eyebrow="Comentarios"
              title="Este hotel aún no tiene comentarios"
              description="Los viajeros podrán agregar observaciones cuando inicien sesión."
            />

            <ul class="mini-comments" *ngIf="commentsFor(item.hotel.id).length">
              <li *ngFor="let c of commentsFor(item.hotel.id)">
                <p class="small">{{ c.texto }}</p>
                <p class="micro muted">Usuario {{ c.usuarioId }} · {{ c.fecha | date: "mediumDate" }}</p>
              </li>
            </ul>
          </div>

          <app-quick-comment
            *ngIf="userId as uid"
            [usuarioId]="uid"
            [hotelId]="item.hotel.id"
            (created)="appendComment(item.hotel.id, $event)"
          />
        </article>
      </section>
    </div>
  `,
})
export class HotelesComponent implements OnInit {
  hoteles: HotelView[] = [];
  comentarios: Record<string, Comentario[]> = {};
  loading = true;
  error: string | null = null;

  constructor(
    private readonly comentariosApi: ComentariosApiService,
    private readonly hotelesApi: HotelesApiService,
    private readonly reaccionesApi: ReaccionesApiService,
    private readonly valoracionesApi: ValoracionesApiService,
    public readonly auth: AuthService,
  ) {}

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    const totalComentarios = Object.values(this.comentarios).reduce((sum, list) => sum + list.length, 0);
    const avgPrice =
      this.hoteles.length > 0
        ? this.hoteles.reduce((sum, item) => sum + item.hotel.precioNoche, 0) / this.hoteles.length
        : 0;

    return [
      { label: "Hoteles", value: this.hoteles.length, hint: "Disponibles hoy" },
      { label: "Promedio", value: this.currency(avgPrice), hint: "Tarifa por noche" },
      { label: "Comentarios", value: totalComentarios, hint: "Feedback agregado" },
    ];
  }

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.hotelesApi.list();
      const enriched = await Promise.all(
        data.map(async (item) => {
          const [valoraciones, reacciones, comentarios] = await Promise.all([
            this.valoracionesApi.statsHotel(item.hotel.id),
            this.reaccionesApi.statsHotel(item.hotel.id),
            this.comentariosApi.listByHotel(item.hotel.id),
          ]);
          this.comentarios[item.hotel.id] = comentarios.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          return { ...item, valoraciones, reacciones };
        }),
      );
      this.hoteles = enriched;
    } catch (err) {
      console.error(err);
      this.error = "Asegura que la API esté disponible y responda el endpoint de hoteles.";
    } finally {
      this.loading = false;
    }
  }

  appendComment(hotelId: string, comentario: Comentario): void {
    this.comentarios = {
      ...this.comentarios,
      [hotelId]: [comentario, ...(this.comentarios[hotelId] ?? [])],
    };
  }

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  ratingLabel(stats: ValoracionStats): string {
    return stats.total ? `${stats.promedio.toFixed(1)} / 5` : "Sin valoración";
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }

  commentsFor(hotelId: string): Comentario[] {
    return this.comentarios[hotelId] ?? [];
  }

  trackByHotel(_: number, item: HotelView): string {
    return item.hotel.id;
  }
}
