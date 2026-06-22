(function () {
  'use strict';

  var CONTACT_SUBJECTS = [
    'Career counselling for students',
    'Career counselling for my child',
    'School partnership',
    'Workshop or seminar',
    'Become a counsellor',
    'General enquiry'
  ];

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function normalizePhone(phone) {
    return String(phone || '').replace(/[\s\-().]/g, '');
  }

  function isNumericPhoneInput(phone) {
    var trimmed = String(phone || '').trim();
    if (!trimmed) {
      return false;
    }
    return /^\+?[\d\s\-().]+$/.test(trimmed);
  }

  function isValidIndianMobile(phone) {
    var digits = normalizePhone(phone);
    if (/^(\+91|91)/.test(digits)) {
      digits = digits.replace(/^(\+91|91)/, '');
    }
    if (/^0/.test(digits)) {
      digits = digits.slice(1);
    }
    return /^[6-9]\d{9}$/.test(digits);
  }

  function validatePhone(phone) {
    var trimmed = String(phone || '').trim();
    if (!trimmed) {
      return 'Please enter your mobile number.';
    }
    if (!isNumericPhoneInput(trimmed)) {
      return 'Mobile number should contain digits only.';
    }
    if (!isValidIndianMobile(trimmed)) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }
    return null;
  }

  function contactFormHtml(selectedSubject) {
    var options = CONTACT_SUBJECTS.map(function (subject) {
      var selected = subject === selectedSubject ? ' selected' : '';
      return '<option value="' + subject + '"' + selected + '>' + subject + '</option>';
    }).join('');

    var inputClass = 'w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust placeholder:text-muted-text focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15';
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';

    return '<form id="contact-form-modal" class="space-y-5" novalidate>' +
      '<div class="grid sm:grid-cols-2 gap-5">' +
        '<div>' +
          '<label for="modal-contact-name" class="' + labelClass + '">Full name</label>' +
          '<input id="modal-contact-name" name="name" type="text" required class="' + inputClass + '" placeholder="Your name" autocomplete="name" />' +
        '</div>' +
        '<div>' +
          '<label for="modal-contact-email" class="' + labelClass + '">Email</label>' +
          '<input id="modal-contact-email" name="email" type="email" required class="' + inputClass + '" placeholder="you@example.com" autocomplete="email" inputmode="email" />' +
        '</div>' +
        '<div class="sm:col-span-2">' +
          '<label for="modal-contact-phone" class="' + labelClass + '">Mobile number</label>' +
          '<input id="modal-contact-phone" name="phone" type="tel" required class="' + inputClass + '" placeholder="+91 98765 43210" autocomplete="tel" inputmode="tel" />' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label for="modal-contact-subject" class="' + labelClass + '">I\'m enquiring about</label>' +
        '<select id="modal-contact-subject" name="subject" class="' + inputClass + '">' +
          options +
        '</select>' +
      '</div>' +
      '<div>' +
        '<label for="modal-contact-message" class="' + labelClass + '">Message</label>' +
        '<textarea id="modal-contact-message" name="message" rows="5" required class="' + inputClass + ' resize-y" placeholder="Tell us how we can help..."></textarea>' +
      '</div>' +
      '<div id="modal-contact-status" class="hidden text-sm rounded-xl px-4 py-3" role="status"></div>' +
      '<button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-md">Send message</button>' +
    '</form>';
  }

  function showFormStatus(statusEl, text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove('hidden', 'bg-nebula/10', 'text-nebula', 'bg-biolume/10', 'text-biolume');
    if (type === 'success') {
      statusEl.classList.add('bg-nebula/10', 'text-nebula');
    } else {
      statusEl.classList.add('bg-biolume/10', 'text-biolume');
    }
  }

  function validateContactForm(form) {
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !phone || !message) {
      return 'Please fill in all required fields.';
    }
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address.';
    }
    var phoneError = validatePhone(phone);
    if (phoneError) {
      return phoneError;
    }
    return null;
  }

  function bindContactForm(form, statusEl) {
    if (!form || form.dataset.bound === '1') return;

    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var validationError = validateContactForm(form);
      if (validationError) {
        showFormStatus(statusEl, validationError, 'error');
        return;
      }

      var site = window.ARIVUU_SITE || {};
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var subject = form.subject.value;
      var message = form.message.value.trim();
      var to = site.email || 'info@arivuu.com';
      var formType = form.id === 'contact-form-modal' ? 'contact-modal' : 'contact-page';

      var payload = {
        formType: formType,
        name: name,
        email: email,
        phone: String(phone),
        subject: subject,
        message: message
      };

      var mailtoFallback = function () {
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nMobile: ' + phone + '\n\n' + message;
        window.location.href = 'mailto:' + encodeURIComponent(to) +
          '?subject=' + encodeURIComponent(subject + ' — ' + name) +
          '&body=' + encodeURIComponent(body);
      };

      if (window.Arivuu.handleContactFormSubmit) {
        window.Arivuu.handleContactFormSubmit({
          form: form,
          statusEl: statusEl,
          payload: payload,
          showStatus: showFormStatus,
          mailtoFallback: mailtoFallback
        });
        return;
      }

      mailtoFallback();
      showFormStatus(statusEl, 'Opening your email client to send the message…', 'success');
    });
  }

  function openContactModal(title, subject) {
    var overlay = document.getElementById('content-modal');
    var titleEl = document.getElementById('content-modal-title');
    var bodyEl = document.getElementById('content-modal-body');
    if (!overlay || !titleEl || !bodyEl) return;

    titleEl.textContent = title || 'Get in touch';
    bodyEl.innerHTML = contactFormHtml(subject || 'General enquiry');

    var form = bodyEl.querySelector('#contact-form-modal');
    var statusEl = bodyEl.querySelector('#modal-contact-status');
    bindContactForm(form, statusEl);

    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var firstInput = form && form.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }

  function bindContactTriggers() {
    if (document.body.dataset.contactTriggersBound === '1') return;
    document.body.dataset.contactTriggersBound = '1';

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-open-contact]');
      if (!btn) return;
      e.preventDefault();
      openContactModal(btn.dataset.contactTitle, btn.dataset.contactSubject);
    });
  }

  window.Arivuu = window.Arivuu || {};
  window.Arivuu.openContactModal = openContactModal;

  function showServiceFormStatus(statusEl, text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove('hidden', 'bg-nebula/10', 'text-nebula', 'bg-biolume/10', 'text-biolume');
    if (type === 'success') {
      statusEl.classList.add('bg-nebula/10', 'text-nebula');
    } else {
      statusEl.classList.add('bg-biolume/10', 'text-biolume');
    }
  }

  function validateServiceContactForm(form) {
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var designationEl = form.designation;
    var designation = designationEl ? designationEl.value.trim() : '';
    var institutionEl = form.institution;
    var institution = institutionEl ? institutionEl.value.trim() : '';
    var cityEl = form.city;
    var city = cityEl ? cityEl.value.trim() : '';

    if (!name || !email || !phone || !institution || !city) {
      return 'Please fill in all required fields.';
    }
    if (!designation) {
      return 'Please select your designation.';
    }
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address.';
    }
    var phoneError = validatePhone(phone);
    if (phoneError) {
      return phoneError;
    }
    return null;
  }

  window.Arivuu.showServiceFormStatus = showServiceFormStatus;
  window.Arivuu.validateServiceContactForm = validateServiceContactForm;

  window.Arivuu.initContact = function (page) {
    bindContactTriggers();

    page = page || document.body.getAttribute('data-page');
    if (page !== 'contact') return;

    var site = window.ARIVUU_SITE || {};
    var addressEl = document.getElementById('contact-address');
    var phoneEl = document.getElementById('contact-phone');
    var emailEl = document.getElementById('contact-email');

    if (addressEl && site.address) addressEl.textContent = site.address;
    if (phoneEl && site.phone) {
      phoneEl.textContent = site.phone;
      phoneEl.href = 'tel:' + site.phone.replace(/\s/g, '');
    }
    if (emailEl && site.email) {
      emailEl.textContent = site.email;
      emailEl.href = 'mailto:' + site.email;
    }

    var socialWrap = document.getElementById('contact-social');
    var socialLinks = document.getElementById('contact-social-links');
    if (socialWrap && socialLinks) {
      var social = site.social || {};
      var links = [];
      if (social.linkedin) {
        links.push(
          '<a href="' + social.linkedin + '" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-nebula/10 border border-nebula/20 flex items-center justify-center hover:bg-nebula/20 transition-colors duration-300" aria-label="LinkedIn">' +
            '<svg class="icon text-nebula" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>' +
          '</a>'
        );
      }
      if (social.instagram) {
        links.push(
          '<a href="' + social.instagram + '" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-nebula/10 border border-nebula/20 flex items-center justify-center hover:bg-nebula/20 transition-colors duration-300" aria-label="Instagram">' +
            '<svg class="icon text-nebula" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>' +
          '</a>'
        );
      }
      if (links.length) {
        socialLinks.innerHTML = links.join('');
        socialWrap.classList.remove('hidden');
      }
    }

    var form = document.getElementById('contact-form');
    var statusEl = document.getElementById('contact-form-status');
    bindContactForm(form, statusEl);
  };
})();
