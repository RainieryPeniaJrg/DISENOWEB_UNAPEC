# DISENOWEB_UNAPEC

## Estructura
- `DisenoWeb.slnx`: solución .NET.
- `server/DisenoWeb.Api`: API ASP.NET Core que persiste entidades en archivos JSON.
- `server/DisenoWeb.Api/Data/storage`: datos semilla (copiados a bin al compilar).
- `client-angular`: front-end Angular standalone.

## Levantar la API
```bash
cd server/DisenoWeb.Api
dotnet run --launch-profile https
```
- Endpoints expuestos en `https://localhost:7057/api/products` (o `http://localhost:5087/api/products`).
- Cambia la ruta base de almacenamiento JSON en `appsettings*.json` > `JsonStorage:BasePath`.

## Levantar el cliente Angular (requiere Node.js 18+)
```bash
cd client-angular
npm install
npm start     # abre en http://localhost:3000
```
- Configuración API: `client-angular/src/environments/environment.development.ts` (`apiBaseUrl`).

## Notas rapidas
- Repositorio genérico `JsonFileRepository<T>` para CRUD sobre archivos JSON (un archivo por entidad).
- Política CORS ya permite `http://localhost:3000`; añade dominios en `Program.cs` si es necesario.
- Datos iniciales de productos en `server/DisenoWeb.Api/Data/storage/products.json`.
