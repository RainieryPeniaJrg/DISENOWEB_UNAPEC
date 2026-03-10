import { Component, Input } from "@angular/core";

@Component({
  selector: "app-empty-state",
  standalone: true,
  template: `
    <div class="empty-state">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h3>{{ title }}</h3>
      <p class="muted small">{{ description }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() eyebrow = "Estado";
  @Input() title = "Todavía no hay contenido";
  @Input() description = "Conecta datos o vuelve más tarde para ver resultados aquí.";
}
