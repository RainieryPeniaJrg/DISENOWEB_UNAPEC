import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
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

  listBySitio(sitioId: string): Promise<Valoracion[]> {
    return firstValueFrom(this.http.get<ApiValoracion[]>(this.apiBase.api(`valoraciones/sitio/${sitioId}`))).then((items) =>
      items.map(normalizeValoracion),
    );
  }

  listByHotel(hotelId: string): Promise<Valoracion[]> {
    return firstValueFrom(this.http.get<ApiValoracion[]>(this.apiBase.api(`valoraciones/hotel/${hotelId}`))).then((items) =>
      items.map(normalizeValoracion),
    );
  }

  statsSitio(sitioId: string): Promise<ValoracionStats> {
    return firstValueFrom(
      this.http.get<ApiValoracionStats>(this.apiBase.api(`valoraciones/sitio/${sitioId}/estadisticas`)),
    ).then(normalizeValoracionStats);
  }

  statsHotel(hotelId: string): Promise<ValoracionStats> {
    return firstValueFrom(
      this.http.get<ApiValoracionStats>(this.apiBase.api(`valoraciones/hotel/${hotelId}/estadisticas`)),
    ).then(normalizeValoracionStats);
  }
}
