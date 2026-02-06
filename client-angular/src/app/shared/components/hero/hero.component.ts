import { Component } from "@angular/core";

@Component({
  selector: "app-hero",
  standalone: true,
  template: `
    <section class="hero">
      <div>
        <p class="eyebrow">DisenoWeb Travel</p>
        <h2>Explora destinos, hoteles y opiniones reales.</h2>
        <p class="muted">
          Descubre experiencias de otros viajeros, mira imágenes, valoraciones 1–5 y reacciones. Las demás secciones
          del sitio están listas para que el equipo las complete.
        </p>
        <div class="tag-cloud">
          <span class="pill pill-ghost">API Live</span>
          <span class="pill pill-ghost">Comentarios + Respuestas</span>
          <span class="pill pill-ghost">Valoraciones</span>
          <span class="pill pill-ghost">Reacciones</span>
        </div>
      </div>
      <div class="hero-card">
        <p class="muted small">Navega con el menú lateral</p>
        <ul class="hero-list">
          <li>Inicio: vista general y últimas reseñas</li>
          <li>Sitios / Hoteles: vistas WIP para extender</li>
          <li>Reservas / Pagos / Perfil: placeholders enlazados</li>
        </ul>
      </div>
    </section>
  `,
})
export class HeroComponent {}
