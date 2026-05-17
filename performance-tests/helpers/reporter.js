import { ENV } from '../config/env.js';

export function buildSummary(data, scenarioName) {
  const prefix = `${ENV.reportPrefix}-${scenarioName}`;
  return {
    stdout: textSummary(data, scenarioName),
    [`performance-tests/reports/${prefix}-summary.json`]: JSON.stringify(data, null, 2),
    [`performance-tests/reports/${prefix}-report.html`]: htmlSummary(data, scenarioName),
  };
}

function textSummary(data, scenarioName) {
  const m = data.metrics;
  return [
    '',
    `TicketingApp k6 summary: ${scenarioName}`,
    `http_req_duration p95: ${valueOf(m.http_req_duration, 'p(95)')} ms`,
    `http_req_duration p99: ${valueOf(m.http_req_duration, 'p(99)')} ms`,
    `http_req_failed rate: ${rateOf(m.http_req_failed)}`,
    `reservation_successes: ${countOf(m.reservation_successes)}`,
    `reservation_conflicts: ${countOf(m.reservation_conflicts)}`,
    `unexpected_status rate: ${rateOf(m.unexpected_status)}`,
    `invalid_json: ${countOf(m.invalid_json)}`,
    '',
  ].join('\n');
}

function htmlSummary(data, scenarioName) {
  const rows = Object.entries(data.metrics)
    .filter(([, metric]) => metric.values)
    .map(([name, metric]) => `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(JSON.stringify(metric.values))}</td></tr>`)
    .join('\n');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>TicketingApp k6 - ${escapeHtml(scenarioName)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #1f2937; }
    h1 { margin-bottom: 4px; }
    .meta { color: #6b7280; margin-bottom: 24px; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; vertical-align: top; }
    th { background: #f3f4f6; text-align: left; }
    td:first-child { width: 260px; font-weight: 600; }
    code { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>TicketingApp k6 - ${escapeHtml(scenarioName)}</h1>
  <div class="meta">Base URL: ${escapeHtml(ENV.baseUrl)} | generado: ${new Date().toISOString()}</div>
  <table>
    <thead><tr><th>Métrica</th><th>Valores</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

function valueOf(metric, key) {
  return !metric || !metric.values || metric.values[key] === undefined ? 'n/a' : metric.values[key].toFixed(2);
}

function countOf(metric) {
  return metric && metric.values && metric.values.count !== undefined ? metric.values.count : 0;
}

function rateOf(metric) {
  if (!metric || !metric.values || metric.values.rate === undefined) return 'n/a';
  return `${(metric.values.rate * 100).toFixed(2)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
