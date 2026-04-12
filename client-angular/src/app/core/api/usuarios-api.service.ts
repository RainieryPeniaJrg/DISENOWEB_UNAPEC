import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { normalizeUsuarioConImagenes } from "./api-normalizers";
import { ApiUser, ApiUsuarioConImagenes } from "../models/api.models";
import { User, UsuarioConImagenes } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class UsuariosApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  list(): Observable<UsuarioConImagenes[]> {
    return this.http.get<ApiUsuarioConImagenes[]>(this.apiBase.api("usuarios")).pipe(map((items) => items.map(normalizeUsuarioConImagenes)));
  }

  listUsers(): Observable<User[]> {
    return this.list().pipe(map((items) => items.map((item) => item.usuario)));
  }

  get(id: string): Observable<UsuarioConImagenes> {
    return this.http.get<ApiUsuarioConImagenes | { usuario?: ApiUser } | ApiUser>(this.apiBase.api(`usuarios/${id}`)).pipe(
      map((data) => {
        if ("usuario" in data || "Usuario" in data || "imagenes" in data || "Imagenes" in data) {
          return normalizeUsuarioConImagenes(data as ApiUsuarioConImagenes);
        }
        return normalizeUsuarioConImagenes({ usuario: data as ApiUser, imagenes: [] });
      }),
    );
  }
}
