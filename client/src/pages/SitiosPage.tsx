import { useEffect, useState } from "react";
import { comentariosApi, sitiosApi } from "../services/api";
import { Comentario, SitioConImagenes } from "../types";
import { ImageStrip } from "../components/ImageStrip";
import { useAuth } from "../state/AuthContext";
import { QuickComment } from "../components/QuickComment";

export function SitiosPage() {
  const { user } = useAuth();
  const [sitios, setSitios] = useState<SitioConImagenes[]>([]);
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sitiosApi.list();
        setSitios(data);
        const comms = await Promise.all(data.map((s) => comentariosApi.listBySitio(s.sitio.id)));
        const map: Record<string, Comentario[]> = {};
        data.forEach((s, idx) => (map[s.sitio.id] = comms[idx]));
        setComentarios(map);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los sitios.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="stack-md">
      <h2>Sitios turísticos</h2>
      {error && <div className="panel error">{error}</div>}
      {loading && <div className="panel">Cargando...</div>}
      {!loading &&
        sitios.map((s) => (
          <article key={s.sitio.id} className="panel">
            <header className="card-header">
              <div>
                <p className="eyebrow">Sitio</p>
                <h4>{s.sitio.nombre}</h4>
                <p className="muted">{s.sitio.descripcion}</p>
              </div>
              <p className="muted small">{s.sitio.ubicacion}</p>
            </header>
            <ImageStrip images={s.imagenes} />
            <h5>Comentarios</h5>
            <ul className="mini-comments">
              {(comentarios[s.sitio.id] ?? []).map((c) => (
                <li key={c.id}>
                  <p className="small">{c.texto}</p>
                  <p className="micro muted">{new Date(c.fecha).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            {user && (
              <QuickComment
                usuarioId={user.userId}
                sitioId={s.sitio.id}
                onCreated={(c) =>
                  setComentarios((prev) => ({ ...prev, [s.sitio.id]: [c, ...(prev[s.sitio.id] ?? [])] }))
                }
              />
            )}
          </article>
        ))}
    </div>
  );
}
