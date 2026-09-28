import assert from "node:assert/strict";
import test from "node:test";

import {
  MODIFIER_TYPES,
  activeReminderTypes,
  categorizeApparentTemperature,
  deriveModifiers,
  deriveRecommendationCore,
  mapWmoCondition,
  normalizeWeatherDay,
  representativeApparentTemperature,
} from "../scripts/recommendation.js";
import {
  categoryBoundaryFixtures,
  partialWeatherFixtures,
  weatherFixture,
} from "./fixtures/weather.js";

test("temperature categories honor every unrounded Fahrenheit boundary", () => {
  for (const [temperature, expected] of categoryBoundaryFixtures) {
    assert.equal(categorizeApparentTemperature(temperature), expected, `${temperature}°F`);
  }
  assert.equal(categorizeApparentTemperature(Number.NaN), null);
});

test("the representative temperature is the local 08:00–18:00 median", () => {
  const fixture = weatherFixture({
    hourly: [
      { hour: 7, apparentTemperatureF: -100 },
      { hour: 8, apparentTemperatureF: 80 },
      { hour: 10, apparentTemperatureF: 60 },
      { hour: 12, apparentTemperatureF: null },
      { hour: 16, apparentTemperatureF: 70 },
      { hour: 18, apparentTemperatureF: 90 },
      { hour: 19, apparentTemperatureF: 200 },
    ],
  });

  assert.deepEqual(representativeApparentTemperature(fixture), {
    valueF: 75,
    source: "daytime-median",
  });
});

test("representative temperature follows both documented fallbacks", () => {
  assert.deepEqual(representativeApparentTemperature(partialWeatherFixtures.dailyMean), {
    valueF: 57,
    source: "daily-mean",
  });
  assert.deepEqual(representativeApparentTemperature(partialWeatherFixtures.minMaxMean), {
    valueF: 50,
    source: "daily-min-max-mean",
  });
  assert.equal(representativeApparentTemperature(partialWeatherFixtures.missing), null);
});

test("normalization rejects malformed and infinite provider values", () => {
  const normalized = normalizeWeatherDay({
    hourly: [
      { time: "invalid", apparentTemperatureF: 60 },
      { hour: 12, apparentTemperatureF: Infinity },
    ],
    daily: { weatherCode: "61", windSpeedMaxMph: Number.NaN },
  });

  assert.deepEqual(normalized.hourly, [
    { hour: null, apparentTemperatureF: 60 },
    { hour: 12, apparentTemperatureF: null },
  ]);
  assert.equal(normalized.daily.weatherCode, null);
  assert.equal(normalized.daily.windSpeedMaxMph, null);
});

test("WMO mapping covers clear, cloud, fog, rain, snow, and thunderstorm families", () => {
  const supportedCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67,
    71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
  ];
  for (const code of supportedCodes) {
    assert.notEqual(mapWmoCondition(code).id, "unknown", `WMO code ${code}`);
  }

  const expectations = [
    [0, "clear", false, false, false],
    [2, "partly-cloudy", false, false, false],
    [45, "fog", false, false, false],
    [51, "drizzle-light", true, false, false],
    [67, "freezing-rain-heavy", true, false, false],
    [82, "rain-showers-heavy", true, false, false],
    [71, "snow-light", false, true, false],
    [86, "snow-showers-heavy", false, true, false],
    [95, "thunderstorm", false, false, true],
    [99, "thunderstorm-hail-heavy", false, false, true],
  ];

  for (const [code, id, rain, snow, thunderstorm] of expectations) {
    const condition = mapWmoCondition(code);
    assert.equal(condition.id, id);
    assert.equal(condition.hasRain, rain);
    assert.equal(condition.hasSnow, snow);
    assert.equal(condition.hasThunderstorm, thunderstorm);
  }
  assert.equal(mapWmoCondition(999).id, "unknown");
  assert.equal(mapWmoCondition(null).id, "unknown");
});

test("each modifier activates alone at its exact threshold", () => {
  const fixtures = {
    rain: weatherFixture({ daily: { precipitationProbabilityMax: 40 } }),
    snow: weatherFixture({ daily: { snowfallInches: 0.01 } }),
    wind: weatherFixture({ daily: { windSpeedMaxMph: 20 } }),
    uv: weatherFixture({ daily: { uvIndexMax: 3 } }),
    hydration: weatherFixture({
      daily: { apparentTemperatureMinF: 71, apparentTemperatureMaxF: 85 },
    }),
    layers: weatherFixture({
      daily: { apparentTemperatureMinF: 50, apparentTemperatureMaxF: 65 },
    }),
    thunderstorm: weatherFixture({ daily: { weatherCode: 95 } }),
  };

  for (const type of MODIFIER_TYPES) {
    const modifiers = deriveModifiers(fixtures[type]);
    for (const comparedType of MODIFIER_TYPES) {
      assert.equal(modifiers[comparedType], comparedType === type, `${type} vs ${comparedType}`);
    }
  }
});

test("wind also activates at the gust threshold and weather codes activate precipitation", () => {
  assert.equal(deriveModifiers(weatherFixture({ daily: { windGustMaxMph: 25 } })).wind, true);
  assert.equal(deriveModifiers(weatherFixture({ daily: { weatherCode: 61 } })).rain, true);
  assert.equal(deriveModifiers(weatherFixture({ daily: { weatherCode: 71 } })).snow, true);
});

test("values immediately below modifier thresholds stay inactive", () => {
  const modifiers = deriveModifiers(weatherFixture({
    daily: {
      precipitationProbabilityMax: 39.999,
      snowfallInches: 0,
      windSpeedMaxMph: 19.999,
      windGustMaxMph: 24.999,
      uvIndexMax: 2.999,
      apparentTemperatureMinF: 70.001,
      apparentTemperatureMaxF: 84.999,
      weatherCode: 0,
    },
  }));

  assert.deepEqual(modifiers, {
    rain: false,
    snow: false,
    wind: false,
    uv: false,
    hydration: false,
    layers: false,
    thunderstorm: false,
  });
});

test("all modifiers combine without suppressing their rule state", () => {
  const result = deriveRecommendationCore(weatherFixture({
    daily: {
      precipitationProbabilityMax: 90,
      snowfallInches: 1,
      windSpeedMaxMph: 25,
      windGustMaxMph: 35,
      uvIndexMax: 7,
      apparentTemperatureMinF: 60,
      apparentTemperatureMaxF: 90,
      weatherCode: 95,
    },
  }));

  assert.deepEqual(result.modifiers, Object.fromEntries(MODIFIER_TYPES.map((type) => [type, true])));
  assert.equal(result.weatherIconId, "weather-thunderstorm");
  assert.deepEqual(result.reminderTypes, [
    "thunderstorm", "snow", "wind", "uv", "hydration", "layers",
  ]);
});

test("snow replaces only the generic rain reminder and icon", () => {
  const modifiers = {
    rain: true,
    snow: true,
    wind: false,
    uv: false,
    hydration: false,
    layers: false,
    thunderstorm: false,
  };
  const result = deriveRecommendationCore(weatherFixture({
    daily: { precipitationProbabilityMax: 80, snowfallInches: 1 },
  }));

  assert.deepEqual(activeReminderTypes(modifiers), ["snow"]);
  assert.equal(result.weatherIconId, "weather-snow");
  assert.equal(result.modifiers.rain, true);
});

test("thunderstorm adds a warning without suppressing rain, wind, or layers", () => {
  const result = deriveRecommendationCore(weatherFixture({
    daily: {
      weatherCode: 95,
      precipitationProbabilityMax: 60,
      windSpeedMaxMph: 20,
      apparentTemperatureMinF: 50,
      apparentTemperatureMaxF: 70,
    },
  }));

  assert.deepEqual(result.reminderTypes, ["thunderstorm", "rain", "wind", "layers"]);
});

test("missing representative temperature returns an explicit serializable state", () => {
  const result = deriveRecommendationCore(partialWeatherFixtures.missing);

  assert.equal(result.status, "missing-data");
  assert.equal(result.reason, "apparent-temperature-unavailable");
  assert.equal(result.category, null);
  assert.equal(result.modifiers, null);
  assert.deepEqual(result.reminderTypes, []);
  assert.doesNotThrow(() => JSON.stringify(result));
});

test("a ready result keeps category, condition, modifiers, icon, and reminders together", () => {
  const result = deriveRecommendationCore(weatherFixture({
    hourly: [
      { hour: 8, apparentTemperatureF: 85 },
      { hour: 12, apparentTemperatureF: 86 },
      { hour: 18, apparentTemperatureF: 87 },
    ],
    daily: { weatherCode: 80, precipitationProbabilityMax: null },
  }));

  assert.equal(result.status, "ready");
  assert.equal(result.category, "hot");
  assert.equal(result.condition.id, "rain-showers-light");
  assert.equal(result.modifiers.rain, true);
  assert.equal(result.weatherIconId, "weather-rain");
  assert.deepEqual(result.reminderTypes, ["rain"]);
});
