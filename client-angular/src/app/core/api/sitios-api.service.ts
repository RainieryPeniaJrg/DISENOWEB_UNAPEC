import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeSitioConImagenes } from "./api-normalizers";
import { ApiSitioConImagenes } from "../models/api.models";
import { SitioConImagenes, SitioTuristico } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class SitiosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<SitioConImagenes[]> {
    return this.http.get<ApiSitioConImagenes[]>(this.apiBase.api("sitiosturisticos")).pipe(map((items) => items.map(normalizeSitioConImagenes)));
  }

  get(id: string): Observable<SitioConImagenes> {
    return this.http.get<ApiSitioConImagenes>(this.apiBase.api(`sitiosturisticos/${id}`)).pipe(map(normalizeSitioConImagenes));
  }

  create(payload: Omit<SitioTuristico, "id">): Observable<SitioConImagenes> {
    return this.http.post<ApiSitioConImagenes>(this.apiBase.api("sitiosturisticos"), payload).pipe(map(normalizeSitioConImagenes));
  }

  update(payload: SitioTuristico): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`sitiosturisticos/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`sitiosturisticos/${id}`));
  }
}
