import { sleep } from 'k6';
import { ENV, virtualUserId } from '../config/env.js';
import { soakThresholds } from '../config/thresholds.js';
import { prepareDataset } from '../helpers/discovery.js';
import { post } from '../helpers/http.js';
import { pick, sample } from '../helpers/random.js';
import { buildSummary } from '../helpers/reporter.js';
import { validateReservationResponse } from '../helpers/validators.js';

export const options = {
  scenarios: {
    soak_reservations: {
      executor: 'constant-vus',
      vus: ENV.soakVus,
      duration: ENV.soakDuration,
      gracefulStop: '1m',
    },
  },
  thresholds: soakThresholds,
};

export function setup() {
  return prepareDataset({ requireSeats: 2 });
}

export default function (data) {
  const bucket = pick(data.seatsByEvent);
  const seats = sample(bucket.seats, Math.min(2, bucket.seats.length));
  const res = post(ENV.reservationsPath, {
    SeatIds: seats.map((seat) => seat.id),
    UserId: virtualUserId(),
  }, {
    name: 'soak_reserve',
    event_id: String(bucket.event.id),
  });

  validateReservationResponse(res);
  sleep(5);
}

export function handleSummary(data) {
  return buildSummary(data, 'soak-test');
}
