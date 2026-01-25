import axios from "axios";
import {
  Comentario,
  Hotel,
  Imagen,
  Reaccion,
  ReaccionStats,
  SitioTuristico,
  Valoracion,
  ValoracionStats,
} from "../types";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7057";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const healthApi = {
  ping: async () => {
    const { data } = await api.get("/");
    return data;
  },
};

export const sitiosApi = {
  list: async (): Promise<SitioTuristico[]> => {
    const { data } = await api.get("/api/sitiosturisticos");
    return data;
  },
};

export const hotelesApi = {
  list: async (): Promise<Hotel[]> => {
    const { data } = await api.get("/api/hoteles");
    return data;
  },
};

export const comentariosApi = {
  listBySitio: async (sitioId: string): Promise<Comentario[]> => {
    const { data } = await api.get(`/api/comentarios/sitio/${sitioId}`);
    return data;
  },
  listByHotel: async (hotelId: string): Promise<Comentario[]> => {
    const { data } = await api.get(`/api/comentarios/hotel/${hotelId}`);
    return data;
  },
  create: async (payload: Omit<Comentario, "id" | "fecha">) => {
    const { data } = await api.post("/api/comentarios", payload);
    return data as Comentario;
  },
  reply: async (comentarioId: string, payload: { usuarioId: string; texto: string }) => {
    const { data } = await api.post(`/api/comentarios/${comentarioId}/responder`, payload);
    return data as Comentario;
  },
};

export const valoracionesApi = {
  listBySitio: async (sitioId: string): Promise<Valoracion[]> => {
    const { data } = await api.get(`/api/valoraciones/sitio/${sitioId}`);
    return data;
  },
  listByHotel: async (hotelId: string): Promise<Valoracion[]> => {
    const { data } = await api.get(`/api/valoraciones/hotel/${hotelId}`);
    return data;
  },
  statsSitio: async (sitioId: string): Promise<ValoracionStats> => {
    const { data } = await api.get(`/api/valoraciones/sitio/${sitioId}/estadisticas`);
    return data;
  },
  statsHotel: async (hotelId: string): Promise<ValoracionStats> => {
    const { data } = await api.get(`/api/valoraciones/hotel/${hotelId}/estadisticas`);
    return data;
  },
  create: async (payload: Omit<Valoracion, "id" | "fecha">) => {
    const { data } = await api.post("/api/valoraciones", payload);
    return data as Valoracion;
  },
};

export const reaccionesApi = {
  listSitio: async (sitioId: string): Promise<Reaccion[]> => {
    const { data } = await api.get(`/api/reacciones/sitio/${sitioId}`);
    return data;
  },
  listHotel: async (hotelId: string): Promise<Reaccion[]> => {
    const { data } = await api.get(`/api/reacciones/hotel/${hotelId}`);
    return data;
  },
  statsSitio: async (sitioId: string): Promise<ReaccionStats> => {
    const { data } = await api.get(`/api/reacciones/sitio/${sitioId}/estadisticas`);
    return data;
  },
  statsHotel: async (hotelId: string): Promise<ReaccionStats> => {
    const { data } = await api.get(`/api/reacciones/hotel/${hotelId}/estadisticas`);
    return data;
  },
  create: async (payload: Omit<Reaccion, "id" | "fecha">) => {
    const { data } = await api.post("/api/reacciones", payload);
    return data as Reaccion;
  },
};

export const imagenesApi = {
  listSitio: async (sitioId: string): Promise<Imagen[]> => {
    const { data } = await api.get(`/api/imagenes/sitio/${sitioId}`);
    return data;
  },
  listHotel: async (hotelId: string): Promise<Imagen[]> => {
    const { data } = await api.get(`/api/imagenes/hotel/${hotelId}`);
    return data;
  },
  listUsuario: async (usuarioId: string): Promise<Imagen[]> => {
    const { data } = await api.get(`/api/imagenes/usuario/${usuarioId}`);
    return data;
  },
  uploadSitio: async (sitioId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const { data } = await api.post(`/api/imagenes/sitio/${sitioId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as Imagen[];
  },
  uploadHotel: async (hotelId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const { data } = await api.post(`/api/imagenes/hotel/${hotelId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as Imagen[];
  },
  uploadUsuario: async (usuarioId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const { data } = await api.post(`/api/imagenes/usuario/${usuarioId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as Imagen[];
  },
};
