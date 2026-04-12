import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizePago } from "./api-normalizers";
import { ApiPago } from "../models/api.models";
import { Pago } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class PagosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<Pago[]> {
    return this.http.get<ApiPago[]>(this.apiBase.api("pagos")).pipe(map((items) => items.map(normalizePago)));
  }

  get(id: string): Observable<Pago> {
    return this.http.get<ApiPago>(this.apiBase.api(`pagos/${id}`)).pipe(map(normalizePago));
  }

  create(payload: Omit<Pago, "id">): Observable<Pago> {
    return this.http.post<ApiPago>(this.apiBase.api("pagos"), payload).pipe(map(normalizePago));
  }

  update(payload: Pago): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`pagos/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`pagos/${id}`));
  }
}
