import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { StatCardComponent } from "../../shared/components/stat-card/stat-card.component";
import { WipBannerComponent } from "../../shared/components/wip-banner/wip-banner.component";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { QuickCommentComponent } from "../../shared/components/quick-comment/quick-comment.component";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { HotelesApiService } from "../../core/api/hoteles-api.service";
import { ReaccionesApiService } from "../../core/api/reacciones-api.service";
import { SitiosApiService } from "../../core/api/sitios-api.service";
import { ValoracionesApiService } from "../../core/api/valoraciones-api.service";
import { AuthService } from "../../core/state/auth.service";
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
  imports: [
    CommonModule,
    HeroComponent,
    StatCardComponent,
    WipBannerComponent,
    ImageStripComponent,
    QuickCommentComponent,
  ],
  template: `
    <div class="stack-lg">
      <app-hero />

      <div *ngIf="error" class="panel error">{{ error }}</div>
      <div *ngIf="loading" class="panel">Cargando destinos y hoteles...</div>

      <ng-container *ngIf="!loading && !error">
        <section class="grid-3">
          <app-stat-card title="Sitios turísticos" [value]="sitios.length" hint="Conectados a la API" />
          <app-stat-card title="Hoteles" [value]="hoteles.length" hint="Listos para reservas (WIP)" />
          <app-stat-card title="Comentarios recientes" [value]="comentariosRecientes.length" hint="Incluye respuestas" />
        </section>

        <section class="stack-md">
          <div class="section-head">
            <h3>Destinos con feedback</h3>
          </div>
          <div class="grid-2">
            <article *ngFor="let item of sitios; trackBy: trackSitio" class="panel">
              <header class="card-header">
                <div>
                  <p class="eyebrow">Sitio</p>
                  <h4>{{ item.sitio.nombre }}</h4>
                  <p class="muted">{{ item.sitio.descripcion }}</p>
                </div>
              </header>
              <div class="stats-row">
                <div class="stat-badge">
                  <p class="muted">Valoraciones</p>
                  <div class="stat-value">{{ item.valoraciones.total }}</div>
                  <p class="small muted">{{ item.valoraciones.promedio }}/5</p>
                </div>
                <div class="stat-badge">
                  <p class="muted">Reacciones</p>
                  <div class="stat-value">{{ item.reacciones.total }}</div>
                  <p class="small muted">{{ toPercent(item.reacciones.promedioMeGusta) }}% me gusta</p>
                </div>
                <div class="stat-badge">
                  <p class="muted">Comentarios</p>
                  <div class="stat-value">{{ item.comentarios.length }}</div>
                  <p class="small muted">incluye respuestas</p>
                </div>
              </div>
              <app-image-strip [images]="item.imagenes" />
              <ng-container [ngTemplateOutlet]="miniComments" [ngTemplateOutletContext]="{ comentarios: item.comentarios }" />
              <app-quick-comment
                *ngIf="userId as uid"
                [usuarioId]="uid"
                [sitioId]="item.sitio.id"
                (created)="appendSitioComment(item.sitio.id, $event)"
              />
            </article>
          </div>
        </section>

        <section class="stack-md">
          <div class="section-head">
            <h3>Hoteles</h3>
            <p class="muted">Reservas y pagos siguen como WIP.</p>
          </div>
          <div class="grid-2">
            <article *ngFor="let item of hoteles; trackBy: trackHotel" class="panel">
              <header class="card-header">
                <div>
                  <p class="eyebrow">Hotel</p>
                  <h4>{{ item.hotel.nombre }}</h4>
                  <p class="muted">{{ item.hotel.direccion }}</p>
                </div>
                <div class="badge">${{ item.hotel.precioNoche.toFixed(2) }} / noche</div>
              </header>
              <div class="stats-row">
                <div class="stat-badge">
                  <p class="muted">Valoraciones</p>
                  <div class="stat-value">{{ item.valoraciones.total }}</div>
                  <p class="small muted">{{ item.valoraciones.promedio }}/5</p>
                </div>
                <div class="stat-badge">
                  <p class="muted">Reacciones</p>
                  <div class="stat-value">{{ item.reacciones.total }}</div>
                  <p class="small muted">{{ toPercent(item.reacciones.promedioMeGusta) }}% me gusta</p>
                </div>
                <div class="stat-badge">
                  <p class="muted">Comentarios</p>
                  <div class="stat-value">{{ item.comentarios.length }}</div>
                  <p class="small muted">incluye respuestas</p>
                </div>
              </div>
              <app-image-strip [images]="item.imagenes" />
              <ng-container [ngTemplateOutlet]="miniComments" [ngTemplateOutletContext]="{ comentarios: item.comentarios }" />
              <app-quick-comment
                *ngIf="userId as uid"
                [usuarioId]="uid"
                [hotelId]="item.hotel.id"
                (created)="appendHotelComment(item.hotel.id, $event)"
              />
            </article>
          </div>
        </section>

        <section class="stack-md">
          <div class="section-head">
            <h3>Work in progress</h3>
            <p class="muted">Reservas, pagos y perfil ya están enlazados en el router con placeholders.</p>
          </div>
          <app-wip-banner />
        </section>
      </ng-container>
    </div>

    <ng-template #miniComments let-comentarios="comentarios">
      <p *ngIf="!comentarios.length" class="muted small">Sin comentarios aún.</p>
      <ul *ngIf="comentarios.length" class="mini-comments">
        <li *ngFor="let c of comentarios | slice: 0 : 3">
          <p class="small">{{ c.texto }}</p>
          <p class="muted micro">Usuario {{ c.usuarioId.slice(0, 6) }} · {{ c.fecha | date }}</p>
        </li>
      </ul>
    </ng-template>
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
    public readonly auth: AuthService,
  ) {}

  get comentariosRecientes(): Comentario[] {
    const list = [...this.sitios.flatMap((s) => s.comentarios), ...this.hoteles.flatMap((h) => h.comentarios)];
    return list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 6);
  }

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.error = null;
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
    } catch (err) {
      console.error(err);
      this.error = "No pudimos conectar con la API. Revisa que esté corriendo en https://localhost:7057";
    } finally {
      this.loading = false;
    }
  }

  appendSitioComment(sitioId: string, comentario: Comentario): void {
    this.sitios = this.sitios.map((s) =>
      s.sitio.id === sitioId ? { ...s, comentarios: [comentario, ...s.comentarios] } : s,
    );
  }

  appendHotelComment(hotelId: string, comentario: Comentario): void {
    this.hoteles = this.hoteles.map((h) =>
      h.hotel.id === hotelId ? { ...h, comentarios: [comentario, ...h.comentarios] } : h,
    );
  }

  toPercent(value: number): number {
    return Math.round(value * 100);
  }

  trackSitio(_: number, item: SitioView): string {
    return item.sitio.id;
  }

  trackHotel(_: number, item: HotelView): string {
    return item.hotel.id;
  }
}
