# TicketingApp

Una aplicación de ticketing para eventos, construida con .NET 8 (backend) y React (frontend). Permite gestionar eventos, seleccionar asientos y realizar reservas.

## Tecnologías

- **Backend**: ASP.NET Core 8, Entity Framework Core, SQL Server, MediatR, JWT Authentication
- **Frontend**: React con Vite, Axios para API calls
- **Base de Datos**: SQLite (archivo local)

## Prerrequisitos

- Docker y Docker Compose
- Opcional para desarrollo local: .NET 8 SDK, Node.js 18+

## Instalación y Ejecución

### Con Docker (Recomendado)

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd TicketingApp
   ```

2. Construye y ejecuta con Docker Compose (incluye SQL Server):
   ```bash
   docker compose up --build -d
   ```

3. Accede a la aplicación en `http://localhost:8080`

   - Frontend: `http://localhost:8080`
   - API Swagger: `http://localhost:8080/swagger`

4. Para detener:
   ```bash
   docker compose down
   ```

### Desarrollo Local

#### Backend (.NET API)

1. Navega al directorio de la API:
   ```bash
   cd TicketingApp.API
   ```

2. Restaura dependencias y ejecuta:
   ```bash
   dotnet restore
   dotnet run
   ```

   La API estará en `http://localhost:5290` (ver `launchSettings.json`).

#### Frontend (React)

1. Navega al directorio del frontend:
   ```bash
   cd ticketing-frontend
   ```

2. Instala dependencias y ejecuta:
   ```bash
   npm install
   npm run dev
   ```

   El frontend estará en `http://localhost:5173`.

Nota: Para desarrollo local, asegúrate de que la API esté corriendo y actualiza `baseURL` en `src/api/client.js` si es necesario.

## Estructura del Proyecto

- `TicketingApp.API/`: Backend ASP.NET Core
- `TicketingApp.Application/`: Lógica de aplicación (CQRS con MediatR)
- `TicketingApp.Domain/`: Entidades y lógica de dominio
- `TicketingApp.Infrastructure/`: Persistencia y repositorios
- `ticketing-frontend/`: Frontend React

## API Endpoints

- `GET /api/v1/events`: Lista eventos
- `GET /api/v1/events/{id}/seats`: Obtiene asientos para un evento
- `POST /api/v1/reservations`: Crea una reserva

Consulta Swagger en `/swagger` para más detalles.

## Base de Datos

La aplicación usa SQL Server. En Docker, se incluye un contenedor de SQL Server. Para desarrollo local, instala SQL Server y actualiza la cadena de conexión en `appsettings.json`.

Asegúrate de que las migraciones de EF Core estén aplicadas. Si es necesario, ejecuta `dotnet ef database update` en el directorio de la API.

## Contribución

1. Fork el repo
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push y crea un PR