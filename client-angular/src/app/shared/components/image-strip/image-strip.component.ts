import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Imagen } from "../../../core/models/domain.models";
import { resolveImageUrl } from "../../../core/utils/image-url.util";

@Component({
  selector: "app-image-strip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p *ngIf="!images.length" class="muted small">Sin imágenes.</p>
    <div *ngIf="images.length" class="image-strip">
      <figure *ngFor="let img of images; trackBy: trackById" [class.highlight]="img.esPrincipal">
        <img [src]="resolveUrl(img.url)" [alt]="img.descripcion || 'Imagen'" loading="lazy" />
        <figcaption class="micro muted">{{ img.descripcion || "Sin descripción" }}</figcaption>
      </figure>
    </div>
  `,
})
export class ImageStripComponent {
  @Input({ required: true }) images: Imagen[] = [];

  resolveUrl(url: string): string {
    return resolveImageUrl(url);
  }

  trackById(_: number, item: Imagen): string {
    return item.id;
  }
}
