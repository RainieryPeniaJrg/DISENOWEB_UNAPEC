import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EMPTY, finalize, tap, catchError } from "rxjs";
import { environment } from "../../../environments/environment";

export type ApiHealthStatus = "checking" | "online" | "offline";

@Injectable({ providedIn: "root" })
export class ApiHealthService {
  readonly status = signal<ApiHealthStatus>("checking");
  readonly lastCheckedAt = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.status.set("checking");
    this.http
      .get(environment.apiBaseUrl, { responseType: "json" })
      .pipe(
        tap(() => this.status.set("online")),
        catchError(() => {
          this.status.set("offline");
          return EMPTY;
        }),
        finalize(() => this.lastCheckedAt.set(new Date().toISOString())),
      )
      .subscribe();
  }
}
