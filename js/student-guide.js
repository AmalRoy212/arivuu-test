(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var data = window.ARIVUU_STUDENT_GUIDE;
  var icons = window.Arivuu.CARD_ICONS || {};

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderFlipCard(card) {
    var icon = icons[card.icon] || icons.compass;
    return (
      '<article class="flip-card">' +
        '<div class="flip-card-inner">' +
          '<div class="flip-card-face flip-card-front glass-card">' +
            '<div class="flip-card-icon-wrap audience-icon audience-icon-md">' + icon + '</div>' +
            '<h3 class="flip-card-title">' + escapeHtml(card.title) + '</h3>' +
            '<p class="flip-card-hint">Hover to learn more</p>' +
          '</div>' +
          '<div class="flip-card-face flip-card-back glass-card">' +
            '<p class="flip-card-description">' + escapeHtml(card.description) + '</p>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderPdfSection(pdfMeta) {
    var samples = pdfMeta.samples || [];
    var defaultSample = samples[0];
    var tabs = samples
      .map(function (sample, index) {
        var active = index === 0 ? ' is-active' : '';
        return (
          '<button type="button" class="pdf-sample-tab' + active + '" data-pdf-tab="' + escapeHtml(sample.id) + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' +
            '<span class="pdf-sample-tab-label">' + escapeHtml(sample.label) + '</span>' +
            '<span class="pdf-sample-tab-desc">' + escapeHtml(sample.description) + '</span>' +
          '</button>'
        );
      })
      .join('');

    return (
      '<section class="service-section pdf-sample-section bg-surface-deep" aria-labelledby="pdf-sample-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="pdf-sample-header">' +
            '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + escapeHtml(pdfMeta.eyebrow) + '</span>' +
            '<h2 id="pdf-sample-title" class="font-display text-3xl sm:text-4xl font-medium text-stardust mt-3">' + escapeHtml(pdfMeta.title) + '</h2>' +
            '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">' + escapeHtml(pdfMeta.intro) + '</p>' +
          '</div>' +
          '<div class="pdf-sample-layout">' +
            '<div class="pdf-sample-panel">' +
              '<div class="pdf-sample-tabs" role="tablist" aria-label="Sample report categories">' + tabs + '</div>' +
            '</div>' +
            '<div class="pdf-sample-showcase">' +
              '<div class="pdf-sample-browser">' +
                '<div class="service-gist-browser-bar">' +
                  '<div class="service-gist-browser-dots" aria-hidden="true"><span></span><span></span><span></span></div>' +
                  '<div class="service-gist-browser-url" id="pdf-sample-url" aria-hidden="true">arivuu.com/sample-report</div>' +
                '</div>' +
                '<div class="pdf-sample-preview-wrap">' +
                  '<iframe id="pdf-sample-preview" class="pdf-sample-preview" title="Sample report thumbnail" src="' + escapeHtml(defaultSample.preview) + '#toolbar=0&navpanes=0&view=FitH" tabindex="-1"></iframe>' +
                  '<button type="button" id="pdf-sample-open" class="pdf-sample-open-trigger" data-open-pdf-preview data-pdf-url="' + escapeHtml(defaultSample.preview) + '" data-pdf-title="' + escapeHtml(defaultSample.label) + '">' +
                    '<span class="pdf-sample-open-icon" aria-hidden="true">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
                    '</span>' +
                    '<span>View sample report</span>' +
                  '</button>' +
                '</div>' +
              '</div>' +
              '<div class="pdf-sample-actions">' +
                '<button type="button" id="pdf-sample-download" class="pill-button" data-pdf-download="' + escapeHtml(defaultSample.pdf) + '" data-pdf-label="' + escapeHtml(defaultSample.label) + '">Download sample PDF</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderTakeTestButton() {
    return (
      '<div class="student-guide-cta-wrap">' +
        '<a href="https://growthpath.arivuu.com/" target="_blank" rel="noopener noreferrer" class="btn-premium btn-premium--test">' +
          '<span>Take a test</span>' +
          '<span class="btn-premium-icon btn-premium-icon--test" aria-hidden="true">' +
            '<svg class="btn-premium-clipboard" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>' +
              '<path class="btn-premium-check" d="m9 14 2 2 4-4"/>' +
            '</svg>' +
          '</span>' +
        '</a>' +
      '</div>'
    );
  }

  function renderStudentHeroSketches() {
    return (
      '<div class="student-hero-decor student-hero-decor--icons" aria-hidden="true">' +
        '<svg class="student-hero-sketch student-hero-sketch--bulb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M28 44h8M30 48h4"/><path d="M32 8c-8 0-14 6-14 14 0 5 2 9 5 12 2 2 3 5 3 8h12c0-3 1-6 3-8 3-3 5-7 5-12 0-8-6-14-14-14z"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--laptop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="14" width="44" height="28" rx="3"/><path d="M6 46h52l-4 6H10l-4-6z"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--cap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 24 32 12l26 12-26 12L6 24z"/><path d="M16 30v12c0 4 7 8 16 8s16-4 16-8V30"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--globe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="32" cy="32" r="20"/><path d="M12 32h40M32 12c6 6 6 34 0 40M32 12c-6 6-6 34 0 40"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--brush" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 52c8-2 18-12 24-24l6-6 8 8-6 6C32 42 22 52 12 52z"/><path d="M38 16l10 10"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--book" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12h18a6 6 0 0 1 6 6v34H18a6 6 0 0 0-6 6V12z"/><path d="M30 18h18a6 6 0 0 1 6 6v34H36a6 6 0 0 0-6 6V18z"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--pencil" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 50l-2 8 8-2 30-30-6-6-30 30z"/><path d="M42 16l6 6"/></svg>' +
        '<svg class="student-hero-sketch student-hero-sketch--chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 52h44"/><path d="M18 44V28M32 44V18M46 44V32"/></svg>' +
      '</div>' +
      '<div class="student-hero-decor student-hero-decor--blob" aria-hidden="true"></div>'
    );
  }

  function renderStudentGuidePage() {
    if (!data) return '<p class="text-muted-text text-center">Content unavailable.</p>';

    var cards = (data.cards || []).map(renderFlipCard).join('');
    var pdfMeta = data.pdfSection || { samples: [] };

    return (
      '<header class="page-hero page-hero--student-guide bg-surface-deep border-b border-nebula/10">' +
        renderStudentHeroSketches() +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 relative">' +
          '<nav class="page-breadcrumbs mb-6" aria-label="Breadcrumb">' +
            '<a href="#/">Home</a><span>/</span>' +
            '<a href="#/student">Students</a><span>/</span>' +
            '<span class="page-breadcrumbs-current">For Students</span>' +
          '</nav>' +
          '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">For Students</span>' +
          '<h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stardust mt-3 leading-tight uppercase">Are you a student?</h1>' +
          '<p class="text-lg sm:text-xl font-semibold text-biolume mt-4">Your career clarity starts here.</p>' +
          '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-3xl leading-relaxed">An integrated, intelligent, and data driven platform that blends AI precision (93% accuracy) with expert human guidance to help students discover their ideal career path. From psychometric assessments to personalised reports, scholarship insights, and 1:1 counselling, Arivuu transforms career confusion into clarity.</p>' +
        '</div>' +
      '</header>' +

      '<section class="section-padding bg-void">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="text-center mb-10">' +
            '<h2 class="font-display text-3xl sm:text-4xl font-semibold text-stardust">Students</h2>' +
          '</div>' +
          '<div class="flip-card-grid">' + cards + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-padding bg-surface-deep">' +
        '<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-stardust text-center leading-tight">Why Arivuu for Career Counselling?</h2>' +
          '<div class="student-guide-why mt-8 space-y-5 text-sm sm:text-base text-muted-text leading-relaxed">' +
            '<p><strong class="text-stardust font-semibold">Arivuu is a trusted and advanced career guidance platform designed to help students make confident academic and career decisions. Powered by our scientifically validated psychometric engine (93% accuracy and reliability) and technology-enabled insights, Arivuu ensures every student discovers their ideal career path with clarity.</strong></p>' +
            '<p>What sets us apart is our <strong class="text-stardust font-semibold">blend of science and human expertise</strong>. Our counsellors sit with both students and parents for <strong class="text-stardust font-semibold">personalised one-on-one sessions</strong>, explaining each option clearly and building a roadmap that feels achievable. With access to <strong class="text-stardust font-semibold">scholarship information</strong>, students can plan their future not just with clarity, but also with financial confidence.</p>' +
          '</div>' +
          renderTakeTestButton() +
        '</div>' +
      '</section>' +

      (window.Arivuu.renderFeatureBar ? window.Arivuu.renderFeatureBar(data.featureBar) : '') +

      renderPdfSection(pdfMeta) +

      (window.Arivuu.renderStudentTestimonialsSection ? window.Arivuu.renderStudentTestimonialsSection() : '') +

      (window.Arivuu.renderFAQSection ? window.Arivuu.renderFAQSection() : '')
    );
  }

  function bindPdfSamples() {
    var samples = (data && data.pdfSection && data.pdfSection.samples) || [];
    if (!samples.length) return;

    var sampleMap = {};
    samples.forEach(function (s) {
      sampleMap[s.id] = s;
    });

    var preview = document.getElementById('pdf-sample-preview');
    var openLink = document.getElementById('pdf-sample-open');
    var downloadBtn = document.getElementById('pdf-sample-download');
    var urlEl = document.getElementById('pdf-sample-url');

    function applySample(sample) {
      if (!sample) return;
      if (preview) preview.src = sample.preview + '#toolbar=0&navpanes=0&view=FitH';
      if (openLink) {
        openLink.setAttribute('data-pdf-url', sample.preview);
        openLink.setAttribute('data-pdf-title', sample.label);
      }
      if (downloadBtn) {
        downloadBtn.setAttribute('data-pdf-download', sample.pdf);
        downloadBtn.setAttribute('data-pdf-label', sample.label);
      }
      if (urlEl) urlEl.textContent = 'arivuu.com/' + sample.id.replace(/-/g, '/');
    }

    document.querySelectorAll('[data-pdf-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-pdf-tab');
        document.querySelectorAll('[data-pdf-tab]').forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        applySample(sampleMap[id]);
      });
    });

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var pdfUrl = downloadBtn.getAttribute('data-pdf-download');
        var label = downloadBtn.getAttribute('data-pdf-label') || 'Sample report';
        if (window.Arivuu.openContactModalForPdf) {
          window.Arivuu.openContactModalForPdf('Download sample report', 'Career counselling for students', pdfUrl, label);
        }
      });
    }
  }

  function bindFlipCards(root) {
    if (!root) return;
    root.querySelectorAll('.flip-card').forEach(function (card) {
      if (card.dataset.bound === '1') return;
      card.dataset.bound = '1';
      card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
      });
    });
  }

  function finalizeStudentGuidePage(mount) {
    if (!mount) return;

    mount.querySelectorAll('.reveal, .reveal-x-left, .reveal-x-right').forEach(function (el) {
      el.classList.add('show');
    });

    if (window.Arivuu.initMain) {
      window.Arivuu.initMain('student-guide');
    }

    function scrollTop() {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    scrollTop();
    requestAnimationFrame(function () {
      scrollTop();
      requestAnimationFrame(scrollTop);
    });
  }

  function renderStudentGuide() {
    var mount = document.getElementById('student-guide-mount');
    if (!mount) return;

    mount.innerHTML = renderStudentGuidePage();

    if (window.Arivuu.bindFAQ) window.Arivuu.bindFAQ();
    bindPdfSamples();
    if (window.Arivuu.bindStudentTestimonials) window.Arivuu.bindStudentTestimonials();
    finalizeStudentGuidePage(mount);
    bindFlipCards(mount);

    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO('/student/guide', {
        title: 'Career Guidance for Students | Arivuu',
        description:
          'Explore Arivuu\'s psychometric assessments, career counselling, sample reports, and personalised guidance for students from Class 8 through college.'
      });
    }
  }

  window.Arivuu.initStudentGuide = function (page) {
    if (page !== 'student-guide') return;
    renderStudentGuide();
  };

  window.Arivuu.renderStudentGuide = renderStudentGuide;

  window.Arivuu.initSharedSections = function (page) {
    if (page === 'home') {
      var faqMount = document.getElementById('faq-mount');
      if (faqMount && window.Arivuu.mountFAQ) window.Arivuu.mountFAQ(faqMount);
    }
  };
})();
