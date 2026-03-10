import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeHotelConImagenes } from "./api-normalizers";
import { ApiHotelConImagenes } from "../models/api.models";
import { HotelConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class HotelesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Promise<HotelConImagenes[]> {
    return firstValueFrom(this.http.get<ApiHotelConImagenes[]>(this.apiBase.api("hoteles"))).then((items) =>
      items.map(normalizeHotelConImagenes),
    );
  }

  get(id: string): Promise<HotelConImagenes> {
    return firstValueFrom(this.http.get<ApiHotelConImagenes>(this.apiBase.api(`hoteles/${id}`))).then(normalizeHotelConImagenes);
  }
}
