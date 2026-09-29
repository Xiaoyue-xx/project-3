const dates = [
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
];

const hourlyTimes = dates.flatMap((date) => (
  Array.from({ length: 24 }, (_, hour) => `${date}T${String(hour).padStart(2, "0")}:00`)
));

export const geocodingFixture = Object.freeze({
  results: [
    {
      id: 5128581,
      name: "New York",
      latitude: 40.71427,
      longitude: -74.00597,
      country_code: "US",
      admin1: "New York",
      timezone: "America/New_York",
    },
    {
      id: 2950159,
      name: "Berlin",
      latitude: 52.52437,
      longitude: 13.41053,
      country_code: "DE",
      admin1: "Berlin",
      timezone: "Europe/Berlin",
    },
    { id: 1, name: "Malformed", latitude: null, longitude: -90, country_code: "US" },
  ],
});

export const forecastFixture = Object.freeze({
  latitude: 40.710335,
  longitude: -73.99307,
  elevation: 32,
  utc_offset_seconds: -14400,
  timezone: "America/New_York",
  timezone_abbreviation: "GMT-4",
  current: {
    time: "2026-09-28T12:15",
    temperature_2m: 72.4,
    apparent_temperature: 73.1,
    weather_code: 1,
    is_day: 1,
    wind_speed_10m: 8.2,
  },
  hourly: {
    time: hourlyTimes,
    apparent_temperature: hourlyTimes.map((_, index) => 55 + (index % 24) * 0.8),
  },
  daily: {
    time: dates,
    weather_code: [1, 61, 2, 0, 3, 80, 0],
    temperature_2m_max: [75, 68, 72, 78, 65, 61, 73],
    temperature_2m_min: [58, 54, 56, 60, 48, 45, 55],
    apparent_temperature_max: [76, 67, 73, 80, 64, 59, 74],
    apparent_temperature_mean: [66, 60, 64, 69, 56, 52, 64],
    apparent_temperature_min: [56, 52, 54, 58, 46, 43, 53],
    precipitation_probability_max: [10, 70, 20, 5, 25, 80, 5],
    precipitation_sum: [0, 0.3, 0, 0, 0, 0.5, 0],
    snowfall_sum: [0, 0, 0, 0, 0, 0, 0],
    uv_index_max: [4, 2, 3, 5, 2, 1, 4],
    wind_speed_10m_max: [12, 18, 10, 9, 21, 17, 8],
    wind_gusts_10m_max: [18, 26, 17, 15, 32, 28, 12],
  },
});

export const partialForecastFixture = Object.freeze({
  latitude: 47.606,
  longitude: -122.332,
  timezone: "America/Los_Angeles",
  hourly: {
    time: ["2026-09-28T12:00"],
    apparent_temperature: [null],
  },
  daily: {
    time: ["2026-09-28"],
    weather_code: [null],
    temperature_2m_max: [61],
    temperature_2m_min: [50],
  },
});

export function jsonResponse(payload, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => payload };
}
