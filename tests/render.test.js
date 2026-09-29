import assert from "node:assert/strict";
import test from "node:test";

import {
  buildForecastRowModel,
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
