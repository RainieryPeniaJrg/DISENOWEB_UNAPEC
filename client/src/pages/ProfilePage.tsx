import { useEffect, useState } from "react";
import { reservacionesApi, usuariosApi } from "../services/api";
import { Reservacion, User } from "../types";
import { useAuth } from "../state/AuthContext";

export function ProfilePage() {
  const { user, updateProfile, loading, error } = useAuth();
  const [reservas, setReservas] = useState<Reservacion[]>([]);
  const [form, setForm] = useState<User | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const [u, allRes] = await Promise.all([usuariosApi.get(user.userId), reservacionesApi.list()]);
      setForm(u);
      setReservas(allRes.filter((r) => r.usuarioId === user.userId));
    };
    load();
  }, [user]);

  if (!user) return <div className="panel">Accede para ver tu perfil.</div>;
  if (!form) return <div className="panel">Cargando perfil...</div>;

  const handleSave = async () => {
    setStatus(null);
    await updateProfile({ name: form.name, email: form.email, passwordHash: form.passwordHash });
    if (!error) setStatus("Datos actualizados");
  };

  return (
    <div className="stack-md">
      <h2>Mi perfil</h2>
      <div className="panel stack-sm">
        <label className="muted small">Nombre</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label className="muted small">Email</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="muted small">Password</label>
        <input
          type="password"
          value={form.passwordHash}
          onChange={(e) => setForm({ ...form, passwordHash: e.target.value })}
        />
        {error && <p className="error-text small">{error}</p>}
        {status && <p className="small" style={{ color: "#46c2b3" }}>{status}</p>}
        <button className="btn primary" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="panel">
        <h4>Mis reservaciones</h4>
        {!reservas.length && <p className="muted small">No tienes reservaciones aún.</p>}
        <ul className="mini-comments">
          {reservas.map((r) => (
            <li key={r.id}>
              <p className="small">
                {new Date(r.fechaInicio).toLocaleDateString()} → {new Date(r.fechaFin).toLocaleDateString()} · Estado:{" "}
                {r.estado} · Total ${r.total}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
