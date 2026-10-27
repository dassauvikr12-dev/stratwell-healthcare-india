# Hirezyy footer navigation cleanup

Approved scope: remove the public Photography & credits footer link and replace it with Contact. Keep Career paths, Questions & answers and Candidate privacy. Preserve the linked bySAUVIK development credit on every page.

The existing brand-refinement.mjs final build pass updates the shared footer in all eleven published HTML pages. The existing image-credits page is retained at its direct URL but is no longer linked in public footer navigation. Image-source records and the existing photography documentation are retained; no attribution or source record is deleted.

No colour, imagery, founder biography, profile link, contact destination or form behaviour changes. The hospital/hotel positioning and current navy/slate design are unchanged. No new CV upload or backend is enabled.

Validation before publication: the generated HTML for all eleven pages differs from the previous release only in the footer-link replacement. Image-source records match the previous release. Headless Chromium checks at 1366x768, 390x844, 768x1024 and 1024x768 confirm the revised footer, Contact link, bySAUVIK link, no horizontal overflow and no page JavaScript errors. Desktop and phone footer screenshots were visually inspected. These are browser-emulated checks, not physical-device tests.
