import { Injectable, signal } from "@angular/core";
import { AuthResponse } from "../models/auth.models";
import { AuthApiService } from "../api/auth-api.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly user = signal<AuthResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly authApi: AuthApiService) {}

  async login(email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await this.authApi.login(email, password);
      if (!res.accedido) {
        throw new Error(res.message);
      }
      this.user.set(res);
    } catch (err: unknown) {
      this.user.set(null);
      this.error.set(this.extractError(err, "No pudimos iniciar sesión"));
    } finally {
      this.loading.set(false);
    }
  }

  async register(name: string, email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await this.authApi.register(name, email, password);
      this.user.set(res);
    } catch (err: unknown) {
      this.user.set(null);
      this.error.set(this.extractError(err, "No pudimos registrar"));
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.user.set(null);
  }

  async updateProfile(updates: { name?: string; email?: string; passwordHash?: string }): Promise<void> {
    const current = this.user();
    if (!current) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const payload = {
        id: current.userId,
        name: updates.name ?? current.name,
        email: updates.email ?? current.email,
        passwordHash: updates.passwordHash ?? current.passwordHash ?? "",
        roleId: current.roleId,
        createdAt: current.createdAt,
      };
      await this.authApi.updateProfile(payload);
      this.user.set({ ...current, name: payload.name, email: payload.email, passwordHash: payload.passwordHash });
    } catch (err: unknown) {
      this.error.set(this.extractError(err, "No pudimos actualizar el perfil"));
    } finally {
      this.loading.set(false);
    }
  }

  private extractError(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;
    return fallback;
  }
}
