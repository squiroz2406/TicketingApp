import { sleep } from 'k6';
import { ENV, virtualUserId } from '../config/env.js';
import { spikeThresholds } from '../config/thresholds.js';
import { prepareDataset } from '../helpers/discovery.js';
import { post } from '../helpers/http.js';
import { pick, randomInt, sample } from '../helpers/random.js';
import { buildSummary } from '../helpers/reporter.js';
import { validateReservationResponse } from '../helpers/validators.js';

export const options = {
  scenarios: {
    spike_reservations: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: ENV.spikeNormalVus },
        { duration: '10s', target: ENV.spikePeakVus },
        { duration: '2m', target: ENV.spikePeakVus },
        { duration: '10s', target: ENV.spikeNormalVus },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
  },
  thresholds: spikeThresholds,
};

export function setup() {
  return prepareDataset({ requireSeats: ENV.maxSeatsPerReservation });
}

export default function (data) {
  const bucket = pick(data.seatsByEvent);
  const seats = sample(bucket.seats, randomInt(1, Math.min(3, bucket.seats.length)));
  const res = post(ENV.reservationsPath, {
    SeatIds: seats.map((seat) => seat.id),
    UserId: virtualUserId(),
  }, {
    name: 'spike_reserve',
    event_id: String(bucket.event.id),
  });

  validateReservationResponse(res);
  sleep(randomInt(1, 2));
}

export function handleSummary(data) {
  return buildSummary(data, 'spike-test');
}
