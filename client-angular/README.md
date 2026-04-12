# Frontend Angular DisenoWeb

## Resumen
Este frontend Angular implementa la experiencia web de turismo para `DisenoWeb`, conectada a la API local en `http://localhost:5000`. La aplicación permite explorar sitios turísticos y hoteles, consultar reservaciones y pagos, gestionar el perfil del usuario autenticado y operar un panel administrativo con CRUD por módulos.

El documento describe el comportamiento funcional actual de la página. No es una memoria técnica profunda ni un roadmap; refleja el estado real implementado hoy.

## URLs locales esperadas
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:5000`

## Propósito del sistema
La aplicación centraliza una experiencia de turismo dominicano sobre una sola interfaz:
- descubrir destinos turísticos;
- comparar hoteles;
- consultar señales sociales como comentarios, valoraciones y reacciones;
- revisar reservaciones y pagos conectados al backend;
- administrar entidades principales desde un panel central.

## Funcionamiento general de la experiencia

### Shell principal
La aplicación carga dentro de un `layout shell` que contiene:
- barra superior con estado del API, sesión y cambio de tema;
- navegación lateral hacia todas las páginas funcionales;
- panel lateral de autenticación;
- footer con acceso directo a la raíz del API y al endpoint de hoteles.

### Estado del API
El frontend ejecuta una verificación de disponibilidad contra la raíz del backend. El estado visible puede ser:
- `Verificando API`
- `API disponible`
- `API no disponible`

Cuando el backend no responde, la interfaz mantiene la navegación pero muestra errores en las pantallas que dependen de datos remotos.

### Sesión y persistencia
La sesión se maneja desde el frontend y se persiste localmente en `localStorage`. Esto permite:
- mantener al usuario autenticado entre recargas;
- mostrar acciones según el estado de sesión;
- filtrar datos personales en reservas, pagos y perfil.

### Diferencia entre vistas públicas y panel admin
- Las vistas públicas están pensadas para exploración y consulta.
- El panel admin concentra la gestión CRUD operativa.
- El acceso admin visible depende del rol guardado en la sesión del frontend.
- Esta restricción es visual; no sustituye autorización real del backend.

## Rutas disponibles
- `/`
- `/sitios`
- `/hoteles`
- `/reservas`
- `/pagos`
- `/perfil`
- `/admin`
- `/admin/:section`

## Descripción funcional por página

### Inicio
La portada funciona como dashboard de descubrimiento.

Comportamiento principal:
- carga sitios y hoteles desde el API;
- combina imágenes, comentarios, valoraciones y reacciones;
- destaca destinos y hoteles relevantes con base en actividad y reputación;
- muestra comentarios recientes agregados;
- resume métricas globales como cantidad de sitios, hoteles y promedio general.

Objetivo funcional:
- dar contexto rápido al usuario antes de navegar a módulos específicos.

### Sitios
Esta página presenta el catálogo turístico con contexto visual y social.

Comportamiento principal:
- lista sitios turísticos activos;
- muestra nombre, ubicación, descripción e imágenes;
- muestra valoraciones agregadas, likes, dislikes y comentarios;
- ordena los comentarios por fecha;
- permite comentar rápidamente si el usuario tiene sesión activa.

Restricción funcional:
- sin sesión, el usuario puede ver información pero no publicar comentarios.

### Hoteles
Esta vista se enfoca en comparación rápida de opciones de estadía.

Comportamiento principal:
- lista hoteles disponibles;
- muestra dirección, imágenes y precio por noche;
- presenta valoración agregada y señales sociales;
- incluye comentarios recientes por hotel;
- permite comentario rápido si existe sesión activa.

Objetivo funcional:
- facilitar comparación entre hoteles con datos operativos y reputacionales visibles.

### Reservas
La pantalla de reservas ya está conectada al backend.

Comportamiento principal:
- consulta reservaciones reales desde el API;
- si existe sesión, filtra por el usuario autenticado;
- si no existe sesión, muestra el conjunto completo disponible;
- refleja registros creados o actualizados desde el panel admin;
- muestra estado, fechas, hotel, usuario y total.

Rol funcional actual:
- pantalla de lectura orientada al usuario;
- la gestión operativa sigue centralizada en admin.

### Pagos
La pantalla de pagos también consume backend real.

Comportamiento principal:
- consulta pagos y reservaciones;
- cruza ambas fuentes para filtrar pagos del usuario autenticado;
- muestra historial, estado, método, fecha, monto y reservación relacionada;
- refleja cambios hechos desde el panel admin.

Rol funcional actual:
- lectura conectada y sincronizada con la gestión administrativa.

### Perfil
La página de perfil depende de que exista sesión iniciada.

Comportamiento principal:
- consulta el usuario autenticado desde el backend;
- carga imágenes del perfil si existen;
- permite edición básica de nombre, correo y password;
- actualiza datos del usuario en el API;
- carga y muestra reservaciones del usuario autenticado;
- mantiene la sesión persistida localmente.

Sin sesión:
- se muestra un estado vacío invitando a autenticarse.

### Admin
El panel admin es la consola central de gestión CRUD.

Módulos disponibles:
- `sitios`
- `hoteles`
- `reservaciones`
- `pagos`
- `comentarios`
- `valoraciones`
- `reacciones`

Comportamiento principal:
- navegación por secciones administrativas;
- carga agregada de todos los catálogos necesarios;
- formularios de creación y edición;
- eliminación con confirmación;
- sincronización de listas tras cada operación;
- selección de relaciones desde catálogos cargados del API.

Reglas funcionales del panel:
- hotel requiere un `sitio`;
- reservación requiere `usuario` y `hotel`;
- pago requiere una `reservación`;
- comentario, valoración y reacción requieren `usuario` y un `sitio` o `hotel`;
- los comentarios también pueden responder a otro comentario.

## Flujos funcionales principales

### Inicio de sesión
- El usuario ingresa email y password desde el panel lateral.
- Si el backend valida la credencial, la sesión queda activa y persistida localmente.
- La UI actualiza navegación, estado de sesión y permisos visuales.

### Registro
- El usuario puede crear una cuenta desde el mismo panel lateral.
- Tras registrarse, la sesión queda activa automáticamente.

### Cierre de sesión
- El usuario autenticado puede cerrar sesión desde el panel lateral.
- Se elimina la sesión local y la UI vuelve a estado invitado.

### Publicación de comentario
- Disponible en sitios y hoteles.
- Requiere sesión activa.
- El comentario se envía al API y se agrega a la vista del recurso correspondiente.

### Edición de perfil
- Disponible solo con sesión.
- El usuario modifica nombre, correo o contraseña.
- Los cambios se envían al endpoint de usuario por identificador.
- Si la actualización es exitosa, la sesión local también se sincroniza.

### Acceso visual al panel admin
- El enlace a `/admin` aparece únicamente si la sesión tiene rol administrativo.
- El acceso visible depende del rol almacenado en frontend.

### Alta, edición y eliminación en admin
- Cada sección cuenta con su propio formulario y listado.
- Al guardar o eliminar, el panel vuelve a sincronizar los datos con el API.
- Los mensajes de estado informan si la operación se completó o falló.

## Credenciales demo funcionales
- Admin: `admin@demo.local / admin123`
- Usuario estándar: `julia@demo.local / julia123`

## Conectividad e integración actual

### Frontend
- `apiBaseUrl` apunta a `http://localhost:5000`
- el frontend corre en `http://localhost:4200`

### Backend
- CORS habilitado para `http://localhost:4200`
- la raíz del API responde como health check básico
- Swagger/OpenAPI solo está visible cuando el backend corre en modo desarrollo

## Restricciones y observaciones actuales
- El acceso admin se controla solo desde el frontend.
- Esto no constituye seguridad real del backend.
- Reservas y pagos ya consumen backend real, pero su operación de negocio del usuario final no vive todavía en pantallas públicas.
- La sesión depende de persistencia local en navegador.
- Si el API no responde, la UI muestra estados de error y disponibilidad, pero no puede operar datos remotos.
- El frontend usa un patrón async reactivo basado en `Observable`, no `Promise`.

## Escenarios funcionales cubiertos

### Usuario invitado
- puede navegar por inicio, sitios, hoteles, reservas y pagos;
- puede ver información pública y estados del sistema;
- no puede comentar ni editar perfil;
- no ve acceso admin.

### Usuario autenticado estándar
- puede iniciar sesión o registrarse;
- puede comentar en sitios y hoteles;
- puede ver reservas y pagos filtrados por su usuario;
- puede editar su perfil;
- no ve acceso admin si no tiene rol administrativo.

### Usuario admin
- ve el acceso al panel `/admin`;
- puede operar CRUD por sección;
- puede gestionar relaciones entre módulos desde catálogos del API.

### API caída o no disponible
- el shell marca `API no disponible`;
- las pantallas dependientes del backend muestran mensajes de error;
- la navegación sigue visible, pero la carga de datos falla.

## Estado actual del frontend
El frontend se considera funcional para demostración, QA y revisión académica en los siguientes ejes:
- navegación general operativa;
- autenticación básica y persistencia de sesión;
- consumo real del backend local;
- vistas públicas conectadas;
- gestión administrativa CRUD por módulos;
- manejo visual de estados de carga, vacío y error.
