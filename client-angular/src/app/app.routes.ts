import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { SitiosComponent } from "./features/sitios/sitios.component";
import { HotelesComponent } from "./features/hoteles/hoteles.component";
import { PerfilComponent } from "./features/perfil/perfil.component";
import { WipComponent } from "./features/wip/wip.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sitios", component: SitiosComponent },
  { path: "hoteles", component: HotelesComponent },
  { path: "reservas", component: WipComponent, data: { title: "Reservas" } },
  { path: "pagos", component: WipComponent, data: { title: "Pagos" } },
  { path: "perfil", component: PerfilComponent },
  { path: "**", redirectTo: "" },
];
