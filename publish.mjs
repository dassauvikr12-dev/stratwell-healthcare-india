import {readFile,writeFile,readdir,mkdir,rm,cp,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';

// Publish only the current, hospital-and-hotel Phase 1 site. Legacy templates stay archived.
const root=process.cwd(), source=join(root,'static'), out=join(root,'dist');
if(resolve(out)!==resolve(root,'dist')) throw new Error('Invalid output path');
const assets=[
 {file:'binoy-paul-enhanced.webp',url:'https://d2ol7oe51mr4n9.cloudfront.net/user_3KXMEC82VhzIuJYrCREy48wyvlo/d3cd6a2a-10e1-4ae3-9554-6ea68d258979.webp',sha256:'1029d05ffefe79c838577593d5ac1320d73f3bdc4d9688d447006ca659153a21',bytes:143326},
 {file:'dipta-biswas.webp',url:'https://d2ol7oe51mr4n9.cloudfront.net/user_3KXMEC82VhzIuJYrCREy48wyvlo/77484e5a-d66f-416a-82f9-3ad4a8b89f6e.webp',sha256:'a65583393c095f1feec89f813da0cc748c3d58252e5e40334357526d699fb61a',bytes:108782}
];
await stat(source);
await rm(out,{recursive:true,force:true});
await cp(source,out,{recursive:true});
await mkdir(join(out,'assets'),{recursive:true});
for(const asset of assets){
 let bytes;
 try {bytes=await readFile(join(root,'assets',asset.file));} catch {}
 const valid=data=>data&&data.length===asset.bytes&&createHash('sha256').update(data).digest('hex')===asset.sha256;
 if(!valid(bytes)){
  const response=await fetch(asset.url,{signal:AbortSignal.timeout(30000),redirect:'error'});
  if(!response.ok)throw new Error('Portrait download failed: '+asset.file+' '+response.status);
  bytes=Buffer.from(await response.arrayBuffer());
 }
 if(!valid(bytes)||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw new Error('Invalid portrait: '+asset.file);
 await writeFile(join(out,'assets',asset.file),bytes);
}
const calendarNote='<p class="calendar-note">Google Calendar opens a personal event draft, not a booked appointment. Confirm a time with the founder by WhatsApp or phone before saving it.</p>';
const pages=new Map();
for(const name of await readdir(out)){
 if(!name.endsWith('.html'))continue;
 let html=await readFile(join(out,name),'utf8');
 html=html.replaceAll('assets/binoy-paul-enhanced.svg','assets/binoy-paul-enhanced.webp').replaceAll('assets/dipta-biswas.svg','assets/dipta-biswas.webp');
 html=html.replace(/<img src="(assets\/(?:binoy-paul-enhanced|dipta-biswas)\.webp)"([^>]*)>/g,'<img src="$1"$2 width="900" height="1125" loading="lazy" decoding="async">');
 html=html.replace(/<a href="https:\/\/calendar\.google\.com\/calendar\/render\?([^"]+)"[^>]*>Google Calendar<\/a>/g,(_,query)=>{
  const url=new URL('https://calendar.google.com/calendar/render?'+query.replaceAll('&amp;','&'));
  const binoy=(url.searchParams.get('text')||'').includes('Binoy');
  url.searchParams.set('details','Personal reminder only. Confirm the date and time with '+(binoy?'Binoy Paul (+91 95993 32936)':'Dipta Biswas (+91 70657 81441)')+' before saving. This link does not reserve availability or send a booking to Hirezyy.');
  return '<a href="'+url.toString().replaceAll('&','&amp;')+'" target="_blank" rel="noopener noreferrer" aria-label="Open a personal Google Calendar draft for '+(binoy?'Binoy Paul':'Dipta Biswas')+'">Google Calendar draft</a>';
 });
 html=html.replace(/(<div class="founder-actions">[\s\S]*?<\/div>)/g,'$1'+calendarNote);
 html=html.replace('<nav id="site-nav">','<nav id="site-nav" aria-label="Main navigation">');
 if(!html.includes('class="skip-link"'))html=html.replace('<body>','<body><a class="skip-link" href="#top">Skip to content</a>');
 html=html.replace(/<button class="menu"([^>]*)>/g,(whole,attrs)=>attrs.includes('aria-controls')?whole:'<button class="menu"'+attrs+' aria-controls="site-nav">');
 html=html.replaceAll('Hirezyy was formalised as a unit of High Value Edge to connect hospital and hotel talent faster, smarter and more reliably.','The founders brought their experience together to develop Hirezyy, a unit of High Value Edge focused on hospital and hotel recruitment.');
 html=html.replaceAll('Hirezyy was formalised in 2026 as a unit of High Value Edge to focus on these two people-intensive sectors: hotels and hospitals.','In 2026, this experience shaped the decision to develop Hirezyy as a unit of High Value Edge, focused on two people-intensive sectors: hotels and hospitals.');
 if(name==='index.html'){
  html=html.replace('Better people.<br><em>Stronger service teams.</em>','The right people.<br><em>Better service &amp; care.</em>');
  html=html.replace('<section class="campus">','<section class="campus" id="campus">');
  html=html.replace('</section><section class="campus"','<p class="founder-insights-link"><a class="arrow-link" href="insights.html">Read the founders’ insights <span aria-hidden="true">→</span></a></p></section><section class="campus"');
 }
 if(name==='about.html'){
  html=html.replace('His career included Goa Marriott, Hyatt Regency Delhi, East West Food Group Birmingham UK, Viceroy Marriott Hyderabad, Eros Hilton Delhi, The Park Delhi, Radisson Blu Guwahati and Clarks Inn Suites Ghaziabad. He later spent more than a decade with Delhivery Ltd. across administration, procurement and fleet operations.','His hospitality career included Goa Marriott, Hyatt Regency Delhi, East West Food Group in Birmingham, UK, Viceroy Marriott Hyderabad, Eros Hilton Delhi, The Park Delhi, Radisson Blu Guwahati and Clarks Inn Suites Ghaziabad. These experiences built a foundation in customer service, team leadership, workforce coordination and operational excellence.</p><p>He subsequently spent more than a decade with Delhivery Ltd., working across administration, procurement, third-party fleet operations and owned fleet operations. This provided hands-on understanding of manpower planning, resource allocation, vendor management and the importance of placing the right people in the right roles.');
  html=html.replace('His experience informs Hirezyy’s focus on service standards, operational fit, workforce readiness and clear communication throughout the hiring journey.','At Medanta The Medicity Hospital, Gurgaon (2014–2025), his work included business development, stakeholder engagement, vendor management, hospital operations and audit coordination. His subsequent assisted-living experience at Aurum Living included resident services, team leadership and hospital and doctor relationships.</p><p>Earlier hospitality experience and training-and-placement coordination inform his approach to service standards, workplace readiness and career preparation.</p><p class="hirezyy-background-note">The organisations named here describe Dipta’s professional experience. They are not presented as Hirezyy clients, partners or endorsements.');
  html=html.replace('<section id="roadmap"','<section class="detail-section"><p class="eyebrow teal">Our purpose</p><h2>Recruitment that understands the workplace.</h2><p>Hotels and hospitals depend on people who combine role-specific skills with communication, service awareness, reliability and operational discipline. We aim to connect that understanding with thoughtful screening, clear joining expectations and practical career preparation.</p><p>Our institutional programmes connect academic learning with real workplace expectations, helping students prepare for employer conversations without promising placements.</p><h3>Our vision</h3><p>To build a recruitment brand professionals can depend on for their careers and organisations can rely on for thoughtful sourcing.</p></section><section id="roadmap"');
  html=html.replace('Client, candidate and recruiter portals, structured pipelines, dashboards and workflow automation.','Client, candidate and recruiter portals, structured pipelines, dashboards and workflow automation are planned as requirements grow. These features are not currently live.');
 }
 html=html.replace('</head>','<link rel="stylesheet" href="release.css"></head>');
 pages.set(name,html);
 await writeFile(join(out,name),html);
}
const ids=new Map([...pages].map(([name,html])=>[name,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
for(const [name,html] of pages){
 const all=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(all).size!==all.length)throw new Error('Duplicate id: '+name);
 if(!html.includes('A unit of High Value Edge'))throw new Error('Missing affiliation: '+name);
 if(/stratwell|binoy-paul-enhanced\.svg|dipta-biswas\.svg|data-demo-role/i.test(html))throw new Error('Legacy content: '+name);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=m[1].replaceAll('&amp;','&');
  if(/^(?:https?:|mailto:|tel:|data:)/.test(value))continue;
  const target=new URL(value,'https://build.invalid/'+name),file=decodeURIComponent(target.pathname.slice(1))||'index.html';
  await stat(join(out,file));
  if(target.hash&&ids.has(file)&&!ids.get(file).has(decodeURIComponent(target.hash.slice(1))))throw new Error('Broken anchor: '+name+' '+value);
 }
}
for(const word of ['Hospital','Hotel','Binoy Paul','Dipta Biswas','Google Calendar draft','95993 32936'])if(!pages.get('index.html').includes(word))throw new Error('Homepage requirement missing: '+word);
await writeFile(join(out,'release.json'),JSON.stringify({brand:'Hirezyy',release:'2026-10-27-hospitals-hotels-portraits',phase:1,sectors:['Hospitals','Hotels'],parent:'High Value Edge',font:'Poppins',founders:['Binoy Paul','Dipta Biswas'],calendar:'personal drafts only',portraits:assets.map(({file,sha256,bytes})=>({file,sha256,bytes})),commit:process.env.VERCEL_GIT_COMMIT_SHA||null},null,2));
console.log('Verified',pages.size,'pages, both high-resolution portraits, all internal links and Phase 1 release.');
