# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved research, project brief, and hand-drawn screen designs into testable requirements.

## Instructions for the Developer

Make and approve the product decisions, draw every proposed screen, provide the drawings to the Agent, and keep this file current as the intended result changes.

To begin, open the project repository in a fresh chat and enter:

`Read ./spec.md and help me begin the Project 3 specification.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, and this file. Review the screen drawings the Developer provides. Ask one focused question at a time, surface gaps and trade-offs without inventing requirements, and keep the specification concise and testable.

## Goal

State what the app should help its Users accomplish and name the user story or stories that define that need.

Help a US college student quickly decide what to wear and what to carry for today or any of the next six days at a selected US location. The experience must make the recommendation visually immediate through a central character while preserving enough weather detail for the User to understand why the recommendation was made.

This goal follows the three approved user stories in `research.md`: preparing for a walk to class, checking weather for different destinations, and choosing a character presentation and clothing style that better reflect personal taste.

## Screen designs

Draw every proposed screen by hand, in both phone and laptop layouts, on paper, a tablet, a whiteboard, or another hand-drawing surface. Save photos or exports in `reference/`, provide them to the Agent, and link them here. Use the drawings to define layout, hierarchy, controls, navigation, and important interaction states.

The Developer supplied and reviewed phone and desktop sketches. Their Chinese headings are design annotations only; every production interface label and message must be in English.

- [Phone flow sketch](reference/phone-flow-sketch.png)
- [Desktop main and information/settings sketches](reference/desktop-layout-sketch.png)

The approved interpretation uses two navigable screens:

1. **Main:** Today/7-day view switch, location and date controls, live weather, central character, outfit recommendation, and carry-item reminders. Location search, character/style selection, outfit details, and carry-item details open as panels or dialogs.
2. **Information/Settings:** Units, character/style preferences, accessibility information, creator credit, weather and recommendation sources, privacy practices, and artwork credits.

An optional splash treatment may appear during startup but is not a separate navigation destination. On phone, content becomes a single-column flow with primary controls reachable without hover and comfortable one-handed targets. On laptop, the selected main layout uses three functional regions: weather and character, outfit and reminders, and seven-day forecast. The rejected alternate desktop layout must not be implemented alongside it.

## Requirements

Translate every fixed brief requirement and the selected research-driven feature into a testable requirement. Define the chosen behavior, content, controls, current and forecast data, responsive layout, accessibility, error handling, privacy, credits, and deployment. The main screen should make clear the location, date, units, data source, and whether conditions are current or forecast. Include an acceptance check for each requirement.

### R1. Live weather and location

The app must use Open-Meteo as its only provider for geocoding, current conditions, and seven-day forecast data. The User can search for a US city or region or explicitly activate “Use my location.” Search results must be restricted to US locations. Device location is requested only after a User action. If permission is denied or unavailable, the app explains what happened and keeps manual search usable.

**Acceptance check:** Search at least three US cities, select each result, and confirm that its name and fresh weather appear. Activate device location once with permission granted and once denied. Confirm that denial does not block manual search and that no other weather provider is contacted.

### R2. Date range and weather context

The app must show today and the following six local calendar days. Today displays current temperature, current apparent temperature, current condition, and the day's high/low. A future date displays forecast high/low, representative apparent temperature, condition, precipitation probability, wind, and UV when present. The main screen always names the location, selected date, unit, Open-Meteo source, and whether the displayed conditions are “Current” or “Forecast.”

**Acceptance check:** Select all seven dates at a US location and verify labels and values against the corresponding Open-Meteo response. Confirm that today is labeled Current and later dates are labeled Forecast.

### R3. Recommendation state consistency

Each selected location and date produces one recommendation state. That state must drive the character outfit, weather icon, outfit text, carry-item icons, and reminder wording. No visual or sentence may derive from a separate conflicting rule path.

**Acceptance check:** Use fixtures that trigger each base category and every modifier. Inspect the rendered icon, outfit, text, and reminders and confirm they all match the same serialized recommendation state.

### R4. Character and style preferences

The User can choose one of four hairstyle-led character looks, one of three styles (Campus Casual, Sporty, or Streetwear), and one of five skin tones. Character and skin tone are independent. Skin tone is presented as five visual swatch buttons without visible text; each swatch still has an accessible English name and selected state. Skin-tone labels describe visual tone only and do not assign race or ethnicity. Character, style, and skin-tone changes update one large character outfit preview immediately inside the open preferences dialog, while Apply preferences remains the explicit save action. All character looks and skin tones receive equivalent category coverage, variation counts, reminders, and controls. Style changes clothing shape and coordinated palette but never weakens weather-protection rules. Every look and wearable layer uses one consistent, game-inspired pixel-art construction with bold hard-edged outlines and expressive hair and facial details. The code-native SVG artwork must remain crisp at phone and laptop sizes and at 200% zoom; clothing must align to the shared body anchors without gaps, unintended overlap, or mismatched silhouettes.

**Acceptance check:** In the preferences dialog, select each of the three styles and confirm the large preview immediately shows a recognizably different outfit before Apply. Select each of the four character looks and five unlabeled skin-tone swatches and confirm the preview updates, each control exposes an accessible name and selected state, and the chosen values persist only after Apply. For all four looks and three styles, trigger all five temperature categories and confirm a complete outfit with the correct protection layers at every skin tone. Inspect all 180 assembled outfits in the development contact sheet, then render representative characters at 320×568, 390×844, and 1440×900 plus 200% zoom.

### R5. Stable independent variation

Every temperature category must provide at least three complete outfit recipes for every character/style combination. Every reminder type must provide at least three wording variations. Outfit selection and each reminder's wording selection use separate deterministic pseudo-random values. Returning to the same location, date, character, and style must reproduce the same variants after navigation and page reload without storing a history of viewed dates. Skin tone affects character rendering only and must not change the selected outfit or reminder variants.

**Acceptance check:** Record results for multiple location/date combinations, navigate away, reload, and return. Confirm exact variant stability. Across a larger fixture set, confirm that outfit and reminder indices do not always form fixed pairs and that all eligible variants can occur.

### R6. Location persistence and privacy

The app may switch among multiple searched locations during a session, but only the latest selected location persists across reloads. Persisted coordinates are rounded to three decimal places to reduce locally stored precision; active-session coordinates may retain provider precision for the current request. It must not store a favorites list, location history, precise device-position history, account, analytics identifier, or weather history. Units, character, style, and skin-tone preferences may persist locally. The information screen must explain local storage and the coordinates sent to Open-Meteo.

**Acceptance check:** Select three locations, reload, and confirm that only the last one is restored with coordinates rounded to three decimals. Inspect local storage and confirm it contains one location plus approved preferences only.

### R7. Units

Fahrenheit is the default. A clearly labeled °F/°C control converts all displayed temperatures without changing the recommendation category or refetching weather. Wind and precipitation units must remain consistent with the selected display system. Internal rules use unrounded provider values.

**Acceptance check:** Toggle units on every view and confirm correct conversions, unchanged recommendation state, no additional fetch, and persistence after reload.

### R8. Loading and failure states

The interface must provide an immediate loading state, a slower-connection message when a weather request remains unresolved for three seconds, and a clear retry action after a request error or ten-second timeout. It must separately explain offline status, denied location permission, no geocoding results, missing selected-day fields, and general service failure. Existing content must not silently masquerade as newly updated data.

**Acceptance check:** Simulate delayed, timed-out, offline, empty, partial, and failed responses plus denied permission. Confirm a distinct message, appropriate recovery action, and an announced status for each state.

### R9. Responsive interaction

At 320 CSS pixels wide and above, the phone layout must avoid horizontal page scrolling, use a single-column content order, keep primary touch targets at least 44×44 CSS pixels where practical, and place frequently used date/location controls within comfortable thumb reach. It must not depend on hover. At 1024 CSS pixels and above, the laptop layout must use the approved multi-column composition rather than stretching the phone stack.

**Acceptance check:** Test at 320×568, 390×844, 768×1024, and 1440×900. Confirm no clipped content or unintended page-level horizontal scrolling, usable touch controls, and the distinct approved laptop composition.

### R10. Accessibility

Target WCAG 2.2 Level AA. Use semantic landmarks, headings, buttons, form labels, visible focus, logical keyboard order, focus trapping and return for dialogs, live-region announcements for asynchronous status, and text equivalents for meaningful icons and the composed outfit. Do not rely on color alone. Normal text must meet 4.5:1 contrast and large text 3:1. Content and controls must remain usable at 200% text zoom. Nonessential animation must stop under `prefers-reduced-motion: reduce`.

**Acceptance check:** Complete the core flow using only a keyboard; run an automated accessibility scan; manually inspect focus, dialog behavior, status announcements, contrast, icon labels, 200% zoom, and reduced motion.

### R11. Information and credits

The Information/Settings screen must identify `xiaoyuex_x` as creator, disclose AI assistance, credit Open-Meteo and its CC BY 4.0 weather-data license, summarize the coded recommendation method, link the NWS/CDC/EPA guidance cited in `research.md`, explain privacy practices, and state that the character, clothing, and icons are original SVG artwork created for the prototype.

**Acceptance check:** Verify that every required disclosure and working source link appears in the deployed information screen and that no uncredited third-party artwork is shipped.

### R12. Public deployment

The finished static app must be deployed from its GitHub repository to a public GitHub Pages HTTPS URL. Relative asset and navigation paths must work at the repository subpath.

**Acceptance check:** Open the public URL in a clean phone browser and laptop browser, reload both routes/views, request location permission, fetch live data, and confirm no mixed-content, path, or console errors.

## Recommendation state and data flow

Define the weather inputs, recommendation categories, coded rules, and shared state. Weather values must come from the provider, and rules must follow the weather guidance cited in `research.md`. The selected location, date, and live weather data must produce one recommendation state that drives every visual and written output.

### Provider inputs

Use Open-Meteo Geocoding API for US search results and the Forecast API with `timezone=auto` and seven forecast days. Request current temperature, apparent temperature, weather code, daylight status, and wind; hourly apparent temperature for 08:00–18:00 local time; and daily weather code, temperature and apparent-temperature min/max, precipitation probability and sum, snowfall sum, UV Index max, wind-speed max, and wind-gust max.

### Derivation

For each date, calculate the median of available hourly apparent temperatures from 08:00 through 18:00 local time. If fewer than three values are available, use the daily mean apparent temperature when provided, otherwise the mean of daily apparent min/max. If no valid fallback exists, show the missing-data state rather than invent a recommendation.

Base categories use unrounded values:

| Category | Representative apparent temperature |
| --- | --- |
| Hot | ≥ 85°F / 29.44°C |
| Warm | ≥ 70°F / 21.11°C and < 85°F / 29.44°C |
| Comfortable | ≥ 55°F / 12.78°C and < 70°F / 21.11°C |
| Chilly | ≥ 40°F / 4.44°C and < 55°F / 12.78°C |
| Cold | < 40°F / 4.44°C |

Modifiers are independently true when:

| Modifier | Rule |
| --- | --- |
| Rain | Daily maximum precipitation probability ≥ 40% or rain/showers are present in the daily weather code |
| Snow | Daily snowfall sum > 0 or snow is present in the daily weather code |
| Wind | Maximum sustained wind ≥ 20 mph / 32.19 km/h or maximum gust ≥ 25 mph / 40.23 km/h |
| UV | Daily maximum UV Index ≥ 3 |
| Hydration | Daily maximum apparent temperature ≥ 85°F / 29.44°C |
| Layers | Daily apparent-temperature max minus min ≥ 15°F / 8.33°C |
| Thunderstorm | Daily weather code is a WMO thunderstorm code (95, 96, or 99) |

Snow takes precedence over a generic rain icon and reminder. A thunderstorm adds its warning without suppressing relevant rain, wind, or layer guidance. These are prototype recommendations, not medical or safety guarantees.

### Shared state

The application holds one serializable recommendation object for the active location/date:

```js
{
  location, date, contextLabel, units,
  weather: { current, hourly, daily, condition },
  preferences: { character, style, skinTone },
  category,
  modifiers: { rain, snow, wind, uv, hydration, layers, thunderstorm },
  outfit: { recipeId, layers, accessibleSummary },
  weatherIconId,
  recommendationText,
  reminders: [{ type, wordingIndex, iconId, text }],
  source: { provider: "Open-Meteo", fetchedAt },
  status
}
```

The render layer reads only this object for recommendation output. Location/date/preferences and provider data flow into derivation first; derived state then flows into all visual and written consumers.

## Content variation

Define at least three outfit variations for each recommendation category and at least three wording variations for each reminder type. Define how outfit and reminder variations are chosen independently at random, and how a previously selected date keeps the same variations, including whether they persist after the page reloads.

### Outfit recipe matrix

Each cell defines three reviewed recipes. The same semantic recipes are fitted to all four character looks with equivalent coverage. Colors and patterns may vary, but required protective layers may not be removed.

| Category | Campus Casual | Sporty | Streetwear |
| --- | --- | --- | --- |
| Hot | graphic tee + denim shorts + canvas sneakers; tank + cargo shorts + low-top sneakers; lightweight tee + linen trousers + canvas shoes | performance tee + running shorts + trainers; athletic tank + bike shorts + trainers; mesh tee + track shorts + running shoes | oversized tee + cargo shorts + high-tops; boxy tank + lightweight parachute pants + sneakers; jersey + denim shorts + skate shoes |
| Warm | tee + straight jeans + sneakers; polo + chinos + canvas shoes; lightweight shirt + relaxed trousers + sneakers | training tee + joggers + trainers; athletic polo + track pants + sneakers; quarter-zip tee + shorts + running shoes | overshirt + tee + cargos + high-tops; rugby shirt + loose jeans + skate shoes; cropped/boxy jacket + tank + parachute pants + sneakers |
| Comfortable | long-sleeve tee + jeans + sneakers; sweatshirt + chinos + casual shoes; cardigan + tee + trousers + sneakers | track jacket + tee + joggers + trainers; hoodie + leggings/joggers + running shoes; crewneck + track pants + sneakers | flannel + tee + cargos + high-tops; denim jacket + tee + wide-leg jeans + skate shoes; hoodie + utility pants + sneakers |
| Chilly | sweater + tee + jeans + warm shoes; fleece + corduroy pants + sneakers; light puffer + long-sleeve + trousers + boots | insulated track jacket + base layer + joggers + trainers; fleece hoodie + thermal leggings/joggers + running shoes; windbreaker + crewneck + track pants + sneakers | bomber + hoodie + cargos + boots; oversized coat + knit + wide-leg pants + high-tops; puffer vest + hoodie + utility pants + boots |
| Cold | insulated parka + sweater + thermal pants + winter boots; puffer + fleece + jeans + boots; wool-style coat + knit + lined trousers + boots | insulated jacket + thermal base + joggers + winter shoes; long puffer + fleece + thermal leggings/joggers + boots; weather shell + insulating midlayer + thermal pants + boots | oversized puffer + hoodie + cargos + boots; parka + layered knit + wide-leg pants + winter boots; shearling-style jacket + thermal top + dark denim + boots |

Rain adds a compatible rain shell or umbrella carry item; snow requires waterproof footwear; wind adds or substitutes a wind-resistant outer layer. These modifier layers are applied after the base recipe and included in the accessible summary.

### Reminder wording

| Type | Variation 1 | Variation 2 | Variation 3 |
| --- | --- | --- | --- |
| Rain | “Pack an umbrella before you head out.” | “Rain is possible—bring a light rain layer.” | “Keep an umbrella close for your walk.” |
| Snow | “Choose waterproof shoes for snow.” | “Snow is in the forecast—wear grippy, water-resistant footwear.” | “Keep your feet warm and dry with winter-ready shoes.” |
| Wind | “Add a wind-resistant outer layer.” | “It will be breezy—bring a jacket that blocks the wind.” | “A light windbreaker will help on exposed walks.” |
| UV | “Add sunscreen, sunglasses, or a hat.” | “UV protection is useful today—cover up and use sunscreen.” | “Bring sun protection for time outdoors.” |
| Hydration | “Carry water and take regular drink breaks.” | “It will feel hot—bring a refillable water bottle.” | “Stay hydrated during your walk across campus.” |
| Layers | “Temperatures will shift—wear removable layers.” | “A layer you can take off will help with today's temperature swing.” | “Plan for a cooler start or finish with an extra layer.” |
| Thunderstorm | “Thunderstorms are possible—check conditions before leaving.” | “Watch the latest forecast and consider delaying outdoor travel.” | “Storms may interrupt your route—stay weather-aware.” |

### Stable selection method

Create a base seed from normalized coordinates rounded to three decimals, local ISO date, character, and style. Hash the seed with separate salts: `outfit`, `outfit-color`, and one salt per reminder type such as `rain-copy`. Map each hash to the eligible array index. This makes selections pseudo-random across different inputs but stable when revisiting the same input, including after reload. Reminder types never share the outfit index or each other's wording index. No viewed-date history is stored.

## Assets

List every art and graphical asset: the character, each outfit variation, icons, and any other visuals. For each, note where it appears, its format, and whether it will be created, generated, or licensed, with its credit or license.

All shipped artwork will be original, code-native SVG created for this prototype and credited to `xiaoyuex_x`; no reference image is an application asset. Character and wearable symbols use a shared integer pixel grid, hard-edged shapes, and aligned body anchors to create a crisp pixel-art appearance without raster-image blur. Reusable symbols may live in grouped SVG sprite files, while the outfit manifest names every assembled recipe from the matrix above. Weather, reminder, status, decorative, and interface artwork retains its existing visual treatment.

| Asset or asset family | Use | Format and quantity | Source/credit |
| --- | --- | --- | --- |
| Character looks | Main character stage and preference preview | SVG, 4 | Original; `xiaoyuex_x` |
| Upper-body garments | Tops, midlayers, sweaters, and jackets used by all 45 semantic recipes | Reusable SVG symbols, approximately 24 | Original; `xiaoyuex_x` |
| Lower-body garments | Shorts, jeans, trousers, joggers, leggings, and thermal pants | Reusable SVG symbols, approximately 14 | Original; `xiaoyuex_x` |
| Footwear | Canvas shoes, trainers, sneakers, high-tops, casual boots, and winter/waterproof boots | Reusable SVG symbols, approximately 10 | Original; `xiaoyuex_x` |
| Weather modifier garments | Rain shell, windbreaker, puffer/insulating layer, hats, and gloves | Reusable SVG symbols, approximately 8 | Original; `xiaoyuex_x` |
| Outfit recipes | Three variants × five categories × three styles × four looks | Data manifest, 180 assembled recipes | Original combinations; `xiaoyuex_x` |
| Weather icons | Clear day/night, partly cloudy, cloudy, rain, snow, wind, thunderstorm | SVG, 8 | Original; `xiaoyuex_x` |
| Reminder icons | Umbrella, waterproof footwear/snow, wind layer, sunscreen/sun, water bottle, removable layer, storm | SVG, 7 | Original; `xiaoyuex_x` |
| Status icons | Location, loading, slow connection, offline/error, retry, information | SVG, 6 | Original; `xiaoyuex_x` |
| Y2K decorative set | Sparkles, sticker outlines, abstract blobs, and simple campus skyline | SVG/CSS, approximately 8 elements | Original; `xiaoyuex_x` |
| Wordmark | “What to Wear?” application title | Text/CSS or original SVG, 1 | Original; `xiaoyuex_x` |

The exact symbol count may change during asset construction, but no category/style/presentation may lose the three approved recipes. Any count change must be recorded in `spec.md` Revisions and the asset manifest.

## Out of scope

Record features intentionally excluded from this project.

- Saved favorite locations or location history beyond the latest location
- Accounts, cloud synchronization, social sharing, or user-generated wardrobes
- Push notifications or background weather alerts
- Shopping links, brand products, prices, advertising, or affiliate tracking
- Weather maps, radar, historical weather, or forecasts beyond seven days
- Medical advice, emergency alert replacement, or guarantees of personal comfort
- Exact cellular signal-strength measurement
- Additional character looks or clothing styles beyond the approved four looks and three styles
- AI-generated or third-party production artwork
- Native mobile applications or offline weather updates

## Revisions

After implementation or testing, record requirement changes and the evidence that prompted them. Update the screen drawings when a material layout or interaction changes.

- **September 28, 2026 — Initial specification draft:** Consolidated the Developer's phone flow into two navigable screens and panels, selected Desktop Main Layout 1, removed multiple saved locations and notifications, limited styles to the approved three, and retained Fahrenheit as the default. The original phone and desktop sketches were saved in `reference/` and linked above.
- **September 28, 2026 — Asset inventory refinement:** Construction produced 90 reusable SVG symbols: 2 character bases with integrated face/hair details, 25 upper-body layers, 14 lower-body layers, 10 footwear layers, 8 modifier/accessory layers, 10 weather icons, 7 reminder icons, 6 status icons, and 8 decorative symbols. Fog and unknown-state icons increased the weather count from the approximate table, while integrated character details replaced separate face/hair symbols. Recipe, style, category, and presentation coverage did not change.
- **September 28, 2026 — Persistence precision clarification:** Limited the persisted latest-location coordinates to three decimal places, while allowing the active session to use provider precision. This reduces stored location precision without adding history or changing the approved location flow.
- **October 5, 2026 — Pixel-character redesign:** Replaced the smooth flat-vector character direction with a crisp, game-inspired pixel-art system after the Developer found the implemented characters and layered clothing visually unsuccessful. The approved change covers both character bases and all wearable layers only. It preserves the existing interface, icons, two presentations, three styles, five weather categories, 90 assembled-outfit coverage, recommendation logic, and accessible summaries. New acceptance checks require aligned layers, coordinated outfits, hard SVG edges, and clarity across phone, laptop, and 200% zoom views.
- **October 5, 2026 — Live preview and skin-tone controls:** Review of the first pixel-art pass prompted a second character revision with a larger head, shorter body, more expressive details, and a less rigid stance. Added four visual skin-tone swatch buttons with hidden accessible names, immediate unsaved character/style/skin preview changes inside the preferences dialog, and persistence after Apply. Skin tone is deliberately excluded from deterministic outfit selection so appearance changes do not unexpectedly change the recommended clothing.
- **October 5, 2026 — Four-look customization:** Replaced the binary Male/Female preference with Cropped, Curls, Long waves, and Soft bob character looks; expanded skin tones from four to five; and consolidated the dialog around one large live preview. The fitted manifest now contains 180 character/category/style entries while retaining the same 45 reviewed semantic outfit recipes.

## Approval

The Developer reviews and explicitly approves this specification and its screen designs before planning begins.

Approved by the Developer on September 28, 2026, including the linked phone and desktop screen designs.

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
