import { Product } from "../types";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <h3 style={{ margin: 0 }}>Inventario</h3>
        <span className="badge">{products.length} items</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => onEdit(p)}>Editar</button>
                    <button className="danger" onClick={() => onDelete(p.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#6c7683", padding: "1rem" }}>
                  Aun no hay productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
