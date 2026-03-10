import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

type HeroMetric = {
  label: string;
  value: string | number;
  hint?: string;
};

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-hero">
      <div class="hero-layout">
        <div class="hero-copy">
          <p class="eyebrow">{{ eyebrow }}</p>
          <h1>{{ title }}</h1>
          <p class="hero-description">{{ description }}</p>
          <div class="chip-row" *ngIf="chips.length">
            <span *ngFor="let chip of chips" class="pill pill-ghost">{{ chip }}</span>
          </div>
          <div class="hero-metrics" *ngIf="metrics.length">
            <article *ngFor="let metric of metrics" class="metric-card">
              <p class="micro">{{ metric.label }}</p>
              <div class="metric-value">{{ metric.value }}</div>
              <p *ngIf="metric.hint" class="micro">{{ metric.hint }}</p>
            </article>
          </div>
        </div>

        <aside class="hero-note">
          <p class="eyebrow">{{ noteTitle }}</p>
          <ul>
            <li *ngFor="let item of noteItems" class="small">{{ item }}</li>
          </ul>
        </aside>
      </div>
    </section>
  `,
})
export class HeroComponent {
  @Input() eyebrow = "DisenoWeb Travel";
  @Input() title = "Explora destinos, hoteles y opiniones reales.";
  @Input() description =
    "Descubre experiencias de otros viajeros, compara datos del API y encuentra ideas para tu próximo viaje.";
  @Input() chips: string[] = [];
  @Input() metrics: HeroMetric[] = [];
  @Input() noteTitle = "Vista rápida";
  @Input() noteItems: string[] = [];
}
