export const ENV = {
  baseUrl: (__ENV.BASE_URL || 'http://localhost:8080').replace(/\/$/, ''),
  authToken: __ENV.AUTH_TOKEN || '',
  userId: Number(__ENV.USER_ID || 1),
  useUniqueUserIds: (__ENV.USE_UNIQUE_USER_IDS || 'false').toLowerCase() === 'true',
  resetData: (__ENV.RESET_DATA || 'true').toLowerCase() === 'true',
  seedPath: __ENV.SEED_PATH || '/api/v1/seed/seed',
  eventsPath: __ENV.EVENTS_PATH || '/api/v1/events',
  reservationsPath: __ENV.RESERVATIONS_PATH || '/api/v1/reservations',
  setupTimeout: __ENV.SETUP_TIMEOUT || '120s',
  requestTimeout: __ENV.REQUEST_TIMEOUT || '15s',
  sameSeatVus: Number(__ENV.SAME_SEAT_VUS || 1000),
  sameSeatMaxDuration: __ENV.SAME_SEAT_MAX_DURATION || '2m',
  syncDelayMs: Number(__ENV.SYNC_DELAY_MS || 5000),
  purchaseVus: Number(__ENV.PURCHASE_VUS || 200),
  purchaseDuration: __ENV.PURCHASE_DURATION || '5m',
  maxSeatsPerReservation: Number(__ENV.MAX_SEATS_PER_RESERVATION || 6),
  spikeNormalVus: Number(__ENV.SPIKE_NORMAL_VUS || 50),
  spikePeakVus: Number(__ENV.SPIKE_PEAK_VUS || 1000),
  stressMaxVus: Number(__ENV.STRESS_MAX_VUS || 1200),
  soakVus: Number(__ENV.SOAK_VUS || 100),
  soakDuration: __ENV.SOAK_DURATION || '1h',
  reportPrefix: __ENV.REPORT_PREFIX || 'ticketing',
};

export function virtualUserId() {
  return ENV.useUniqueUserIds ? ENV.userId + __VU : ENV.userId;
}

export function authHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (ENV.authToken) {
    headers.Authorization = `Bearer ${ENV.authToken}`;
  }

  return headers;
}
