import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeHotelConImagenes } from "./api-normalizers";
import { ApiHotelConImagenes } from "../models/api.models";
import { Hotel, HotelConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class HotelesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<HotelConImagenes[]> {
    return this.http.get<ApiHotelConImagenes[]>(this.apiBase.api("hoteles")).pipe(map((items) => items.map(normalizeHotelConImagenes)));
  }

  get(id: string): Observable<HotelConImagenes> {
    return this.http.get<ApiHotelConImagenes>(this.apiBase.api(`hoteles/${id}`)).pipe(map(normalizeHotelConImagenes));
  }

  create(payload: Omit<Hotel, "id">): Observable<HotelConImagenes> {
    return this.http.post<ApiHotelConImagenes>(this.apiBase.api("hoteles"), payload).pipe(map(normalizeHotelConImagenes));
  }

  update(payload: Hotel): Observable<void> {
    return this.http.put<void>(this.apiBase.api(`hoteles/${payload.id}`), payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiBase.api(`hoteles/${id}`));
  }
}
