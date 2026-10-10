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
