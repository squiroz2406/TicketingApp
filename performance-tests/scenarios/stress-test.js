import { sleep } from 'k6';
import { ENV, virtualUserId } from '../config/env.js';
import { stressThresholds } from '../config/thresholds.js';
import { prepareDataset } from '../helpers/discovery.js';
import { post } from '../helpers/http.js';
import { pick, randomInt, sample } from '../helpers/random.js';
import { buildSummary } from '../helpers/reporter.js';
import { validateReservationResponse } from '../helpers/validators.js';

export const options = {
  scenarios: {
    stress_reservations: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: Math.round(ENV.stressMaxVus * 0.25) },
        { duration: '3m', target: Math.round(ENV.stressMaxVus * 0.50) },
        { duration: '3m', target: Math.round(ENV.stressMaxVus * 0.75) },
        { duration: '3m', target: ENV.stressMaxVus },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: stressThresholds,
};

export function setup() {
  return prepareDataset({ requireSeats: ENV.maxSeatsPerReservation });
}

export default function (data) {
  const bucket = pick(data.seatsByEvent);
  const seats = sample(bucket.seats, randomInt(1, Math.min(ENV.maxSeatsPerReservation, bucket.seats.length)));
  const res = post(ENV.reservationsPath, {
    SeatIds: seats.map((seat) => seat.id),
    UserId: virtualUserId(),
  }, {
    name: 'stress_reserve',
    event_id: String(bucket.event.id),
  });

  validateReservationResponse(res);
  sleep(randomInt(0, 2));
}

export function handleSummary(data) {
  return buildSummary(data, 'stress-test');
}
