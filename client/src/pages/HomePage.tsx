import { useEffect, useMemo, useState } from "react";
import { comentariosApi, hotelesApi, reaccionesApi, sitiosApi, valoracionesApi } from "../services/api";
import {
  Comentario,
  HotelConImagenes,
  SitioConImagenes,
  ValoracionStats,
  ReaccionStats,
} from "../types";
import { StatCard } from "../components/StatCard";
import { WipBanner } from "../components/WipBanner";
import { Hero } from "../components/Hero";
import { ImageStrip } from "../components/ImageStrip";
import { useAuth } from "../state/AuthContext";
import { QuickComment } from "../components/QuickComment";

type SitioView = {
  sitio: SitioConImagenes["sitio"];
  imagenes: SitioConImagenes["imagenes"];
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
  comentarios: Comentario[];
};

type HotelView = {
  hotel: HotelConImagenes["hotel"];
  imagenes: HotelConImagenes["imagenes"];
  valoraciones: ValoracionStats;
  reacciones: ReaccionStats;
  comentarios: Comentario[];
};

export function HomePage() {
  const { user } = useAuth();
  const [sitios, setSitios] = useState<SitioView[]>([]);
  const [hoteles, setHoteles] = useState<HotelView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const [sitiosData, hotelesData] = await Promise.all([sitiosApi.list(), hotelesApi.list()]);

        const sitiosEnriquecidos = await Promise.all(
          sitiosData.map(async ({ sitio, imagenes }) => {
            const [val, reac, com] = await Promise.all([
              valoracionesApi.statsSitio(sitio.id),
              reaccionesApi.statsSitio(sitio.id),
              comentariosApi.listBySitio(sitio.id),
            ]);
            return { sitio, imagenes, valoraciones: val, reacciones: reac, comentarios: com };
          })
        );

        const hotelesEnriquecidos = await Promise.all(
          hotelesData.map(async ({ hotel, imagenes }) => {
            const [val, reac, com] = await Promise.all([
              valoracionesApi.statsHotel(hotel.id),
              reaccionesApi.statsHotel(hotel.id),
              comentariosApi.listByHotel(hotel.id),
            ]);
            return { hotel, imagenes, valoraciones: val, reacciones: reac, comentarios: com };
          })
        );

        setSitios(sitiosEnriquecidos);
        setHoteles(hotelesEnriquecidos);
      } catch (err) {
        console.error(err);
        setError("No pudimos conectar con la API. Revisa que esté corriendo en https://localhost:7057");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const comentariosRecientes = useMemo(() => {
    const lista = [...sitios.flatMap((s) => s.comentarios), ...hoteles.flatMap((h) => h.comentarios)];
    return lista.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 6);
  }, [sitios, hoteles]);

  return (
    <div className="stack-lg">
      <Hero />

      {error && <div className="panel error">{error}</div>}
      {loading && <div className="panel">Cargando destinos y hoteles...</div>}

      {!loading && !error && (
        <>
          <section className="grid-3">
            <StatCard title="Sitios turísticos" value={sitios.length} hint="Conectados a la API" />
            <StatCard title="Hoteles" value={hoteles.length} hint="Listos para reservas (WIP)" />
            <StatCard title="Comentarios recientes" value={comentariosRecientes.length} hint="Incluye respuestas" />
          </section>

          <section className="stack-md">
            <div className="section-head">
              <h3>Destinos con feedback</h3>
            </div>
            <div className="grid-2">
              {sitios.map((item) => (
                <article key={item.sitio.id} className="panel">
                  <header className="card-header">
                    <div>
                      <p className="eyebrow">Sitio</p>
                      <h4>{item.sitio.nombre}</h4>
                      <p className="muted">{item.sitio.descripcion}</p>
                    </div>
                  </header>
                  <div className="stats-row">
                    <StatBadge label="Valoraciones" value={item.valoraciones.total} note={`${item.valoraciones.promedio}/5`} />
                    <StatBadge
                      label="Reacciones"
                      value={item.reacciones.total}
                      note={`${Math.round(item.reacciones.promedioMeGusta * 100)}% me gusta`}
                    />
                    <StatBadge label="Comentarios" value={item.comentarios.length} note="incluye respuestas" />
                  </div>
                  <ImageStrip images={item.imagenes} />
                  <MiniComments comentarios={item.comentarios} />
                  {user && (
                    <QuickComment
                      usuarioId={user.userId}
                      sitioId={item.sitio.id}
                      onCreated={(c) =>
                        setSitios((prev) =>
                          prev.map((s) => (s.sitio.id === item.sitio.id ? { ...s, comentarios: [c, ...s.comentarios] } : s))
                        )
                      }
                    />
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="stack-md">
            <div className="section-head">
              <h3>Hoteles</h3>
              <p className="muted">Reservas y pagos siguen como WIP.</p>
            </div>
            <div className="grid-2">
              {hoteles.map((item) => (
                <article key={item.hotel.id} className="panel">
                  <header className="card-header">
                    <div>
                      <p className="eyebrow">Hotel</p>
                      <h4>{item.hotel.nombre}</h4>
                      <p className="muted">{item.hotel.direccion}</p>
                    </div>
                    <div className="badge">${item.hotel.precioNoche.toFixed(2)} / noche</div>
                  </header>
                  <div className="stats-row">
                    <StatBadge label="Valoraciones" value={item.valoraciones.total} note={`${item.valoraciones.promedio}/5`} />
                    <StatBadge
                      label="Reacciones"
                      value={item.reacciones.total}
                      note={`${Math.round(item.reacciones.promedioMeGusta * 100)}% me gusta`}
                    />
                    <StatBadge label="Comentarios" value={item.comentarios.length} note="incluye respuestas" />
                  </div>
                  <ImageStrip images={item.imagenes} />
                  <MiniComments comentarios={item.comentarios} />
                  {user && (
                    <QuickComment
                      usuarioId={user.userId}
                      hotelId={item.hotel.id}
                      onCreated={(c) =>
                        setHoteles((prev) =>
                          prev.map((h) => (h.hotel.id === item.hotel.id ? { ...h, comentarios: [c, ...h.comentarios] } : h))
                        )
                      }
                    />
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="stack-md">
            <div className="section-head">
              <h3>Work in progress</h3>
              <p className="muted">Reservas, pagos y perfil ya están enlazados en el router con placeholders.</p>
            </div>
            <WipBanner />
          </section>
        </>
      )}
    </div>
  );
}

function StatBadge({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="stat-badge">
      <p className="muted">{label}</p>
      <div className="stat-value">{value}</div>
      {note && <p className="small muted">{note}</p>}
    </div>
  );
}

function MiniComments({ comentarios }: { comentarios: Comentario[] }) {
  if (!comentarios.length) return <p className="muted small">Sin comentarios aún.</p>;
  return (
    <ul className="mini-comments">
      {comentarios.slice(0, 3).map((c) => (
        <li key={c.id}>
          <p className="small">{c.texto}</p>
          <p className="muted micro">Usuario {c.usuarioId.slice(0, 6)} · {new Date(c.fecha).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
