import { Imagen } from "../types";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7057";

export function ImageStrip({ images }: { images: Imagen[] }) {
  if (!images.length) return <p className="muted small">Sin imágenes.</p>;
  return (
    <div className="image-strip">
      {images.map((img) => {
        const src = img.url.startsWith("http") ? img.url : `${apiBase}${img.url}`;
        return (
          <figure key={img.id} className={img.esPrincipal ? "highlight" : ""}>
            <img src={src} alt={img.descripcion || "Imagen"} loading="lazy" />
            <figcaption className="micro muted">{img.descripcion || "Sin descripción"}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
