import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Comentario } from "../../../core/models/domain.models";
import { ComentariosApiService } from "../../../core/api/comentarios-api.service";

@Component({
  selector: "app-quick-comment",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="stack-sm quick-comment" (submit)="handleSubmit($event)">
      <textarea
        placeholder="Escribe tu comentario..."
        [(ngModel)]="texto"
        name="texto"
        rows="2"
        required
      ></textarea>
      <p *ngIf="error" class="small error-text">{{ error }}</p>
      <button class="btn primary" type="submit" [disabled]="loading">
        {{ loading ? "Publicando..." : "Comentar" }}
      </button>
    </form>
  `,
})
export class QuickCommentComponent {
  @Input({ required: true }) usuarioId!: string;
  @Input() sitioId?: string;
  @Input() hotelId?: string;
  @Output() created = new EventEmitter<Comentario>();

  texto = "";
  loading = false;
  error: string | null = null;

  constructor(private readonly comentariosApi: ComentariosApiService) {}

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.texto.trim()) return;

    this.loading = true;
    this.error = null;

    try {
      const payload: Omit<Comentario, "id" | "fecha"> = {
        texto: this.texto,
        usuarioId: this.usuarioId,
        sitioId: this.sitioId ?? null,
        hotelId: this.hotelId ?? null,
      };
      const created = await this.comentariosApi.create(payload);
      this.created.emit(created);
      this.texto = "";
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : "No se pudo publicar el comentario";
    } finally {
      this.loading = false;
    }
  }
}
