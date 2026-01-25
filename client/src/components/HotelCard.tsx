import { HotelConImagenes, Comentario } from "../types";
import { ImageStrip } from "./ImageStrip";
import { StatCard } from "./StatCard";
import { QuickComment } from "./QuickComment";
import { useAuth } from "../state/AuthContext";

type Props = {
  data: HotelConImagenes;
  valoracionesTotal?: number;
  valoracionesPromedio?: number;
  reaccionesTotal?: number;
  comentarios?: Comentario[];
  onComment?: (c: Comentario) => void;
};

export function HotelCard({ data, valoracionesPromedio, valoracionesTotal, reaccionesTotal, comentarios = [], onComment }: Props) {
  const { user } = useAuth();
  return (
    <article className="panel">
      <header className="card-header">
        <div>
          <p className="eyebrow">Hotel</p>
          <h4>{data.hotel.nombre}</h4>
          <p className="muted">{data.hotel.direccion}</p>
        </div>
        <div className="badge">${data.hotel.precioNoche.toFixed(2)} / noche</div>
      </header>
      <div className="stats-row">
        <StatCard title="Valoraciones" value={valoracionesTotal ?? 0} hint={`${valoracionesPromedio ?? 0}/5`} />
        <StatCard
          title="Reacciones"
          value={reaccionesTotal ?? 0}
          hint={reaccionesTotal ? `${Math.round((reaccionesTotal ?? 0) * 100) / 100} total` : "sin datos"}
        />
        <StatCard title="Comentarios" value={comentarios.length} hint="incluye respuestas" />
      </div>
      <ImageStrip images={data.imagenes} />
      <ul className="mini-comments">
        {comentarios.slice(0, 3).map((c) => (
          <li key={c.id}>
            <p className="small">{c.texto}</p>
            <p className="muted micro">{new Date(c.fecha).toLocaleString()}</p>
          </li>
        ))}
        {!comentarios.length && <p className="muted small">Sin comentarios aún.</p>}
      </ul>
      {user && onComment && (
        <QuickComment
          usuarioId={user.userId}
          hotelId={data.hotel.id}
          onCreated={(c) => {
            onComment(c);
          }}
        />
      )}
    </article>
  );
}
