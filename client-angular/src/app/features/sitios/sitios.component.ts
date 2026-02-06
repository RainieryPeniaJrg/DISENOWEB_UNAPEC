import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { SitiosApiService } from "../../core/api/sitios-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Comentario, SitioConImagenes } from "../../core/models/domain.models";
import { ImageStripComponent } from "../../shared/components/image-strip/image-strip.component";
import { QuickCommentComponent } from "../../shared/components/quick-comment/quick-comment.component";

@Component({
  selector: "app-sitios",
  standalone: true,
  imports: [CommonModule, ImageStripComponent, QuickCommentComponent],
  template: `
    <div class="stack-md">
      <h2>Sitios turísticos</h2>
      <div *ngIf="error" class="panel error">{{ error }}</div>
      <div *ngIf="loading" class="panel">Cargando...</div>
      <article *ngFor="let s of sitios; trackBy: trackBySitio" class="panel">
        <header class="card-header">
          <div>
            <p class="eyebrow">Sitio</p>
            <h4>{{ s.sitio.nombre }}</h4>
            <p class="muted">{{ s.sitio.descripcion }}</p>
          </div>
          <p class="muted small">{{ s.sitio.ubicacion }}</p>
        </header>
        <app-image-strip [images]="s.imagenes" />
        <h5>Comentarios</h5>
        <ul class="mini-comments">
          <li *ngFor="let c of comentarios[s.sitio.id] ?? []">
            <p class="small">{{ c.texto }}</p>
            <p class="micro muted">{{ c.fecha | date: "short" }}</p>
          </li>
        </ul>
        <app-quick-comment
          *ngIf="userId as uid"
          [usuarioId]="uid"
          [sitioId]="s.sitio.id"
          (created)="appendComment(s.sitio.id, $event)"
        />
      </article>
    </div>
  `,
})
export class SitiosComponent implements OnInit {
  sitios: SitioConImagenes[] = [];
  comentarios: Record<string, Comentario[]> = {};
  loading = true;
  error: string | null = null;

  constructor(
    private readonly comentariosApi: ComentariosApiService,
    private readonly sitiosApi: SitiosApiService,
    public readonly auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.sitiosApi.list();
      this.sitios = data;
      const allComments = await Promise.all(data.map((item) => this.comentariosApi.listBySitio(item.sitio.id)));
      const map: Record<string, Comentario[]> = {};
      data.forEach((item, idx) => {
        map[item.sitio.id] = allComments[idx];
      });
      this.comentarios = map;
    } catch (err) {
      console.error(err);
      this.error = "No se pudieron cargar los sitios.";
    } finally {
      this.loading = false;
    }
  }

  appendComment(sitioId: string, comentario: Comentario): void {
    this.comentarios = { ...this.comentarios, [sitioId]: [comentario, ...(this.comentarios[sitioId] ?? [])] };
  }

  get userId(): string | null {
    return this.auth.user()?.userId ?? null;
  }

  trackBySitio(_: number, item: SitioConImagenes): string {
    return item.sitio.id;
  }
}
