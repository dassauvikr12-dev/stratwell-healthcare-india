# Hospital corridor hero

The owner approved replacing the red-background healthcare portrait in the homepage hero with an unmistakably hospital-related corridor. The hotel panel, founder colours, independent profile pages and candidate behaviour are unchanged.

The replacement is photograph 31499386 by Adarsh Mp on Pexels, described by the source as two nurses discussing notes in a hospital corridor in Ulliyeri, Kerala, India. Source: https://www.pexels.com/photo/healthcare-professionals-in-hospital-corridor-31499386/ . Licence: https://www.pexels.com/license/ . It is illustrative stock photography, not a Hirezyy hospital partnership, employee claim or service-region restriction. The unrelated Fortis architectural reference was not republished.

The image is downloaded during the existing art-direction build step, served from the site's own assets folder, and credited on image-credits.html. CSS improves visibility and preserves the corridor and both staff in the narrow crop. No surgical background.

Pre-publication Chromium browser checks passed at 1366x700, 390x844, 320x740, 768x1024 and 1024x768. Image decoding, horizontal overflow, hotel panel retention and absent geographic-focus panel were checked. The About, Insights, both full founder profile pages and candidate page HTML matched the previous release byte-for-byte. Screenshots of desktop, phone and iPad portrait layouts were inspected. These are browser-emulated checks, not physical-device certification.

Build command remains: node publish.mjs && node visual-refresh.mjs && node art-direction.mjs && node founder-profiles.mjs
