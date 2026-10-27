import { readFile, writeFile, readdir, mkdir, rm, cp, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

// A dependency-free static build. Existing source pages remain the editable templates.
// Only dist/ is published. Do not add credentials, candidate records or client data here.
const root = process.cwd();
const out = resolve(root, 'dist');
if (out !== join(root, 'dist')) throw new Error('Invalid build destination');
const required = ['index.html', 'about.html', 'insights.html', 'client-update.js', 'hirezyy.css', 'phase1.js', 'assets/binoy-paul.avif'];
for (const file of required) await stat(join(root, file));
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">';
const tagline = 'Connecting the Right Talent with the Right Opportunity';
const promise = 'Faster, Smarter, and More Reliably.';
const brand = text => text
  .replace(/Stratwell Health Talent/g, 'Hirezyy')
  .replace(/STRATWELL HEALTH TALENT/g, 'HIREZYY')
  .replace(/Stratwell/g, 'Hirezyy').replace(/STRATWELL/g, 'HIREZYY')
  .replace(/stratwell/g, 'hirezyy')
  .replace(/Founder(?:’|'|&#8217;)s Desk/g, 'Founders’ Desk');

function replaceOnce(text, expression, replacement, description) {
  if (!expression.test(text)) throw new Error('Source changed; review ' + description);
  return text.replace(expression, replacement);
}
const portrait = '<img src="assets/binoy-paul.avif" alt="Binoy Paul, Founder" width="560" height="420" loading="lazy" decoding="async">';
const founderCards = `<div class="hirezyy-founder-grid">
  <article class="hirezyy-founder-card"><div class="hirezyy-founder-photo">${portrait}</div><div class="hirezyy-founder-copy"><p class="eyebrow teal">Founder</p><h3>Binoy Paul</h3><p>Over two decades across hospitality and supply chain, bringing people management, operational leadership and business understanding to recruitment.</p><a class="arrow-link" href="about.html#binoy-paul">Meet Binoy <span aria-hidden="true">→</span></a></div></article>
  <article class="hirezyy-founder-card"><div class="hirezyy-founder-monogram" aria-hidden="true"><span>DB</span><small>Healthcare. People. Purpose.</small></div><div class="hirezyy-founder-copy"><p class="eyebrow teal">Founder</p><h3>Dipta Biswas</h3><p>Experience across healthcare, hospitality and service businesses, connecting hospital operations, team development and institutional relationships.</p><a class="arrow-link" href="about.html#dipta-biswas">Meet Dipta <span aria-hidden="true">→</span></a></div></article>
</div>`;
const binoyProfile = `<article class="hirezyy-profile" id="binoy-paul">
  <div class="hirezyy-profile-visual"><div class="hirezyy-founder-photo">${portrait}</div><p class="hirezyy-profile-caption">Binoy Paul <span>Founder · Hirezyy</span></p></div>
  <div class="hirezyy-profile-body"><p class="eyebrow teal">Founder</p><h3>Binoy Paul</h3><p class="profile-strap">Hospitality · supply chain · people management · operational leadership</p>
  <p>With over two decades of professional experience spanning the hospitality and supply chain industries, Binoy Paul brings a unique combination of people management, operational leadership and business understanding to the recruitment and manpower placement sector.</p>
  <p>A Hotel Management graduate from the Institute of Hotel Management (IHM), Guwahati, with an MBA in Event Management, Binoy began his career in hospitality. He gained extensive experience in Food &amp; Beverage Service, Banquet Operations and Event Management in India and the UK.</p>
  <p>During his hospitality career, he worked with Goa Marriott, Hyatt Regency Delhi, East West Food Group Birmingam UK, Viceroy Marriott Hyderabad, Eros Hilton Delhi, The Park Delhi, Radisson Blu Guwahati and Clarks Inn Suites Gaziabad. These experiences helped him develop a strong foundation in customer service, team leadership, workforce coordination and operational excellence.</p>
  <p>He subsequently transitioned into supply chain management, where he spent over a decade with Delhivery Ltd., gaining hands-on experience across administration, procurement, third-party fleet operations and owned fleet operations. This journey provided valuable insights into manpower planning, resource allocation, vendor management, operational efficiency and the importance of having the right people in the right roles.</p>
  <p class="hirezyy-background-note">The organisations named here describe Binoy’s professional experience. They are not presented as Hirezyy clients, partners or endorsements.</p></div>
</article>`;
const values = `<section class="hirezyy-values" aria-label="The Hirezyy approach">
 <article><span>01 / Role fit</span><h3>Understand the work.</h3><p>Build the hiring brief around qualifications, experience, team needs and joining expectations.</p></article>
 <article><span>02 / Readiness</span><h3>Prepare the people.</h3><p>Connect career preparation and institutional workshops with the realities of the workplace.</p></article>
 <article><span>03 / Coordination</span><h3>Keep hiring moving.</h3><p>Support shortlisting, interviews, offers and joining with clear, human-led communication.</p></article>
</section>`;

const built = new Map();
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(html|css|js)$/.test(entry.name)) continue;
  if (entry.name === 'script.js' || entry.name === 'portal.css') continue; // Phase 2 demo source retained but not published.
  let text = brand(await readFile(join(root, entry.name), 'utf8'));
  if (entry.name.endsWith('.html')) {
    text = text.replace(/<span class="brand-mark">S<\/span>/g, '<span class="brand-mark" aria-hidden="true">H</span>')
      .replace(/<span>HIREZYY<small>HEALTH TALENT<\/small><\/span>/g, '<span class="brand-wordmark">Hirezyy<small>A unit of High Value Edge</small></span>')
      .replace(/<a href="training.html">Training<\/a>/g, '<a href="training.html">Training &amp; workshops</a>')
      .replace(/<a([^>]*?)href="index.html#platform"([^>]*?)>[\s\S]*?<\/a>/g, '<a$1href="about.html#roadmap"$2>Our development roadmap →</a>')
      .replace(/<link[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g, '')
      .replace(/<link[^>]*href="portal.css"[^>]*>/g, '')
      .replace('</head>', fonts + '<link rel="stylesheet" href="hirezyy.css"></head>');
    if (entry.name === 'index.html') {
      text = replaceOnce(text, /<div class="hero-copy">[\s\S]*?(?=\s*<div class="hero-art")/, `<div class="hero-copy"><p class="eyebrow"><span class="eyebrow-dot"></span>Healthcare recruitment · Training · Industry connect</p><h1>Better hiring.<br><em>Stronger care teams.</em></h1><p class="hirezyy-tagline">${tagline}<span>${promise}</span></p><p class="intro">A healthcare talent partner for hospitals, professionals and institutions. We bring role-focused screening, career readiness and human-led coordination together.</p><div class="actions"><a class="button light" href="employers.html#requirements">Hire healthcare talent <span aria-hidden="true">→</span></a><a class="button hero-secondary" href="candidates.html#register">Find opportunities <span aria-hidden="true">↗</span></a></div><a class="hirezyy-campus-link" href="training.html#institute-enquiry">For institutions: plan a workshop <span aria-hidden="true">→</span></a><div class="trust"><span><b>Role-focused</b> sourcing &amp; screening</span><span><b>Human-led</b> coordination</span><span><b>Career-ready</b> connections</span></div></div>`, 'homepage hero');
      text = replaceOnce(text, /<section class="statement">[\s\S]*?<\/section>/, '<section class="statement"><p>The right hire starts with understanding the role, the workplace and the person.</p><a href="#approach">Our approach <span aria-hidden="true">↓</span></a></section>' + values, 'value proposition');
      text = replaceOnce(text, /<div class="founder-heading">[\s\S]*?(?=\s*<div class="founder-insight-grid")/, `<div class="hirezyy-founders-heading"><div><p class="eyebrow teal">People behind the purpose</p><h2 id="founder-title">From the<br>Founders’ Desk</h2></div><p>Meet the people behind Hirezyy. Experience across healthcare, hospitality and supply chain informs our approach to people, preparation and recruitment.</p></div>${founderCards}<div class="hirezyy-insights-label"><p class="eyebrow teal">Perspectives on better healthcare teams</p><h3>Ideas that inform our approach.</h3></div>`, 'two-founder section');
      text = replaceOnce(text, /<section class="jobs" id="jobs">[\s\S]*?<\/section>/, '<section class="hirezyy-career-callout" id="jobs"><div><p class="eyebrow teal">Healthcare careers</p><h2>Your next step starts<br>with a conversation.</h2><p>Tell us your qualifications, experience and preferred role. Our team will discuss relevant opportunities as requirements become available.</p></div><a class="button dark" href="candidates.html#register">Share your career interests <span aria-hidden="true">→</span></a></section>', 'replace illustrative vacancies');
      text = replaceOnce(text, /<section class="platform-intro" id="platform">[\s\S]*?<\/section>/, '', 'defer demo portals');
      text = replaceOnce(text, /<div class="modal" id="login-modal"[\s\S]*?(?=\s*<script src="script.js")/, '', 'remove public demo login');
      text = text.replace('<script src="script.js"></script>', '<script src="phase1.js"></script>');
      text = text.replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="Hirezyy, a unit of High Value Edge: healthcare recruitment, career preparation, workshops and industry connect for hospitals, professionals and institutions.">')
        .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, '<meta property="og:title" content="Hirezyy | Healthcare Recruitment, Training & Industry Connect">')
        .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, '<meta property="og:description" content="Connecting the Right Talent with the Right Opportunity. Faster, Smarter, and More Reliably. A unit of High Value Edge.">')
        .replace(/<title>[\s\S]*?<\/title>/, '<title>Hirezyy | Healthcare Recruitment, Training &amp; Industry Connect</title>');
    }
    if (entry.name === 'about.html') {
      text = replaceOnce(text, /(<section id="leadership"[^>]*>)[\s\S]*?(?=<article class="leader-profile">)/, '$1<p class="eyebrow teal">Our founders</p><h2>Experience behind<br>every connection.</h2>' + binoyProfile, 'Binoy full founder profile');
      text = text.replace('<article class="leader-profile">', '<article class="leader-profile" id="dipta-biswas">').replace('<h3>Dipta Biswas</h3>', '<p class="eyebrow teal">Founder</p><h3>Dipta Biswas</h3>');
      text = replaceOnce(text, /<section id="roadmap"[\s\S]*?<\/section>/, '<section id="roadmap" class="detail-section"><p class="eyebrow teal">A phased approach</p><h2>People first.<br>Technology as we grow.</h2><div class="detail-grid"><article class="detail-card"><h3>Phase 1 · Human-led connections</h3><p>A clear website for healthcare recruitment, founder perspectives, institutional workshops and enquiries handled by the team.</p></article><article class="detail-card"><h3>Phase 2 · Connected operations</h3><p>Client, candidate and recruiter portals, together with workflow automation, are planned as recruitment requirements grow. These features are not currently live.</p></article></div></section>', 'agreed phased roadmap');
    }
    if (entry.name === 'insights.html') {
      const note = `<section class="hirezyy-founder-feature" aria-labelledby="binoy-insights-title"><div class="hirezyy-founder-photo">${portrait}</div><div><p class="eyebrow teal">Meet another founder</p><h2 id="binoy-insights-title">Binoy Paul</h2><p>Over two decades in hospitality and supply chain have shaped Binoy’s understanding of people management, workforce coordination and operational leadership. His experience brings another perspective to Hirezyy’s recruitment journey.</p><a class="arrow-link" href="about.html#binoy-paul">Read Binoy’s founder profile <span aria-hidden="true">→</span></a></div></section>`;
      text = replaceOnce(text, /(?=<section class="insight-library")/, note, 'Binoy presence on founders desk');
      text = text.replace('href="about.html#leadership">Meet Dipta', 'href="about.html#dipta-biswas">Meet Dipta');
    }
    if (!text.includes('A unit of High Value Edge')) throw new Error('Missing parent-brand affiliation in ' + entry.name);
  }
  if (entry.name === 'typography.css') text = text.replace(/@import\s+url\([^;]*fonts\.googleapis\.com[^;]*\);\s*/g, '');
  await writeFile(join(out, entry.name), text);
  built.set(entry.name, text);
}
await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });

// Fail the release rather than publish a partial rebrand or broken internal links.
const ids = new Map([...built].filter(([name]) => name.endsWith('.html')).map(([name, text]) => [name, new Set([...text.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))]));
for (const [name, text] of built) {
  if (/stratwell/i.test(text)) throw new Error('Unreplaced brand in ' + name);
  if (!name.endsWith('.html')) continue;
  const allIds = [...text.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(allIds).size !== allIds.length) throw new Error('Duplicate HTML ids in ' + name);
  for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [target, hash] = url.split('#');
    const file = target || name;
    if (hash && ids.has(file) && !ids.get(file).has(hash)) throw new Error('Broken anchor ' + name + ' → ' + url);
    if (target && !built.has(target) && !target.startsWith('assets/')) throw new Error('Missing linked file ' + name + ' → ' + url);
  }
}
const home = built.get('index.html');
for (const expected of ['Binoy Paul', 'Dipta Biswas', 'High Value Edge', 'Hirezyy', 'assets/binoy-paul.avif', tagline, 'training.html', 'diptabiswas00@gmail.com']) {
  if (!home.includes(expected)) throw new Error('Missing homepage content: ' + expected);
}
if (/id="(?:login-modal|portal-shell)"|data-demo-role|Explore Talent Portal/.test(home)) throw new Error('Phase 2 demo is still published on the homepage');
await writeFile(join(out, 'release.json'), JSON.stringify({ brand: 'Hirezyy', release: '2026-10-27-founder-rebrand', phase: 1, founders: ['Binoy Paul', 'Dipta Biswas'], parent: 'High Value Edge', font: 'Poppins' }, null, 2));
console.log('Hirezyy build passed:', ids.size, 'pages; branding, founders, links and Phase 1 checks complete.');
