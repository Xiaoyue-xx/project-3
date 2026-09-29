import assert from "node:assert/strict";
import test from "node:test";

import { STORAGE_KEY, loadPersistedSettings } from "../scripts/persistence.js";
import { createAppStore } from "../scripts/state.js";
import { normalizeForecastResponse } from "../scripts/weather-service.js";
import { forecastFixture } from "./fixtures/open-meteo.js";

class MemoryStorage {
  constructor() {
    this.values = new Map();
    this.writes = 0;
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.writes += 1;
    this.values.set(key, value);
  }
}

const locations = [
  {
    id: 5128581,
    name: "New York",
    label: "New York, New York",
    admin1: "New York",
    countryCode: "US",
    latitude: 40.71427,
    longitude: -74.00597,
    timezone: "America/New_York",
  },
  {
    id: 4671654,
    name: "Austin",
    label: "Austin, Texas",
    admin1: "Texas",
    countryCode: "US",
    latitude: 30.26715,
    longitude: -97.74306,
    timezone: "America/Chicago",
  },
  {
    id: 5809844,
    name: "Seattle",
    label: "Seattle, Washington",
    admin1: "Washington",
    countryCode: "US",
    latitude: 47.60621,
    longitude: -122.33207,
    timezone: "America/Los_Angeles",
  },
];

function forecastFor(location, sourceSuffix = "fixture") {
  const normalized = normalizeForecastResponse({
    ...forecastFixture,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  });
  return Object.freeze({
    ...normalized,
    source: Object.freeze({
      provider: "Open-Meteo",
      fetchedAt: `2026-09-28T18:00:00.000Z-${sourceSuffix}`,
    }),
  });
}

test("the store starts with approved defaults and one serializable recommendation state", () => {
  const store = createAppStore({ storage: new MemoryStorage() });
  const state = store.getState();
  assert.equal(state.units, "fahrenheit");
  assert.deepEqual(state.preferences, { character: "female", style: "campus-casual" });
  assert.equal(state.recommendation.status, "idle");
  assert.doesNotThrow(() => JSON.stringify(state));
});

test("three sequential locations persist only the latest approved fields", async () => {
  const storage = new MemoryStorage();
  let fetchCount = 0;
  const store = createAppStore({
    storage,
    fetchForecastImpl: async (location) => {
      fetchCount += 1;
      return forecastFor(location, fetchCount);
    },
  });

  for (const location of locations) await store.selectLocation(location);
  assert.equal(fetchCount, 3);
  assert.equal(store.getState().activeLocation.label, "Seattle, Washington");

  const persisted = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.deepEqual(Object.keys(persisted).sort(), [
    "character", "latestLocation", "style", "units", "version",
  ]);
  assert.deepEqual(Object.keys(persisted.latestLocation).sort(), [
    "admin1", "countryCode", "id", "label", "latitude", "longitude", "name", "timezone",
  ]);
  assert.equal(persisted.latestLocation.label, "Seattle, Washington");
  assert.equal(persisted.latestLocation.latitude, 47.606);
  assert.equal(persisted.latestLocation.longitude, -122.332);
  assert.doesNotMatch(storage.getItem(STORAGE_KEY), /forecast|weather|history|favorite|selectedDate/);
});

test("a new store restores the latest location and preferences without an automatic fetch", async () => {
  const storage = new MemoryStorage();
  let fetchCount = 0;
  const firstStore = createAppStore({
    storage,
    fetchForecastImpl: async (location) => {
      fetchCount += 1;
      return forecastFor(location);
    },
  });
  await firstStore.selectLocation(locations[1]);
  firstStore.setUnits("celsius");
  firstStore.setPreferences({ character: "male", style: "streetwear" });

  const restoredStore = createAppStore({
    storage,
    fetchForecastImpl: async () => {
      fetchCount += 1;
      throw new Error("should not run during restoration");
    },
  });
  const restored = restoredStore.getState();
  assert.equal(fetchCount, 1);
  assert.equal(restored.activeLocation.label, "Austin, Texas");
  assert.equal(restored.activeLocation.latitude, 30.267);
  assert.equal(restored.units, "celsius");
  assert.deepEqual(restored.preferences, { character: "male", style: "streetwear" });
  assert.equal(restored.request.status, "idle");
});

test("unit changes convert display values without fetching or changing recommendations", async () => {
  let fetchCount = 0;
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location) => {
      fetchCount += 1;
      return forecastFor(location);
    },
  });
  await store.selectLocation(locations[0]);
  const before = store.getState().recommendation;
  store.setUnits("celsius");
  const after = store.getState().recommendation;

  assert.equal(fetchCount, 1);
  assert.equal(after.category, before.category);
  assert.equal(after.outfit.fitId, before.outfit.fitId);
  assert.deepEqual(after.reminders, before.reminders);
  assert.equal(after.weather.display.temperatureUnit, "°C");
  assert.ok(Math.abs(after.weather.display.currentTemperature - 22.4444444) < 0.0001);
  assert.equal(before.weather.display.currentTemperature, 72.4);
});

test("returning to a forecast date reproduces the exact outfit and reminder variants", async () => {
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location) => forecastFor(location),
  });
  await store.selectLocation(locations[0]);
  store.selectDate("2026-09-29");
  const firstVisit = store.getState().recommendation;
  store.selectDate("2026-10-01");
  store.selectDate("2026-09-29");
  const returnVisit = store.getState().recommendation;

  assert.equal(returnVisit.contextLabel, "Forecast");
  assert.deepEqual(returnVisit.outfit, firstVisit.outfit);
  assert.deepEqual(returnVisit.reminders, firstVisit.reminders);
});

test("the derived recommendation is the single complete render source", async () => {
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location) => forecastFor(location),
  });
  await store.selectLocation(locations[0]);
  store.selectDate("2026-09-29");
  const recommendation = store.getState().recommendation;

  assert.equal(recommendation.status, "ready");
  assert.equal(recommendation.location.label, "New York, New York");
  assert.equal(recommendation.weather.condition.id, "rain-light");
  assert.equal(recommendation.modifiers.rain, true);
  assert.equal(recommendation.weatherIconId, "weather-rain");
  assert.ok(recommendation.outfit.layers.includes("modifier-rain-shell"));
  assert.ok(recommendation.reminders.some(({ type }) => type === "rain"));
  assert.match(recommendation.recommendationText, /outfit|layer|pieces/i);
  assert.equal(recommendation.source.provider, "Open-Meteo");
});

test("loading, slow, and ready request states are published in order", async () => {
  const statuses = [];
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location, { onSlow }) => {
      onSlow();
      return forecastFor(location);
    },
  });
  store.subscribe((state) => statuses.push(state.request.status));
  await store.selectLocation(locations[0]);
  assert.deepEqual(statuses, ["loading", "slow", "ready"]);
  assert.equal(store.getState().recommendation.status, "ready");
});

test("a failed weather request can be retried without reselecting the location", async () => {
  let attempt = 0;
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location) => {
      attempt += 1;
      if (attempt === 1) {
        const error = new Error("offline");
        error.code = "network";
        throw error;
      }
      return forecastFor(location, "retry");
    },
  });

  await store.selectLocation(locations[1]);
  assert.equal(store.getState().request.status, "error");
  assert.equal(store.getState().request.errorCode, "network");
  assert.equal(store.getState().forecast, null);

  await store.refresh();
  assert.equal(attempt, 2);
  assert.equal(store.getState().request.status, "ready");
  assert.equal(store.getState().activeLocation.label, "Austin, Texas");
});

test("a stale location response cannot replace a newer selection", async () => {
  const pending = [];
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: (location) => new Promise((resolve) => pending.push({ location, resolve })),
  });
  const firstRequest = store.selectLocation(locations[0]);
  const secondRequest = store.selectLocation(locations[2]);
  pending[1].resolve(forecastFor(locations[2], "newer"));
  await secondRequest;
  pending[0].resolve(forecastFor(locations[0], "stale"));
  await firstRequest;

  assert.equal(store.getState().activeLocation.label, "Seattle, Washington");
  assert.equal(store.getState().forecast.source.fetchedAt.endsWith("newer"), true);
});

test("corrupt or unavailable storage falls back safely", () => {
  const corrupt = new MemoryStorage();
  corrupt.setItem(STORAGE_KEY, "not-json");
  assert.deepEqual(loadPersistedSettings(corrupt), {
    latestLocation: null,
    units: "fahrenheit",
    character: "female",
    style: "campus-casual",
  });

  const unavailable = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  };
  const store = createAppStore({ storage: unavailable });
  assert.equal(store.getState().recommendation.status, "idle");
  assert.doesNotThrow(() => store.setUnits("celsius"));
});

test("invalid dates, units, and preferences are rejected", async () => {
  const store = createAppStore({
    storage: new MemoryStorage(),
    fetchForecastImpl: async (location) => forecastFor(location),
  });
  await store.selectLocation(locations[0]);
  assert.throws(() => store.selectDate("2030-01-01"), RangeError);
  assert.throws(() => store.setUnits("kelvin"), RangeError);
  assert.throws(() => store.setPreferences({ character: "robot" }), RangeError);
  assert.throws(() => store.setPreferences({ style: "formal" }), RangeError);
  await assert.rejects(store.selectLocation({ name: "Invalid" }), TypeError);
});
