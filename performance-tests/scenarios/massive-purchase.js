import { sleep } from 'k6';
import { ENV, virtualUserId } from '../config/env.js';
import { purchaseThresholds } from '../config/thresholds.js';
import { prepareDataset } from '../helpers/discovery.js';
import { post } from '../helpers/http.js';
import { pick, randomInt, sample } from '../helpers/random.js';
import { buildSummary } from '../helpers/reporter.js';
import { validateReservationResponse } from '../helpers/validators.js';

export const options = {
  scenarios: {
    massive_purchase: {
      executor: 'constant-vus',
      vus: ENV.purchaseVus,
      duration: ENV.purchaseDuration,
      gracefulStop: '30s',
    },
  },
  thresholds: purchaseThresholds,
};

export function setup() {
  return prepareDataset({ requireSeats: ENV.maxSeatsPerReservation });
}

export default function (data) {
  const eventBucket = pick(data.seatsByEvent);
  const seatCount = randomInt(1, Math.min(ENV.maxSeatsPerReservation, eventBucket.seats.length));
  const seats = sample(eventBucket.seats, seatCount);

  const payload = {
    SeatIds: seats.map((seat) => seat.id),
    UserId: virtualUserId(),
  };

  const res = post(ENV.reservationsPath, payload, {
    name: 'reserve_multiple_seats',
    event_id: String(eventBucket.event.id),
    seat_count: String(seatCount),
  });

  validateReservationResponse(res);
  sleep(randomInt(1, 3));
}

export function handleSummary(data) {
  return buildSummary(data, 'massive-purchase');
}
