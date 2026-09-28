# Data

Provider responses will be normalized into the internal shape defined by
`scripts/recommendation.js`. Recommendation rules always consume Fahrenheit,
miles per hour, local provider timestamps, and inches of snowfall. Display-unit
conversion is deliberately kept outside the rules so changing units cannot
change the selected recommendation.

Deterministic test fixtures live in `tests/fixtures/`; live provider responses
must not be committed here.

This directory will contain application-owned content manifests. Live weather
responses and precise device locations must not be committed.
