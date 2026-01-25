import axios from "axios";
import {
  AuthResponse,
  Comentario,
  Hotel,
  HotelConImagenes,
  Imagen,
  Reaccion,
  ReaccionStats,
  SitioConImagenes,
  SitioTuristico,
  Valoracion,
  ValoracionStats,
  User,
  Reservacion,
} from "../types";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7057";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/usuarios/register", { name, email, password });
    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/api/usuarios/login", { email, password });
    return data;
  },
  updateProfile: async (user: User): Promise<void> => {
    await api.put(`/api/usuarios/${user.id}`, user);
  },
};

export const sitiosApi = {
  list: async (): Promise<SitioConImagenes[]> => {
    const { data } = await api.get<SitioConImagenes[]>("/api/sitiosturisticos");
    return data;
  },
  get: async (id: string): Promise<SitioConImagenes> => {
    const { data } = await api.get<SitioConImagenes>(`/api/sitiosturisticos/${id}`);
    return data;
  },
};

export const usuariosApi = {
  get: async (id: string): Promise<User> => {
    const { data } = await api.get(`/api/usuarios/${id}`);
    return data.usuario ?? data; // soportar formato extendido
  },
};

export const reservacionesApi = {
  list: async (): Promise<Reservacion[]> => {
    const { data } = await api.get("/api/reservaciones");
    return data;
  },
};

export const hotelesApi = {
  list: async (): Promise<HotelConImagenes[]> => {
    const { data } = await api.get<HotelConImagenes[]>("/api/hoteles");
    return data;
  },
  get: async (id: string): Promise<HotelConImagenes> => {
    const { data } = await api.get<HotelConImagenes>(`/api/hoteles/${id}`);
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
