'use strict';
(() => {
  const email = 'diptabiswas00@gmail.com';
  const phone = '917065781441';
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const menu = document.querySelector('.menu');
  const navigation = document.querySelector('#main-navigation');
  // The existing homepage script already owns its menu.
  if (!document.querySelector('#login-modal') && menu && navigation) {
    menu.addEventListener('click', () => {
      menu.setAttribute('aria-expanded', String(navigation.classList.toggle('open')));
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navigation.classList.contains('open')) {
        navigation.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.focus();
      }
    });
  }
  document.querySelectorAll('[data-enquiry]').forEach(form => {
    const result = form.querySelector('.enquiry-result');
    form.addEventListener('input', () => { result.hidden = true; });
    form.addEventListener('change', () => { result.hidden = true; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const rows = [...new FormData(form).entries()].map(([label, value]) => `${label}: ${String(value).trim() || 'Not provided'}`);
      const body = `Hello Dipta,\n\n${form.dataset.enquiry}\n\n${rows.join('\n')}\n\nPlease let me know the next steps.`;
      result.querySelector('textarea').value = body;
      result.querySelector('[data-email]').href = `mailto:${email}?subject=${encodeURIComponent('Stratwell: ' + form.dataset.enquiry)}&body=${encodeURIComponent(body)}`;
      result.querySelector('[data-whatsapp]').href = `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
      result.querySelector('.result-status').textContent = 'Review the message and send it through your preferred app. It has not been sent yet.';
      result.hidden = false;
      result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    form.querySelector('[data-copy]').addEventListener('click', async () => {
      const area = result.querySelector('textarea');
      try {
        await navigator.clipboard.writeText(area.value);
        result.querySelector('.result-status').textContent = 'Copied. Paste the enquiry into your email or WhatsApp and send it there.';
      } catch {
        area.focus(); area.select();
        result.querySelector('.result-status').textContent = 'Select and copy the prepared message, then send it from your email or WhatsApp.';
      }
    });
  });
  const escapeCalendar = text => String(text).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const stamp = date => date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  // Fold UTF-8 lines at 75 octets, including the continuation space.
  const fold = line => {
    const encoder = new TextEncoder(); let output = '', part = '', size = 0;
    for (const char of line) {
      const length = encoder.encode(char).length;
      if (size + length > 75) { output += part + '\r\n'; part = ' '; size = 1; }
      part += char; size += length;
    }
    return output + part;
  };
  document.querySelectorAll('[data-calendar]').forEach(form => {
    const input = form.elements['Interview time'];
    const now = new Date();
    input.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const start = new Date(input.value);
      if (Number.isNaN(start.getTime()) || start <= new Date()) {
        form.querySelector('.calendar-status').textContent = 'Choose a confirmed interview time in the future.'; return;
      }
      const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Stratwell//Personal Interview Reminder//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${globalThis.crypto?.randomUUID?.() || Date.now()}@stratwell.local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(new Date(start.getTime()+30*60000))}`,'SUMMARY:Stratwell interview reminder',`LOCATION:${escapeCalendar(form.elements.Location.value)}`,'DESCRIPTION:Personal reminder only. Confirm the interview details with Dipta before attending.','END:VEVENT','END:VCALENDAR'];
      const url = URL.createObjectURL(new Blob([lines.map(fold).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'stratwell-interview.ics';
      document.body.append(link); link.click(); link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
      form.querySelector('.calendar-status').textContent = 'Your reminder is downloaded. Open it in your calendar app. No interview booking or invitation was sent.';
    });
  });
})();

// Shared workshop navigation and authorised developer credit on public pages.
(() => {
  if (!document.querySelector('link[href="learning.css"]')) {
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet'; sheet.href = 'learning.css';
    document.head.append(sheet);
  }
  document.querySelectorAll('#main-navigation a[href="training.html"]').forEach(link => {
    link.textContent = 'Training & workshops';
  });
  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.site-credit')) {
    const credit = document.createElement('div'); credit.className = 'site-credit';
    const label = document.createElement('span'); label.className = 'site-credit-label';
    label.textContent = 'Designed & developed by';
    const link = document.createElement('a'); link.className = 'site-credit-link';
    link.href = 'https://bysauvik.com/'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Designed and developed by bySAUVIK. Visit bysauvik.com (opens in a new tab)');
    const logo = document.createElement('img');
    logo.src = 'https://bysauvik.com/assets/bysauvik-mark.svg';
    logo.width = 30; logo.height = 30; logo.alt = ''; logo.loading = 'lazy'; logo.decoding = 'async';
    logo.referrerPolicy = 'no-referrer';
    // Keep the accessible wordmark visible if the external asset is unavailable.
    logo.addEventListener('error', () => { logo.hidden = true; });
    const wordmark = document.createElement('span'); wordmark.className = 'site-credit-wordmark';
    const prefix = document.createElement('i'); prefix.textContent = 'by';
    const domain = document.createElement('span'); domain.className = 'site-credit-domain'; domain.textContent = 'bysauvik.com';
    wordmark.append(prefix, document.createTextNode('SAUVIK'), domain);
    const arrow = document.createElement('span'); arrow.className = 'site-credit-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗';
    link.append(logo, wordmark, arrow); credit.append(label, link); footer.append(credit);
    const footerLinks = footer.querySelector('.footer-links');
    if (footerLinks && !footerLinks.querySelector('a[href*="training.html"]')) {
      const training = document.createElement('a'); training.href = 'training.html#institute-enquiry';
      training.textContent = 'Training & institutional partnerships'; footerLinks.prepend(training);
    }
  }
  // Enrich the existing campus introduction without duplicating the section.
  const campus = document.querySelector('#campus');
  if (campus) {
    campus.querySelector('.campus-copy .eyebrow').textContent = 'Stratwell Learning & Industry Connect';
    campus.querySelector('.campus-copy > p:not(.eyebrow)').textContent = 'Workshops, career readiness and industry exposure for universities, nursing colleges, allied-health institutes and healthcare-management students. We help your academic or placement team shape a programme around your learners.';
    const partnership = campus.querySelector('.campus-copy .arrow-link');
    partnership.href = 'training.html#institute-enquiry';
    partnership.replaceChildren(document.createTextNode('Partner with us for campus training '));
    const arrow = document.createElement('span'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden','true'); partnership.append(arrow);
    const featured = campus.querySelector('.campus-node.featured');
    featured.querySelector('strong').textContent = 'Workshops & industry connect';
    featured.querySelector('small').textContent = 'Career readiness · practical exposure · employer conversations';
    campus.querySelector('.campus-workshops p:not(.eyebrow)').textContent = 'Healthcare careers, CV clinics, interview preparation, communication, hospital operations and workplace readiness. Explore on-campus, online or hybrid formats, tailored with your institution.';
    campus.querySelector('.workshop-note small').textContent = 'Topics, trainers, delivery dates and any fees are agreed in writing before booking. Hospital exposure visits need host approval. Training does not guarantee placement or clinical certification.';
    const explore = campus.querySelector('a.button[href="training.html"]');
    if (explore) explore.firstChild.textContent = 'Explore workshops & programmes ';
  }
  const topic = document.querySelector('#workshop-topic');
  const selectWorkshop = requested => {
    if (!topic || !requested) return false;
    const chosen = Array.from(topic.options).find(option => option.value === requested);
    if (!chosen) return false;
    Array.from(topic.options).forEach(option => {
      option.selected = option === chosen;
      option.toggleAttribute('selected', option === chosen);
    });
    topic.value = chosen.value;
    const form = topic.closest('form');
    if (form) {
      let notice = form.querySelector('[data-workshop-selection]');
      if (!notice) {
        notice = document.createElement('p');
        notice.className = 'form-note'; notice.dataset.workshopSelection = '';
        notice.setAttribute('role', 'status');
        form.prepend(notice);
      }
      notice.textContent = `Topic selected: ${chosen.value}. Complete your institution details to prepare an enquiry.`;
    }
    topic.dispatchEvent(new Event('input', {bubbles:true}));
    topic.dispatchEvent(new Event('change', {bubbles:true}));
    return true;
  };
  if (topic) {
    topic.addEventListener('change', () => {
      const notice = topic.closest('form')?.querySelector('[data-workshop-selection]');
      if (notice) notice.textContent = topic.value ? `Topic selected: ${topic.value}. Complete your institution details to prepare an enquiry.` : 'Please select your preferred workshop topic.';
    });
    selectWorkshop(new URLSearchParams(window.location.search).get('topic'));
  }
  document.querySelectorAll('[data-workshop-topic]').forEach(link => {
    const requested = link.dataset.workshopTopic;
    link.href = `training.html?topic=${encodeURIComponent(requested)}#institute-enquiry`;
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!selectWorkshop(requested)) return;
      event.preventDefault();
      try { history.replaceState(null, '', link.href); } catch { /* Selection also works in an offline preview. */ }
      document.querySelector('#institute-enquiry')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
    });
  });
  const now = new Date();
  const today = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  document.querySelectorAll('[data-future-date]').forEach(input => { input.min = today; });
})();
