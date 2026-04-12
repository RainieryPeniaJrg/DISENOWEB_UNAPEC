import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeValoracion, normalizeValoracionStats } from "./api-normalizers";
import { ApiValoracion, ApiValoracionStats } from "../models/api.models";
import { Valoracion, ValoracionStats } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ValoracionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<Valoracion[]> {
    return this.http.get<ApiValoracion[]>(this.apiBase.api("valoraciones")).pipe(map((items) => items.map(normalizeValoracion)));
  }

  get(id: string): Observable<Valoracion> {
    return this.http.get<ApiValoracion>(this.apiBase.api(`valoraciones/${id}`)).pipe(map(normalizeValoracion));
  }

  listBySitio(sitioId: string): Observable<Valoracion[]> {
    return this.http.get<ApiValoracion[]>(this.apiBase.api(`valoraciones/sitio/${sitioId}`)).pipe(map((items) => items.map(normalizeValoracion)));
  }

  listByHotel(hotelId: string): Observable<Valoracion[]> {
    return this.http.get<ApiValoracion[]>(this.apiBase.api(`valoraciones/hotel/${hotelId}`)).pipe(map((items) => items.map(normalizeValoracion)));
  }

  statsSitio(sitioId: string): Observable<ValoracionStats> {
    return this.http.get<ApiValoracionStats>(this.apiBase.api(`valoraciones/sitio/${sitioId}/estadisticas`)).pipe(map(normalizeValoracionStats));
  }

  statsHotel(hotelId: string): Observable<ValoracionStats> {
    return this.http.get<ApiValoracionStats>(this.apiBase.api(`valoraciones/hotel/${hotelId}/estadisticas`)).pipe(map(normalizeValoracionStats));
  }

  create(payload: Omit<Valoracion, "id">): Observable<Valoracion> {
    return this.http.post<ApiValoracion>(this.apiBase.api("valoraciones"), payload).pipe(map(normalizeValoracion));
  }

  update(payload: Valoracion): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`valoraciones/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`valoraciones/${id}`));
  }
}
