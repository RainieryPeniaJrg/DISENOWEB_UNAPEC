# Frontend Angular DisenoWeb

Migración side-by-side desde `client` (React + Vite) a Angular standalone.

## Scripts
- `npm install`
- `npm start`
- `npm run build`

## Variables
- `src/environments/environment.development.ts`:
  - `apiBaseUrl: "https://localhost:7057"`

## Arquitectura
- `src/app/layout`: shell principal (topbar/sidebar/footer) + panel de auth.
- `src/app/features`: páginas `home`, `sitios`, `hoteles`, `perfil`, `wip`.
- `src/app/core/api`: clientes `HttpClient` por recurso.
- `src/app/core/state`: estado global (`AuthService`, `ThemeService`) con signals.
- `src/app/core/models`: tipos alineados al backend.

## Rutas
- `/`
- `/sitios`
- `/hoteles`
- `/reservas` (WIP)
- `/pagos` (WIP)
- `/perfil`
