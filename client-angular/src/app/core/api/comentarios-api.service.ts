import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeComentario } from "./api-normalizers";
import { ApiComentario } from "../models/api.models";
import { Comentario } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ComentariosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listBySitio(sitioId: string): Promise<Comentario[]> {
    return firstValueFrom(this.http.get<ApiComentario[]>(this.apiBase.api(`comentarios/sitio/${sitioId}`))).then((items) =>
      items.map(normalizeComentario),
    );
  }

  listByHotel(hotelId: string): Promise<Comentario[]> {
    return firstValueFrom(this.http.get<ApiComentario[]>(this.apiBase.api(`comentarios/hotel/${hotelId}`))).then((items) =>
      items.map(normalizeComentario),
    );
  }

  create(payload: Omit<Comentario, "id" | "fecha">): Promise<Comentario> {
    return firstValueFrom(this.http.post<ApiComentario>(this.apiBase.api("comentarios"), payload)).then(normalizeComentario);
  }

  reply(comentarioId: string, payload: { usuarioId: string; texto: string }): Promise<Comentario> {
    return firstValueFrom(
      this.http.post<ApiComentario>(this.apiBase.api(`comentarios/${comentarioId}/responder`), payload),
    ).then(normalizeComentario);
  }
}
