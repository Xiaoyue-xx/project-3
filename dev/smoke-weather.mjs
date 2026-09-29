import { deriveRecommendationCore } from "../scripts/recommendation.js";
import { fetchForecast, searchUsLocations } from "../scripts/weather-service.js";

const cityQueries = ["New York, NY", "Austin, TX", "Seattle, WA"];

for (const query of cityQueries) {
  const [location] = await searchUsLocations(query, { count: 3 });
  if (!location) throw new Error(`No US location result for ${query}`);
  const forecast = await fetchForecast(location);
  if (forecast.days.length !== 7) throw new Error(`Expected seven days for ${query}`);
  const recommendation = deriveRecommendationCore(forecast.days[0]);
  console.log([
    location.label,
    forecast.location.timezone,
    `${forecast.days.length} days`,
    `recommendation: ${recommendation.status}`,
  ].join(" | "));
}
