import { useEffect, useState } from "react";
import { ProductForm } from "./components/ProductForm";
import { ProductList } from "./components/ProductList";
import { productApi } from "./api";
import { Product } from "./types";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productApi.list();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos. Verifica que la API este arriba.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (payload: Omit<Product, "id" | "createdAt">, existingId?: string) => {
    setSaving(true);
    setError(null);
    try {
      if (existingId && editing) {
        const updated: Product = { ...editing, ...payload };
        await productApi.update(updated);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditing(null);
      } else {
        const created = await productApi.create(payload);
        setProducts((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await productApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editing?.id === id) {
        setEditing(null);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto");
    }
  };

  return (
    <div className="app-shell">
      <header>
        <p style={{ color: "#6c7683", margin: 0 }}>API + React</p>
        <h1>Inventario JSON</h1>
      </header>

      {error && (
        <div className="panel" style={{ borderColor: "#ffd7d7", color: "#9b1c1c" }}>
          {error}
        </div>
      )}

      <div className="two-col">
        <ProductForm onSave={handleSave} editing={editing} loading={saving} />
        <div>
          {loading ? (
            <div className="panel">Cargando...</div>
          ) : (
            <ProductList products={products} onEdit={setEditing} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
