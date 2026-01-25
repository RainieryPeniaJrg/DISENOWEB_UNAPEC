# API rápida (DisenoWeb)

- Swagger UI: `https://localhost:7057/swagger` (se actualiza con los nuevos endpoints de comentarios con respuestas, valoraciones y reacciones).
- Postman: `postman/DisenoWeb-api.postman_collection.json` incluye variables precargadas que apuntan al seeding.

## IDs de seeding principales
- Sitio Playa Bonita: `33333333-3333-3333-3333-333333333333`
- Sitio Salto Esmeralda: `44444444-4444-4444-4444-444444444444`
- Hotel Mar Azul: `55555555-5555-5555-5555-555555555555`
- Hotel Eco Lodge Esmeralda: `66666666-6666-6666-6666-666666666666`
- Usuario Julia (demo): `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`
- Comentario raíz Playa Bonita: `77777777-7777-7777-7777-777777777777`

## Endpoints clave
- Comentarios: `GET /api/comentarios/sitio/{id}`, `GET /api/comentarios/hotel/{id}`, `POST /api/comentarios`, `POST /api/comentarios/{id}/responder`
- Valoraciones: `GET /api/valoraciones/sitio/{id}`, `GET /api/valoraciones/hotel/{id}`, `GET /api/valoraciones/{destino}/estadisticas`, `POST /api/valoraciones`
- Reacciones: `GET /api/reacciones/sitio/{id}`, `GET /api/reacciones/hotel/{id}`, `GET /api/reacciones/{destino}/estadisticas`, `POST /api/reacciones`

## Notas
- Puntuación de valoraciones validada 1–5.
- Un usuario solo puede valorar o reaccionar una vez por destino.
- Comentarios permiten respuestas anidadas con `parentComentarioId`.
