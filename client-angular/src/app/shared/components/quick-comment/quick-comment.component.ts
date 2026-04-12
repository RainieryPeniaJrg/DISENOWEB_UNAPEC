import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";
import { Comentario } from "../../../core/models/domain.models";
import { ComentariosApiService } from "../../../core/api/comentarios-api.service";

@Component({
  selector: "app-quick-comment",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="stack-sm quick-comment" (submit)="handleSubmit($event)">
      <textarea
        class="form-textarea"
        placeholder="Escribe tu comentario..."
        [(ngModel)]="texto"
        name="texto"
        rows="3"
        required
      ></textarea>
      <p *ngIf="error" class="small error-text">{{ error }}</p>
      <div class="action-row">
        <button class="btn primary" type="submit" [disabled]="loading">
        {{ loading ? "Publicando..." : "Comentar" }}
        </button>
        <p class="micro muted">Comparte una observación útil para otros viajeros.</p>
      </div>
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

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.texto.trim()) return;

    this.loading = true;
    this.error = null;
    const payload: Omit<Comentario, "id" | "fecha"> = {
      texto: this.texto,
      usuarioId: this.usuarioId,
      sitioId: this.sitioId ?? null,
      hotelId: this.hotelId ?? null,
    };

    this.comentariosApi
      .create(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (created) => {
          this.created.emit(created);
          this.texto = "";
        },
        error: (err: unknown) => {
          this.error = err instanceof Error ? err.message : "No se pudo publicar el comentario";
        },
      });
  }
}
