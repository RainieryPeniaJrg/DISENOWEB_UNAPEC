import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { Imagen } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ImagenesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listSitio(sitioId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<Imagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`)));
  }

  listHotel(hotelId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<Imagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`)));
  }

  listUsuario(usuarioId: string): Promise<Imagen[]> {
    return firstValueFrom(this.http.get<Imagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`)));
  }

  uploadSitio(sitioId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<Imagen[]>(this.apiBase.api(`imagenes/sitio/${sitioId}`), form));
  }

  uploadHotel(hotelId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<Imagen[]>(this.apiBase.api(`imagenes/hotel/${hotelId}`), form));
  }

  uploadUsuario(usuarioId: string, files: File[]): Promise<Imagen[]> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return firstValueFrom(this.http.post<Imagen[]>(this.apiBase.api(`imagenes/usuario/${usuarioId}`), form));
  }
}
