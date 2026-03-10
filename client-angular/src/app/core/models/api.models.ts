export type ApiMaybe<T> = T | null | undefined;

export interface ApiRole {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
}

export interface ApiUser {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  email?: string;
  Email?: string;
  passwordHash?: string;
  PasswordHash?: string;
  roleId?: string;
  RoleId?: string;
  createdAt?: string;
  CreatedAt?: string;
}

export interface ApiSitioTuristico {
  id?: string;
  Id?: string;
  nombre?: string;
  Nombre?: string;
  descripcion?: string;
  Descripcion?: string;
  ubicacion?: string;
  Ubicacion?: string;
  activo?: boolean;
  Activo?: boolean;
}

export interface ApiHotel {
  id?: string;
  Id?: string;
  nombre?: string;
  Nombre?: string;
  direccion?: string;
  Direccion?: string;
  precioNoche?: number;
  PrecioNoche?: number;
  sitioId?: string;
  SitioId?: string;
  activo?: boolean;
  Activo?: boolean;
}

export interface ApiImagen {
  id?: string;
  Id?: string;
  url?: string;
  Url?: string;
  fileName?: string;
  FileName?: string;
  descripcion?: string;
  Descripcion?: string;
  esPrincipal?: boolean;
  EsPrincipal?: boolean;
  sitioId?: ApiMaybe<string>;
  SitioId?: ApiMaybe<string>;
  hotelId?: ApiMaybe<string>;
  HotelId?: ApiMaybe<string>;
  usuarioId?: ApiMaybe<string>;
  UsuarioId?: ApiMaybe<string>;
}

export interface ApiComentario {
  id?: string;
  Id?: string;
  texto?: string;
  Texto?: string;
  fecha?: string;
  Fecha?: string;
  usuarioId?: string;
  UsuarioId?: string;
  sitioId?: ApiMaybe<string>;
  SitioId?: ApiMaybe<string>;
  hotelId?: ApiMaybe<string>;
  HotelId?: ApiMaybe<string>;
  parentComentarioId?: ApiMaybe<string>;
  ParentComentarioId?: ApiMaybe<string>;
}

export interface ApiValoracion {
  id?: string;
  Id?: string;
  puntuacion?: number;
  Puntuacion?: number;
  fecha?: string;
  Fecha?: string;
  usuarioId?: string;
  UsuarioId?: string;
  sitioId?: ApiMaybe<string>;
  SitioId?: ApiMaybe<string>;
  hotelId?: ApiMaybe<string>;
  HotelId?: ApiMaybe<string>;
}

export interface ApiValoracionStats {
  total?: number;
  Total?: number;
  promedio?: number;
  Promedio?: number;
}

export interface ApiReaccion {
  id?: string;
  Id?: string;
  meGusta?: boolean;
  MeGusta?: boolean;
  fecha?: string;
  Fecha?: string;
  usuarioId?: string;
  UsuarioId?: string;
  sitioId?: ApiMaybe<string>;
  SitioId?: ApiMaybe<string>;
  hotelId?: ApiMaybe<string>;
  HotelId?: ApiMaybe<string>;
}

export interface ApiReaccionStats {
  total?: number;
  Total?: number;
  likes?: number;
  Likes?: number;
  dislikes?: number;
  Dislikes?: number;
  promedioMeGusta?: number;
  PromedioMeGusta?: number;
}

export interface ApiReservacion {
  id?: string;
  Id?: string;
  fechaInicio?: string;
  FechaInicio?: string;
  fechaFin?: string;
  FechaFin?: string;
  estado?: string;
  Estado?: string;
  total?: number;
  Total?: number;
  usuarioId?: string;
  UsuarioId?: string;
  hotelId?: string;
  HotelId?: string;
}

export interface ApiPago {
  id?: string;
  Id?: string;
  metodoPago?: string;
  MetodoPago?: string;
  monto?: number;
  Monto?: number;
  fechaPago?: string;
  FechaPago?: string;
  estado?: string;
  Estado?: string;
  reservacionId?: string;
  ReservacionId?: string;
}

export interface ApiProduct {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  price?: number;
  Price?: number;
  createdAt?: string;
  CreatedAt?: string;
}

export interface ApiAuthResponse {
  message?: string;
  Message?: string;
  accedido?: boolean;
  Accedido?: boolean;
  userId?: string;
  UserId?: string;
  name?: string;
  Name?: string;
  email?: string;
  Email?: string;
  roleId?: string;
  RoleId?: string;
  createdAt?: string;
  CreatedAt?: string;
  imagenes?: ApiImagen[];
  Imagenes?: ApiImagen[];
}

export interface ApiSitioConImagenes {
  sitio?: ApiSitioTuristico;
  Sitio?: ApiSitioTuristico;
  imagenes?: ApiImagen[];
  Imagenes?: ApiImagen[];
}

export interface ApiHotelConImagenes {
  hotel?: ApiHotel;
  Hotel?: ApiHotel;
  imagenes?: ApiImagen[];
  Imagenes?: ApiImagen[];
}

export interface ApiUsuarioConImagenes {
  usuario?: ApiUser;
  Usuario?: ApiUser;
  imagenes?: ApiImagen[];
  Imagenes?: ApiImagen[];
}
