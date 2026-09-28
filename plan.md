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
3. [ ] **Implement stable content variation.** Add the 45 semantic outfit recipes fitted to both character presentations, all reminder wording from `spec.md`, a documented hash function, and separately salted outfit/reminder selections. Test 90 character/category/style recipe slots, repeated selection before and after module reinitialization, broad seed coverage, and independence from fixed outfit/reminder pairs; commit.
4. [ ] **Create the original SVG system early.** Build the two base characters, reusable garment layers, weather icons, reminder/status icons, Y2K decorations, and an asset manifest connecting every recipe ID to compatible layers. Render a temporary asset gallery for both character presentations across all categories and styles. Check SVG IDs, view boxes, clipping, z-order, contrast, accessible summaries, and all 90 recipes at phone and laptop sizes; fix alignment before continuing and commit.
5. [ ] **Implement the Open-Meteo data layer.** Add US-only geocoding, forecast/current requests, response normalization, `AbortController` timeout, three-second slow state, ten-second failure state, and clear provider errors. Test normal, empty, partial, delayed, timed-out, and failed fixture responses; then smoke-test live data for New York, Austin, and Seattle without committing response data; commit.
6. [ ] **Implement central application state and privacy-safe persistence.** Add active location/date, units, character, style, request status, normalized provider data, and one derived recommendation object. Persist one latest location plus approved preferences only. Test three sequential locations, reload restoration, unit changes without refetch or category changes, date return stability, and local-storage contents; commit.
7. [ ] **Build the responsive main screen from the approved drawings.** Implement the phone single-column composition and selected desktop three-region composition, Today/7-day switch, date controls, source/context labels, central character, outfit card, and reminders. Do not implement the rejected desktop alternative. Verify 320×568, 390×844, 768×1024, 1024×768, and 1440×900 layouts with real and long fallback text; commit.
8. [ ] **Build location and preference interactions.** Implement the location-search panel, explicit device-location action, denied/unsupported permission messages, character/style panel, outfit-details panel, carry-item-details panel, and °F/°C control. Use accessible dialogs or inline panels with focus management and no hover dependency. Verify keyboard, touch, escape/close, focus return, manual fallback, and the absence of saved-location favorites or notification controls; commit.
9. [ ] **Build information, loading, and failure experiences.** Add creator and AI-assistance credit, Open-Meteo/CC BY 4.0 attribution, recommendation and guidance sources, privacy text, original-art credit, accessibility information, loading skeleton/status, slow/offline/error/missing-data states, and retry. Verify every R8 and R11 acceptance check plus working external links; commit.
10. [ ] **Complete integrated accessibility and responsive verification.** Run the full Node test suite, keyboard-only flow, automated accessibility scan if an available local browser tool supports it, manual contrast review, 200% zoom, reduced motion, status announcements, touch-target measurement, and both real phone/laptop checks. Fix failures before marking any related specification requirement complete; commit.
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

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
