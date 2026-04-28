# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY ticketing-frontend/package*.json ./
RUN npm install
COPY ticketing-frontend/ .
RUN npm run build

# Build API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app
COPY TicketingApp.sln ./
COPY TicketingApp.API/TicketingApp.API.csproj TicketingApp.API/
COPY TicketingApp.Application/TicketingApp.Application.csproj TicketingApp.Application/
COPY TicketingApp.Domain/TicketingApp.Domain.csproj TicketingApp.Domain/
COPY TicketingApp.Infrastructure/TicketingApp.Infrastructure.csproj TicketingApp.Infrastructure/
RUN dotnet restore
COPY . .
RUN dotnet build -c Release
RUN dotnet publish TicketingApp.API/TicketingApp.API.csproj -c Release -o /app/publish --no-build

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=api-build /app/publish .
COPY --from=frontend-build /app/frontend/dist ./wwwroot
EXPOSE 80
ENTRYPOINT ["dotnet", "TicketingApp.API.dll"]