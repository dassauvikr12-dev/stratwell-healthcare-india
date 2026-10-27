'use strict';
(() => {
 const form=document.querySelector('#candidate-application');
 if(!form)return;
 const fileInput=document.querySelector('#candidate-cv'),fileStatus=document.querySelector('#cv-status'),remove=document.querySelector('#remove-cv'),result=document.querySelector('#candidate-result');
 let selectedFile=null,fileVersion=0,validating=false;
 const scrollTo=el=>el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
 const updatePath=()=>{
  const stage=form.querySelector('[name="Career stage"]:checked')?.value;
  form.querySelectorAll('[data-career-path]').forEach(fieldset=>{const enabled=fieldset.dataset.careerPath===stage;fieldset.hidden=!enabled;fieldset.disabled=!enabled;});
  result.hidden=true;
 };
 form.querySelectorAll('[name="Career stage"]').forEach(radio=>radio.addEventListener('change',updatePath));
 document.querySelectorAll('.v-page-hero a[href="#register"]').forEach((link,i)=>link.addEventListener('click',()=>{const radio=form.querySelector('[name="Career stage"][value="'+(i===0?'Fresher':'Experienced')+'"]');if(radio){radio.checked=true;updatePath();}}));
 form.addEventListener('input',()=>{result.hidden=true;});form.addEventListener('change',()=>{result.hidden=true;});
 const clearFile=()=>{fileVersion++;selectedFile=null;validating=false;fileInput.value='';fileInput.setCustomValidity('');fileStatus.textContent='No CV selected.';fileStatus.classList.remove('v-error');remove.hidden=true;result.hidden=true;};
 remove.addEventListener('click',clearFile);
 fileInput.addEventListener('change',async()=>{
  const version=++fileVersion;selectedFile=null;validating=true;result.hidden=true;fileStatus.classList.remove('v-error');fileInput.setCustomValidity('');
  const file=fileInput.files?.[0];if(!file){clearFile();return;}
  fileStatus.textContent='Checking your selected file…';remove.hidden=false;
  let error='';const extension=file.name.split('.').pop()?.toLowerCase();
  if(!['pdf','doc','docx'].includes(extension))error='Choose a PDF, DOC or DOCX file.';
  else if(file.size===0)error='The selected file is empty. Choose another CV.';
  else if(file.size>5*1024*1024)error='The maximum CV size is 5 MB. Please select a smaller file.';
  if(!error){
   try{const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());
    const pdf=bytes[0]===0x25&&bytes[1]===0x50&&bytes[2]===0x44&&bytes[3]===0x46;
    const doc=bytes[0]===0xd0&&bytes[1]===0xcf&&bytes[2]===0x11&&bytes[3]===0xe0;
    const docx=bytes[0]===0x50&&bytes[1]===0x4b&&bytes[2]===0x03&&bytes[3]===0x04;
    if((extension==='pdf'&&!pdf)||(extension==='doc'&&!doc)||(extension==='docx'&&!docx))error='The file does not match its document format. Please select a valid CV.';
   }catch{error='This file could not be read. Please select it again.';}
  }
  if(version!==fileVersion)return;validating=false;
  if(error){fileStatus.textContent=error;fileStatus.classList.add('v-error');fileInput.setCustomValidity(error);return;}
  selectedFile=file;fileStatus.textContent=file.name+' · '+(file.size/1024/1024).toFixed(2)+' MB · Selected on this device, not uploaded.';
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();if(validating){fileStatus.textContent='Please let the file check finish, then review your application.';return;}if(!form.reportValidity())return;
  const rows=[];for(const [key,value]of new FormData(form).entries()){if(value instanceof File)continue;const text=String(value).trim();if(text)rows.push(key+': '+text);}
  if(selectedFile)rows.push('CV to attach: '+selectedFile.name);
  const body='Hello Dipta,\n\nI would like to be considered for relevant hospital or hotel opportunities through Hirezyy.\n\n'+rows.join('\n')+'\n\nPlease let me know the next steps.';
  result.querySelector('textarea').value=body;
  result.querySelector('[data-candidate-email]').href='mailto:diptabiswas00@gmail.com?subject='+encodeURIComponent('Hirezyy candidate application: '+form.elements['Full name'].value.trim())+'&body='+encodeURIComponent(body);
  result.querySelector('[data-candidate-whatsapp]').href='https://wa.me/917065781441?text='+encodeURIComponent(body);
  const share=result.querySelector('[data-share-cv]');let supported=false;try{supported=!!(selectedFile&&navigator.canShare&&navigator.canShare({files:[selectedFile]}));}catch{}
  share.hidden=!supported;result.querySelector('.v-result-status').textContent=selectedFile?'Your CV has not been uploaded. Attach it in email or WhatsApp before sending. On supported devices, Share CV & application opens your device’s sharing menu.':'Review and send from your preferred app. You can also attach your CV there. Nothing has been submitted yet.';
  result.hidden=false;scrollTo(result);
 });
 result.querySelector('[data-candidate-copy]').addEventListener('click',async()=>{const area=result.querySelector('textarea'),status=result.querySelector('.v-result-status');try{await navigator.clipboard.writeText(area.value);status.textContent='Application copied. Paste it in your email or WhatsApp, attach your CV, and send it to Dipta.';}catch{area.focus();area.select();status.textContent='Select and copy your application, then attach your CV in your chosen app.';}});
 result.querySelector('[data-share-cv]').addEventListener('click',async()=>{if(!selectedFile)return;try{await navigator.share({title:'Hirezyy candidate application',text:result.querySelector('textarea').value+'\nRecruitment contact: diptabiswas00@gmail.com / +91 70657 81441',files:[selectedFile]});result.querySelector('.v-result-status').textContent='The share hand-off has completed. Check your chosen app to confirm the recipient and delivery. This website cannot verify receipt.';}catch(error){if(error.name!=='AbortError')result.querySelector('.v-result-status').textContent='File sharing is not available here. Open email or WhatsApp and attach your CV manually.';}});
 updatePath();
})();
