import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { Valoracion, ValoracionStats } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ValoracionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listBySitio(sitioId: string): Promise<Valoracion[]> {
    return firstValueFrom(this.http.get<Valoracion[]>(this.apiBase.api(`valoraciones/sitio/${sitioId}`)));
  }

  listByHotel(hotelId: string): Promise<Valoracion[]> {
    return firstValueFrom(this.http.get<Valoracion[]>(this.apiBase.api(`valoraciones/hotel/${hotelId}`)));
  }

  statsSitio(sitioId: string): Promise<ValoracionStats> {
    return firstValueFrom(this.http.get<ValoracionStats>(this.apiBase.api(`valoraciones/sitio/${sitioId}/estadisticas`)));
  }

  statsHotel(hotelId: string): Promise<ValoracionStats> {
    return firstValueFrom(this.http.get<ValoracionStats>(this.apiBase.api(`valoraciones/hotel/${hotelId}/estadisticas`)));
  }
}
