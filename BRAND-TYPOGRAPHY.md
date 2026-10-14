# Stratwell Health Talent: typography standard

## One family

Use **Poppins**, a sans-serif family, for all new Stratwell website text, social posts, workshop posters, recruitment creatives, presentations and brochures. Do not combine it with a serif or a second decorative family.

| Purpose | Poppins style |
| --- | --- |
| Body copy and descriptions | Regular, 400 |
| Labels, supporting lines and editorial quotations | Medium, 500 |
| Headings, card titles and buttons | SemiBold, 600 |
| Select short headline emphasis | Bold, 700 |

Create hierarchy with size, weight, spacing and colour, not a change of family. Avoid Thin and Light for small text. Do not use all-capitals for paragraphs. In Canva, choose Poppins for every text box and use the corresponding weights above. The same standard applies to future social templates; existing Canva designs have not been edited by this website release.

## Website implementation

`styles.css` imports `typography.css`, which loads Poppins 400, 500, 600 and 700 through the Google Fonts CSS API with `display=swap`. The shared family guard also covers legacy component styles and dynamically generated portal screens. Arial and generic sans-serif are fallbacks for unavailable webfonts, not additional brand typefaces.

The main heading scale and line heights have been adjusted for the sans-serif family. Existing content, enquiry behavior, programme details, contact data, imagery, colours and linked bySAUVIK logo artwork are preserved. Text remains HTML text, rather than being flattened into images.

## Search and performance

Treat this as a readability and brand-consistency decision, not a promise of higher search rankings. Google's technical indexing requirements concern accessible working pages and indexable content. Font provider choice is not an indexing requirement. Keep font requests limited and review real loading performance separately.

## Reference sources

- Google Fonts Poppins specimen: https://fonts.google.com/specimen/Poppins
- Canva's official Design DNA 2025 font coverage: https://www.canva.com/newsroom/news/design-dna-2025/
- Google Fonts CSS API: https://developers.google.com/fonts/docs/css2
- Google Search technical requirements: https://developers.google.com/search/docs/essentials/technical

No font files are distributed with this repository update. Availability was checked against the official public sources above; no access to the client's Canva Brand Kit is assumed.
