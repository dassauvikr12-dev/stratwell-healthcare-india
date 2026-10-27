# Hirezyy journey-card colour refinement

Scope: the homepage section "What brings you to Hirezyy?" only. Replace the three white card panels with sage green, warm sand and muted mint. The surrounding section uses a soft sage-to-sand background. Keep dark-teal text, a narrow muted-gold image divider, understated borders and shadows, and keyboard-visible focus styling. No images, words, destinations, founder styling or application behaviour are changed.

The content panels fill the card height so tablet card bottoms and action links align. Existing mobile image-and-copy layout is retained. Reduced-motion users receive no hover movement.

Source change: append scoped .v-choose rules to static/art-direction.css. The existing publishing pipeline and hosting target are unchanged.

Pre-publication checks: Chromium browser emulation at 1366x615, 390x844, 320x740, 768x1024 and 1024x768. No horizontal overflow, image failures, clipped cards or JavaScript errors. Screenshots visually inspected at desktop, phone and iPad portrait sizes. Dark-teal headings and body/action text were checked against all gradient endpoints; lowest calculated contrast was 5.48:1. Checks are browser-emulated, not physical device or Safari certification.

The founder profiles, Add to Calendar reminder behaviour, hospital corridor hero, and fresher/experienced candidate flow are preserved. This release does not add direct CV upload or backend storage.
