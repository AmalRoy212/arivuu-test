(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  function getSheetConfig() {
    var env = window.ARIVUU_ENV || {};
    return {
      sheetId: env.ARIVUU_CONTACT_FORM_GOOGLE_SHEET_ID || '',
      scriptUrl: String(env.ARIVUU_CONTACT_FORM_APPS_SCRIPT_URL || '').trim()
    };
  }

  function isConfigured() {
    return Boolean(getSheetConfig().scriptUrl);
  }

  function submitToSheet(payload) {
    var cfg = getSheetConfig();
    if (!cfg.scriptUrl) {
      return Promise.reject(new Error('Form storage is not configured yet.'));
    }

    var data = Object.assign(
      {
        sheetId: cfg.sheetId,
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString()
      },
      payload
    );
    if (data.phone != null && data.phone !== '') {
      data.phone = String(data.phone);
    }

    return fetch(cfg.scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.text().then(function (text) {
        var parsed;
        try {
          parsed = JSON.parse(text);
        } catch (err) {
          if (res.ok) return { ok: true };
          throw new Error('Could not save your submission. Please try again.');
        }
        if (!parsed.ok) {
          throw new Error(parsed.error || 'Could not save your submission. Please try again.');
        }
        return parsed;
      });
    });
  }

  function setSubmitting(form, isSubmitting) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    btn.disabled = isSubmitting;
    if (isSubmitting) {
      if (!btn.dataset.defaultLabel) btn.dataset.defaultLabel = btn.textContent;
      btn.textContent = 'Sending…';
    } else if (btn.dataset.defaultLabel) {
      btn.textContent = btn.dataset.defaultLabel;
    }
  }

  function handleSubmit(options) {
    var form = options.form;
    var statusEl = options.statusEl;
    var payload = options.payload;
    var showStatus = options.showStatus;
    var onSuccess = options.onSuccess;
    var mailtoFallback = options.mailtoFallback;

    if (isConfigured()) {
      setSubmitting(form, true);
      showStatus(statusEl, 'Sending your message…', 'success');

      return submitToSheet(payload)
        .then(function () {
          form.reset();
          showStatus(statusEl, 'Thank you! We received your message and will get back to you soon.', 'success');
          if (onSuccess) onSuccess();
        })
        .catch(function (err) {
          showStatus(statusEl, err.message || 'Could not send your message. Please try again.', 'error');
        })
        .finally(function () {
          setSubmitting(form, false);
        });
    }

    if (typeof mailtoFallback === 'function') {
      mailtoFallback();
      showStatus(statusEl, 'Opening your email client to send the message…', 'success');
      return Promise.resolve();
    }

    showStatus(statusEl, 'Form storage is not configured. Please email us directly.', 'error');
    return Promise.resolve();
  }

  window.Arivuu.submitContactToSheet = submitToSheet;
  window.Arivuu.isContactFormSheetConfigured = isConfigured;
  window.Arivuu.handleContactFormSubmit = handleSubmit;
})();
