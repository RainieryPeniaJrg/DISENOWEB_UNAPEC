# 🌴 RD Tourism — Plataforma de Hotelería y Turismo en República Dominicana

Aplicación web fullstack para explorar hoteles y sitios turísticos de RD.

- **Backend:** ASP.NET Core 8 Web API con JWT Auth
- **Frontend:** Angular 17 (Standalone Components)
- **Sin base de datos:** Datos en memoria (fácil de migrar a SQL Server / EF Core)

---

## 📁 Estructura del Proyecto

```
rd-tourism/
├── backend/               ← API .NET 8
│   ├── Controllers/
│   │   └── Controllers.cs         (HotelsController, TouristSitesController, AuthController)
│   ├── Models/
│   │   └── Models.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── HotelService.cs
│   │   └── TouristSiteService.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── RDTourism.API.csproj
│
└── frontend/              ← Angular 17
    └── src/
        └── app/
            ├── components/navbar/
            ├── guards/auth.guard.ts
            ├── interceptors/auth.interceptor.ts
            ├── models/models.ts
            ├── pages/
            │   ├── login/
            │   ├── hotels/
            │   ├── hotel-detail/
            │   └── sites/
            ├── services/
            │   ├── auth.service.ts
            │   └── api.services.ts
            ├── app.component.ts
            ├── app.config.ts
            └── app.routes.ts
```

---

## 🚀 Cómo Levantar el Proyecto

### ✅ Requisitos Previos

| Herramienta        | Versión mínima | Descarga                           |
|--------------------|----------------|------------------------------------|
| .NET SDK           | 8.0            | https://dotnet.microsoft.com       |
| Node.js            | 18+            | https://nodejs.org                 |
| Angular CLI        | 17+            | `npm install -g @angular/cli`      |

---

### 🔧 Backend (.NET 8 API)

```bash
# 1. Ir a la carpeta backend
cd rd-tourism/backend

# 2. Restaurar paquetes NuGet
dotnet restore

# 3. Ejecutar la API
dotnet run
```

La API quedará corriendo en:
- **HTTP:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger

#### Endpoints disponibles:

| Método | Ruta                            | Auth | Descripción                       |
|--------|---------------------------------|------|-----------------------------------|
| POST   | /api/auth/login                 | No   | Login de usuario                  |
| POST   | /api/auth/register              | No   | Registro de nuevo usuario         |
| GET    | /api/hotels                     | Sí   | Listar hoteles (filtros opcionales)|
| GET    | /api/hotels/{id}                | Sí   | Detalle de un hotel               |
| GET    | /api/hotels/provinces           | Sí   | Provincias disponibles            |
| POST   | /api/hotels/{id}/reserve        | Sí   | Solicitar reserva de hotel        |
| GET    | /api/touristsites               | Sí   | Listar sitios turísticos          |
| GET    | /api/touristsites/{id}          | Sí   | Detalle de un sitio               |
| GET    | /api/touristsites/categories    | Sí   | Categorías disponibles            |

#### Query params para filtros:
- `/api/hotels?province=La Altagracia&stars=5&category=Resort`
- `/api/touristsites?category=Playa`

---

### 🎨 Frontend (Angular 17)

```bash
# 1. Ir a la carpeta frontend
cd rd-tourism/frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
ng serve
```

La app quedará disponible en: **http://localhost:4200**

---

## 🔑 Credenciales Demo

| Usuario     | Email                    | Contraseña |
|-------------|--------------------------|------------|
| Demo User   | demo@rdturismo.com       | Demo123!   |
| Admin RD    | admin@rdturismo.com      | Admin123!  |

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Login / Registro con JWT
- Guard de rutas protegidas
- Interceptor HTTP para enviar token automáticamente
- Auto-logout si el token expira (401)

### 🏨 Hoteles
- Listado con filtros por provincia, categoría y estrellas
- Cards con imagen, rating, precio/noche, amenidades
- Detalle del hotel con galería y descripción completa
- Formulario de reserva con cálculo automático de noches y precio total
- Código de confirmación generado por la API

### 🗺️ Sitios Turísticos
- Listado filtrable por categoría (Playa, Naturaleza, Cultural, Histórico)
- Cards con imagen, actividades, precio de entrada y mejor época para visitar

---

## 🔧 Variables de Configuración

### Backend (`appsettings.json`)
```json
{
  "Jwt": {
    "Key": "RDTourism_SuperSecretKey_2024_MustBe32Chars!"
  }
}
```

### Frontend (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

---

## 🛠️ Próximos Pasos Sugeridos

- [ ] Conectar a **SQL Server** con **Entity Framework Core**
- [ ] Agregar **galería de imágenes** por hotel
- [ ] Implementar **mapa interactivo** con Google Maps API
- [ ] Panel de **administración** para gestionar hoteles/sitios
- [ ] Módulo de **mis reservas** por usuario
- [ ] **Notificaciones por email** al confirmar reserva (SendGrid)
- [ ] Deploy en **Azure App Service** (backend) + **Azure Static Web Apps** (frontend)

---

## 📦 Paquetes NuGet Utilizados

```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
```

---

## 🇩🇴 Datos Incluidos

### Hoteles (8 hoteles reales)
- Hard Rock Hotel & Casino Punta Cana
- Barceló Bávaro Grand Resort
- Casa de Campo Resort & Villas (La Romana)
- Hotel Embajador (Santo Domingo)
- Secrets Royal Beach Punta Cana
- Hodelpa Gran Almirante (Santiago)
- Bahia Principe Grand Samaná
- Hodelpa Caribe Colonial (Ciudad Colonial)

### Sitios Turísticos (9 sitios)
- Playa Bávaro
- Ciudad Colonial de Santo Domingo (UNESCO)
- Cascadas de Agua Blanca (Constanza)
- Bahía de las Águilas (Pedernales)
- Pico Duarte
- Altos de Chavón
- Playa Rincón (Samaná)
- Lago Enriquillo
- Carnaval de La Vega

---

*Desarrollado con ❤️ para República Dominicana 🇩🇴*
