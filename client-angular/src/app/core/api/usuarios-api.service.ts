import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { User } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class UsuariosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  async get(id: string): Promise<User> {
    const data = await firstValueFrom(this.http.get<{ usuario?: User } | User>(this.apiBase.api(`usuarios/${id}`)));
    if ('usuario' in data && data.usuario) {
        return data.usuario;
      }
      return data as User;
    }
}
