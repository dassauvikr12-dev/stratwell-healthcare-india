'use strict';
(() => {
 const email='diptabiswas00@gmail.com',phone='917065781441';
 const scrollTo=element=>element?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
 document.querySelectorAll('[data-year]').forEach(element=>element.textContent=new Date().getFullYear());
 const menu=document.querySelector('.menu'),nav=document.querySelector('#site-nav');
 const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');};
 if(menu&&nav){
  menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',String(nav.classList.toggle('open'))));
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
 }
 document.querySelectorAll('[data-enquiry]').forEach(form=>{
  const result=form.querySelector('.enquiry-result');if(!result)return;
  const hideDraft=()=>{result.hidden=true;};
  form.addEventListener('input',hideDraft);form.addEventListener('change',hideDraft);
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const rows=[...new FormData(form).entries()].map(([key,value])=>`${key}: ${String(value).trim()||'Not provided'}`);
   const body=`Hello Dipta,\n\n${form.dataset.enquiry}\n\n${rows.join('\n')}\n\nPlease let me know the next steps.`;
   result.querySelector('textarea').value=body;
   result.querySelector('[data-email]').href=`mailto:${email}?subject=${encodeURIComponent('Hirezyy: '+form.dataset.enquiry)}&body=${encodeURIComponent(body)}`;
   result.querySelector('[data-whatsapp]').href=`https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
   result.querySelector('.result-status').textContent='Review this draft and send it through your preferred app. Nothing has been submitted automatically.';
   result.hidden=false;scrollTo(result);
  });
  result.querySelector('[data-copy]')?.addEventListener('click',async()=>{
   const area=result.querySelector('textarea'),status=result.querySelector('.result-status');
   try{await navigator.clipboard.writeText(area.value);status.textContent='Copied. Paste the enquiry into your preferred app and send it there.';}
   catch{area.focus();area.select();status.textContent='Select and copy the prepared enquiry manually.';}
  });
 });
 const contact=document.querySelector('#contact-form');
 if(contact)contact.addEventListener('submit',event=>{
  event.preventDefault();if(!contact.reportValidity())return;
  const data=new FormData(contact);
  const body='Hello Dipta,\n\nName: '+data.get('name')+'\nEmail: '+data.get('email')+'\nInterest: '+data.get('interest');
  location.href=`mailto:${email}?subject=${encodeURIComponent('Hirezyy enquiry: '+data.get('interest'))}&body=${encodeURIComponent(body)}`;
  contact.querySelector('.form-message').textContent='An email draft has been prepared. Review and send it in your email app. Nothing was submitted automatically.';
 });
 const topic=document.querySelector('#workshop-topic');
 const selectTopic=requested=>{
  if(!topic||!requested)return false;
  const chosen=[...topic.options].find(option=>option.value===requested);if(!chosen)return false;
  topic.value=chosen.value;topic.dispatchEvent(new Event('change',{bubbles:true}));
  let notice=topic.closest('form')?.querySelector('[data-topic-notice]');
  if(!notice){notice=document.createElement('p');notice.className='form-note';notice.dataset.topicNotice='';notice.setAttribute('role','status');topic.closest('form')?.prepend(notice);}
  notice.textContent='Topic selected: '+chosen.value+'. Complete your institution details to prepare an enquiry.';return true;
 };
 if(topic){selectTopic(new URLSearchParams(location.search).get('topic'));topic.addEventListener('change',()=>{const notice=topic.closest('form')?.querySelector('[data-topic-notice]');if(notice)notice.textContent=topic.value?'Topic selected: '+topic.value+'. Complete your institution details to prepare an enquiry.':'Please select a workshop topic.';});}
 document.querySelectorAll('[data-workshop-topic]').forEach(link=>{
  const requested=link.dataset.workshopTopic;
  link.href='training.html?topic='+encodeURIComponent(requested)+'#institute-enquiry';
  link.addEventListener('click',event=>{
   if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!selectTopic(requested))return;
   event.preventDefault();history.replaceState(null,'',link.href);scrollTo(document.querySelector('#institute-enquiry'));
  });
 });
 const now=new Date(),today=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
 document.querySelectorAll('[data-future-date]').forEach(input=>input.min=today);
})();
