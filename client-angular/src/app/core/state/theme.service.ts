import { Injectable, signal } from "@angular/core";

export type Theme = "light" | "dark";

const STORAGE_KEY = "disenoweb-theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly theme = signal<Theme>("dark");

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    this.theme.set(saved ?? "dark");
    this.applyTheme();
  }

  toggle(): void {
    this.theme.set(this.theme() === "dark" ? "light" : "dark");
    this.applyTheme();
  }

  private applyTheme(): void {
    const current = this.theme();
    document.documentElement.setAttribute("data-theme", current);
    localStorage.setItem(STORAGE_KEY, current);
  }
}
