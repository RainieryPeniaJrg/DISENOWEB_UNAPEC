import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";

export type ApiHealthStatus = "checking" | "online" | "offline";

@Injectable({ providedIn: "root" })
export class ApiHealthService {
  readonly status = signal<ApiHealthStatus>("checking");
  readonly lastCheckedAt = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.status.set("checking");
    try {
      await firstValueFrom(this.http.get(environment.apiBaseUrl, { responseType: "json" }));
      this.status.set("online");
    } catch {
      this.status.set("offline");
    } finally {
      this.lastCheckedAt.set(new Date().toISOString());
    }
  }
}
