import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
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

  list(): Promise<Pago[]> {
    return firstValueFrom(this.http.get<ApiPago[]>(this.apiBase.api("pagos"))).then((items) => items.map(normalizePago));
  }
}
