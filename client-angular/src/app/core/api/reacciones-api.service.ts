import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeReaccion, normalizeReaccionStats } from "./api-normalizers";
import { ApiReaccion, ApiReaccionStats } from "../models/api.models";
import { Reaccion, ReaccionStats } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ReaccionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<Reaccion[]> {
    return this.http.get<ApiReaccion[]>(this.apiBase.api("reacciones")).pipe(map((items) => items.map(normalizeReaccion)));
  }

  get(id: string): Observable<Reaccion> {
    return this.http.get<ApiReaccion>(this.apiBase.api(`reacciones/${id}`)).pipe(map(normalizeReaccion));
  }

  listSitio(sitioId: string): Observable<Reaccion[]> {
    return this.http.get<ApiReaccion[]>(this.apiBase.api(`reacciones/sitio/${sitioId}`)).pipe(map((items) => items.map(normalizeReaccion)));
  }

  listHotel(hotelId: string): Observable<Reaccion[]> {
    return this.http.get<ApiReaccion[]>(this.apiBase.api(`reacciones/hotel/${hotelId}`)).pipe(map((items) => items.map(normalizeReaccion)));
  }

  statsSitio(sitioId: string): Observable<ReaccionStats> {
    return this.http.get<ApiReaccionStats>(this.apiBase.api(`reacciones/sitio/${sitioId}/estadisticas`)).pipe(map(normalizeReaccionStats));
  }

  statsHotel(hotelId: string): Observable<ReaccionStats> {
    return this.http.get<ApiReaccionStats>(this.apiBase.api(`reacciones/hotel/${hotelId}/estadisticas`)).pipe(map(normalizeReaccionStats));
  }

  create(payload: Omit<Reaccion, "id">): Observable<Reaccion> {
    return this.http.post<ApiReaccion>(this.apiBase.api("reacciones"), payload).pipe(map(normalizeReaccion));
  }

  update(payload: Reaccion): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`reacciones/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`reacciones/${id}`));
  }
}
