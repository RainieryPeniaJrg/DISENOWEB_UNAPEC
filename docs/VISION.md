# Visión y Alcance — DisenoWeb (Demo Fullstack)

## Propósito
Construir una plataforma de experiencias turísticas que conecte a usuarios con sitios y hoteles, permitiendo explorar, reaccionar, comentar (con respuestas), valorar (1–5) y gestionar imágenes de cada entidad. La demo prioriza el flujo de usuario final (no admin) y la conexión efectiva front ↔ backend.

## Alcance actual
- **Backend (.NET 10 / JSON storage)**
  - Entidades: Usuarios, Roles, Sitios Turísticos, Hoteles, Comentarios (con respuestas), Valoraciones (1–5), Reacciones (like/dislike), Imágenes (upload multipart por entidad), Reservaciones, Pagos.
  - Endpoints clave:
    - Auth simple: `POST /api/usuarios/register`, `POST /api/usuarios/login` (devuelve `accedido` y `userId`).
    - Imagenes: `POST /api/imagenes/{sitio|hotel|usuario}/{id}` (multipart), `GET` por entidad, `DELETE` individual. Archivos servidos desde `wwwroot/uploads`.
    - Comentarios con hilo: `POST /api/comentarios`, `POST /api/comentarios/{id}/responder`, listados por sitio/hotel.
    - Valoraciones/Reacciones: listados + estadísticas por sitio/hotel.
    - Sitios/Hoteles devuelven sus imágenes embebidas.
  - Validaciones: unicidad de valoración/reacción por usuario+destino, una imagen principal por entidad, puntuación 1–5, fechas de reservación coherentes.
  - CORS para Vite/localhost, Swagger expuesto; build verificado.

- **Frontend (Vite + React + TS)**
  - Rutas: Inicio, Sitios, Hoteles, Perfil, Reservas/Pagos (WIP placeholders).
  - Home, Sitios y Hoteles muestran imágenes, valoraciones, reacciones, comentarios recientes; permiten comentar si hay sesión.
  - Perfil: actualizar datos básicos y listar reservaciones del usuario.
  - UI: layout con header (tema claro/oscuro, toggle de menú, saludo), sidebar plegable con panel de auth; componentes reutilizables (cards de sitio/hotel, tiras de imágenes, quick comment, stat cards, iconos).
  - Tema dual (light/dark) persistente en localStorage.
  - Cliente API centralizado (`services/api.ts`) alineado con el backend y tipos fuertes (`types.ts`); contexts de Auth y Theme.

## Supuestos
- Seguridad mínima: auth sin hashing ni tokens (demo). IDs de usuario se confían para operaciones.
- Almacenamiento en archivos JSON; uploads en `wwwroot/uploads`.
- Demo orientada a usuario final; operaciones CRUD de master-data admin quedan fuera de alcance actual.

## No incluido (futuro)
- Pasarela de pagos real, flujo completo de reservas/pagos en frontend.
- Gestión avanzada de roles/permisos y protección de endpoints.
- Paginación/búsquedas, optimización de imágenes y CDN.
- Tests E2E y CI/CD.

## Cómo usar
1) Backend: `dotnet run` en `server/DisenoWeb.Api` (sirve `/uploads`).
2) Frontend: `npm install && npm run dev` en `client/` (usar `VITE_API_BASE_URL=https://localhost:7057` si cambia).
3) Probar con seed:
   - admin@demo.local / admin123
   - julia@demo.local / julia123 (usuario final)

## Métricas de éxito (demo)
- API y front levantan sin ajustes adicionales.
- Imágenes se muestran en Home/Sitios/Hoteles desde uploads locales.
- Usuario puede registrarse/iniciar sesión, comentar y ver sus reservaciones en Perfil.
