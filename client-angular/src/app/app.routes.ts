import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { SitiosComponent } from "./features/sitios/sitios.component";
import { HotelesComponent } from "./features/hoteles/hoteles.component";
import { PerfilComponent } from "./features/perfil/perfil.component";
import { ReservasComponent } from "./features/reservas/reservas.component";
import { PagosComponent } from "./features/pagos/pagos.component";
import { AdminPanelComponent } from "./features/admin/admin-panel.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sitios", component: SitiosComponent },
  { path: "hoteles", component: HotelesComponent },
  { path: "reservas", component: ReservasComponent },
  { path: "pagos", component: PagosComponent },
  { path: "perfil", component: PerfilComponent },
  { path: "admin", component: AdminPanelComponent },
  { path: "admin/:section", component: AdminPanelComponent },
  { path: "**", redirectTo: "" },
];
