import assert from "node:assert/strict";
import test from "node:test";

import { deriveRecommendationCore } from "../scripts/recommendation.js";
import {
  FORECAST_FIELDS,
  WeatherServiceError,
  buildForecastUrl,
  buildGeocodingUrl,
  fetchForecast,
  normalizeForecastResponse,
  normalizeGeocodingResponse,
  requestJson,
  searchUsLocations,
} from "../scripts/weather-service.js";
import {
  forecastFixture,
  geocodingFixture,
  jsonResponse,
  partialForecastFixture,
} from "./fixtures/open-meteo.js";

function abortableDelay(payload, delayMs) {
  return (_url, { signal }) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(jsonResponse(payload)), delayMs);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

test("geocoding URLs trim input and enforce the US country filter", () => {
  const url = buildGeocodingUrl("  New York, NY  ", 6);
  assert.equal(url.origin, "https://geocoding-api.open-meteo.com");
  assert.equal(url.searchParams.get("name"), "New York, NY");
  assert.equal(url.searchParams.get("count"), "6");
  assert.equal(url.searchParams.get("countryCode"), "US");
  assert.equal(buildGeocodingUrl("N"), null);
});

test("geocoding normalization keeps only valid US results", () => {
  assert.deepEqual(normalizeGeocodingResponse(geocodingFixture), [{
    id: 5128581,
    name: "New York",
    admin1: "New York",
    countryCode: "US",
    latitude: 40.71427,
    longitude: -74.00597,
    timezone: "America/New_York",
    label: "New York, New York",
  }]);
  assert.deepEqual(normalizeGeocodingResponse({}), []);
});

test("short and empty location searches return no results without fetching", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse({});
  };
  assert.deepEqual(await searchUsLocations("", { fetchImpl }), []);
  assert.deepEqual(await searchUsLocations("A", { fetchImpl }), []);
  assert.equal(calls, 0);
});

test("location search returns an explicit empty result array", async () => {
  const results = await searchUsLocations("No Such Place", {
    fetchImpl: async () => jsonResponse({ results: [] }),
  });
  assert.deepEqual(results, []);
});

test("forecast URLs request the approved fields, units, timezone, and seven days", () => {
  const url = buildForecastUrl({ latitude: 40.7128, longitude: -74.006 });
  assert.equal(url.origin, "https://api.open-meteo.com");
  assert.deepEqual(url.searchParams.get("current").split(","), [...FORECAST_FIELDS.current]);
  assert.deepEqual(url.searchParams.get("hourly").split(","), [...FORECAST_FIELDS.hourly]);
  assert.deepEqual(url.searchParams.get("daily").split(","), [...FORECAST_FIELDS.daily]);
  assert.equal(url.searchParams.get("temperature_unit"), "fahrenheit");
  assert.equal(url.searchParams.get("wind_speed_unit"), "mph");
  assert.equal(url.searchParams.get("precipitation_unit"), "inch");
  assert.equal(url.searchParams.get("timezone"), "auto");
  assert.equal(url.searchParams.get("forecast_days"), "7");
});

test("forecast normalization produces seven local days and current conditions", () => {
  const forecast = normalizeForecastResponse(forecastFixture);
  assert.equal(forecast.location.timezone, "America/New_York");
  assert.equal(forecast.location.elevationMeters, 32);
  assert.equal(forecast.current.apparentTemperatureF, 73.1);
  assert.equal(forecast.days.length, 7);
  assert.equal(forecast.days[0].hourly.length, 24);
  assert.equal(forecast.days[0].hourly[8].time, "2026-09-28T08:00");
  assert.equal(forecast.days[1].daily.precipitationProbabilityMax, 70);
  assert.equal(forecast.days[4].daily.windSpeedMaxMph, 21);
});

test("partial forecasts normalize missing values without inventing a recommendation", () => {
  const forecast = normalizeForecastResponse(partialForecastFixture);
  assert.equal(forecast.days[0].daily.apparentTemperatureMeanF, null);
  assert.equal(forecast.days[0].daily.uvIndexMax, null);
  const recommendation = deriveRecommendationCore(forecast.days[0]);
  assert.equal(recommendation.status, "missing-data");
  assert.equal(recommendation.reason, "apparent-temperature-unavailable");
});

test("fetchForecast attaches provider metadata without changing normalized values", async () => {
  const forecast = await fetchForecast({ latitude: 40.7128, longitude: -74.006 }, {
    fetchImpl: async () => jsonResponse(forecastFixture),
    now: () => "2026-09-28T18:00:00.000Z",
  });
  assert.deepEqual(forecast.source, {
    provider: "Open-Meteo",
    fetchedAt: "2026-09-28T18:00:00.000Z",
  });
  assert.equal(forecast.days.length, 7);
});

test("slow requests announce once but still resolve", async () => {
  let slowAnnouncements = 0;
  const payload = await requestJson(new URL("https://example.test/slow"), {
    fetchImpl: abortableDelay({ ok: true }, 25),
    slowMs: 5,
    timeoutMs: 100,
    onSlow: () => { slowAnnouncements += 1; },
  });
  assert.deepEqual(payload, { ok: true });
  assert.equal(slowAnnouncements, 1);
});

test("fast requests clear the slow timer", async () => {
  let slowAnnouncements = 0;
  await requestJson(new URL("https://example.test/fast"), {
    fetchImpl: async () => jsonResponse({ ok: true }),
    slowMs: 20,
    timeoutMs: 100,
    onSlow: () => { slowAnnouncements += 1; },
  });
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(slowAnnouncements, 0);
});

test("requests abort at the timeout with a typed error", async () => {
  await assert.rejects(
    requestJson(new URL("https://example.test/timeout"), {
      fetchImpl: abortableDelay({}, 100),
      slowMs: 5,
      timeoutMs: 15,
    }),
    (error) => error instanceof WeatherServiceError && error.code === "timeout",
  );
});

test("caller cancellation remains distinct from timeout", async () => {
  const controller = new AbortController();
  const request = requestJson(new URL("https://example.test/abort"), {
    fetchImpl: abortableDelay({}, 100),
    signal: controller.signal,
    slowMs: 50,
    timeoutMs: 200,
  });
  controller.abort("new-location-selected");
  await assert.rejects(
    request,
    (error) => error instanceof WeatherServiceError && error.code === "aborted",
  );
});

test("HTTP, provider, invalid JSON, and network failures have stable error codes", async () => {
  await assert.rejects(
    requestJson(new URL("https://example.test/http"), {
      fetchImpl: async () => jsonResponse({}, { ok: false, status: 503 }),
    }),
    (error) => error.code === "service" && error.status === 503,
  );
  await assert.rejects(
    requestJson(new URL("https://example.test/provider"), {
      fetchImpl: async () => jsonResponse({ error: true, reason: "Invalid request" }),
    }),
    (error) => error.code === "service" && error.message === "Invalid request",
  );
  await assert.rejects(
    requestJson(new URL("https://example.test/json"), {
      fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new Error(); } }),
    }),
    (error) => error.code === "invalid-response",
  );
  await assert.rejects(
    requestJson(new URL("https://example.test/network"), {
      fetchImpl: async () => { throw new TypeError("offline"); },
    }),
    (error) => error.code === "network",
  );
});

test("malformed forecast responses fail clearly", () => {
  assert.throws(
    () => normalizeForecastResponse({ daily: {} }),
    (error) => error instanceof WeatherServiceError && error.code === "invalid-response",
  );
  assert.throws(() => buildForecastUrl({ latitude: 100, longitude: 0 }), RangeError);
});
