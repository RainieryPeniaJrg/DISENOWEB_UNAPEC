import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-stat-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel stat-card">
      <p class="eyebrow">{{ title }}</p>
      <div class="stat-value">{{ value }}</div>
      <p *ngIf="hint" class="muted small">{{ hint }}</p>
    </div>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number | string;
  @Input() hint?: string;
}
