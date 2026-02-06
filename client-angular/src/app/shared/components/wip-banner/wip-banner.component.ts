import { Component } from "@angular/core";

@Component({
  selector: "app-wip-banner",
  standalone: true,
  template: `
    <div class="panel wip-banner">
      <div>
        <p class="eyebrow">Siguientes iteraciones</p>
        <h4>Reservas, pagos y perfil</h4>
        <p class="muted small">
          Las rutas ya están definidas en el router. Agrega formularios, validaciones y llamadas a la API cuando se
          diseñen los flujos.
        </p>
      </div>
      <div class="pill">WIP</div>
    </div>
  `,
})
export class WipBannerComponent {}
