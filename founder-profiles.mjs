import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';

// Final founder presentation: dedicated biographies, stable portraits, honest calendar actions.
// Run after art-direction.mjs. Do not change recruitment copy or candidate data handling.
const out=join(process.cwd(),'dist');
const about=await readFile(join(out,'about.html'),'utf8');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const people=[
 {id:'binoy-paul',name:'Binoy Paul',image:'binoy-paul-enhanced.webp',strap:'Hospitality, people management & operational leadership.',phone:'919599332936',display:'+91 95993 32936'},
 {id:'dipta-biswas',name:'Dipta Biswas',image:'dipta-biswas.webp',strap:'Hospital operations, partnerships & talent development.',phone:'917065781441',display:'+91 70657 81441',email:'diptabiswas00@gmail.com'}
];
const note='Confirm a time with the founder first. Add to Calendar creates a reminder, not a booking.';
for(const p of people){
 const card=about.match(new RegExp('<article class="v-founder-card" id="'+p.id+'">([\\s\\S]*?)</article>'))?.[1];
 const bio=card?.match(/<details class="v-biography"><summary>[^<]*<\/summary>([\s\S]*?)<\/details>/)?.[1];
 const actions=card?.match(/<div class="v-founder-actions">[\s\S]*?<\/div>/)?.[0];
 if(!bio||!actions)throw new Error('Review source biography and actions for '+p.id);
 p.bio=bio;p.actions=actions;
}
function calendarLabel(html){
 return html.replace(/(<a\b[^>]*href="https:\/\/calendar\.google\.com\/[^>]*>)[\s\S]*?<\/a>/g,(_,open)=>open+'Add to Calendar</a>');
}
function photo(p,eager=false){return `<img src="assets/${p.image}" alt="${escape(p.name)}, Founder of Hirezyy" width="900" height="1125" loading="${eager?'eager':'lazy'}" decoding="async">`;}
function compact(p,id=''){
 return `<article class="v-founder-card"${id?` id="${id}"`:''}><div class="v-founder-portrait">${photo(p)}</div><div class="v-founder-copy"><header class="v-founder-identity"><p class="eyebrow teal">Founder</p><h3>${p.name}</h3><p>${escape(p.strap)}</p></header>${calendarLabel(p.actions)}<a class="arrow-link v-profile-link" href="${p.id}.html" aria-label="View ${p.name}’s full profile">View full profile <span aria-hidden="true">↗</span></a></div></article>`;
}
function common(html){
 html=calendarLabel(html);
 html=html.replace(/<p id="calendar-help">[\s\S]*?<\/p>/g,`<p id="calendar-help">${note}</p>`);
 if(!html.includes('href="founder-profiles.css"'))html=html.replace('</head>','<link rel="stylesheet" href="founder-profiles.css"></head>');
 return html;
}
const pages=new Map();
for(const name of await readdir(out)){
 if(!name.endsWith('.html'))continue;
 let html=await readFile(join(out,name),'utf8');
 html=html.replace(/<article class="v-founder-card"(?: id="([^"]+)")?>[\s\S]*?<\/article>/g,(block,id)=>{
  const person=people.find(p=>block.includes('<h3>'+p.name+'</h3>'));
  if(!person)throw new Error('Unknown founder in '+name);
  return compact(person,id||'');
 });
 pages.set(name,common(html));
}
for(const p of people){
 const other=people.find(f=>f.id!==p.id);
 const main=`<main id="top"><section class="fp-hero"><div class="v-wrap"><a class="fp-back" href="about.html#leadership"><span aria-hidden="true">←</span> Meet our founders</a><div class="fp-intro"><div class="fp-portrait">${photo(p,true)}</div><div class="fp-identity"><p class="eyebrow">Founder · Hirezyy</p><h1>${p.name}</h1><p class="fp-strap">${escape(p.strap)}</p><p class="fp-affiliation">A unit of High Value Edge</p>${calendarLabel(p.actions)}<p class="fp-calendar-note" id="calendar-help">${note}</p></div></div></div></section><section class="fp-biography"><div class="v-wrap fp-reading-grid"><aside><p class="eyebrow teal">The experience behind the perspective</p><h2>Professional background</h2><div class="fp-contact"><a href="tel:+${p.phone}">${p.display}</a>${p.email?`<a href="mailto:${p.email}">${p.email}</a>`:''}</div></aside><div class="fp-reading">${p.bio}</div></div></section><section class="fp-next"><div class="v-wrap"><div><p class="eyebrow teal">People behind Hirezyy</p><h2>Meet ${other.name}</h2><p>${escape(other.strap)}</p></div><a class="button dark" href="${other.id}.html">View founder profile <span aria-hidden="true">↗</span></a></div></section></main>`;
 let html=about.replace(/<main id="top">[\s\S]*?<\/main>/,main);
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${p.name} | Founder | Hirezyy</title>`)
  .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape('Meet '+p.name+', Founder of Hirezyy. '+p.strap)}">`)
  .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${p.name} | Founder | Hirezyy">`)
  .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${escape(p.strap)}">`)
  .replace('data-page="about"',`data-page="${p.id}"`);
 pages.set(p.id+'.html',common(html));
}
const ids=new Map([...pages].map(([name,html])=>[name,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
for(const [name,html]of pages){
 const all=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(all.length!==ids.get(name).size)throw new Error('Duplicate id: '+name);
 if(/class="v-biography"|>Calendar draft<|>Google Calendar draft</i.test(html))throw new Error('Old founder interaction remains: '+name);
 for(const [,raw]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=raw.replaceAll('&amp;','&');if(/^(?:https?:|mailto:|tel:|data:)/.test(value))continue;
  const url=new URL(value,'https://build.invalid/'+name),file=url.pathname.slice(1)||'index.html';
  if(!pages.has(file))await stat(join(out,file));
  if(url.hash&&ids.has(file)&&!ids.get(file).has(decodeURIComponent(url.hash.slice(1))))throw new Error('Broken link: '+name+' '+value);
 }
 await writeFile(join(out,name),html);
}
for(const name of ['index.html','about.html','insights.html']){
 const html=pages.get(name);
 for(const p of people)if(!html.includes('href="'+p.id+'.html"'))throw new Error('Profile link missing in '+name);
 if((html.match(/class="v-founder-card"/g)||[]).length!==2)throw new Error('Founder card count changed: '+name);
}
for(const p of people)if(!pages.get(p.id+'.html').includes(p.bio))throw new Error('Biography changed: '+p.id);
const release=JSON.parse(await readFile(join(out,'release.json'),'utf8'));
Object.assign(release,{release:'2026-10-27-founder-profile-pages',founderProfiles:people.map(p=>'/'+p.id),founderCards:'Non-expanding cards with separate full-profile pages',calendarLabel:'Add to Calendar',calendar:'Personal reminders only; direct time confirmation required'});
await writeFile(join(out,'release.json'),JSON.stringify(release,null,2));
console.log('Founder release verified:',pages.size,'pages, unchanged biographies, separate profiles, stable cards and Add to Calendar actions.');
