'use strict';
// Enquiries remain visitor-reviewed email drafts. No false success or hidden submission.
(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = 'Hirezyy enquiry: ' + data.get('interest');
    const body = 'Hello Dipta,\n\nName: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nInterest: ' + data.get('interest');
    window.location.href = 'mailto:diptabiswas00@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.querySelector('.form-message').textContent = 'Your email app will open with a draft. Review and send it there to contact Dipta. Nothing has been submitted automatically.';
  });
})();
