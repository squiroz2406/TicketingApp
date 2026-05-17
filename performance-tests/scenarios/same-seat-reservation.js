import { sleep } from 'k6';
import { ENV, virtualUserId } from '../config/env.js';
import { sameSeatThresholds } from '../config/thresholds.js';
import { prepareDataset } from '../helpers/discovery.js';
import { post } from '../helpers/http.js';
import { buildSummary } from '../helpers/reporter.js';
import { validateReservationResponse } from '../helpers/validators.js';

export const options = {
  scenarios: {
    same_seat_contention: {
      executor: 'per-vu-iterations',
      vus: ENV.sameSeatVus,
      iterations: 1,
      maxDuration: ENV.sameSeatMaxDuration,
      gracefulStop: '0s',
    },
  },
  thresholds: sameSeatThresholds,
};

export function setup() {
  return prepareDataset({ requireSeats: 1 });
}

export default function (data) {
  const waitMs = data.syncAt - Date.now();
  if (waitMs > 0) {
    sleep(waitMs / 1000);
  }

  const payload = {
    SeatIds: [data.targetSeat.id],
    UserId: virtualUserId(),
  };

  const res = post(ENV.reservationsPath, payload, {
    name: 'reserve_same_seat',
    seat_id: data.targetSeat.id,
    event_id: String(data.targetSeat.eventId),
  });

  validateReservationResponse(res, { sameSeat: true });
}

export function handleSummary(data) {
  return buildSummary(data, 'same-seat-reservation');
}
