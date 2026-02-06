import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { HotelConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class HotelesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Promise<HotelConImagenes[]> {
    return firstValueFrom(this.http.get<HotelConImagenes[]>(this.apiBase.api("hoteles")));
  }

  get(id: string): Promise<HotelConImagenes> {
    return firstValueFrom(this.http.get<HotelConImagenes>(this.apiBase.api(`hoteles/${id}`)));
  }
}
