import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-wip",
  standalone: true,
  template: `
    <div class="panel">
      <p class="eyebrow">{{ title }}</p>
      <h2>Work in progress</h2>
      <p class="muted">
        La vista ya está enrutada y lista para que el equipo implemente funcionalidades específicas. Conecta aquí las
        operaciones de la API correspondientes cuando estén definidas.
      </p>
    </div>
  `,
})
export class WipComponent {
  readonly title: string;

  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data["title"] ?? "WIP";
  }
}
