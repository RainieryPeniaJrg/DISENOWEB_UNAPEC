import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
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

  listSitio(sitioId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`))).then((items) =>
      items.map(normalizeImagen),
    );
  }

  listHotel(hotelId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`))).then((items) =>
      items.map(normalizeImagen),
    );
  }

  listUsuario(usuarioId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<ApiImagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`))).then((items) =>
      items.map(normalizeImagen),
    );
  }

  uploadSitio(sitioId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`), form)).then((items) =>
      items.map(normalizeImagen),
    );
  }

  uploadHotel(hotelId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`), form)).then((items) =>
      items.map(normalizeImagen),
    );
  }

  uploadUsuario(usuarioId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<ApiImagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`), form)).then((items) =>
      items.map(normalizeImagen),
    );
  }
}
