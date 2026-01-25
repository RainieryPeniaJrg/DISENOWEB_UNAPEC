import { useEffect, useState } from "react";
import { comentariosApi, hotelesApi } from "../services/api";
import { Comentario, HotelConImagenes } from "../types";
import { ImageStrip } from "../components/ImageStrip";
import { useAuth } from "../state/AuthContext";
import { QuickComment } from "../components/QuickComment";

export function HotelesPage() {
  const { user } = useAuth();
  const [hoteles, setHoteles] = useState<HotelConImagenes[]>([]);
  const [comentarios, setComentarios] = useState<Record<string, Comentario[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hotelesApi.list();
        setHoteles(data);
        const comms = await Promise.all(data.map((h) => comentariosApi.listByHotel(h.hotel.id)));
        const map: Record<string, Comentario[]> = {};
        data.forEach((h, idx) => (map[h.hotel.id] = comms[idx]));
        setComentarios(map);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los hoteles.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="stack-md">
      <h2>Hoteles</h2>
      {error && <div className="panel error">{error}</div>}
      {loading && <div className="panel">Cargando...</div>}
      {!loading &&
        hoteles.map((h) => (
          <article key={h.hotel.id} className="panel">
            <header className="card-header">
              <div>
                <p className="eyebrow">Hotel</p>
                <h4>{h.hotel.nombre}</h4>
                <p className="muted">{h.hotel.direccion}</p>
              </div>
              <div className="badge">${h.hotel.precioNoche.toFixed(2)} / noche</div>
            </header>
            <ImageStrip images={h.imagenes} />
            <h5>Comentarios</h5>
            <ul className="mini-comments">
              {(comentarios[h.hotel.id] ?? []).map((c) => (
                <li key={c.id}>
                  <p className="small">{c.texto}</p>
                  <p className="micro muted">{new Date(c.fecha).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            {user && (
              <QuickComment
                usuarioId={user.userId}
                hotelId={h.hotel.id}
                onCreated={(c) =>
                  setComentarios((prev) => ({ ...prev, [h.hotel.id]: [c, ...(prev[h.hotel.id] ?? [])] }))
                }
              />
            )}
          </article>
        ))}
    </div>
  );
}
