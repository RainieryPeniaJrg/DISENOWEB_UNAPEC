import axios from "axios";
import { Product } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7057/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const productApi = {
  list: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products");
    return data;
  },
  create: async (payload: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  },
  update: async (product: Product): Promise<void> => {
    await api.put(`/products/${product.id}`, product);
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
