import { ENV } from './env.js';

const expectedSameSeatConflicts = Math.max(0, ENV.sameSeatVus - 1);

export const defaultThresholds = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<1200', 'p(99)<2500'],
  invalid_json: ['count==0'],
  unexpected_status: ['rate==0'],
  timeouts_or_network_errors: ['rate==0'],
};

export const sameSeatThresholds = Object.assign({}, defaultThresholds, {
  http_req_failed: ['rate<0.02'],
  reservation_successes: ['count==1'],
  reservation_conflicts: [`count>=${expectedSameSeatConflicts}`],
  overbooking_detected: ['count==0'],
  inconsistent_responses: ['count==0'],
  http_req_duration: ['p(95)<1500', 'p(99)<3000'],
});

export const purchaseThresholds = Object.assign({}, defaultThresholds, {
  reservation_successes: ['count>0'],
  business_conflicts: ['rate<0.35'],
  http_req_duration: ['p(95)<1500', 'p(99)<3000'],
});

export const spikeThresholds = Object.assign({}, defaultThresholds, {
  http_req_failed: ['rate<0.10'],
  http_req_duration: ['p(95)<2500', 'p(99)<5000'],
});

export const stressThresholds = {
  invalid_json: ['count==0'],
  unexpected_status: ['rate<0.20'],
  timeouts_or_network_errors: ['rate<0.10'],
  http_req_duration: ['p(95)<5000', 'p(99)<10000'],
};

export const soakThresholds = Object.assign({}, defaultThresholds, {
  http_req_failed: ['rate<0.03'],
  http_req_duration: ['p(95)<1500', 'p(99)<3000'],
});
