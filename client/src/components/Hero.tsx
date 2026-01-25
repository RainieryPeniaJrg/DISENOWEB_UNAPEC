export function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">DisenoWeb Travel</p>
        <h2>Explora destinos, hoteles y opiniones reales.</h2>
        <p className="muted">
          Descubre experiencias de otros viajeros, mira imágenes, valoraciones 1–5 y reacciones. Las demás secciones del
          sitio están listas para que el equipo las complete.
        </p>
        <div className="tag-cloud">
          <span className="pill pill-ghost">API Live</span>
          <span className="pill pill-ghost">Comentarios + Respuestas</span>
          <span className="pill pill-ghost">Valoraciones</span>
          <span className="pill pill-ghost">Reacciones</span>
        </div>
      </div>
      <div className="hero-card">
        <p className="muted small">Navega con el menú lateral</p>
        <ul className="hero-list">
          <li>Inicio: vista general y últimas reseñas</li>
          <li>Sitios / Hoteles: vistas WIP para extender</li>
          <li>Reservas / Pagos / Perfil: placeholders enlazados</li>
        </ul>
      </div>
    </section>
  );
}
