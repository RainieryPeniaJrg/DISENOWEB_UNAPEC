import { useEffect, useState } from "react";
import { Product } from "../types";

interface ProductFormProps {
  onSave: (input: Omit<Product, "id" | "createdAt">, existingId?: string) => Promise<void> | void;
  editing?: Product | null;
  loading?: boolean;
}

const emptyState = { name: "", description: "", price: 0 };

export function ProductForm({ onSave, editing, loading }: ProductFormProps) {
  const [form, setForm] = useState(emptyState);

  useEffect(() => {
    if (editing) {
      setForm({ name: editing.name, description: editing.description ?? "", price: editing.price });
    } else {
      setForm(emptyState);
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ ...form, price: Number(form.price) }, editing?.id);
    if (!editing) {
      setForm(emptyState);
    }
  };

  return (
    <form className="panel input-row" onSubmit={handleSubmit}>
      <div className="input-row">
        <label>
          Nombre
          <input
            name="name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            placeholder="Producto"
          />
        </label>
        <label>
          Descripcion
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Detalle breve"
          />
        </label>
        <label>
          Precio
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
            required
          />
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="button" type="submit" disabled={loading}>
          {editing ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
