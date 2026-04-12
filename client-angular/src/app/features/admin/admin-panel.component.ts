import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { Observable, finalize, forkJoin } from "rxjs";
import { ComentariosApiService } from "../../core/api/comentarios-api.service";
import { HotelesApiService } from "../../core/api/hoteles-api.service";
import { PagosApiService } from "../../core/api/pagos-api.service";
import { ReaccionesApiService } from "../../core/api/reacciones-api.service";
import { ReservacionesApiService } from "../../core/api/reservaciones-api.service";
import { SitiosApiService } from "../../core/api/sitios-api.service";
import { UsuariosApiService } from "../../core/api/usuarios-api.service";
import { ValoracionesApiService } from "../../core/api/valoraciones-api.service";
import { AuthService } from "../../core/state/auth.service";
import { Comentario, Hotel, Pago, Reaccion, Reservacion, SitioTuristico, User, Valoracion } from "../../core/models/domain.models";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";
import { HeroComponent } from "../../shared/components/hero/hero.component";

type AdminSection = "sitios" | "hoteles" | "reservaciones" | "pagos" | "comentarios" | "valoraciones" | "reacciones";
type TargetType = "sitio" | "hotel";
type SimpleOption = { id: string; label: string };

@Component({
  selector: "app-admin-panel",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, HeroComponent, EmptyStateComponent],
  templateUrl: "./admin-panel.component.html",
})
export class AdminPanelComponent implements OnInit {
  readonly sections: AdminSection[] = ["sitios", "hoteles", "reservaciones", "pagos", "comentarios", "valoraciones", "reacciones"];
  readonly sectionLabels: Record<AdminSection, string> = { sitios: "Sitios", hoteles: "Hoteles", reservaciones: "Reservaciones", pagos: "Pagos", comentarios: "Comentarios", valoraciones: "Valoraciones", reacciones: "Reacciones" };

  activeSection: AdminSection = "sitios";
  loading = true;
  error: string | null = null;
  status: string | null = null;

  sitios: SitioTuristico[] = [];
  hoteles: Hotel[] = [];
  reservaciones: Reservacion[] = [];
  pagos: Pago[] = [];
  comentarios: Comentario[] = [];
  valoraciones: Valoracion[] = [];
  reacciones: Reaccion[] = [];
  users: User[] = [];

  sitioForm: SitioTuristico = this.newSitio();
  hotelForm: Hotel = this.newHotel();
  reservacionForm: Reservacion = this.newReservacion();
  pagoForm: Pago = this.newPago();
  comentarioForm = this.newComentarioForm();
  valoracionForm = this.newValoracionForm();
  reaccionForm = this.newReaccionForm();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly comentariosApi: ComentariosApiService,
    private readonly hotelesApi: HotelesApiService,
    private readonly pagosApi: PagosApiService,
    private readonly reaccionesApi: ReaccionesApiService,
    private readonly reservacionesApi: ReservacionesApiService,
    private readonly sitiosApi: SitiosApiService,
    private readonly usuariosApi: UsuariosApiService,
    private readonly valoracionesApi: ValoracionesApiService,
    public readonly auth: AuthService,
  ) {}

  get heroMetrics(): { label: string; value: string | number; hint?: string }[] {
    return [
      { label: "Módulos", value: this.sections.length, hint: "CRUD disponible" },
      { label: "Registros", value: this.currentCount, hint: "Sección activa" },
      { label: "Sesión", value: this.auth.isAdmin() ? "Admin" : "Bloqueada", hint: "Control visual" },
    ];
  }

  get heroNotes(): string[] {
    return [
      "Usa admin@demo.local / admin123 para habilitar la gestión.",
      "Las relaciones se seleccionan desde catálogos del API.",
      "La UI restringe acceso, pero el backend aún no autoriza de forma real.",
    ];
  }

  get currentCount(): number {
    switch (this.activeSection) {
      case "sitios": return this.sitios.length;
      case "hoteles": return this.hoteles.length;
      case "reservaciones": return this.reservaciones.length;
      case "pagos": return this.pagos.length;
      case "comentarios": return this.comentarios.length;
      case "valoraciones": return this.valoraciones.length;
      case "reacciones": return this.reacciones.length;
    }
  }

  get sitioOptions(): SimpleOption[] { return this.sitios.map((item) => ({ id: item.id, label: item.nombre })); }
  get hotelOptions(): SimpleOption[] { return this.hoteles.map((item) => ({ id: item.id, label: item.nombre })); }
  get reservacionOptions(): SimpleOption[] { return this.reservaciones.map((item) => ({ id: item.id, label: `${item.estado} · ${item.id}` })); }
  get userOptions(): SimpleOption[] { return this.users.map((item) => ({ id: item.id, label: item.name })); }
  get comentarioOptions(): SimpleOption[] { return this.comentarios.map((item) => ({ id: item.id, label: item.texto })); }
  get comentarioTitle(): string { return this.comentarioForm.id ? "Editar comentario" : this.comentarioForm.parentComentarioId ? "Responder comentario" : "Crear comentario"; }
  get comentarioActionLabel(): string { return this.comentarioForm.id ? "Actualizar" : this.comentarioForm.parentComentarioId ? "Responder" : "Crear"; }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const section = params["section"] as AdminSection | undefined;
      this.activeSection = this.sections.includes(section ?? "sitios") ? (section as AdminSection) : "sitios";
    });

    if (!this.auth.isAdmin()) {
      this.loading = false;
      return;
    }

    this.reloadAll();
  }

  targetOptions(targetType: TargetType): SimpleOption[] {
    return targetType === "sitio" ? this.sitioOptions : this.hotelOptions;
  }

  reloadAll(message?: string): void {
    this.loading = true;
    this.error = null;
    if (message) this.status = message;

    forkJoin({
      sitiosData: this.sitiosApi.list(),
      hotelesData: this.hotelesApi.list(),
      reservaciones: this.reservacionesApi.list(),
      pagos: this.pagosApi.list(),
      comentarios: this.comentariosApi.list(),
      valoraciones: this.valoracionesApi.list(),
      reacciones: this.reaccionesApi.list(),
      users: this.usuariosApi.listUsers(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ sitiosData, hotelesData, reservaciones, pagos, comentarios, valoraciones, reacciones, users }) => {
          this.sitios = sitiosData.map((item) => item.sitio);
          this.hoteles = hotelesData.map((item) => item.hotel);
          this.reservaciones = reservaciones;
          this.pagos = pagos;
          this.comentarios = comentarios;
          this.valoraciones = valoraciones;
          this.reacciones = reacciones;
          this.users = users;
        },
        error: (err) => {
          this.error = this.extractError(err, "No se pudo sincronizar el panel admin.");
        },
      });
  }

  editSitio(item: SitioTuristico): void { this.sitioForm = { ...item }; this.status = null; }
  resetSitioForm(): void { this.sitioForm = this.newSitio(); }
  saveSitio(): void {
    const request$: Observable<unknown> = this.sitioForm.id
      ? this.sitiosApi.update(this.sitioForm)
      : this.sitiosApi.create({ nombre: this.sitioForm.nombre, descripcion: this.sitioForm.descripcion, ubicacion: this.sitioForm.ubicacion, activo: this.sitioForm.activo });

    request$.subscribe({
      next: () => {
        this.resetSitioForm();
        this.reloadAll("Sitio sincronizado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar el sitio.");
      },
    });
  }
  deleteSitio(id: string): void {
    if (!window.confirm("Eliminar este sitio?")) return;
    this.sitiosApi.delete(id).subscribe({
      next: () => {
        if (this.sitioForm.id === id) this.resetSitioForm();
        this.reloadAll("Sitio eliminado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar el sitio.");
      },
    });
  }

  editHotel(item: Hotel): void { this.hotelForm = { ...item }; this.status = null; }
  resetHotelForm(): void { this.hotelForm = this.newHotel(); }
  saveHotel(): void {
    const payload = { ...this.hotelForm, precioNoche: Number(this.hotelForm.precioNoche) };
    const request$: Observable<unknown> = payload.id
      ? this.hotelesApi.update(payload)
      : this.hotelesApi.create({ nombre: payload.nombre, direccion: payload.direccion, precioNoche: payload.precioNoche, sitioId: payload.sitioId, activo: payload.activo });

    request$.subscribe({
      next: () => {
        this.resetHotelForm();
        this.reloadAll("Hotel sincronizado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar el hotel.");
      },
    });
  }
  deleteHotel(id: string): void {
    if (!window.confirm("Eliminar este hotel?")) return;
    this.hotelesApi.delete(id).subscribe({
      next: () => {
        if (this.hotelForm.id === id) this.resetHotelForm();
        this.reloadAll("Hotel eliminado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar el hotel.");
      },
    });
  }

  editReservacion(item: Reservacion): void { this.reservacionForm = { ...item, fechaInicio: this.toDateInput(item.fechaInicio), fechaFin: this.toDateInput(item.fechaFin) }; this.status = null; }
  resetReservacionForm(): void { this.reservacionForm = this.newReservacion(); }
  saveReservacion(): void {
    const payload = { ...this.reservacionForm, total: Number(this.reservacionForm.total) };
    const request$: Observable<unknown> = payload.id
      ? this.reservacionesApi.update(payload)
      : this.reservacionesApi.create({ fechaInicio: payload.fechaInicio, fechaFin: payload.fechaFin, estado: payload.estado, total: payload.total, usuarioId: payload.usuarioId, hotelId: payload.hotelId });

    request$.subscribe({
      next: () => {
        this.resetReservacionForm();
        this.reloadAll("Reservación sincronizada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar la reservación.");
      },
    });
  }
  deleteReservacion(id: string): void {
    if (!window.confirm("Eliminar esta reservación?")) return;
    this.reservacionesApi.delete(id).subscribe({
      next: () => {
        if (this.reservacionForm.id === id) this.resetReservacionForm();
        this.reloadAll("Reservación eliminada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar la reservación.");
      },
    });
  }

  editPago(item: Pago): void { this.pagoForm = { ...item, fechaPago: this.toDateInput(item.fechaPago) }; this.status = null; }
  resetPagoForm(): void { this.pagoForm = this.newPago(); }
  savePago(): void {
    const payload = { ...this.pagoForm, monto: Number(this.pagoForm.monto) };
    const request$: Observable<unknown> = payload.id
      ? this.pagosApi.update(payload)
      : this.pagosApi.create({ metodoPago: payload.metodoPago, monto: payload.monto, fechaPago: payload.fechaPago, estado: payload.estado, reservacionId: payload.reservacionId });

    request$.subscribe({
      next: () => {
        this.resetPagoForm();
        this.reloadAll("Pago sincronizado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar el pago.");
      },
    });
  }
  deletePago(id: string): void {
    if (!window.confirm("Eliminar este pago?")) return;
    this.pagosApi.delete(id).subscribe({
      next: () => {
        if (this.pagoForm.id === id) this.resetPagoForm();
        this.reloadAll("Pago eliminado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar el pago.");
      },
    });
  }

  editComentario(item: Comentario): void { this.comentarioForm = { id: item.id, texto: item.texto, usuarioId: item.usuarioId, targetType: item.sitioId ? "sitio" : "hotel", targetId: item.sitioId ?? item.hotelId ?? "", parentComentarioId: item.parentComentarioId ?? "", fecha: item.fecha }; this.status = null; }
  prepareReply(item: Comentario): void { this.comentarioForm = { ...this.newComentarioForm(), parentComentarioId: item.id, targetType: item.sitioId ? "sitio" : "hotel", targetId: item.sitioId ?? item.hotelId ?? "" }; this.status = null; }
  resetComentarioForm(): void { this.comentarioForm = this.newComentarioForm(); }
  saveComentario(): void {
    const request$: Observable<unknown> = this.comentarioForm.id
      ? this.comentariosApi.update({ id: this.comentarioForm.id, texto: this.comentarioForm.texto, fecha: this.comentarioForm.fecha || new Date().toISOString(), usuarioId: this.comentarioForm.usuarioId, sitioId: this.comentarioForm.targetType === "sitio" ? this.comentarioForm.targetId : null, hotelId: this.comentarioForm.targetType === "hotel" ? this.comentarioForm.targetId : null, parentComentarioId: this.comentarioForm.parentComentarioId || null })
      : this.comentarioForm.parentComentarioId
        ? this.comentariosApi.reply(this.comentarioForm.parentComentarioId, { usuarioId: this.comentarioForm.usuarioId, texto: this.comentarioForm.texto })
        : this.comentariosApi.create({ texto: this.comentarioForm.texto, usuarioId: this.comentarioForm.usuarioId, sitioId: this.comentarioForm.targetType === "sitio" ? this.comentarioForm.targetId : null, hotelId: this.comentarioForm.targetType === "hotel" ? this.comentarioForm.targetId : null, parentComentarioId: null });

    request$.subscribe({
      next: () => {
        this.resetComentarioForm();
        this.reloadAll("Comentario sincronizado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar el comentario.");
      },
    });
  }
  deleteComentario(id: string): void {
    if (!window.confirm("Eliminar este comentario?")) return;
    this.comentariosApi.delete(id).subscribe({
      next: () => {
        if (this.comentarioForm.id === id) this.resetComentarioForm();
        this.reloadAll("Comentario eliminado correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar el comentario.");
      },
    });
  }

  editValoracion(item: Valoracion): void { this.valoracionForm = { id: item.id, puntuacion: item.puntuacion, usuarioId: item.usuarioId, targetType: item.sitioId ? "sitio" : "hotel", targetId: item.sitioId ?? item.hotelId ?? "", fecha: item.fecha }; this.status = null; }
  resetValoracionForm(): void { this.valoracionForm = this.newValoracionForm(); }
  saveValoracion(): void {
    const payload = { puntuacion: Number(this.valoracionForm.puntuacion), fecha: this.valoracionForm.fecha || new Date().toISOString(), usuarioId: this.valoracionForm.usuarioId, sitioId: this.valoracionForm.targetType === "sitio" ? this.valoracionForm.targetId : null, hotelId: this.valoracionForm.targetType === "hotel" ? this.valoracionForm.targetId : null };
    const request$: Observable<unknown> = this.valoracionForm.id
      ? this.valoracionesApi.update({ id: this.valoracionForm.id, ...payload })
      : this.valoracionesApi.create(payload);

    request$.subscribe({
      next: () => {
        this.resetValoracionForm();
        this.reloadAll("Valoración sincronizada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar la valoración.");
      },
    });
  }
  deleteValoracion(id: string): void {
    if (!window.confirm("Eliminar esta valoración?")) return;
    this.valoracionesApi.delete(id).subscribe({
      next: () => {
        if (this.valoracionForm.id === id) this.resetValoracionForm();
        this.reloadAll("Valoración eliminada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar la valoración.");
      },
    });
  }

  editReaccion(item: Reaccion): void { this.reaccionForm = { id: item.id, meGusta: item.meGusta, usuarioId: item.usuarioId, targetType: item.sitioId ? "sitio" : "hotel", targetId: item.sitioId ?? item.hotelId ?? "", fecha: item.fecha }; this.status = null; }
  resetReaccionForm(): void { this.reaccionForm = this.newReaccionForm(); }
  saveReaccion(): void {
    const payload = { meGusta: this.reaccionForm.meGusta, fecha: this.reaccionForm.fecha || new Date().toISOString(), usuarioId: this.reaccionForm.usuarioId, sitioId: this.reaccionForm.targetType === "sitio" ? this.reaccionForm.targetId : null, hotelId: this.reaccionForm.targetType === "hotel" ? this.reaccionForm.targetId : null };
    const request$: Observable<unknown> = this.reaccionForm.id
      ? this.reaccionesApi.update({ id: this.reaccionForm.id, ...payload })
      : this.reaccionesApi.create(payload);

    request$.subscribe({
      next: () => {
        this.resetReaccionForm();
        this.reloadAll("Reacción sincronizada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo guardar la reacción.");
      },
    });
  }
  deleteReaccion(id: string): void {
    if (!window.confirm("Eliminar esta reacción?")) return;
    this.reaccionesApi.delete(id).subscribe({
      next: () => {
        if (this.reaccionForm.id === id) this.resetReaccionForm();
        this.reloadAll("Reacción eliminada correctamente.");
      },
      error: (err: unknown) => {
        this.error = this.extractError(err, "No se pudo eliminar la reacción.");
      },
    });
  }

  resolveDestino(sitioId?: string | null, hotelId?: string | null): string {
    if (sitioId) return this.sitios.find((item) => item.id === sitioId)?.nombre ?? sitioId;
    if (hotelId) return this.hoteles.find((item) => item.id === hotelId)?.nombre ?? hotelId;
    return "Sin destino";
  }

  currency(value: number): string {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(value);
  }

  private extractError(err: unknown, fallback: string): string {
    if (typeof err === "object" && err !== null && "error" in err) {
      const error = (err as { error?: unknown }).error;
      if (typeof error === "string") return error;
      if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === "string") return message;
      }
    }
    if (err instanceof Error) return err.message;
    return fallback;
  }

  private toDateInput(value: string): string { return value ? new Date(value).toISOString().slice(0, 10) : ""; }
  private newSitio(): SitioTuristico { return { id: "", nombre: "", descripcion: "", ubicacion: "", activo: true }; }
  private newHotel(): Hotel { return { id: "", nombre: "", direccion: "", precioNoche: 0, sitioId: "", activo: true }; }
  private newReservacion(): Reservacion { return { id: "", fechaInicio: "", fechaFin: "", estado: "pendiente", total: 0, usuarioId: "", hotelId: "" }; }
  private newPago(): Pago { return { id: "", metodoPago: "efectivo", monto: 0, fechaPago: this.toDateInput(new Date().toISOString()), estado: "pendiente", reservacionId: "" }; }
  private newComentarioForm(): { id: string; texto: string; usuarioId: string; targetType: TargetType; targetId: string; parentComentarioId: string; fecha: string } { return { id: "", texto: "", usuarioId: "", targetType: "sitio", targetId: "", parentComentarioId: "", fecha: "" }; }
  private newValoracionForm(): { id: string; puntuacion: number; usuarioId: string; targetType: TargetType; targetId: string; fecha: string } { return { id: "", puntuacion: 5, usuarioId: "", targetType: "sitio", targetId: "", fecha: "" }; }
  private newReaccionForm(): { id: string; meGusta: boolean; usuarioId: string; targetType: TargetType; targetId: string; fecha: string } { return { id: "", meGusta: true, usuarioId: "", targetType: "sitio", targetId: "", fecha: "" }; }
}
