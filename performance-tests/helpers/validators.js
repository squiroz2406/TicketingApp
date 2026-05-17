import { check } from 'k6';
import {
  businessConflicts,
  inconsistentResponses,
  invalidJson,
  reservationConflicts,
  reservationLatency,
  reservationSuccesses,
  unexpectedStatus,
} from './metrics.js';
import { parseJson } from './http.js';

const CONFLICT_STATUSES = [400, 409];

export function validateReservationResponse(res, { sameSeat = false } = {}) {
  reservationLatency.add(res.timings.duration);

  const statusIsExpected = res.status === 200 || CONFLICT_STATUSES.includes(res.status);
  unexpectedStatus.add(!statusIsExpected);

  const body = parseJson(res, invalidJson);
  const ok = check(res, {
    'reservation returned expected HTTP status': () => statusIsExpected,
    'reservation response is valid JSON': () => body !== null,
  });

  if (!ok || !body) {
    inconsistentResponses.add(1);
    return { success: false, conflict: false, body };
  }

  const success = res.status === 200 && body.success === true && Boolean(body.reservationId);
  const conflict = CONFLICT_STATUSES.includes(res.status) && body.success === false;

  if (success) {
    reservationSuccesses.add(1);
  }

  if (conflict) {
    reservationConflicts.add(1);
    businessConflicts.add(true);
  } else {
    businessConflicts.add(false);
  }

  if (!success && !conflict) {
    inconsistentResponses.add(1);
  }

  if (sameSeat) {
    check(res, {
      'same-seat attempt is success or controlled conflict': () => success || conflict,
      'successful same-seat response includes reservationId': () => !success || Boolean(body.reservationId),
    });
  }

  return { success, conflict, body };
}
