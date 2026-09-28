export function weatherFixture(overrides = {}) {
  const defaultHourly = [
    { time: "2026-09-28T08:00", apparentTemperatureF: 60 },
    { time: "2026-09-28T12:00", apparentTemperatureF: 62 },
    { time: "2026-09-28T18:00", apparentTemperatureF: 64 },
  ];

  return {
    ...overrides,
    date: overrides.date ?? "2026-09-28",
    hourly: overrides.hourly ?? defaultHourly,
    daily: {
      apparentTemperatureMeanF: 62,
      apparentTemperatureMinF: 58,
      apparentTemperatureMaxF: 68,
      precipitationProbabilityMax: 0,
      snowfallInches: 0,
      uvIndexMax: 0,
      windSpeedMaxMph: 0,
      windGustMaxMph: 0,
      weatherCode: 0,
      ...overrides.daily,
    },
  };
}

export const categoryBoundaryFixtures = [
  [39.999, "cold"],
  [40, "chilly"],
  [54.999, "chilly"],
  [55, "comfortable"],
  [69.999, "comfortable"],
  [70, "warm"],
  [84.999, "warm"],
  [85, "hot"],
];

export const partialWeatherFixtures = {
  dailyMean: weatherFixture({
    hourly: [
      { hour: 9, apparentTemperatureF: 50 },
      { hour: 15, apparentTemperatureF: 60 },
    ],
    daily: { apparentTemperatureMeanF: 57 },
  }),
  minMaxMean: weatherFixture({
    hourly: [{ hour: 12, apparentTemperatureF: 60 }],
    daily: {
      apparentTemperatureMeanF: null,
      apparentTemperatureMinF: 40,
      apparentTemperatureMaxF: 60,
    },
  }),
  missing: weatherFixture({
    hourly: [{ hour: 12, apparentTemperatureF: null }],
    daily: {
      apparentTemperatureMeanF: null,
      apparentTemperatureMinF: null,
      apparentTemperatureMaxF: null,
    },
  }),
};
