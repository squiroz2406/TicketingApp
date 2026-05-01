# TicketingApp

Una aplicación de ticketing para eventos, construida con .NET 8 (backend) y React (frontend). Permite gestionar eventos, seleccionar asientos y realizar reservas.

## Tecnologías

- **Backend**: ASP.NET Core 8, Entity Framework Core, SQL Server, MediatR, JWT Authentication
- **Frontend**: React con Vite, Axios para API calls
- **Base de Datos**: SQL Server

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

2. Construye y ejecuta con Docker Compose (incluye SQL Server y la aplicación completa):
   ```bash
   docker compose up --build -d
   ```

3. Accede a la aplicación:
   - **API Swagger**: `http://localhost:8080/swagger`
   - **SQL Server**: `localhost:1433` (Usuario: sa, Contraseña: Admin123!)

4. Para detener:
   ```bash
   docker compose down
   ```

### Puertos Levantados

- **Aplicación (API)**: `8080`
- **SQL Server**: `1433`
- **Frontend**: `5173`

## Configuración de la Base de Datos

Antes de ejecutar la aplicación, asegúrate de que las migraciones de Entity Framework estén aplicadas.

### Agregar Migraciones (si no existen)

1. Instala las herramientas de EF si no las tienes:
   ```bash
   dotnet tool install --global dotnet-ef
   ```

2. Desde el directorio raíz del proyecto:
   ```bash
   dotnet ef migrations add InitialCreate --project TicketingApp.API --startup-project TicketingApp.API
   dotnet ef database update --project TicketingApp.Infrastructure \
   --startup-project TicketingApp.API
   ```

## Pruebas de Endpoints

Después de ejecutar `docker compose up --build -d`, puedes probar los endpoints usando curl, Postman o el navegador.

### 1. Verificar que la API esté corriendo

- Abre `http://localhost:8080/swagger` en el navegador para ver la documentación de la API.

### 2. Sembrar datos de prueba

- POST `http://localhost:8080/api/seed/seed`
  - Esto crea los eventos de ejemplo con sectores y asientos.

### 3. Listar eventos

- GET `http://localhost:8080/api/v1/events`
  - Debería devolver los eventos creados.

### 4. Ver sectores de un evento

- GET `http://localhost:8080/api/v1/events/{id}/sectors`
  - Reemplaza `{id}` con el ID del evento (ej. 1).

### 5. Ver disponibilidad de asientos

- GET `http://localhost:8080/api/v1/events/{id}/seats`
  - Muestra los asientos disponibles.

### 6. Reservar un asiento

- POST `http://localhost:8080/api/v1/reservations`
  - Body JSON: `{"eventId": 1, "seatId": 1, "userId": 1}` (ajusta IDs según datos).

### 7. Crear un nuevo evento (opcional)

- POST `http://localhost:8080/api/v1/events`
  - Body JSON: `{"name": "Nuevo Evento", "eventDate": "2026-06-01T20:00:00", "venue": "Lugar", "status": "Active"}`

Usa herramientas como Postman para enviar requests con JSON bodies.

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
