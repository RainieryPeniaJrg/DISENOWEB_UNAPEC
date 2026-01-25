export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
  createdAt: string;
}

export interface SitioTuristico {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  activo: boolean;
}

export interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  precioNoche: number;
  sitioId: string;
  activo: boolean;
}

export interface Imagen {
  id: string;
  url: string;
  fileName: string;
  descripcion: string;
  esPrincipal: boolean;
  sitioId?: string | null;
  hotelId?: string | null;
  usuarioId?: string | null;
}

export interface SitioConImagenes {
  sitio: SitioTuristico;
  imagenes: Imagen[];
}

export interface HotelConImagenes {
  hotel: Hotel;
  imagenes: Imagen[];
}

export interface Comentario {
  id: string;
  texto: string;
  fecha: string;
  usuarioId: string;
  sitioId?: string | null;
  hotelId?: string | null;
  parentComentarioId?: string | null;
}

export interface Valoracion {
  id: string;
  puntuacion: number;
  fecha: string;
  usuarioId: string;
  sitioId?: string | null;
  hotelId?: string | null;
}

export interface ValoracionStats {
  total: number;
  promedio: number;
}

export interface Reaccion {
  id: string;
  meGusta: boolean;
  fecha: string;
  usuarioId: string;
  sitioId?: string | null;
  hotelId?: string | null;
}

export interface ReaccionStats {
  total: number;
  likes: number;
  dislikes: number;
  promedioMeGusta: number;
}

export interface Reservacion {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  total: number;
  usuarioId: string;
  hotelId: string;
}

export interface Pago {
  id: string;
  metodoPago: string;
  monto: number;
  fechaPago: string;
  estado: string;
  reservacionId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  accedido: boolean;
  userId: string;
  name: string;
  email: string;
  roleId: string;
  createdAt: string;
  imagenes: Imagen[];
}
