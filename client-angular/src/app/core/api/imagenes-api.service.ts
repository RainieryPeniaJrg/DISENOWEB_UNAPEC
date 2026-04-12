import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeImagen } from "./api-normalizers";
import { ApiImagen } from "../models/api.models";
import { Imagen } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ImagenesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listSitio(sitioId: string): Observable<Imagen[]> {
    return this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`)).pipe(map((items) => items.map(normalizeImagen)));
  }

  listHotel(hotelId: string): Observable<Imagen[]> {
    return this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`)).pipe(map((items) => items.map(normalizeImagen)));
  }

  listUsuario(usuarioId: string): Observable<Imagen[]> {
    return this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`)).pipe(map((items) => items.map(normalizeImagen)));
  }

  uploadSitio(sitioId: string, files: File[]): Observable<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`), form).pipe(map((items) => items.map(normalizeImagen)));
  }

  uploadHotel(hotelId: string, files: File[]): Observable<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`), form).pipe(map((items) => items.map(normalizeImagen)));
  }

  uploadUsuario(usuarioId: string, files: File[]): Observable<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`), form).pipe(map((items) => items.map(normalizeImagen)));
  }
}
