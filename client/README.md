## Frontend DisenoWeb

Estado: conectado a la API JSON (`https://localhost:7057`) con routing y vistas base para usuarios no admin.

### Scripts
- `npm install`
- `npm run dev`
- `npm run build`

### Variables de entorno
- `VITE_API_BASE_URL` (opcional): por defecto `https://localhost:7057`.

### Arquitectura
- `src/App.tsx`: Router con vistas Inicio + WIP (sitios, hoteles, reservas, pagos, perfil).
- `src/components`: Shell (header/sidebar/footer), tarjetas y banners reutilizables.
- `src/pages/HomePage.tsx`: consume API de sitios/hoteles, valoraciones, reacciones, comentarios e imágenes.
- `src/services/api.ts`: cliente Axios y funciones por recurso.
- `src/types.ts`: modelos tipados alineados con el backend.

### Colores/tema
- Paleta en `src/styles.css` (primario teal `#46c2b3`, acento ámbar `#f6c344`, fondo oscuro).

### Flujos listos
- Inicio: métricas rápidas, cards de sitios/hoteles con valoraciones/reacciones, lista de comentarios recientes.
- Imágenes: strips por destino/hotel mostrando principal y adicionales.
- Navegación: rutas WIP listas para implementar reservas/pagos/perfil.

Ajusta las vistas WIP reutilizando el `api.ts` y los componentes de layout.
