import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { Comentario } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ComentariosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listBySitio(sitioId: string): Promise<Comentario[]> {
    return firstValueFrom(this.http.get<Comentario[]>(this.apiBase.api(`comentarios/sitio/${sitioId}`)));
  }

  listByHotel(hotelId: string): Promise<Comentario[]> {
    return firstValueFrom(this.http.get<Comentario[]>(this.apiBase.api(`comentarios/hotel/${hotelId}`)));
  }

  create(payload: Omit<Comentario, "id" | "fecha">): Promise<Comentario> {
    return firstValueFrom(this.http.post<Comentario>(this.apiBase.api("comentarios"), payload));
  }

  reply(comentarioId: string, payload: { usuarioId: string; texto: string }): Promise<Comentario> {
    return firstValueFrom(
      this.http.post<Comentario>(this.apiBase.api(`comentarios/${comentarioId}/responder`), payload),
    );
  }
}
