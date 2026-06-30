(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  function getModal() {
    return document.getElementById('pdf-preview-modal');
  }

  function getFrame() {
    return document.getElementById('pdf-preview-frame');
  }

  function pdfViewUrl(url) {
    if (!url) return 'about:blank';
    var hash = 'toolbar=0&navpanes=0&scrollbar=1&view=FitH';
    return url.indexOf('#') === -1 ? url + '#' + hash : url + '&' + hash;
  }

  function closePdfPreview() {
    var modal = getModal();
    var frame = getFrame();
    if (!modal) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (frame) {
      frame.src = 'about:blank';
    }
  }

  function openPdfPreview(url, title) {
    var modal = getModal();
    var frame = getFrame();
    var titleEl = document.getElementById('pdf-preview-title');
    if (!modal || !frame) return;

    if (titleEl) titleEl.textContent = title || 'Sample report';
    frame.src = pdfViewUrl(url);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function bindPdfPreviewModal() {
    if (document.body.dataset.pdfPreviewBound === '1') return;
    document.body.dataset.pdfPreviewBound = '1';

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-pdf-preview]')) {
        e.preventDefault();
        closePdfPreview();
        return;
      }

      var trigger = e.target.closest('[data-open-pdf-preview]');
      if (!trigger) return;

      e.preventDefault();
      openPdfPreview(trigger.getAttribute('data-pdf-url'), trigger.getAttribute('data-pdf-title'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var modal = getModal();
      if (modal && !modal.classList.contains('hidden')) {
        closePdfPreview();
      }
    });

    var body = document.getElementById('pdf-preview-body');
    if (body) {
      body.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      });
    }
  }

  window.Arivuu.openPdfPreview = openPdfPreview;
  window.Arivuu.closePdfPreview = closePdfPreview;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindPdfPreviewModal);
  } else {
    bindPdfPreviewModal();
  }
})();
