import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
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

  listSitio(sitioId: string): Promise<Reaccion[]> {
    return firstValueFrom(this.http.get<ApiReaccion[]>(this.apiBase.api(`reacciones/sitio/${sitioId}`))).then((items) =>
      items.map(normalizeReaccion),
    );
  }

  listHotel(hotelId: string): Promise<Reaccion[]> {
    return firstValueFrom(this.http.get<ApiReaccion[]>(this.apiBase.api(`reacciones/hotel/${hotelId}`))).then((items) =>
      items.map(normalizeReaccion),
    );
  }

  statsSitio(sitioId: string): Promise<ReaccionStats> {
    return firstValueFrom(this.http.get<ApiReaccionStats>(this.apiBase.api(`reacciones/sitio/${sitioId}/estadisticas`))).then(
      normalizeReaccionStats,
    );
  }

  statsHotel(hotelId: string): Promise<ReaccionStats> {
    return firstValueFrom(this.http.get<ApiReaccionStats>(this.apiBase.api(`reacciones/hotel/${hotelId}/estadisticas`))).then(
      normalizeReaccionStats,
    );
  }
}
