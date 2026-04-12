import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
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

  list(): Observable<Comentario[]> {
    return this.http.get<ApiComentario[]>(this.apiBase.api("comentarios")).pipe(map((items) => items.map(normalizeComentario)));
  }

  get(id: string): Observable<Comentario> {
    return this.http.get<ApiComentario>(this.apiBase.api(`comentarios/${id}`)).pipe(map(normalizeComentario));
  }

  listBySitio(sitioId: string): Observable<Comentario[]> {
    return this.http.get<ApiComentario[]>(this.apiBase.api(`comentarios/sitio/${sitioId}`)).pipe(map((items) => items.map(normalizeComentario)));
  }

  listByHotel(hotelId: string): Observable<Comentario[]> {
    return this.http.get<ApiComentario[]>(this.apiBase.api(`comentarios/hotel/${hotelId}`)).pipe(map((items) => items.map(normalizeComentario)));
  }

  create(payload: Omit<Comentario, "id" | "fecha">): Observable<Comentario> {
    return this.http.post<ApiComentario>(this.apiBase.api("comentarios"), payload).pipe(map(normalizeComentario));
  }

  reply(comentarioId: string, payload: { usuarioId: string; texto: string }): Observable<Comentario> {
    return this.http.post<ApiComentario>(this.apiBase.api(`comentarios/${comentarioId}/responder`), payload).pipe(map(normalizeComentario));
  }

  update(payload: Comentario): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`comentarios/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`comentarios/${id}`));
  }
}
