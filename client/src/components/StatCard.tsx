export function StatCard({ title, value, hint }: { title: string; value: number | string; hint?: string }) {
  return (
    <div className="panel stat-card">
      <p className="eyebrow">{title}</p>
      <div className="stat-value">{value}</div>
      {hint && <p className="muted small">{hint}</p>}
    </div>
  );
}
