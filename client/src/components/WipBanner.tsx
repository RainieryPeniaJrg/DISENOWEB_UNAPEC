export function WipBanner() {
  return (
    <div className="panel wip-banner">
      <div>
        <p className="eyebrow">Siguientes iteraciones</p>
        <h4>Reservas, pagos y perfil</h4>
        <p className="muted small">
          Las rutas ya están definidas en el router. Agrega formularios, validaciones y llamadas a la API cuando se
          diseñen los flujos.
        </p>
      </div>
      <div className="pill">WIP</div>
    </div>
  );
}
