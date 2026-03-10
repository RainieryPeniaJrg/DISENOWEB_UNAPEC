import {
  ApiAuthResponse,
  ApiComentario,
  ApiHotel,
  ApiHotelConImagenes,
  ApiImagen,
  ApiPago,
  ApiReaccion,
  ApiReaccionStats,
  ApiReservacion,
  ApiSitioConImagenes,
  ApiSitioTuristico,
  ApiUser,
  ApiUsuarioConImagenes,
  ApiValoracion,
  ApiValoracionStats,
} from "../models/api.models";
import {
  Comentario,
  Hotel,
  HotelConImagenes,
  Imagen,
  Pago,
  Reaccion,
  ReaccionStats,
  Reservacion,
  SitioConImagenes,
  SitioTuristico,
  User,
  UsuarioConImagenes,
  Valoracion,
  ValoracionStats,
} from "../models/domain.models";
import { AuthResponse } from "../models/auth.models";

function read<T>(source: Record<string, unknown> | null | undefined, ...keys: string[]): T | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined) {
      return value as T;
    }
  }
  return undefined;
}

function readString(source: Record<string, unknown> | null | undefined, ...keys: string[]): string {
  return String(read<unknown>(source, ...keys) ?? "");
}

function readNumber(source: Record<string, unknown> | null | undefined, ...keys: string[]): number {
  const value = read<unknown>(source, ...keys);
  return typeof value === "number" ? value : Number(value ?? 0);
}

function readBoolean(source: Record<string, unknown> | null | undefined, ...keys: string[]): boolean {
  const value = read<unknown>(source, ...keys);
  return typeof value === "boolean" ? value : Boolean(value);
}

function readNullableString(source: Record<string, unknown> | null | undefined, ...keys: string[]): string | null {
  const value = read<unknown>(source, ...keys);
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function normalizeImagen(raw: ApiImagen | null | undefined): Imagen {
  return {
    id: readString(raw, "id", "Id"),
    url: readString(raw, "url", "Url"),
    fileName: readString(raw, "fileName", "FileName") || undefined,
    descripcion: readString(raw, "descripcion", "Descripcion") || undefined,
    esPrincipal: readBoolean(raw, "esPrincipal", "EsPrincipal"),
    sitioId: readNullableString(raw, "sitioId", "SitioId"),
    hotelId: readNullableString(raw, "hotelId", "HotelId"),
    usuarioId: readNullableString(raw, "usuarioId", "UsuarioId"),
  };
}

export function normalizeUser(raw: ApiUser | null | undefined): User {
  return {
    id: readString(raw, "id", "Id"),
    name: readString(raw, "name", "Name"),
    email: readString(raw, "email", "Email"),
    passwordHash: readString(raw, "passwordHash", "PasswordHash") || undefined,
    roleId: readString(raw, "roleId", "RoleId"),
    createdAt: readString(raw, "createdAt", "CreatedAt"),
  };
}

export function normalizeAuthResponse(raw: ApiAuthResponse | null | undefined): AuthResponse {
  return {
    message: readString(raw, "message", "Message"),
    accedido: readBoolean(raw, "accedido", "Accedido"),
    userId: readString(raw, "userId", "UserId"),
    name: readString(raw, "name", "Name"),
    email: readString(raw, "email", "Email"),
    roleId: readString(raw, "roleId", "RoleId"),
    createdAt: readString(raw, "createdAt", "CreatedAt"),
    imagenes: readArray<ApiImagen>(read(raw, "imagenes", "Imagenes")).map(normalizeImagen),
  };
}

export function normalizeSitio(raw: ApiSitioTuristico | null | undefined): SitioTuristico {
  return {
    id: readString(raw, "id", "Id"),
    nombre: readString(raw, "nombre", "Nombre"),
    descripcion: readString(raw, "descripcion", "Descripcion"),
    ubicacion: readString(raw, "ubicacion", "Ubicacion"),
    activo: readBoolean(raw, "activo", "Activo"),
  };
}

export function normalizeHotel(raw: ApiHotel | null | undefined): Hotel {
  return {
    id: readString(raw, "id", "Id"),
    nombre: readString(raw, "nombre", "Nombre"),
    direccion: readString(raw, "direccion", "Direccion"),
    precioNoche: readNumber(raw, "precioNoche", "PrecioNoche"),
    sitioId: readString(raw, "sitioId", "SitioId"),
    activo: readBoolean(raw, "activo", "Activo"),
  };
}

export function normalizeSitioConImagenes(raw: ApiSitioConImagenes | null | undefined): SitioConImagenes {
  return {
    sitio: normalizeSitio((read(raw, "sitio", "Sitio") as ApiSitioTuristico | undefined) ?? undefined),
    imagenes: readArray<ApiImagen>(read(raw, "imagenes", "Imagenes")).map(normalizeImagen),
  };
}

export function normalizeHotelConImagenes(raw: ApiHotelConImagenes | null | undefined): HotelConImagenes {
  return {
    hotel: normalizeHotel((read(raw, "hotel", "Hotel") as ApiHotel | undefined) ?? undefined),
    imagenes: readArray<ApiImagen>(read(raw, "imagenes", "Imagenes")).map(normalizeImagen),
  };
}

export function normalizeUsuarioConImagenes(raw: ApiUsuarioConImagenes | null | undefined): UsuarioConImagenes {
  return {
    usuario: normalizeUser((read(raw, "usuario", "Usuario") as ApiUser | undefined) ?? undefined),
    imagenes: readArray<ApiImagen>(read(raw, "imagenes", "Imagenes")).map(normalizeImagen),
  };
}

export function normalizeComentario(raw: ApiComentario | null | undefined): Comentario {
  return {
    id: readString(raw, "id", "Id"),
    texto: readString(raw, "texto", "Texto"),
    fecha: readString(raw, "fecha", "Fecha"),
    usuarioId: readString(raw, "usuarioId", "UsuarioId"),
    sitioId: readNullableString(raw, "sitioId", "SitioId"),
    hotelId: readNullableString(raw, "hotelId", "HotelId"),
    parentComentarioId: readNullableString(raw, "parentComentarioId", "ParentComentarioId"),
  };
}

export function normalizeValoracion(raw: ApiValoracion | null | undefined): Valoracion {
  return {
    id: readString(raw, "id", "Id"),
    puntuacion: readNumber(raw, "puntuacion", "Puntuacion"),
    fecha: readString(raw, "fecha", "Fecha"),
    usuarioId: readString(raw, "usuarioId", "UsuarioId"),
    sitioId: readNullableString(raw, "sitioId", "SitioId"),
    hotelId: readNullableString(raw, "hotelId", "HotelId"),
  };
}

export function normalizeValoracionStats(raw: ApiValoracionStats | null | undefined): ValoracionStats {
  return {
    total: readNumber(raw, "total", "Total"),
    promedio: readNumber(raw, "promedio", "Promedio"),
  };
}

export function normalizeReaccion(raw: ApiReaccion | null | undefined): Reaccion {
  return {
    id: readString(raw, "id", "Id"),
    meGusta: readBoolean(raw, "meGusta", "MeGusta"),
    fecha: readString(raw, "fecha", "Fecha"),
    usuarioId: readString(raw, "usuarioId", "UsuarioId"),
    sitioId: readNullableString(raw, "sitioId", "SitioId"),
    hotelId: readNullableString(raw, "hotelId", "HotelId"),
  };
}

export function normalizeReaccionStats(raw: ApiReaccionStats | null | undefined): ReaccionStats {
  return {
    total: readNumber(raw, "total", "Total"),
    likes: readNumber(raw, "likes", "Likes"),
    dislikes: readNumber(raw, "dislikes", "Dislikes"),
    promedioMeGusta: readNumber(raw, "promedioMeGusta", "PromedioMeGusta"),
  };
}

export function normalizeReservacion(raw: ApiReservacion | null | undefined): Reservacion {
  return {
    id: readString(raw, "id", "Id"),
    fechaInicio: readString(raw, "fechaInicio", "FechaInicio"),
    fechaFin: readString(raw, "fechaFin", "FechaFin"),
    estado: readString(raw, "estado", "Estado"),
    total: readNumber(raw, "total", "Total"),
    usuarioId: readString(raw, "usuarioId", "UsuarioId"),
    hotelId: readString(raw, "hotelId", "HotelId"),
  };
}

export function normalizePago(raw: ApiPago | null | undefined): Pago {
  return {
    id: readString(raw, "id", "Id"),
    metodoPago: readString(raw, "metodoPago", "MetodoPago"),
    monto: readNumber(raw, "monto", "Monto"),
    fechaPago: readString(raw, "fechaPago", "FechaPago"),
    estado: readString(raw, "estado", "Estado"),
    reservacionId: readString(raw, "reservacionId", "ReservacionId"),
  };
}
