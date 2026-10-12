# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Research your context of use, references, weather guidance, technical options, and choices that will guide the specification.

## Instructions for the Developer

Judge sources and recommendations, make the consequential decisions, and keep this file current as the work develops.

To begin, open the project repository in a fresh chat and enter:

`Read ./research.md and help me begin Project 3 research.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, and this file. Ask one focused question at a time. Help investigate and compare options without deciding for the Developer. Verify sources directly and keep this file concise.

## Context of use

As the User, describe when and where you would use the app and what you need from it. Record important circumstances, assumptions, and limitations.

The primary User is a US college student preparing to walk to class. They use the app before leaving their dorm or apartment and need a quick, practical answer to two questions: what should I wear, and what should I bring? The experience should prioritize fast scanning because the User may be getting ready under time pressure and using a phone with one hand.

## User story

Write at least one user story grounded in your context of use:

> As a [type of user], I want to [need or goal], so that [reason or outcome].

Focus on the need rather than prescribing an interface or feature.

> As a college student who walks to class, I want outfit and carry-item recommendations based on the day's weather, so that I can leave comfortably prepared without forgetting essentials.

> As a college student who regularly moves between campus, home, and other cities, I want to search different US locations or use device location, so that I can receive weather recommendations for where I am going.

> As a college student with personal clothing preferences, I want to choose a character presentation and campus casual, sporty, or streetwear style, so that the recommendations better reflect my taste.

## References

Collect 5–10 reference images from relevant products and interfaces. Save each image in `reference/`, identify its source, and record a brief observation about what is useful, ineffective, or relevant to this project. Reference images are examples only; do not use them in the app.

1. [Apple Weather location list](reference/01-apple-weather.jpg) — Source: [Weather on the App Store](https://apps.apple.com/us/app/weather/id1069513131). The city cards make location, current condition, and high/low temperature easy to scan, and the bottom search control is thumb-accessible. Our main screen should not copy its location-list emphasis because the character must remain central.
2. [CARROT Weather forecast](reference/02-carrot-weather.png) — Source: [CARROT Weather on the App Store](https://apps.apple.com/us/app/carrot-weather-alerts-radar/id961390574). A large temperature, short personality-driven sentence, and simple hourly row create a playful hierarchy without hiding the forecast. The tilted promotional framing is expressive but would reduce usability inside the actual app.
3. [Windy weather map](reference/03-windy.jpg) — Source: [Windy.com on the App Store](https://apps.apple.com/us/app/windy-com/id1161387262). Strong color coding makes weather patterns visually immediate. The dense map controls and technical layers are unnecessary for a quick clothing decision and show what to keep out of scope.
4. [SuitU characters](reference/04-suitu.jpg) — Source: [SuitU on the App Store](https://apps.apple.com/us/app/suitu-fashion-avatar-dress-up/id1663749627). Large full-body characters clearly make fashion the focal point and demonstrate distinct silhouettes and styling. The ornate detail level would be difficult to modularize and does not represent practical class-day clothing.
5. [Whering styling canvas](reference/05-whering.jpg) — Source: [Whering on the App Store](https://apps.apple.com/us/app/whering-your-digital-wardrobe/id1519461680). Separating top, accessory, bottom, and shoes makes a modular outfit legible, while the restrained app canvas sits comfortably within a more expressive promotional background. This supports a clear character stage surrounded by selective Y2K decoration.
6. [Retro/Y2K page layout](reference/06-y2k-retro-layout.webp) — Source: [Tiny Coast Digital retro web-design case study](https://tinycoastdigital.com/squarespace-projects/retro-web-design). Bold pink, green, purple, oversized type, and collage-like blocks produce a memorable identity. The app should borrow the palette and accents but avoid the page's very large type and long, busy composition.
7. [Retro framed-card detail](reference/07-y2k-retro-detail.webp) — Source: [Tiny Coast Digital retro web-design case study](https://tinycoastdigital.com/squarespace-projects/retro-web-design). A rounded, high-contrast frame turns the person into the unmistakable focal point, while the retro object background provides context. A simpler illustrated background will be needed so weather and clothing remain readable.

## Weather and technical evidence

Record each useful source, what it supports, and important limitations. Research the weather variables, apparel guidance, reminders, accessibility, privacy, artwork, weather providers, and technical options needed for informed decisions.

- **Open-Meteo Forecast API:** Its official documentation provides current, hourly, and daily variables, with a seven-day forecast by default and up to sixteen days. The public non-commercial API requires no API key, supports browser requests, and requires attribution under CC BY 4.0. The free service has usage limits and no uptime guarantee. Source: [Open-Meteo Forecast API documentation](https://open-meteo.com/en/docs) and [pricing](https://open-meteo.com/en/pricing).
- **WeatherAPI:** It supplies current weather, forecasts, and location search, but requires an API key. Its current free plan provides only a three-day forecast, which does not meet the selected seven-day range; placing its secret key in a public GitHub Pages app would also be inappropriate. Source: [WeatherAPI documentation](https://www.weatherapi.com/docs/) and [pricing](https://www.weatherapi.com/pricing.aspx).
- **Cold-weather clothing:** The National Weather Service recommends loose, warm layers; a wind- and water-resistant outer layer; warm footwear; and additional coverage as conditions become colder. Wind chill describes how cold exposed skin feels and supports using apparent temperature rather than air temperature alone. Sources: [NWS cold-weather guidance](https://www.weather.gov/safety/cold-during) and [wind-chill explanation](https://www.weather.gov/safety/cold-wind-chill-chart).
- **Hot-weather clothing and hydration:** CDC guidance recommends loose, lightweight, light-colored clothing, sunscreen, and drinking plenty of fluids in extreme heat. Source: [CDC extreme-heat guidance](https://www.cdc.gov/climate-health/php/resources/protect-yourself-from-the-dangers-of-extreme-heat.html).
- **Sun protection:** The US EPA groups UV Index 1–2 as low, 3–7 as moderate to high, and 8+ as very high to extreme. At 3 or above it recommends sun protection such as sunscreen, protective clothing, a hat, and sunglasses. Source: [EPA UV Index scale](https://www.epa.gov/sunsafety/uv-index-scale-0).
- **Rule structure implication:** Use apparent temperature for a base outfit category, then apply precipitation, wind, UV, and heat modifiers for outerwear, icons, and reminders. Exact thresholds will be defined and tested in `spec.md`; the app will present practical guidance, not medical advice.
- **Network-status feasibility:** The browser Network Information API can report an estimated effective connection type, but it has limited browser availability. The broadly available `navigator.onLine` value is only a hint and cannot guarantee that the weather service is reachable. A dependable interface should therefore communicate slow and failed weather requests, provide retry behavior, and use online/offline events only as supporting signals rather than claim to measure cellular strength. Sources: [MDN Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) and [MDN `navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine).
- **Precipitation and wind inputs:** The National Weather Service defines precipitation probability as the likelihood of measurable precipitation at a point during the stated period; 30–50% is described as a chance. Its forecast terminology describes sustained 20–30 mph wind as windy. Open-Meteo supplies daily maximum precipitation probability, precipitation and snowfall totals, maximum wind speed and gusts, maximum UV Index, weather code, and apparent-temperature values. Sources: [NWS forecast terms](https://www.weather.gov/ppg/forecast_terms) and [Open-Meteo forecast variables](https://open-meteo.com/en/docs).
- **Location privacy:** Browser geolocation works only in a secure context and requires explicit User permission. Request it only after the User activates “Use my location,” explain denial without blame, and keep manual search available. Send coordinates to Open-Meteo only to retrieve a place name and weather; do not add analytics, accounts, or a location history. Persist only the latest selected location and User preferences in local storage. Source: [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
- **Accessibility:** Target WCAG 2.2 Level AA. Use semantic controls and headings, visible keyboard focus, text alternatives for meaningful graphics, status announcements for asynchronous weather results, and text/background contrast of at least 4.5:1 (3:1 for large text). Use at least 44×44 CSS-pixel primary touch targets where practical, exceeding the 24×24 AA minimum for one-handed phone use. Do not rely on color alone, support 200% text zoom, and suppress nonessential animation when `prefers-reduced-motion: reduce` is active. Sources: [WCAG 2.2](https://www.w3.org/TR/wcag/) and [W3C reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39).

## Decisions

Record the selected weather provider, forecast range, recommendation categories and rules, screen structure, visual direction, artwork approach (original, AI-generated, or appropriately licensed), deployment method, and one additional feature justified by the research. Briefly explain important trade-offs.

- **Forecast range:** Show today and the following six days (seven calendar days total). This covers a typical week of classes without overloading the date selector.
- **Location selection:** Let the User search for a US city or area or use device location. Store only the most recently selected location on the device, as required by the brief.
- **Multiple-location behavior:** The User may search for and switch among multiple US locations during a session, but the app will not maintain a saved-locations or favorites list. Across reloads, only the single most recently selected location persists.
- **Weather provider:** Use Open-Meteo as the single live weather provider. It covers the selected forecast range without exposing an API key in the public client-side app. Credit Open-Meteo and note its CC BY 4.0 data license on the information screen.
- **Base recommendation categories:** Use five apparent-temperature categories: hot, warm, comfortable, chilly, and cold. Precipitation, strong wind, elevated UV, and high heat act as modifiers that add relevant outerwear, weather icons, written guidance, and carry-item reminders.
- **Representative temperature:** Base the selected date's outfit on the typical apparent temperature during the local daytime activity window (8:00 a.m.–6:00 p.m.), rather than the day's minimum. Continue to display current conditions for today, and add a removable-layer reminder when the day's apparent-temperature range is large. This balances daytime comfort with morning and evening preparation.
- **Temperature thresholds and units:** Categorize the representative apparent temperature as hot at 85°F/29°C or above, warm at 70–84°F/21–28°C, comfortable at 55–69°F/13–20°C, chilly at 40–54°F/4–12°C, and cold below 40°F/4°C. Default to Fahrenheit for the US audience and provide a Fahrenheit/Celsius toggle; internal rule evaluation uses unrounded Celsius values from the provider.
- **Reminder rules:** Add an umbrella or light-rainwear reminder when maximum precipitation probability is at least 40%; waterproof, slip-resistant footwear when snowfall is forecast; a wind-resistant layer when maximum sustained wind is at least 20 mph or gusts reach 25 mph; sun protection when UV Index is at least 3; hydration when maximum apparent temperature reaches 85°F; removable layers when the apparent-temperature range reaches 15°F; and a weather-awareness/delay message for thunderstorm codes. Multiple reminders may apply independently. The UV threshold follows EPA guidance; the remaining numeric triggers are prototype heuristics informed by cited NWS terminology and must be described as recommendations rather than guarantees or medical advice.
- **Character choice:** Let the User choose among four hairstyle-led character looks and five visual skin-tone swatches. Character and skin tone are independent. Every look and skin tone must receive equivalent recommendation coverage, outfit variety, and functionality. Skin-tone choices describe appearance only and must not be labeled as racial or ethnic categories.
- **Outfit system:** Build the characters from modular clothing layers (such as tops, bottoms, shoes, outerwear, and accessories) rather than drawing every combination as one image. Each character presentation will still have at least three reviewed complete outfit variations for every base category. This increases visible variety and reduces duplicated artwork, but requires consistent character proportions and careful layer testing.
- **Selectable outfit styles:** Offer campus casual, sporty, and streetwear preferences. The preference changes the pool of modular clothing pieces while weather protection rules remain consistent across all styles.
- **Visual direction:** Use crisp, game-inspired pixel-art characters with modular pixel-grid clothing, bold dark outlines, expressive hair and facial details, a larger head, shorter body, and a less rigid stance. Keep the existing Y2K interface, sticker-like weather graphics, and selective collage details unchanged so the character redesign remains focused. Render the character system as code-native SVG with hard edges so it stays clear on phone, laptop, and at 200% zoom. Keep functional text and controls visually quieter so the expressive styling does not reduce readability.
- **Artwork approach and estimate:** Create original, code-native SVG artwork rather than AI-generated or third-party character art. Use four base character looks, reusable clothing layers across tops, bottoms, outerwear, footwear, and accessories, and 180 fitted outfit entries (four looks × five temperature categories × three styles × three variations). Recoloring and recombining the SVG layers provides additional variety without producing a separate image for every outfit.
- **Screen structure:** Use two navigable screens. The main screen contains a Today/7-day view switch, location and date controls, live weather, the character and outfit, written guidance, and reminders. Location search, character/style selection, outfit details, carry-item details, permission feedback, and connection errors appear as dialogs, panels, or inline states rather than separate navigation destinations. The information/settings screen contains units, creator identity, weather and recommendation sources, privacy practices, and artwork credits. An optional splash treatment may appear during startup but is not a separate destination.
- **Technical approach:** Build a static browser application with semantic HTML, responsive CSS, and modular vanilla JavaScript. Use inline or local SVG components for the character and clothing layers. This avoids a build dependency, keeps the data flow inspectable, and can be hosted directly on GitHub Pages.
- **Deployment:** Publish the static app to a public GitHub Pages HTTPS URL from a GitHub remote repository. Verify the deployed build independently on a phone and laptop.
- **Creator credit:** Identify the creator as `xiaoyuex_x` and disclose AI assistance on the information screen.
- **Additional feature:** Add connection-aware weather loading. If a request is slow, show a delayed-loading message; if the browser is offline or the request fails, show an honest status and a retry control. Use Network Information API hints only where supported and never present them as an exact cellular-signal measurement. This responds to mobile use in inconsistent campus connectivity while preserving a clear fallback on unsupported browsers.

Once the recommendation categories are chosen, estimate the art needed: the character, three outfit variations per category, weather icons, and reminder icons. Use that estimate to choose the artwork approach.

## Revisions

Record new evidence or changed decisions and explain why they changed.

- **September 28, 2026 — Screen sketch review:** The Developer supplied a phone flow sketch showing splash, location, Today, 7-day, character, outfit-detail, carry-item, and settings views. To preserve the approved scope, the flow is consolidated into two navigable screens with the remaining views implemented as panels or states. The multiple-saved-location list and notifications shown in the sketch are excluded because the brief allows only the latest location to persist and notifications were not selected as the research-driven feature. Fahrenheit remains the default, with Celsius available as a preference.
- **September 28, 2026 — Desktop layout selection:** The Developer supplied two desktop main-screen concepts and an information/settings concept. The first main-screen concept was selected because its weather/character, outfit/reminder, and seven-day columns make use of the wider viewport while keeping the character central. The denser alternate layout was rejected; character and style controls remain in a settings panel. The desktop settings concept will be revised to remove notifications, use the three approved styles, default to Fahrenheit, and persist only the latest location.
- **October 5, 2026 — Character-art direction:** After reviewing the implemented character system, the Developer replaced its smooth flat-vector treatment with a crisp, game-inspired pixel-art direction. Only the two characters and wearable layers change; the interface, weather icons, recommendation coverage, and interaction model remain unchanged. The supplied visual reference informs proportion and pixel treatment only and will not be copied or shipped.
- **October 5, 2026 — Character customization refinement:** Review of the first pixel-art pass showed that its straight pose, long body, and simplified face did not meet the intended character quality. The Developer selected a larger-head, shorter-body, more expressive pixel-art direction; requested four visual skin-tone swatches without visible text; and required character/style/skin choices to update the clothing preview immediately before preferences are applied.
- **October 5, 2026 — Character choice expansion:** The Developer approved a refined pixel-art implementation with four hairstyle-led character looks, five independent skin tones, and one large live outfit preview. This replaces the binary Male/Female control and makes every draft selection visibly update before Apply.

## Approval

The Developer reviews the sources and decisions, corrects this file, and explicitly approves it before specification begins.

Approved by the Developer on September 28, 2026.

## Saving the transcript

After the Developer approves the research, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
