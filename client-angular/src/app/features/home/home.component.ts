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

  <!-- HERO -->

  <section class="hero">

    <div>
      <h1>Explora destinos increíbles</h1>
      <p>
        Descubre playas, cascadas y hoteles recomendados por viajeros.
      </p>
    </div>

    <div class="hero-card">
      <p class="muted small">Explora:</p>

      <ul class="small">
        <li>🏝 Destinos turísticos</li>
        <li>🏨 Hoteles</li>
        <li>💬 Opiniones reales</li>
      </ul>
    </div>

  </section>

  <!-- ESTADOS -->

  <div *ngIf="error" class="panel">
    {{ error }}
  </div>

  <div *ngIf="loading" class="panel">
    Cargando destinos y hoteles...
  </div>

  <ng-container *ngIf="!loading && !error">

    <!-- STATS -->

    <section class="grid-3">

      <app-stat-card
        title="Sitios turísticos"
        [value]="sitios.length">
      </app-stat-card>

      <app-stat-card
        title="Hoteles"
        [value]="hoteles.length">
      </app-stat-card>

      <app-stat-card
        title="Comentarios recientes"
        [value]="comentariosRecientes.length">
      </app-stat-card>

    </section>

    <!-- SITIOS -->

    <section class="stack-md">

      <h2>Destinos populares</h2>

      <div class="grid-2">

        <article
          *ngFor="let item of sitios; trackBy: trackSitio"
          class="panel">

          <div style="padding:18px">

            <h4>{{ item.sitio.nombre }}</h4>

            <p class="muted">
              {{ item.sitio.descripcion }}
            </p>

          </div>

          <app-image-strip
            [images]="item.imagenes">
          </app-image-strip>

          <div style="padding:18px">

            <ng-container
              [ngTemplateOutlet]="miniComments"
              [ngTemplateOutletContext]="{ comentarios: item.comentarios }">
            </ng-container>

          </div>

        </article>

      </div>

    </section>

    <!-- HOTELES -->

    <section class="stack-md">

      <h2>Hoteles recomendados</h2>

      <div class="grid-2">

        <article
          *ngFor="let item of hoteles; trackBy: trackHotel"
          class="panel">

          <div style="padding:18px">

            <div style="display:flex;justify-content:space-between;align-items:center">

              <div>
                <h4>{{ item.hotel.nombre }}</h4>

                <p class="muted">
                  {{ item.hotel.direccion }}
                </p>
              </div>

              <div class="badge">
                {{ item.hotel.precioNoche }} / noche
              </div>

            </div>

          </div>

          <app-image-strip
            [images]="item.imagenes">
          </app-image-strip>

          <div style="padding:18px">

            <ng-container
              [ngTemplateOutlet]="miniComments"
              [ngTemplateOutletContext]="{ comentarios: item.comentarios }">
            </ng-container>

          </div>

        </article>

      </div>

    </section>

  </ng-container>

</div>


<!-- TEMPLATE COMENTARIOS -->

<ng-template #miniComments let-comentarios="comentarios">

  <p *ngIf="!comentarios?.length" class="muted small">
    Sin comentarios aún.
  </p>

  <ul *ngIf="comentarios?.length" class="mini-comments">

    <li *ngFor="let c of getMiniComentarios(comentarios)">

      <p class="small">
        {{ c.texto }}
      </p>

      <p class="micro muted">
        Usuario {{ c.usuarioId }}
        ·
        {{ c.fecha | date:'shortDate' }}
      </p>

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

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  get comentariosRecientes(): Comentario[] {
    const all = [
      ...this.sitios.flatMap((s) => s.comentarios),
      ...this.hoteles.flatMap((h) => h.comentarios),
    ];
    return all
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 6);
  }

  getMiniComentarios(comentarios: Comentario[]): Comentario[] {
    return comentarios.slice(0, 3);
  }

  async ngOnInit(): Promise<void> {
    try {
      const [sitiosData, hotelesData] = await Promise.all([
        this.sitiosApi.list(),
        this.hotelesApi.list(),
      ]);

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
      this.error = "No pudimos conectar con la API.";
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

  trackSitio(_: number, item: SitioView): string {
    return item.sitio.id;
  }

  trackHotel(_: number, item: HotelView): string {
    return item.hotel.id;
  }
}
