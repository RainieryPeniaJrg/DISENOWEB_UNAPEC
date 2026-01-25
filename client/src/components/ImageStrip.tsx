import { Imagen } from "../types";

export function ImageStrip({ images }: { images: Imagen[] }) {
  if (!images.length) return <p className="muted small">Sin imágenes.</p>;
  return (
    <div className="image-strip">
      {images.map((img) => (
        <figure key={img.id} className={img.esPrincipal ? "highlight" : ""}>
          <img src={img.url} alt={img.descripcion || "Imagen"} loading="lazy" />
          <figcaption className="micro muted">{img.descripcion || "Sin descripción"}</figcaption>
        </figure>
      ))}
    </div>
  );
}
