import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ApiBaseService } from "./api-base.service";
import { AuthResponse } from "../models/auth.models";
import { User } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiBase: ApiBaseService,
  ) {}

  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(this.apiBase.api("usuarios/register"), { name, email, password }),
    );
  }

  login(email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(this.apiBase.api("usuarios/login"), { email, password }),
    );
  }

  updateProfile(user: User): Promise<void> {
    return firstValueFrom(this.http.put<void>(this.apiBase.api(`usuarios/${user.id}`), user));
  }
}
