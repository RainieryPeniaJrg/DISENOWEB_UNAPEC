import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { finalize, forkJoin, map, of, switchMap } from "rxjs";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { ReaccionesApiService } from "../../core/api/reacciones-api.service";
import { SitiosApiService } from "../../core/api/sitios-api.service";
import { ValoracionesApiService } from "../../core/api/valoraciones-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Comentario, ReaccionStats, SitioConImagenes, ValoracionStats } from "../../core/models/domain.models";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { QuickCommentComponent } from "../../shared/components/quick-comment/quick-comment.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

type SitioView = SitioConImagenes & {
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
};

@Component({
  selector: "app-sitios",
  standalone: true,
  imports: [CommonModule, HeroComponent, ImageStripComponent, QuickCommentComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <app-hero
        eyebrow="Sitios"
        title="Catálogo turístico con contexto visual y social."
        description="Cada ficha combina descripción, ubicación, imágenes, valoración agregada y conversación reciente del API."
        [chips]="['Sitios activos', 'Comentarios', 'Likes y dislikes']"
        [metrics]="heroMetrics"
        noteTitle="Uso esperado"
        [noteItems]="['Explorar destinos disponibles.', 'Leer feedback real.', 'Comentar si tienes sesión activa.']"
      />

      <div *ngIf="error" class="panel error">
        <p class="eyebrow">Error</p>
        <h3>No se pudieron cargar los sitios.</h3>
        <p class="muted small">{{ error }}</p>
      </div>

      <div *ngIf="loading" class="panel">
        <p class="eyebrow">Cargando</p>
        <h3>Sincronizando catálogo de sitios turísticos.</h3>
      </div>

      <app-empty-state
        *ngIf="!loading && !error && !sitios.length"
        eyebrow="Sitios"
        title="No hay destinos disponibles"
        description="Cuando el backend publique sitios activos, aparecerán aquí."
      />

      <section class="content-grid" *ngIf="!loading && !error && sitios.length">
        <article *ngFor="let item of sitios; trackBy: trackBySitio" class="surface-card">
          <div class="card-head">
            <div class="card-copy">
              <p class="eyebrow">Destino</p>
              <h3>{{ item.sitio.nombre }}</h3>
              <p class="muted">{{ item.sitio.ubicacion }}</p>
            </div>
            <span class="pill pill-primary">{{ ratingLabel(item.valoraciones) }}</span>
          </div>

          <p class="small">{{ item.sitio.descripcion }}</p>

          <div class="chip-row">
            <span class="pill pill-ghost">{{ item.reacciones.likes }} likes</span>
            <span class="pill pill-ghost">{{ item.reacciones.dislikes }} dislikes</span>
            <span class="pill pill-ghost">{{ commentsFor(item.sitio.id).length }} comentarios</span>
          </div>

          <app-image-strip [images]="item.imagenes" />

          <div class="stack-sm">
            <div class="section-head">
              <h4>Comentarios</h4>
              <span class="micro muted">Ordenados por fecha</span>
            </div>

            <app-empty-state
              *ngIf="!commentsFor(item.sitio.id).length"
              eyebrow="Comentarios"
              title="Aún sin comentarios"
              description="Sé la primera persona en compartir una recomendación."
            />

            <ul class="mini-comments" *ngIf="commentsFor(item.sitio.id).length">
              <li *ngFor="let c of commentsFor(item.sitio.id)">
                <p class="small">{{ c.texto }}</p>
                <p class="micro muted">Usuario {{ c.usuarioId }} · {{ c.fecha | date: "mediumDate" }}</p>
              </li>
            </ul>
          </div>

          <app-quick-comment
            *ngIf="userId as uid"
            [usuarioId]="uid"
            [sitioId]="item.sitio.id"
            (created)="appendComment(item.sitio.id, $event)"
          />
        </article>
      </section>
    </div>
  `,
})
export class SitiosComponent implements OnInit {
  sitios: SitioView[] = [];
  comentarios: Record<string, Comentario[]> = {};
  loading = true;
  error: string | null = null;

  constructor(
    private readonly comentariosApi: ComentariosApiService,
    private readonly reaccionesApi: ReaccionesApiService,
    private readonly sitiosApi: SitiosApiService,
    private readonly valoracionesApi: ValoracionesApiService,
    public readonly auth: AuthService,
  ) {}

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    const totalComentarios = Object.values(this.comentarios).reduce((sum, list) => sum + list.length, 0);
    return [
      { label: "Sitios", value: this.sitios.length, hint: "Datos activos desde el API" },
      { label: "Comentarios", value: totalComentarios, hint: "Conversación visible" },
      { label: "Sesión", value: this.userId ? "Activa" : "Invitado", hint: "Comentar requiere acceso" },
    ];
  }

  ngOnInit(): void {
    this.sitiosApi
      .list()
      .pipe(
        switchMap((data) =>
          data.length
            ? forkJoin(
                data.map((item) =>
                  forkJoin({
                    valoraciones: this.valoracionesApi.statsSitio(item.sitio.id),
                    reacciones: this.reaccionesApi.statsSitio(item.sitio.id),
                    comentarios: this.comentariosApi.listBySitio(item.sitio.id),
                  }).pipe(
                    map(({ valoraciones, reacciones, comentarios }) => ({
                      ...item,
                      valoraciones,
                      reacciones,
                      comentarios,
                    })),
                  ),
                ),
              )
            : of([] as Array<SitioView & { comentarios: Comentario[] }>),
        ),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (enriched) => {
          this.comentarios = enriched.reduce<Record<string, Comentario[]>>((acc, item) => {
            acc[item.sitio.id] = [...item.comentarios].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            return acc;
          }, {});
          this.sitios = enriched.map(({ comentarios: _comentarios, ...item }) => item);
        },
        error: (err) => {
          console.error(err);
          this.error = "Asegura que la API esté disponible y responda el endpoint de sitios.";
        },
      });
  }

  appendComment(sitioId: string, comentario: Comentario): void {
    this.comentarios = {
      ...this.comentarios,
      [sitioId]: [comentario, ...(this.comentarios[sitioId] ?? [])],
    };
  }

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  ratingLabel(stats: ValoracionStats): string {
    return stats.total ? `${stats.promedio.toFixed(1)} / 5` : "Sin valoración";
  }

  commentsFor(sitioId: string): Comentario[] {
    return this.comentarios[sitioId] ?? [];
  }

  trackBySitio(_: number, item: SitioView): string {
    return item.sitio.id;
  }
}
