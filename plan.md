# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into an ordered, trackable build and verification plan.

## Instructions for the Developer

Set priorities, review the checklist, verify results rather than relying only on the Agent's report, and keep the project documents current as the work changes. Expect the build to take many rounds of testing and fixing; record material changes under Revisions.

To begin planning, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me create the Project 3 implementation plan.`

After approving the plan, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me implement the approved Project 3 plan in working checkpoints.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, `spec.md`, and this file, then inspect the relevant project files. Propose concrete tasks and checks without expanding the approved scope.

During implementation, follow the approved plan in working checkpoints and keep it current. Never mark approvals or items requiring Developer verification complete on the Developer's behalf.

## Approach

Summarize the structure, data flow, dependencies, task order, and main risks.

Build a dependency-light static application with semantic HTML, responsive CSS, ES modules, original SVG symbols, and JSON-like content manifests. Keep weather retrieval, provider normalization, recommendation derivation, deterministic variation, persistence, and DOM rendering in separate modules. Provider data and User inputs must pass through one pure recommendation function before reaching any character, icon, sentence, or reminder output.

Use Node 22's built-in test runner for pure logic and provider-normalization tests. Serve the app locally with `python3 -m http.server 4173`; no runtime framework or build step is required. Use saved fixtures for deterministic and failure-state verification, then perform a smaller live Open-Meteo smoke test. GitHub CLI is not available, so creation of the public remote and Pages configuration will require either the GitHub website or an authenticated Git command at the deployment checkpoint.

Build the recommendation engine and SVG asset system before polishing the interface because category coverage, stable variation, and layer alignment are the largest scope risks. Other risks are incomplete Open-Meteo fields, browser geolocation denial, free-service availability, accidental storage of extra locations, dense desktop content, one-handed phone reach, and visual contrast within the Y2K direction. Every checkpoint ends with focused verification and a meaningful commit only after secrets and generated clutter have been checked.

## Checklist

### Approvals

- [x] Research approved — September 28, 2026
- [x] Specification and screen designs approved — September 28, 2026
- [x] Plan approved — September 28, 2026

### Build

1. [x] **Create the repository baseline.** Added `.gitignore`, `index.html`, `styles/`, `scripts/`, `assets/`, `data/`, and `tests/`; added a minimal `package.json` for ES modules and test scripts; and documented local commands in `AGENTS.md`. Verified three passing shell tests and HTTP 200 responses from `http://localhost:4173` on September 28, 2026. Browser-console inspection will continue with the first interactive browser checkpoint.
2. [x] **Implement the pure recommendation engine.** Added normalized Fahrenheit/mph weather types, representative daytime apparent-temperature calculation with documented fallbacks, five category thresholds, seven independent modifiers, complete supported WMO condition mapping, precedence rules, and an explicit missing-data result. Added deterministic boundary and partial-data fixtures. Verified all five categories, each modifier alone and together, snow/rain precedence, thunderstorm behavior, malformed values, and missing-data fallback with 16 passing tests on September 28, 2026; committed.
3. [x] **Implement stable content variation.** Added all 45 semantic outfit recipes with equivalent male/female fits, all 21 reminder wordings from `spec.md`, protective-layer composition, documented FNV-1a hashing, and separate salts for outfits, colors, and each reminder type. Verified 90 fitted recipe entries, repeated selection before and after module reinitialization, all three indices across broad seed coverage, and independence from fixed outfit/reminder pairs with 25 passing tests on September 28, 2026; committed.
4. [x] **Create the original SVG system early.** Built a 90-symbol original SVG library with two character bases, reusable garment and protection layers, weather/reminder/status icons, Y2K decorations, three palettes, and a manifest connecting all 90 fitted outfit entries to compatible layers. Added a responsive development gallery plus representative and full contact-sheet preview generation. Verified unique IDs, view boxes, internal references, z-order, accessible summaries, responsive gallery rules, icon coverage, and all 90 rendered outfits; corrected hat, hood, and face alignment before completion. `npm test` passed 30/30 tests on September 28, 2026; committed.
5. [x] **Implement the Open-Meteo data layer.** Added US-filtered geocoding, approved current/hourly/daily forecast requests, Fahrenheit/mph/inch response normalization, caller cancellation, a three-second slow callback, a ten-second abort timeout, and typed provider/network/response errors. Tested normal, empty, partial, delayed, timed-out, cancelled, malformed, and failed fixture responses. `npm test` passed 44/44 tests, and a live smoke test returned seven ready recommendation days for New York, Austin, and Seattle without saving responses on September 28, 2026; committed.
6. [x] **Implement central application state and privacy-safe persistence.** Added active location/date, units, character/style preferences, ordered request states, normalized provider data, stale-request protection, unit conversion, and one complete derived recommendation object. Restricted versioned local storage to one latest location with three-decimal coordinates plus approved preferences only. Verified three sequential locations, reload restoration without automatic fetch, unit changes without refetch or recommendation changes, exact date-return stability, request-state order, stale-response rejection, unavailable storage, and serialized contents with 54 passing tests on September 28, 2026; committed.
7. [x] **Build the responsive main screen from the approved drawings.** Added the phone single-column composition and selected desktop three-region composition, Today/7-day switch, seven date controls, unit display control, source/context labels, layered central character, outfit card, carry reminders, and explicit empty state. The render module consumes central state and uses the pure recommendation rules for forecast summaries. Verified live Open-Meteo data and long fallback text at 320×568, 390×844, 768×1024, 1024×768, and 1440×900: all had exact viewport-width documents, 44-pixel minimum visible button heights, and the desktop breakpoint showed three columns. `npm test` passed 59/59 tests on September 28, 2026; committed.
8. [x] **Build location and preference interactions.** Added an Open-Meteo US location-search dialog, explicit device-location action, distinct denied/unsupported/unavailable/timeout recovery messages, dressed character previews, three style choices, outfit-details and carry-item-details dialogs, and completed the existing °F/°C control flow. Native modal dialogs provide keyboard focus containment; explicit close, Escape, backdrop close, and trigger focus return are supported without hover. Browser verification covered Austin search, empty results, three sequential cities, granted and denied geolocation, male/streetwear preference updates, detail content, 390-pixel dialog layout, Escape, focus return, and manual fallback. Confirmed the stored schema retained only the latest location and approved preferences, with no favorite-location or notification controls. `npm test` passed 64/64 tests on September 29, 2026; committed.
9. [x] **Build information, loading, and failure experiences.** Added the second navigable Information/Settings screen with units and preference access, creator and AI-assistance credit, Open-Meteo/CC BY 4.0 attribution, coded-method summary, NWS/CDC/EPA guidance links, privacy disclosure, original-art credit, and accessibility information. Added an announced status presentation with loading skeletons plus distinct slow, offline, timeout, network, provider, invalid-response, and missing-data states with appropriate retry/location recovery. Browser checks confirmed 320-pixel and 1440-pixel information layouts, navigation focus, immediate loading, the three-second slow message, stale-content removal, offline retry recovery, and successful live completion. All five official external links returned HTTP 200. `npm test` passed 70/70 tests on September 29, 2026; committed.
10. [ ] **Complete integrated accessibility and responsive verification.** The local and automated portion is complete: the full Node suite, keyboard-only location flow, browser accessibility-tree inspection, contrast calculation, 200% text reflow, reduced motion, status announcements, touch-target rules, and target viewport checks passed after the fixes recorded below. Developer verification on a real phone and laptop remains required before this checkpoint can be marked complete.
11. [ ] **Create the public remote and deploy.** Confirm no secrets or private data are tracked, create/connect the approved public GitHub repository, push `main`, enable GitHub Pages, and verify relative paths and live API/location behavior at the public HTTPS URL. Record the repository and deployment URLs in `AGENTS.md` and `plan.md`; commit any deployment-path fixes.
12. [ ] **Run usability testing and revise.** Use the approved protocol below with three peers on the deployed app. Record observations without identifying information, select one meaningful improvement supported across the findings, update `spec.md` if behavior changes, add the improvement as a named task here, implement it, rerun affected checks, redeploy, and commit.

Throughout all checkpoints:

- [ ] Use the approved screen drawings to guide layout and interaction work.
- [ ] Keep one recommendation state driving every visual and written output.
- [ ] Test and fix each checkpoint against the specification before starting the next.
- [ ] Check staged files for secrets before every commit.
- [ ] Commit only meaningful working checkpoints.

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [ ] Prepare the usability test below
- [ ] Test with three peers and record each session
- [ ] Add the chosen improvement to this checklist, and update `spec.md` if the intended result changes
- [ ] Implement, verify, and redeploy at least one meaningful revision

Specification verification will be tracked in a requirement matrix added here during implementation. Each row will identify the requirement, automated evidence where available, manual evidence, deployed evidence, and current status. Developer-only verification and approvals remain unchecked until the Developer performs them.

| Requirement | Automated evidence | Local browser/manual evidence | Deployed evidence | Status |
| --- | --- | --- | --- | --- |
| R1 Live weather and location | Provider, state, and device-location tests | Three-city live smoke test; search plus granted/denied recovery checked | Pending | Local pass; deployment pending |
| R2 Date range and context | Provider and render tests cover seven normalized days and required labels | Live current/forecast views checked | Pending | Local pass; deployment pending |
| R3 State consistency | Recommendation, state, variation, and render tests use one derived state | Character, copy, icons, and reminders checked together | Pending | Local pass; deployment pending |
| R4 Character and style | Complete two-presentation, three-style, five-category test coverage | Preference dialog and rendered changes checked | Pending | Local pass; deployment pending |
| R5 Stable variation | Determinism, coverage, reload-equivalent, and independence tests | Date-return stability checked | Pending | Local pass; deployment pending |
| R6 Persistence and privacy | Restricted-schema and coordinate-rounding tests | Sequential-location storage inspected | Pending | Local pass; deployment pending |
| R7 Units | Conversion, persistence, and no-refetch state tests | Main and Information controls checked | Pending | Local pass; deployment pending |
| R8 Loading and failures | Delayed, timeout, cancellation, partial, malformed, and failed response tests | Loading, slow, offline, retry, and denial states checked | Pending | Local pass; deployment pending |
| R9 Responsive interaction | CSS regression rules cover 320-pixel floor, zero-min grids, and 44-pixel targets | No page overflow at 320×568, 390×844, 768×1024, 1024×768, or 1440×900, including 200% text | Pending | Emulated/local pass; real devices pending |
| R10 Accessibility | Semantic, label, contrast-pair, focus, target, reflow, and reduced-motion tests | Keyboard core flow and Chrome accessibility tree passed with no unnamed controls; 200% text and reduced motion checked | Pending | Local pass; Developer real-device review pending |
| R11 Information and credits | Shell/render tests cover disclosures and source links | Information layouts checked; five official links returned HTTP 200 | Pending | Local pass; deployment pending |
| R12 Public deployment | Relative source paths covered by shell tests | Not applicable yet | Pending | Checkpoint 11 |

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

### Purpose

Determine whether a first-time college-age User can understand the live-data status, choose a location/date, interpret the character-led recommendation, change preferences, and recover from a connection problem on phone and laptop without coaching.

### Consistent setup

- Use the deployed HTTPS build with live weather unless a task explicitly uses a controlled failure state.
- Test at least two sessions on a phone and one on a laptop; include keyboard use in the laptop session.
- Describe the app as a weather-based clothing prototype without explaining its controls.
- Ask the same core tasks in the same order; follow-up questions may clarify observed behavior but must not lead the tester.

### Tasks and non-leading prompts

1. “You are leaving for class today in your current city. Show what you would wear and bring.”
2. “You will be in another US city later this week. Find that day and decide how you would prepare.”
3. “Change the character and choose the clothing style you prefer.”
4. “Find out where the weather and clothing advice come from and what location information is saved.”
5. Present a controlled failed or offline request: “The weather did not load. What would you do next?”

After the tasks, ask: “What felt clear?”, “What caused hesitation?”, and “What, if anything, would you change first?”

### Session note template

```text
Participant label: P1 / P2 / P3
Device and viewport:
Input method:
Date:

Task:
Observed actions and exact comments:
Success without help: Yes / Partial / No
Barrier or question:
Possible change (interpretation, kept separate from observation):

Post-test comments:
```

### Synthesis rule

After all sessions, group repeated observations by severity and frequency. Prefer an improvement that resolves a demonstrated barrier in a core task, benefits more than one participant or prevents a serious single-session failure, fits the approved product goal, and can be verified against a specific acceptance check. Do not choose an improvement only because it is visually appealing.

## Revisions

Record material plan changes and why they were made.

- **September 28, 2026 — Initial plan draft:** Ordered work around the pure recommendation engine and reusable SVG system before full UI polish, because deterministic coverage and artwork alignment are the highest implementation risks. Selected Node's built-in test runner and a static Python preview server to preserve the approved no-framework, no-build runtime approach.
- **September 28, 2026 — Checkpoint 1:** Created and locally served the semantic English application shell. `npm test` passed 3/3 tests and local `HEAD`/`GET` requests returned HTTP 200. The sandbox required approved port access for the preview server; no application change was needed.
- **September 28, 2026 — Checkpoint 2:** Added the pure recommendation engine and deterministic fixtures. Internal rules consume normalized Fahrenheit, mph, local timestamps, and snowfall inches so display-unit changes cannot affect recommendations. `npm test` passed 16/16 tests, including category and modifier boundaries, all supported WMO codes, combined hazards, precedence, fallbacks, and missing data.
- **September 28, 2026 — Checkpoint 3:** Added 45 semantic outfit recipes, equivalent fits for both character presentations, all approved reminder copy, protection overrides, and deterministic FNV-1a selection with independent salts. `npm test` passed 25/25 tests; an additional coverage count confirmed all 90 fitted recipe entries.
- **September 28, 2026 — Checkpoint 4:** Created the 90-symbol original SVG system, full outfit-to-layer manifest, responsive development gallery, and generated alignment/contact-sheet previews. Automated checks passed 30/30, and the rendered 90-entry sheet confirmed complete male/female, category, and style coverage without clipping. Visual review prompted hat and hood corrections before completion.
- **September 28, 2026 — Checkpoint 5:** Added the Open-Meteo geocoding and forecast service with internal imperial-unit normalization, request timing states, cancellation, typed failures, and deterministic complete/partial fixtures. `npm test` passed 44/44 tests. Live smoke checks for New York, Austin, and Seattle each returned seven days and a ready recommendation; no live payloads were saved.
- **September 28, 2026 — Checkpoint 6:** Added central application state, one render-ready recommendation object, display-unit conversion, request sequencing, and a versioned privacy-restricted storage schema. Only one rounded latest location and the approved unit/character/style preferences persist. `npm test` passed 54/54 tests, including sequential locations, restoration, no-refetch unit changes, stable date returns, and stale-response protection.
- **September 28, 2026 — Checkpoint 7:** Replaced the baseline shell with the approved responsive Y2K main screen and connected it to central state. Real-browser checks with live New York Open-Meteo data confirmed no horizontal overflow across all five target viewports, 44-pixel minimum visible buttons, a phone single-column flow, and the distinct desktop three-region layout. Long condition and recommendation fallbacks also remained contained; `npm test` passed 59/59 tests.
- **September 29, 2026 — Checkpoint 8:** Added four accessible modal interactions for location, preferences, outfit details, and carry-item details. Live browser tests loaded Austin, New York, Seattle, and Boston, exercised granted and denied geolocation, confirmed keyboard Escape and focus return, and verified that only the latest rounded location plus approved preferences persisted. `npm test` passed 64/64 tests.
- **September 29, 2026 — Checkpoint 9:** Added the Information/Settings screen and complete visible request-state system. Controlled browser tests confirmed loading-to-slow-to-ready sequencing, offline stale-content removal and retry recovery, screen-navigation focus, responsive information layouts, and all required disclosures. The Open-Meteo, CC BY 4.0, NWS, CDC, and EPA links each returned HTTP 200; `npm test` passed 70/70 tests.
- **September 29, 2026 — Checkpoint 10 local verification:** Added accessibility regression tests and corrected text-reflow failures caused by rem-based minimum page and grid widths. Chrome checks found no unnamed interactive or meaningful image nodes, completed the core location flow by keyboard, honored reduced motion, and produced no page overflow at five target viewports with 200% root text. Calculated key normal-text contrast pairs met at least 4.5:1, and `npm test` passed 73/73 tests. This checkpoint remains open until the Developer verifies the app on a real phone and laptop.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
