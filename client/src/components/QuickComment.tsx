import { FormEvent, useState } from "react";
import { comentariosApi } from "../services/api";
import { Comentario } from "../types";

type Props = {
  usuarioId: string;
  sitioId?: string;
  hotelId?: string;
  onCreated: (comentario: Comentario) => void;
};

export function QuickComment({ usuarioId, sitioId, hotelId, onCreated }: Props) {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: any = { texto, usuarioId, sitioId, hotelId };
      const res = await comentariosApi.create(payload);
      onCreated(res);
      setTexto("");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo publicar el comentario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stack-sm quick-comment" onSubmit={handleSubmit}>
      <textarea
        placeholder="Escribe tu comentario..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={2}
        required
      />
      {error && <p className="small error-text">{error}</p>}
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? "Publicando..." : "Comentar"}
      </button>
    </form>
  );
}
