import { Component } from "@angular/core";
import { LayoutShellComponent } from "./layout/layout-shell/layout-shell.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [LayoutShellComponent],
  template: `<app-layout-shell></app-layout-shell>`,
})
export class AppComponent {}
