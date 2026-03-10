import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeUsuarioConImagenes } from "./api-normalizers";
import { ApiUser, ApiUsuarioConImagenes } from "../models/api.models";
import { UsuarioConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class UsuariosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  async get(id: string): Promise<UsuarioConImagenes> {
    const data = await firstValueFrom(
      this.http.get<ApiUsuarioConImagenes | { usuario?: ApiUser } | ApiUser>(this.apiBase.api(`usuarios/${id}`)),
    );
    if ("usuario" in data || "Usuario" in data || "imagenes" in data || "Imagenes" in data) {
      return normalizeUsuarioConImagenes(data as ApiUsuarioConImagenes);
    }
    return normalizeUsuarioConImagenes({ usuario: data as ApiUser, imagenes: [] });
  }
}
