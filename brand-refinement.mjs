import { readFile, writeFile, readdir, stat, rm } from 'node:fs/promises';
import { join } from 'node:path';

// Presentation-only final pass. Run after founder-profiles.mjs.
// Keep biographies, forms, contact destinations and the hospital/hotel focus intact.
const out = join(process.cwd(), 'dist');
const photos = {
  professionals: {
    url: 'https://images.pexels.com/photos/4308091/pexels-photo-4308091.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Two professionals working together with a laptop and notebook',
    author: 'Ketut Subiyanto',
    place: 'Professional collaboration (illustrative)',
    source: 'https://www.pexels.com/photo/cheerful-young-indian-coworkers-with-laptop-discussing-project-in-office-4308091/',
    license: 'https://www.pexels.com/license/',
    width: 1400, height: 933
  },
  workshop: {
    url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&fm=jpg&q=85&w=1400',
    alt: 'Professionals taking part in a group discussion in a Bengaluru workspace',
    author: 'Smartworks Coworking',
    place: 'Bengaluru, India; group discussion (illustrative)',
    source: 'https://unsplash.com/photos/men-and-women-having-a-meeting-cW4lLTavU80',
    license: 'https://unsplash.com/license',
    width: 1400, height: 788
  }
};
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const image = (key, eager = false) => {
  const p = photos[key];
  return `<img src="assets/visual-${key}.jpg" alt="${escape(p.alt)}" width="${p.width}" height="${p.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
};
for (const [key, p] of Object.entries(photos)) {
  let bytes;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(p.url, { signal: AbortSignal.timeout(30000), redirect: 'error' });
      if (!response.ok) throw new Error(`Photo request failed: ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1000 || bytes.length > 5000000 || bytes[0] !== 255 || bytes[1] !== 216) throw new Error('Invalid photograph');
      break;
    } catch (error) {
      if (attempt === 2) throw new Error(`Cannot prepare ${key}: ${error.message}`);
    }
  }
  await writeFile(join(out, 'assets', `visual-${key}.jpg`), bytes);
}
const pages = new Map();
for (const name of await readdir(out)) {
  if (!name.endsWith('.html')) continue;
  let html = await readFile(join(out, name), 'utf8');
  const beforeForms = [...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].map(m => m[0]).join('');
  if (name === 'image-credits.html') {
    const credit = key => `<article>${image(key)}<h2>${photos[key].place}</h2><p>Photography: ${photos[key].author}</p><a href="${photos[key].source}" target="_blank" rel="noopener noreferrer">View original photograph ↗</a><p><a href="${photos[key].license}" target="_blank" rel="noopener noreferrer">Photo licence ↗</a></p></article>`;
    const oldCredit = /<article><img[^>]*src="assets\/visual-campus\.jpg"[\s\S]*?<\/article>/;
    if (!oldCredit.test(html)) throw new Error('Review classroom photo credit before replacing');
    html = html.replace(oldCredit, credit('professionals') + credit('workshop'));
  } else {
    if (name === 'index.html') {
      const candidates = /(<a class="v-audience-card" href="candidates\.html#register">)<img[^>]*>/;
      const campuses = /(<a class="v-audience-card" href="training\.html">)<img[^>]*>/;
      if (!candidates.test(html) || !campuses.test(html)) throw new Error('Review audience cards before replacing their photos');
      html = html.replace(candidates, (_, start) => start + image('professionals'));
      html = html.replace(campuses, (_, start) => start + image('workshop'));
    }
    html = html.replace(/<img\b[^>]*src="assets\/visual-campus\.jpg"[^>]*>/g, tag => image(name === 'candidates.html' ? 'professionals' : 'workshop', tag.includes('loading="eager"')));
  }
  html = html.replace('</head>', '<link rel="stylesheet" href="brand-system.css"></head>');
  html = html.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#142338">');
  if (html.includes('visual-campus.jpg')) throw new Error('Old classroom photograph remains in ' + name);
  if ([...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].map(m => m[0]).join('') !== beforeForms) throw new Error('Application form changed unexpectedly');
  // Keep image-source records, but use the public footer for visitor journeys.
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  const creditLink = '<a href="image-credits.html">Photography &amp; credits</a>';
  const rawCreditLink = '<a href="image-credits.html">Photography & credits</a>';
  if (!footer || (!footer.includes(creditLink) && !footer.includes(rawCreditLink))) {
    throw new Error('Review shared footer before changing navigation: ' + name);
  }
  const updatedFooter = footer.replace(creditLink, '<a href="index.html#contact">Contact</a>')
    .replace(rawCreditLink, '<a href="index.html#contact">Contact</a>');
  if (updatedFooter.includes('image-credits.html') || !updatedFooter.includes('https://bysauvik.com/')) {
    throw new Error('Footer navigation or developer credit changed unexpectedly: ' + name);
  }
  html = html.replace(footer, updatedFooter);
  pages.set(name, html);
  await writeFile(join(out, name), html);
}
await rm(join(out, 'assets', 'visual-campus.jpg'), { force: true });
const sources = JSON.parse(await readFile(join(out, 'image-sources.json'), 'utf8'));
delete sources.campus;
Object.assign(sources, photos);
await writeFile(join(out, 'image-sources.json'), JSON.stringify(sources, null, 2));
const ids = new Map([...pages].map(([name, html]) => [name, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))]));
for (const [name, html] of pages) {
  if (!html.includes('A unit of High Value Edge')) throw new Error('Brand affiliation missing');
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(value)) continue;
    const u = new URL(value, 'https://build.invalid/' + name);
    const file = u.pathname.slice(1) || 'index.html';
    await stat(join(out, file));
    if (u.hash && ids.has(file) && !ids.get(file).has(decodeURIComponent(u.hash.slice(1)))) throw new Error('Broken anchor: ' + value);
  }
}
const release = JSON.parse(await readFile(join(out, 'release.json'), 'utf8'));
Object.assign(release, {
  release: '2026-10-28-footer-navigation',
  footerNavigation: ['Career paths', 'Questions & answers', 'Candidate privacy', 'Contact'],
  palette: 'Navy, slate and cool grey; restrained steel-blue accents',
  founderPalette: 'Navy background, cool-grey cards and coordinated blue actions',
  candidateImagery: 'Adult professional collaboration; classroom image removed across public pages',
  campusImagery: 'Professional group discussion; no institution or partnership claim',
  visualAssets: Object.keys(sources).length
});
await writeFile(join(out, 'release.json'), JSON.stringify(release, null, 2));
console.log(`Brand refinement verified: ${pages.size} pages; replacement photos credited; forms and destinations preserved.`);
