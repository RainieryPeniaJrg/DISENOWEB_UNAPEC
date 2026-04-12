import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeReservacion } from "./api-normalizers";
import { ApiReservacion } from "../models/api.models";
import { Reservacion } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ReservacionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<Reservacion[]> {
    return this.http.get<ApiReservacion[]>(this.apiBase.api("reservaciones")).pipe(map((items) => items.map(normalizeReservacion)));
  }

  get(id: string): Observable<Reservacion> {
    return this.http.get<ApiReservacion>(this.apiBase.api(`reservaciones/${id}`)).pipe(map(normalizeReservacion));
  }

  create(payload: Omit<Reservacion, "id">): Observable<Reservacion> {
    return this.http.post<ApiReservacion>(this.apiBase.api("reservaciones"), payload).pipe(map(normalizeReservacion));
  }

  update(payload: Reservacion): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`reservaciones/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`reservaciones/${id}`));
  }
}
