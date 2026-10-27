import {readFile,writeFile,readdir,rm,stat} from 'node:fs/promises';
import {join} from 'node:path';

// Final presentation pass. Regional references are an image brief, not service coverage.
// Run after publish.mjs and visual-refresh.mjs; retain all applicant and contact behaviour.
const out=join(process.cwd(),'dist');
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const photos={
 corridor:{url:'https://images.pexels.com/photos/31499386/pexels-photo-31499386/free-photo-of-healthcare-professionals-in-hospital-corridor.jpeg?auto=compress&dpr=1&h=1200&w=900',width:675,height:1200,alt:'Two nurses reviewing notes in a hospital corridor',author:'Adarsh Mp',place:'Hospital corridor in Kerala, India (illustrative)',source:'https://www.pexels.com/photo/healthcare-professionals-in-hospital-corridor-31499386/',license:'Pexels License',licenseUrl:'https://www.pexels.com/license/'},
 healthcare:{id:'1659353888906-adb3e0041693',alt:'Healthcare professional in a white coat with a stethoscope',author:'Fotos',place:'Healthcare professional portrait (illustrative)',source:'https://unsplash.com/photos/a-woman-in-a-white-coat-H9lg5Noj660'},
 reception:{id:'1519494026892-80bbd2d6fd0d',alt:'Bright hospital reception and patient-service area',author:'Martha Dominguez de Gouveia',place:'Hospital reception (illustrative)',source:'https://unsplash.com/photos/hospital-lobby-reception-with-signage-nMyM7fxpokE'}
};
await Promise.all(Object.entries(photos).map(async([key,photo])=>{
 const response=await fetch(photo.url||('https://images.unsplash.com/photo-'+photo.id+'?auto=format&fit=crop&fm=jpg&q=85&w=1400'),{signal:AbortSignal.timeout(45000),redirect:'error',headers:{'User-Agent':'Mozilla/5.0'}});
 if(!response.ok)throw new Error('Hospital image download failed: '+key+' '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length<1000||bytes.length>5000000||bytes[0]!==255||bytes[1]!==216)throw new Error('Invalid hospital photograph: '+key);
 await writeFile(join(out,'assets','visual-'+key+'.jpg'),bytes);
}));
const image=(key,eager=false)=>`<img src="assets/visual-${key}.jpg" alt="${esc(photos[key].alt)}" width="${photos[key].width||1400}" height="${photos[key].height||933}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
const credit=key=>`<article>${image(key)}<h2>${photos[key].place}</h2><p>Photography: ${photos[key].author}</p><a href="${photos[key].source}" target="_blank" rel="noopener noreferrer">View original photograph ↗</a></article>`;
const pages=new Map();
for(const name of await readdir(out)){
 if(!name.endsWith('.html'))continue;
 let html=await readFile(join(out,name),'utf8');
 if(name==='index.html'){
  const regionSection=/<section class="v-section v-regions"[^>]*>[\s\S]*?<\/section>/;
  if(!regionSection.test(html))throw new Error('Review homepage structure before removing regional coverage section');
  html=html.replace(regionSection,'').replace(/<p class="v-regional-line">[\s\S]*?<\/p>/,'');
 }
 html=html.replaceAll(' Focused on North, East and Northeast India.','');
 if(name==='image-credits.html'){
  const formerCredit=/<article><img[^>]*src="assets\/visual-clinical\.jpg"[\s\S]*?<\/article>/;
  if(!formerCredit.test(html))throw new Error('Review hospital photo credit structure');
  html=html.replace('Stock photographs are used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>.','Stock photographs are used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a> or the <a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">Pexels License</a>, according to the source.');
  html=html.replace(formerCredit,credit('healthcare')+credit('reception')+credit('corridor'));
  html=html.replaceAll('Regional and workplace photography is used to illustrate our focus. It does not identify Hirezyy employees, clients or partner institutions.','Indian places and workplace photography support the visual story, not a regional service boundary. Stock subjects are not presented as Hirezyy staff or partners.');
  html=html.replaceAll('Sources and context for Hirezyy’s illustrative India-based photography.','Sources and context for Indian location imagery and illustrative workplace photography.');
 }
 let occurrence=0;
 html=html.replace(/<img\b[^>]*src="assets\/visual-clinical\.jpg"[^>]*>/g,()=>{
  occurrence++;
  const key=name==='index.html'&&occurrence===1?'corridor':(['candidates.html','careers.html'].includes(name)?'healthcare':'reception');
  return image(key,name==='index.html'&&occurrence===1);
 });
 html=html.replace('</head>','<link rel="stylesheet" href="art-direction.css"></head>');
 if(/Our geographic focus|Rooted in India|North, East and Northeast India|NORTH · EAST · NORTHEAST INDIA|These are areas of focus|visual-clinical\.jpg|operating theatre|1719594546260-0039e7ca88c1/i.test(html))throw new Error('Unresolved geographic or surgical imagery in '+name);
 await writeFile(join(out,name),html);pages.set(name,html);
}
await rm(join(out,'assets','visual-clinical.jpg'),{force:true});
const sources=JSON.parse(await readFile(join(out,'image-sources.json'),'utf8'));
delete sources.clinical;Object.assign(sources,photos);
await writeFile(join(out,'image-sources.json'),JSON.stringify(sources,null,2));
const ids=new Map([...pages].map(([name,html])=>[name,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]))]));
for(const [name,html]of pages){
 for(const [,raw]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=raw.replaceAll('&amp;','&');if(/^(?:https?:|mailto:|tel:|data:)/.test(value))continue;
  const url=new URL(value,'https://build.invalid/'+name),file=url.pathname.slice(1)||'index.html';await stat(join(out,file));
  if(url.hash&&ids.has(file)&&!ids.get(file).has(decodeURIComponent(url.hash.slice(1))))throw new Error('Broken final link: '+name+' '+value);
 }
}
for(const page of ['index.html','about.html','insights.html'])for(const required of ['Binoy Paul','Dipta Biswas','919599332936','917065781441','calendar.google.com','diptabiswas00@gmail.com'])if(!pages.get(page).includes(required))throw new Error('Founder detail missing: '+page+' '+required);
for(const required of ['value="Fresher"','value="Experienced"','type="file"','Direct website uploads are not connected yet.'])if(!pages.get('candidates.html').includes(required))throw new Error('Candidate flow changed unexpectedly');
const release=JSON.parse(await readFile(join(out,'release.json'),'utf8'));
Object.assign(release,{release:'2026-10-27-hospital-imagery-founder-colours',visualAssets:Object.keys(sources).length,geography:'Image inspiration only; regional service-area messaging removed',hospitalImagery:'Hospital corridor with nursing staff in the homepage hero; non-surgical imagery retained elsewhere',heroImage:'assets/visual-corridor.jpg',founderPalette:'Deep teal, warm ivory and brass accents'});
await writeFile(join(out,'release.json'),JSON.stringify(release,null,2));
console.log('Art direction verified:',pages.size,'pages; no regional coverage claims or operating-theatre imagery; founder contacts and candidate flow retained.');
