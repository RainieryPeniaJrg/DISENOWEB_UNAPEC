# Documento de Visión y Alcance  
**Proyecto:** DisenoWeb (Plataforma de Experiencias Turísticas)  
**Grupo:** 3  
**Integrantes:** Juan Peña, Jose Canelo, Juan Peralta, Kevin Vasquez, Crismery Disla, Jordy de los Santos  
**Fecha:** 25/01/2026  
**Control de versiones:** v1.1  

---

## 1. Introducción
### 1.1 Propósito  
Establecer la visión, el alcance y las funcionalidades del sistema DisenoWeb, plataforma web para explorar sitios turísticos y hoteles, con interacción social (valoraciones, reacciones, comentarios en hilo), gestión de imágenes y consulta de reservaciones personales.

### 1.2 Alcance  
- Frontend (React + Vite) dirigido al usuario final: navegación, registro/acceso, comentarios, perfil y reservaciones.  
- Backend (.NET) con APIs REST y base de datos estructurada para usuarios, roles, sitios, hoteles, comentarios, valoraciones, reacciones, imágenes, reservaciones y pagos.  
- Intercambio JSON; imágenes servidas como recursos estáticos accesibles por URL.  

### 1.3 Definiciones  
- **Sitio:** Lugar turístico.  
- **Hotel:** Alojamiento vinculado a un sitio.  
- **Valoración:** Puntuación 1–5 por usuario y destino.  
- **Reacción:** Marcación positiva/negativa por usuario y destino.  
- **Comentario:** Publicación textual con soporte de respuestas (hilo).  
- **Imagen:** Archivo asociado a entidad (sitio/hotel/usuario).  
- **WIP:** Sección en construcción.  

## 2. Necesidades de usuario
- Explorar sitios y hoteles con descripciones, imágenes y métricas.  
- Registrarse e iniciar sesión con flujo ágil.  
- Comentar y responder a otros usuarios.  
- Visualizar y actualizar información personal.  
- Consultar reservaciones activas e históricas.  
- Alternar tema claro/oscuro y usar la aplicación en desktop o móvil.  

## 3. Visión general del producto
Plataforma turística digital con catálogo multimedia y feedback social, que permite a cada usuario gestionar su perfil e historial de reservaciones. Está preparada para extenderse con flujos completos de reservas y pagos y con panel administrativo.

## 4. Requerimientos funcionales
- Autenticación y cuentas: registro y acceso por correo/contraseña; respuesta de acceso incluye mensaje y `userId`.  
- Usuarios: consultar/editar perfil, asociar imágenes, visualizar reservaciones propias.  
- Sitios y Hoteles: listados y detalle con imágenes y métricas.  
- Comentarios: creación y respuestas; listados por sitio/hotel.  
- Valoraciones: una por usuario/destino; estadísticas (total y promedio).  
- Reacciones: like/dislike; estadísticas (likes, dislikes, porcentaje de aprobación).  
- Imágenes: carga multipart y asociación a usuario/sitio/hotel; selección de imagen principal; eliminación individual.  
- Reservaciones/Pagos: endpoints habilitados; UI muestra reservaciones del usuario (creación/pago se integrará en fase siguiente).  
- UI y navegación: SPA con router, tema claro/oscuro, sidebar plegable, componentes reutilizables (cards, tiras de imágenes, comentarios rápidos).  

## 5. Requerimientos no funcionales
- Usabilidad: interfaz responsiva y consistente; componentes reutilizables.  
- Rendimiento: peticiones concurrentes para listados/estadísticas; imágenes servidas estáticamente.  
- Disponibilidad: despliegue local y entornos controlados; preparado para productivo.  
- Mantenibilidad: código modular (servicios API, contextos de estado, componentes UI).  
- Portabilidad: navegadores modernos; backend en entornos .NET; URL base configurable.  

## 6. Recursos
- **Equipo computacional:** Servidor para API .NET y base de datos; almacenamiento para imágenes; entorno Node para frontend.  
- **Equipo no computacional:** Espacio físico e infraestructura básica para desarrollo/despliegue.  
- **Personal:** Desarrolladores fullstack, QA funcional, soporte de infraestructura.  
- **Tiempo:** Iteraciones cortas con entregas continuas.  
- **Capacitación:** Guías internas de uso de Swagger/Postman y ejecución de frontend.  
- **Servicios de comunicación:** Repositorio Git, mensajería de equipo, reuniones periódicas.  
- **Licenciamiento e instalación:** Dependencias open-source (React, Vite, Axios, .NET SDK); instalación con gestores oficiales.  

## 7. Restricciones
- Dependencia de conectividad con la API para todas las operaciones.  
- Flujos completos de creación de reservas y pagos se integrarán en la siguiente fase; actualmente se visualizan reservaciones existentes.  
- Gestión de archivos requiere almacenamiento accesible para servir imágenes estáticas.  

## 8. Estándares aplicables
- Estilo REST para APIs JSON.  
- Convenciones HTTP (GET/POST/PUT/DELETE).  
- Políticas CORS definidas para orígenes frontend.  
- Manejo de archivos mediante multipart/form-data y publicación en rutas estáticas.  

## 9. Características del sistema
- Catálogo multimedia: sitios y hoteles con múltiples imágenes y una principal.  
- Feedback social: comentarios con hilos, valoraciones y reacciones agregadas.  
- Experiencia de usuario: tema claro/oscuro, menú lateral plegable, navegación fluida.  
- Gestión personal: edición de datos de usuario e imágenes; vista de reservaciones.  
- Capa de datos: persistencia estructurada que facilita consultas y estadísticas por entidad.  

### 9.a Requerimientos de desempeño
- Respuesta interactiva en listados y creación de comentarios.  
- Entrega de imágenes desde almacenamiento estático para minimizar latencia.  

### 9.b Requerimientos de documentación
- Swagger actualizado para los endpoints.  
- Colección Postman mantenida por versión.  
- README del frontend con pasos de instalación/ejecución y notas de diseño.  

## 10. Requerimientos de ambiente
- Backend: .NET 10, almacenamiento estructurado y espacio para uploads.  
- Frontend: Node + npm para construcción Vite; variable `VITE_API_BASE_URL` para apuntar al servicio.  
- Servidor de archivos estáticos para las imágenes (`/uploads`).  

## 11. Manual / Ayuda
- Ayuda en línea vía Swagger (`/swagger`) y mensajes de validación en UI.  
- Guías de instalación/configuración en README del frontend; colección Postman para pruebas.  

## 12. Control de versiones
- **v1.1 (25/01/2026):** Documento de visión alineado a plantilla, con alcance completo, control de versiones y grupo asignado.  
- **v1.0 (25/01/2026):** Versión inicial del documento de visión.  

## 13. Conclusión
DisenoWeb presenta una plataforma robusta para la gestión y exploración de experiencias turísticas, integrando catálogo multimedia, interacción social y administración de usuario y reservaciones. Su arquitectura modular permite evolucionar hacia flujos completos de reservas/pagos y funcionalidades administrativas sin comprometer la base establecida.

---
### Anexos
- Recursos y lineamientos adicionales descritos en la sección 6.  
- Estándares y ayudas detallados en las secciones 8, 10 y 11.  
