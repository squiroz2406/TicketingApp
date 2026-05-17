# TicketingApp Performance & Concurrency Tests

Suite k6 profesional para validar integridad de reservas en la API real de TicketingApp.

## Objetivo crítico

El escenario principal es `same-seat-reservation`: muchos VUs intentan reservar exactamente el mismo asiento con `POST /api/v1/reservations`.

Contrato esperado:

- 1 respuesta exitosa `HTTP 200` con `success=true` y `reservationId`.
- N-1 respuestas controladas `HTTP 409` o `HTTP 400` con `success=false`.
- 0 JSON inválidos.
- 0 estados HTTP inesperados.
- 0 overbooking. La prueba falla si `reservation_successes` es distinto de `1`.

## Endpoints detectados

- `POST /api/v1/seed/seed`: recrea datos de prueba. Es destructivo.
- `GET /api/v1/events`: lista funciones/películas.
- `GET /api/v1/events/{id}/seats`: disponibilidad de asientos.
- `POST /api/v1/reservations`: reserva asientos. Body real:

```json
{
  "SeatIds": ["guid-del-asiento"],
  "UserId": 1
}
```

## Requisitos

- Docker y Docker Compose.
- Opcional: k6 instalado localmente.

La app ahora aplica migraciones automáticamente en Docker con `Database__AutoMigrate=true`.

## Ejecución rápida con Docker

Desde la raíz del repo:

```bash
docker compose up --build -d
docker compose -f docker-compose.yml -f performance-tests/docker-compose.k6.yml --profile tools run --rm k6
```

El comando anterior ejecuta el test crítico de reserva simultánea del mismo asiento.

## Ejecutar escenarios con k6 local

Desde la raíz:

```bash
k6 run performance-tests/scenarios/same-seat-reservation.js
k6 run performance-tests/scenarios/massive-purchase.js
k6 run performance-tests/scenarios/spike-test.js
k6 run performance-tests/scenarios/stress-test.js
k6 run performance-tests/scenarios/soak-test.js
```

Ejemplo agresivo:

```bash
SAME_SEAT_VUS=1000 RESET_DATA=true BASE_URL=http://localhost:8080 \
  k6 run performance-tests/scenarios/same-seat-reservation.js
```

## Variables principales

- `BASE_URL`: URL de la API. Default `http://localhost:8080`.
- `RESET_DATA`: ejecuta seed antes del test. Default `true`. No usar contra datos reales.
- `AUTH_TOKEN`: bearer token opcional.
- `USER_ID`: base para generar usuarios virtuales.
- `USE_UNIQUE_USER_IDS`: default `false` porque el seed real crea solo `UserId=1`. Activar solo si existen usuarios suficientes.
- `SAME_SEAT_VUS`: usuarios simultáneos contra el mismo asiento.
- `PURCHASE_VUS`, `PURCHASE_DURATION`: compra masiva.
- `SPIKE_NORMAL_VUS`, `SPIKE_PEAK_VUS`: spike test.
- `STRESS_MAX_VUS`: techo progresivo del stress test.
- `SOAK_VUS`, `SOAK_DURATION`: duración y concurrencia del soak.

## Reportes

Cada ejecución genera:

- `performance-tests/reports/<prefix>-<scenario>-summary.json`
- `performance-tests/reports/<prefix>-<scenario>-report.html`
- resumen textual en consola

## Grafana y Prometheus

Levantar observabilidad:

```bash
docker compose -f docker-compose.yml -f performance-tests/docker-compose.k6.yml \
  --profile observability up -d prometheus grafana
```

Ejecutar k6 exportando métricas:

```bash
K6_OUT=experimental-prometheus-rw \
docker compose -f docker-compose.yml -f performance-tests/docker-compose.k6.yml \
  --profile tools run --rm k6
```

Grafana queda en `http://localhost:3001` con usuario `admin` y password `admin`.

## Validación SQL post-test

Para confirmar desde SQL Server que no hay reservas activas duplicadas:

```bash
docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'Admin123!' -d TicketingDb -C \
  -i /dev/stdin < performance-tests/data/sql/concurrency-validations.sql
```

La primera consulta no debe devolver filas.

## Interpretación

- `reservation_successes != 1` en el test same-seat indica overbooking o falla funcional.
- `unexpected_status > 0` indica respuestas fuera del contrato esperado.
- `invalid_json > 0` indica respuestas corruptas o HTML/errores no normalizados.
- `timeouts_or_network_errors > 0` apunta a saturación, deadlocks visibles como timeout, reinicios o problemas de red.
- p95/p99 altos con errores bajos indican degradación de performance, no necesariamente pérdida de integridad.

## Troubleshooting

- Si no hay eventos o asientos, ejecutar con `RESET_DATA=true`.
- Si el seed falla, verificar que SQL Server esté healthy y que la API haya aplicado migraciones.
- Si el test falla por `reservation_successes>1`, revisar inmediatamente constraints, transacciones y logs de `DbUpdateConcurrencyException`.
- Si aparecen muchos `409` en tests masivos, puede ser normal por contención y agotamiento de asientos; bajar VUs o reseedear.
