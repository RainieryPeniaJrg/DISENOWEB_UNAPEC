import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { HotelesApiService } from "../../core/api/hoteles-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Comentario, HotelConImagenes } from "../../core/models/domain.models";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { QuickCommentComponent } from "../../shared/components/quick-comment/quick-comment.component";

@Component({
  selector: "app-hoteles",
  standalone: true,
  imports: [CommonModule, ImageStripComponent, QuickCommentComponent],
  template: `
    <div class="stack-md">
      <h2>Hoteles</h2>
      <div *ngIf="error" class="panel error">{{ error }}</div>
      <div *ngIf="loading" class="panel">Cargando...</div>
      <article *ngFor="let h of hoteles; trackBy: trackByHotel" class="panel">
        <header class="card-header">
          <div>
            <p class="eyebrow">Hotel</p>
            <h4>{{ h.hotel.nombre }}</h4>
            <p class="muted">{{ h.hotel.direccion }}</p>
          </div>
          <div class="badge">${{ h.hotel.precioNoche.toFixed(2) }} / noche</div>
        </header>
        <app-image-strip [images]="h.imagenes" />
        <h5>Comentarios</h5>
        <ul class="mini-comments">
          <li *ngFor="let c of comentarios[h.hotel.id] ?? []">
            <p class="small">{{ c.texto }}</p>
            <p class="micro muted">{{ c.fecha | date: "short" }}</p>
          </li>
        </ul>
        <app-quick-comment
          *ngIf="userId as uid"
          [usuarioId]="uid"
          [hotelId]="h.hotel.id"
          (created)="appendComment(h.hotel.id, $event)"
        />
      </article>
    </div>
  `,
})
export class HotelesComponent implements OnInit {
  hoteles: HotelConImagenes[] = [];
  comentarios: Record<string, Comentario[]> = {};
  loading = true;
  error: string | null = null;

  constructor(
    private readonly comentariosApi: ComentariosApiService,
    private readonly hotelesApi: HotelesApiService,
    public readonly auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.hotelesApi.list();
      this.hoteles = data;
      const allComments = await Promise.all(data.map((item) => this.comentariosApi.listByHotel(item.hotel.id)));
      const map: Record<string, Comentario[]> = {};
      data.forEach((item, idx) => {
        map[item.hotel.id] = allComments[idx];
      });
      this.comentarios = map;
    } catch (err) {
      console.error(err);
      this.error = "No se pudieron cargar los hoteles.";
    } finally {
      this.loading = false;
    }
  }

  appendComment(hotelId: string, comentario: Comentario): void {
    this.comentarios = { ...this.comentarios, [hotelId]: [comentario, ...(this.comentarios[hotelId] ?? [])] };
  }

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  trackByHotel(_: number, item: HotelConImagenes): string {
    return item.hotel.id;
  }
}
