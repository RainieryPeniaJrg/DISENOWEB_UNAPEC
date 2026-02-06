import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { Reaccion, ReaccionStats } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ReaccionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  listSitio(sitioId: string): Promise<Reaccion[]> {
    return firstValueFrom(this.http.get<Reaccion[]>(this.apiBase.api(`reacciones/sitio/${sitioId}`)));
  }

  listHotel(hotelId: string): Promise<Reaccion[]> {
    return firstValueFrom(this.http.get<Reaccion[]>(this.apiBase.api(`reacciones/hotel/${hotelId}`)));
  }

  statsSitio(sitioId: string): Promise<ReaccionStats> {
    return firstValueFrom(this.http.get<ReaccionStats>(this.apiBase.api(`reacciones/sitio/${sitioId}/estadisticas`)));
  }

  statsHotel(hotelId: string): Promise<ReaccionStats> {
    return firstValueFrom(this.http.get<ReaccionStats>(this.apiBase.api(`reacciones/hotel/${hotelId}/estadisticas`)));
  }
}
