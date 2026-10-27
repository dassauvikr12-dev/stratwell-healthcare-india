# Hirezyy professional colour and imagery refinement

## Requested scope
Replace the yellow classroom photograph in the candidate card and make the entire website's colour combination more professional. Keep the hotel-and-hospital positioning, Hirezyy name, High Value Edge affiliation, Poppins typography, founder portraits, biographies and working contact routes.

## Visual system
One coordinated palette across all eleven published pages: navy #142338, slate #23364e, cool-grey canvas #e8edf3, cool-grey panels #dfe6ef and restrained steel-blue accents #375f87. Remove the mixed sage/sand/mint audience colours and decorative gold gradients. Coordinate button treatments and use modest corner radii and understated borders. Founder summaries remain non-expanding, with separate biographies and Add to Calendar reminders. Phone audience cards use consistent full-width photos above the copy to preserve the people in the replacement image.

## Photos
Replace the yellow classroom asset across public pages. Candidates use a professional-collaboration photograph by Ketut Subiyanto, Pexels 4308091: https://www.pexels.com/photo/cheerful-young-indian-coworkers-with-laptop-discussing-project-in-office-4308091/ . Pexels licence: https://www.pexels.com/license/ . The campus card and other learning placements use a professional group-discussion image by Smartworks Coworking, photographed in Bengaluru: https://unsplash.com/photos/men-and-women-having-a-meeting-cW4lLTavU80 . Unsplash licence: https://unsplash.com/license . Both source pages and licences were checked. These are illustrative stock photographs, not Hirezyy employees, confirmed placements, clients or institutional partners. Credit both on the photography page. Preserve the approved hospital-corridor and hotel hero images.

## Build
Run the existing four build steps followed by `node brand-refinement.mjs`. The final pass downloads and validates the two licensed photos, replaces contextual image slots, adds static/brand-system.css last, checks internal links and confirms forms were not changed. Earlier build passes remain as existing inputs.

## Verification
Pre-release Chromium emulation checked all eleven pages at desktop 1366x768, phone 390x844, small phone 320x740, iPad portrait 768x1024 and landscape 1024x768: 55 page/viewport checks. No horizontal overflow, missing local images, expanding founder biography or page JavaScript errors. Navigation open/close checked. Desktop hero, journey cards, founders, application, training and tablet/phone screenshots inspected. Core new text/background colour pairs checked with contrast ratios of 5.25:1 or better. This is targeted contrast testing, not a full accessibility certification. Browser-emulated device views, not physical-device or Safari certification.

## Unchanged functionality
No new backend or data collection. Candidate fresher/experienced branches and local CV selection remain; direct private CV upload is still not enabled. No emails, WhatsApp messages or calendar invitations are sent by this release. No geography-based service-coverage claim is introduced.
