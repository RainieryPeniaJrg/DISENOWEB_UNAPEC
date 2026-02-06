import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { Reservacion } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class ReservacionesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Promise<Reservacion[]> {
    return firstValueFrom(this.http.get<Reservacion[]>(this.apiBase.api("reservaciones")));
  }
}
