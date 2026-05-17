import { Counter, Rate, Trend } from 'k6/metrics';

export const reservationSuccesses = new Counter('reservation_successes');
export const reservationConflicts = new Counter('reservation_conflicts');
export const overbookingDetected = new Counter('overbooking_detected');
export const invalidJson = new Counter('invalid_json');
export const unexpectedStatus = new Rate('unexpected_status');
export const inconsistentResponses = new Counter('inconsistent_responses');
export const timeoutsOrNetworkErrors = new Rate('timeouts_or_network_errors');
export const businessConflicts = new Rate('business_conflicts');
export const reservationLatency = new Trend('reservation_latency', true);
export const setupLatency = new Trend('setup_latency', true);
