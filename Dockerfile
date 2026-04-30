# =========================
# 1. Build FRONTEND (React + Vite)
# =========================
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY ticketing-frontend/package*.json ./
RUN npm install

COPY ticketing-frontend/ .
RUN npm run build


# =========================
# 2. Build BACKEND (.NET 8)
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app

COPY TicketingApp.sln ./
COPY TicketingApp.API/TicketingApp.API.csproj TicketingApp.API/
COPY TicketingApp.Application/TicketingApp.Application.csproj TicketingApp.Application/
COPY TicketingApp.Domain/TicketingApp.Domain.csproj TicketingApp.Domain/
COPY TicketingApp.Infrastructure/TicketingApp.Infrastructure.csproj TicketingApp.Infrastructure/

RUN dotnet restore

COPY . .
RUN dotnet publish TicketingApp.API/TicketingApp.API.csproj -c Release -o /app/publish


# =========================
# 3. Runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copia backend publicado
COPY --from=api-build /app/publish .

# Copia build del frontend (Vite genera /dist)
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Variables importantes para .NET en Docker
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 8080

ENTRYPOINT ["dotnet", "TicketingApp.API.dll"]