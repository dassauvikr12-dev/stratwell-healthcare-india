# Hirezyy visual journey release

Build: `node publish.mjs && node visual-refresh.mjs`. Vercel uses this exact command in vercel.json. The second step creates the current public page bodies, keeping the verified founder photographs and source enquiry forms. Edit visual-refresh.mjs for public content; static/visual.css and static/visual.js hold the new layout and candidate interaction. The original source templates remain for original forms and biographies.

## Approved scope
Hospital and hotel recruitment only; Hirezyy, a unit of High Value Edge; single-family Poppins typography and the established teal/cream palette. Visual geography is North, East and Northeast India, with Delhi, Kolkata and Guwahati reference photography. No branch offices, clients, college partnerships or academic qualifications are invented.

## Photography
Eight free-to-use photographs under the Unsplash License are downloaded at build time and served locally from dist/assets. image-credits.html and image-sources.json identify photographers and source pages. Stock photos are illustrative and not endorsements. No raw user CVs or private contact records belong in Git.

## Founders
Compact photo/identity/contact cards; full biographies remain accessible under Read full profile on the about page. Binoy: +91 95993 32936, email not supplied. Dipta: +91 70657 81441, diptabiswas00@gmail.com. Google Calendar remains a personal event draft, not a booking or live availability service.

## Candidate flow
Fresher and Experienced branches conditionally show appropriate fields. PDF/DOC/DOCX selection supports a 5 MB limit, basic format checks, removal and native file sharing when supported. File selection is local only. The interface explicitly says files are NOT uploaded. Visitors review an application, then send it through email/WhatsApp and attach the CV manually, or use their device share sheet. No success message claims server receipt.

Direct private CV storage remains pending Vercel team authorization. Do not expose applicant CVs in a public storage bucket or use a public repository to receive them. Server-side upload, access control, abuse controls and retention handling must be connected and verified before replacing the attachment-only disclosure.

Client, candidate and recruiter portals remain Phase 2. Existing hospital/college logo approvals and final domain remain outside this release.
