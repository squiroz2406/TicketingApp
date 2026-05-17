import http from 'k6/http';
import { ENV, authHeaders } from '../config/env.js';
import { timeoutsOrNetworkErrors } from './metrics.js';

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 299 }, 400, 409));

export function get(path, tags = {}) {
  const res = http.get(`${ENV.baseUrl}${path}`, {
    headers: authHeaders(),
    timeout: ENV.requestTimeout,
    tags,
  });

  trackTransportFailure(res);
  return res;
}

export function post(path, body, tags = {}) {
  const res = http.post(`${ENV.baseUrl}${path}`, JSON.stringify(body), {
    headers: authHeaders(),
    timeout: ENV.requestTimeout,
    tags,
  });

  trackTransportFailure(res);
  return res;
}

function trackTransportFailure(res) {
  const failed = !res || res.error || res.status === 0;
  timeoutsOrNetworkErrors.add(failed);
}

export function parseJson(res, metric) {
  try {
    return res.json();
  } catch (error) {
    metric.add(1);
    return null;
  }
}
