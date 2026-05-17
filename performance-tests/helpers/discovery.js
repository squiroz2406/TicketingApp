import { check, sleep } from 'k6';
import { ENV } from '../config/env.js';
import { get, post, parseJson } from './http.js';
import { invalidJson, setupLatency } from './metrics.js';

export function prepareDataset({ requireSeats = 1 } = {}) {
  waitForApi();

  if (ENV.resetData) {
    const seed = post(ENV.seedPath, {}, { name: 'seed_database' });
    check(seed, {
      'seed endpoint returned 2xx': (r) => r.status >= 200 && r.status < 300,
    });
  }

  const eventsRes = get(ENV.eventsPath, { name: 'list_events_setup' });
  setupLatency.add(eventsRes.timings.duration);
  const events = parseJson(eventsRes, invalidJson);

  if (!Array.isArray(events) || events.length === 0) {
    throw new Error(`No events returned by ${ENV.eventsPath}. Seed the database or set RESET_DATA=true.`);
  }

  const seatsByEvent = [];
  for (const event of events) {
    const seatsRes = get(`${ENV.eventsPath}/${event.id}/seats`, { name: 'list_seats_setup' });
    setupLatency.add(seatsRes.timings.duration);
    const seats = parseJson(seatsRes, invalidJson);
    if (!Array.isArray(seats)) {
      continue;
    }

    const availableSeats = seats
      .filter((seat) => seat && seat.id && seat.status === 'available')
      .map((seat) => ({
        id: seat.id,
        eventId: event.id,
        sectorId: seat.sectorId,
        label: seat.seatNumber || `${seat.row}${seat.col}`,
      }));

    if (availableSeats.length > 0) {
      seatsByEvent.push({ event, seats: availableSeats });
    }
  }

  const allSeats = seatsByEvent.reduce((acc, item) => acc.concat(item.seats), []);
  if (allSeats.length < requireSeats) {
    throw new Error(`Need at least ${requireSeats} available seats, found ${allSeats.length}.`);
  }

  return {
    events,
    seatsByEvent,
    allSeats,
    targetSeat: allSeats[0],
    syncAt: Date.now() + ENV.syncDelayMs,
  };
}

function waitForApi() {
  const deadline = Date.now() + durationToMs(ENV.setupTimeout);

  while (Date.now() < deadline) {
    const res = get('/swagger/index.html', { name: 'health_probe' });
    if (res.status >= 200 && res.status < 500) {
      return;
    }
    sleep(1);
  }

  throw new Error(`API did not become reachable at ${ENV.baseUrl}`);
}

function durationToMs(value) {
  const match = String(value).match(/^(\d+)(ms|s|m)$/);
  if (!match) {
    return 120000;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  if (unit === 'ms') return amount;
  if (unit === 's') return amount * 1000;
  return amount * 60 * 1000;
}
