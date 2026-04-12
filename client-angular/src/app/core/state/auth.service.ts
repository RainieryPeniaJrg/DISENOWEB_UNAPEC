import { Injectable, signal } from "@angular/core";
import { AuthResponse } from "../models/auth.models";
import { AuthApiService } from "../api/auth-api.service";
import { EMPTY, Observable, finalize, tap, catchError } from "rxjs";

const STORAGE_KEY = "disenoweb-session";
const ADMIN_ROLE_ID = "11111111-1111-1111-1111-111111111111";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly user = signal<AuthResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly authApi: AuthApiService) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.user.set(JSON.parse(saved) as AuthResponse);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    this.loading.set(true);
    this.error.set(null);
    return this.authApi.login(email, password).pipe(
      tap((res) => {
        if (!res.accedido) {
          throw new Error(res.message);
        }
        this.user.set(res);
        this.persistSession();
      }),
      catchError((err: unknown) => {
        this.user.set(null);
        localStorage.removeItem(STORAGE_KEY);
        this.error.set(this.extractError(err, "No pudimos iniciar sesión"));
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    this.loading.set(true);
    this.error.set(null);
    return this.authApi.register(name, email, password).pipe(
      tap((res) => {
        this.user.set(res);
        this.persistSession();
      }),
      catchError((err: unknown) => {
        this.user.set(null);
        localStorage.removeItem(STORAGE_KEY);
        this.error.set(this.extractError(err, "No pudimos registrar"));
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  isAdmin(): boolean {
    return this.user()?.roleId === ADMIN_ROLE_ID;
  }

  updateProfile(updates: { name?: string; email?: string; passwordHash?: string }): Observable<void> {
    const current = this.user();
    if (!current) return EMPTY;

    this.loading.set(true);
    this.error.set(null);

    const payload = {
      id: current.userId,
      name: updates.name ?? current.name,
      email: updates.email ?? current.email,
      passwordHash: updates.passwordHash ?? current.passwordHash ?? "",
      roleId: current.roleId,
      createdAt: current.createdAt,
    };

    return this.authApi.updateProfile(payload).pipe(
      tap(() => {
        this.user.set({ ...current, name: payload.name, email: payload.email, passwordHash: payload.passwordHash });
        this.persistSession();
      }),
      catchError((err: unknown) => {
        this.error.set(this.extractError(err, "No pudimos actualizar el perfil"));
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  private extractError(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;
    return fallback;
  }

  private persistSession(): void {
    const current = this.user();
    if (!current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}
