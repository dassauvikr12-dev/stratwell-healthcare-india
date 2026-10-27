# Hirezyy founder profile layout correction

## Requested correction
Opening a long biography inside a founder card increased the card height and enlarged/cropped the photograph. Founder summaries must not expand. Preserve the approved teal, ivory and brass styling.

## Publishing
Run `node publish.mjs && node visual-refresh.mjs && node art-direction.mjs && node founder-profiles.mjs`. Vercel runs this command. The final pass extracts the existing biographies without rewriting them and publishes /binoy-paul and /dipta-biswas. All three founder-summary locations link to the separate pages. Existing /about#binoy-paul and /about#dipta-biswas anchors still work.

The cards contain a photograph, identity, concise description, contact controls and View full profile. Full biographies have an independent 4:5 portrait above the reading section, so text length cannot resize the photograph. No new biography claims or contact details have been added.

Calendar actions are labelled Add to Calendar. Their destinations still create personal Google Calendar events, not appointments. The visible note asks visitors to confirm the time with the founder first. No invitations or messages are sent.

## Responsive checks before publication
Chromium browser emulation: 1366x615 desktop, 390x844 and 320x740 phones, iPad-sized 768x1024 and 1024x768 viewports, and iPad Air-sized 820x1180 and 1180x820 viewports. All eleven pages were checked at the primary desktop, phone and iPad sizes; founder and profile pages were also checked at the three extra sizes. Total: 56 page/viewport checks.

Checks passed: no horizontal overflow, local images loaded, no expanding biography within cards, professional calendar labels, both profile destinations, mobile menu open/close, and no JavaScript page errors. The desktop founder section fits a 615px-high viewport. Screenshots were visually inspected. These are browser-emulated checks, not physical iPad/iPhone or Safari certification.

Candidate forms and their existing local-only CV-selection flow are unchanged. No private CV-upload backend is enabled by this release.
