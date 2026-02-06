export function WipPage({ title }: { title: string }) {
  return (
    <div className="panel">
      <p className="eyebrow">{title}</p>
      <h2>Work in progress</h2>
      <p className="muted">
        La vista ya está enrutada y lista para que el equipo implemente funcionalidades específicas. Conecta aquí las
        operaciones de la API correspondientes cuando estén definidas.
      </p>
    </div>
  );
}
