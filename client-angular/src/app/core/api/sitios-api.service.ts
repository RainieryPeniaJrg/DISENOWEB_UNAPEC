import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { SitioConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class SitiosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Promise<SitioConImagenes[]> {
    return firstValueFrom(this.http.get<SitioConImagenes[]>(this.apiBase.api("sitiosturisticos")));
  }

  get(id: string): Promise<SitioConImagenes> {
    return firstValueFrom(this.http.get<SitioConImagenes>(this.apiBase.api(`sitiosturisticos/${id}`)));
  }
}
