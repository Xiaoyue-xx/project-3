import assert from "node:assert/strict";
import test from "node:test";

import {
  buildForecastRowModel,
  buildStatusPresentation,
  convertForecastTemperature,
  displayTemperature,
  formatForecastDate,
} from "../scripts/render.js";
import { forecastFixture } from "./fixtures/open-meteo.js";
import { normalizeForecastResponse } from "../scripts/weather-service.js";

const forecast = normalizeForecastResponse(forecastFixture);

test("date formatting preserves provider-local calendar dates", () => {
  assert.equal(formatForecastDate("2026-09-28", "weekday"), "Mon");
  assert.equal(formatForecastDate("2026-09-28", "short"), "Sep 28");
  assert.match(formatForecastDate("2026-09-28"), /Monday, Sep 28/);
  assert.equal(formatForecastDate(null), "Date unavailable");
});

test("forecast temperature formatting supports both approved unit systems", () => {
  assert.equal(convertForecastTemperature(68, "fahrenheit"), 68);
  assert.equal(convertForecastTemperature(68, "celsius"), 20);
  assert.equal(displayTemperature(20.4, "°C"), "20°C");
  assert.equal(displayTemperature(null, "°F"), "—");
});

test("forecast rows derive icon and condition from the shared recommendation rules", () => {
  const rainyDay = forecast.days[1];
  const model = buildForecastRowModel(rainyDay, "fahrenheit", rainyDay.date);
  assert.equal(model.condition, "Light rain");
  assert.equal(model.iconId, "weather-rain");
  assert.equal(model.high, "68°F");
  assert.equal(model.low, "54°F");
  assert.equal(model.selected, true);
});

test("long unavailable forecast values have explicit fallbacks", () => {
  const day = {
    date: "2026-10-05",
    hourly: [],
    daily: {
      weatherCode: null,
      temperatureMaxF: null,
      temperatureMinF: null,
    },
  };
  const model = buildForecastRowModel(day, "celsius", "2026-10-04");
  assert.equal(model.condition, "Conditions unavailable");
  assert.equal(model.high, "—");
  assert.equal(model.low, "—");
  assert.equal(model.selected, false);
});

function statusState(request, recommendationStatus = request.status) {
  return {
    activeLocation: { label: "Austin, Texas" },
    request,
    recommendation: { status: recommendationStatus },
  };
}

test("loading and slow requests have distinct announced presentations", () => {
  const loading = buildStatusPresentation(statusState({ status: "loading", errorCode: null }));
  const slow = buildStatusPresentation(statusState({ status: "slow", errorCode: null }));
  assert.equal(loading.status, "loading");
  assert.equal(loading.busy, true);
  assert.match(loading.message, /Austin, Texas/);
  assert.equal(slow.status, "slow");
  assert.match(slow.title, /Still connecting/);
  assert.notEqual(slow.iconId, loading.iconId);
});

test("offline, timeout, provider, and malformed responses have distinct recovery copy", () => {
  const errors = ["timeout", "network", "service", "invalid-response"].map((errorCode) => (
    buildStatusPresentation(statusState({ status: "error", errorCode }))
  ));
  assert.equal(new Set(errors.map(({ title }) => title)).size, 4);
  assert.ok(errors.every(({ retry }) => retry));

  const offline = buildStatusPresentation(
    statusState({ status: "error", errorCode: "network" }),
    { online: false },
  );
  assert.equal(offline.status, "offline");
  assert.match(offline.title, /offline/);
});

test("missing selected-day data never invents an outfit", () => {
  const missing = buildStatusPresentation(
    statusState({ status: "ready", errorCode: null }, "missing-data"),
  );
  assert.equal(missing.status, "missing-data");
  assert.equal(missing.busy, false);
  assert.equal(missing.retry, true);
  assert.match(missing.message, /not provide enough/);
});
