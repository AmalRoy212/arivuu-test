(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var data = window.ARIVUU_AUDIENCE_SERVICES;

  var ICONS = {
    compass: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    chart: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    'user-check': '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>',
    briefcase: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    activity: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
    navigation: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    calendar: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    award: '<svg class="service-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    users: '<svg class="service-workshop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    book: '<svg class="service-workshop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
    heart: '<svg class="service-workshop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>',
    clock: '<svg class="service-workshop-meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    map: '<svg class="service-workshop-meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getQueryParam(name) {
    if (window.Arivuu && window.Arivuu.routerParams) {
      return window.Arivuu.routerParams.get(name);
    }
    return new URLSearchParams(window.location.search).get(name);
  }

  function getAudience() {
    var id = getQueryParam('audience') || data.defaultAudience || 'school';
    if (!data.audiences[id]) id = data.defaultAudience || 'school';
    return data.audiences[id];
  }

  function serviceUrl(audience) {
    return '#/service?audience=' + encodeURIComponent(audience);
  }

  function renderLogoMarquee(logos) {
    var items = logos.concat(logos).map(function (name) {
      return (
        '<div class="logo-marquee-item">' +
          '<img src="images/arivuu-logo.png" alt="" class="logo-marquee-img" draggable="false" />' +
          '<span class="logo-marquee-name">' + escapeHtml(name) + '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="service-partners-marquee-wrap">' +
        '<div class="logo-marquee" aria-label="Partner schools">' +
          '<div class="logo-marquee-track">' + items + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderCustomSelect(id, label, name, placeholder, options, required) {
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';
    var triggerClass =
      'service-select-trigger w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust ' +
      'focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15 ' +
      'flex items-center justify-between gap-3 text-left cursor-pointer';
    var optionsHtml = options.map(function (opt) {
      return (
        '<li class="service-select-option" role="option" data-value="' + escapeHtml(opt) + '">' +
          escapeHtml(opt) +
        '</li>'
      );
    }).join('');

    return (
      '<div class="service-custom-select" data-custom-select>' +
        '<label for="' + id + '" class="' + labelClass + '">' + escapeHtml(label) + '</label>' +
        '<input type="hidden" id="' + id + '" name="' + name + '" value=""' + (required ? ' required' : '') + ' />' +
        '<button type="button" class="' + triggerClass + '" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="service-select-value is-placeholder">' + escapeHtml(placeholder) + '</span>' +
          '<svg class="service-select-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>' +
        '<ul class="service-select-menu" role="listbox" hidden>' + optionsHtml + '</ul>' +
      '</div>'
    );
  }

  function renderField(label, id, name, type, placeholder, autocomplete, inputmode) {
    var labelClass = 'block text-xs font-medium text-muted-text mb-1.5';
    var inputClass =
      'w-full px-4 py-3 rounded-xl border border-nebula/25 bg-white text-sm text-stardust ' +
      'placeholder:text-muted-text focus:outline-none focus:border-nebula/50 focus:ring-2 focus:ring-nebula/15';
    var attrs = 'id="' + id + '" name="' + name + '" type="' + type + '" required class="' + inputClass + '" placeholder="' + escapeHtml(placeholder) + '"';
    if (autocomplete) attrs += ' autocomplete="' + autocomplete + '"';
    if (inputmode) attrs += ' inputmode="' + inputmode + '"';

    return (
      '<div>' +
        '<label for="' + id + '" class="' + labelClass + '">' + escapeHtml(label) + '</label>' +
        '<input ' + attrs + ' />' +
      '</div>'
    );
  }

  function renderContactForm(audience) {
    var designationField = renderCustomSelect(
      'service-contact-designation',
      'Designation',
      'designation',
      'Select designation',
      data.designationOptions,
      true
    );

    return (
      '<form id="service-contact-form" class="glass-card p-6 sm:p-8 lg:p-10 space-y-5 w-full" novalidate ' +
        'data-subject="' + escapeHtml(audience.contactSubject) + '" data-audience="' + escapeHtml(audience.id) + '">' +
        '<div class="grid sm:grid-cols-2 gap-5">' +
          renderField('Name', 'service-contact-name', 'name', 'text', 'Your name', 'name') +
          renderField('Email', 'service-contact-email', 'email', 'email', 'you@example.com', 'email', 'email') +
          '<div class="sm:col-span-2">' +
            renderField('Mobile number', 'service-contact-phone', 'phone', 'tel', '+91 98765 43210', 'tel', 'tel') +
          '</div>' +
        '</div>' +
        '<div class="grid sm:grid-cols-2 gap-5">' +
          renderField('School / Institution', 'service-contact-institution', 'institution', 'text', 'School or institute name', 'organization') +
          renderField('City', 'service-contact-city', 'city', 'text', 'Your city', 'address-level2') +
        '</div>' +
        designationField +
        '<div id="service-contact-status" class="hidden text-sm rounded-xl px-4 py-3" role="status"></div>' +
        '<button type="submit" class="w-full sm:w-auto px-8 py-3 rounded-full bg-nebula text-white text-sm font-medium hover:bg-nebula/80 transition-all duration-300 shadow-accent-md">Submit</button>' +
      '</form>'
    );
  }

  function renderAceStep(step) {
    var points = step.points.map(function (p) {
      return '<li class="service-ace-point">' + escapeHtml(p) + '</li>';
    }).join('');

    var content =
      '<div class="service-ace-content">' +
        '<div class="service-ace-watermark" aria-hidden="true">' + escapeHtml(step.letter) + '</div>' +
        '<div class="service-ace-letter">' + escapeHtml(step.letter) + ' = ' + escapeHtml(step.title) + '</div>' +
        '<ul class="service-ace-list">' + points + '</ul>' +
      '</div>';

    var imageClass = 'service-ace-image' + (step.imageFit === 'contain' ? ' service-ace-image--contain' : '');
    var imageAlt = step.letter === 'A' ? 'Approach badge' : (step.letter === 'E' ? 'Eco System illustration' : '');

    var image =
      '<div class="service-ace-image-wrap service-ace-parallax-layer">' +
        '<img src="' + escapeHtml(step.image) + '" alt="' + escapeHtml(imageAlt) + '" class="' + imageClass + '" />' +
      '</div>';

    var rowClass = step.imageLeft
      ? 'service-ace-row'
      : 'service-ace-row service-ace-row--image-right';

    return '<div class="' + rowClass + '">' + image + content + '</div>';
  }

  function renderPlatformFeatures(features) {
    return features.map(function (item) {
      var icon = ICONS[item.icon] || ICONS.compass;
      return (
        '<div class="service-feature-card">' +
          '<div class="service-feature-icon-wrap">' + icon + '</div>' +
          '<div class="service-feature-num">' + item.num + '</div>' +
          '<p class="service-feature-text">' + escapeHtml(item.text) + '</p>' +
        '</div>'
      );
    }).join('');
  }

  function renderGistHighlights(items) {
    return items.map(function (item) {
      return (
        '<li class="service-gist-highlight">' +
          '<span class="service-gist-highlight-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.517-6.517a1 1 0 0 1 1.414 0z" clip-rule="evenodd"/></svg>' +
          '</span>' +
          '<span>' + escapeHtml(item) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderGistStats(stats) {
    return stats.map(function (stat) {
      return (
        '<div class="service-gist-stat">' +
          '<span class="service-gist-stat-value">' + escapeHtml(stat.value) + '</span>' +
          '<span class="service-gist-stat-label">' + escapeHtml(stat.label) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  var AUDIENCE_ACCENTS = {
    Students: 'nebula',
    Parents: 'biolume',
    Educators: 'biolume'
  };

  function renderWorkshopAudiences(item) {
    var audiences = item.audiences || (item.audience ? [item.audience] : []);
    return audiences.map(function (label) {
      var tagAccent = AUDIENCE_ACCENTS[label] || item.accent || 'nebula';
      return (
        '<span class="service-workshop-audience service-workshop-audience--' + tagAccent + '">' +
          escapeHtml(label) +
        '</span>'
      );
    }).join('');
  }

  function renderWorkshopCard(item) {
    var accent = item.accent === 'biolume' ? 'biolume' : 'nebula';
    var icon = ICONS[item.icon] || ICONS.compass;

    return (
      '<article class="service-workshop-card service-workshop-card--' + accent + '">' +
        '<div class="service-workshop-card-glow" aria-hidden="true"></div>' +
        '<div class="service-workshop-card-inner">' +
          '<div class="service-workshop-card-top">' +
            '<div class="service-workshop-icon-wrap service-workshop-icon-wrap--' + accent + '">' + icon + '</div>' +
            '<div class="service-workshop-audiences">' + renderWorkshopAudiences(item) + '</div>' +
          '</div>' +
          '<h3 class="service-workshop-title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="service-workshop-desc">' + escapeHtml(item.description) + '</p>' +
          '<div class="service-workshop-meta">' +
            '<span class="service-workshop-meta-item">' + ICONS.clock + escapeHtml(item.duration) + '</span>' +
            '<span class="service-workshop-meta-item">' + ICONS.map + escapeHtml(item.format) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderWorkshopsSection() {
    var meta = data.workshopsSection || {};
    var stats = (meta.stats || []).map(function (stat) {
      return (
        '<div class="service-workshops-stat">' +
          '<span class="service-workshops-stat-value">' + escapeHtml(stat.value) + '</span>' +
          '<span class="service-workshops-stat-label">' + escapeHtml(stat.label) + '</span>' +
        '</div>'
      );
    }).join('');

    var cards = (data.workshops || []).map(renderWorkshopCard).join('');

    return (
      '<section class="service-section service-workshops-section bg-void" aria-labelledby="service-workshops-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-workshops-header">' +
            '<span class="service-workshops-eyebrow">' + escapeHtml(meta.eyebrow || 'Events & Seminars') + '</span>' +
            '<h2 id="service-workshops-title" class="service-workshops-title">' +
              'Workshops &amp; <span class="gradient-text">Seminars</span>' +
            '</h2>' +
            '<p class="service-workshops-intro">' + escapeHtml(meta.intro || '') + '</p>' +
          '</div>' +
          (stats ? '<div class="service-workshops-stats">' + stats + '</div>' : '') +
          '<div class="service-workshops-grid">' + cards + '</div>' +
          '<div class="service-workshops-cta">' +
            '<div class="service-workshops-cta-content">' +
              '<p class="service-workshops-cta-title">' + escapeHtml(meta.ctaText || 'Book a workshop') + '</p>' +
              '<p class="service-workshops-cta-hint">' + escapeHtml(meta.ctaHint || '') + '</p>' +
            '</div>' +
            '<a href="#service-contact-form" class="service-workshops-cta-btn">Get in touch</a>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderGistSection(audience) {
    var gistMeta = data.gistSection || {};
    var defaultTab = data.gistTabs.find(function (t) { return t.id === audience.defaultGistTab; }) || data.gistTabs[0];

    var tabs = data.gistTabs.map(function (tab) {
      var active = tab.id === audience.defaultGistTab ? ' is-active' : '';
      return (
        '<button type="button" class="service-gist-tab' + active + '" data-gist-tab="' + tab.id + '" ' +
          'aria-pressed="' + (active ? 'true' : 'false') + '" role="tab">' +
          '<span class="service-gist-tab-label">' + escapeHtml(tab.label) + '</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<section class="service-section service-gist-section bg-surface-deep" aria-labelledby="service-gist-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-gist-header">' +
            '<span class="service-gist-eyebrow">' + escapeHtml(gistMeta.eyebrow || 'Platform') + '</span>' +
            '<h2 id="service-gist-title" class="service-gist-title">' + escapeHtml(gistMeta.title || 'Gist of our software') + '</h2>' +
            '<p class="service-gist-intro">' + escapeHtml(gistMeta.intro || '') + '</p>' +
          '</div>' +
          '<div class="service-gist-layout">' +
            '<div class="service-gist-panel">' +
              '<div class="service-gist-tabs" role="tablist" aria-label="Software audience views">' + tabs + '</div>' +
              '<div class="service-gist-detail" id="service-gist-detail">' +
                '<h3 class="service-gist-headline" id="service-gist-headline">' + escapeHtml(defaultTab.headline) + '</h3>' +
                '<p class="service-gist-description" id="service-gist-description">' + escapeHtml(defaultTab.description) + '</p>' +
                '<ul class="service-gist-highlights" id="service-gist-highlights">' +
                  renderGistHighlights(defaultTab.highlights || []) +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="service-gist-showcase">' +
              '<div class="service-gist-stats" id="service-gist-stats">' +
                renderGistStats(defaultTab.stats || []) +
              '</div>' +
              '<div class="service-gist-browser">' +
                '<div class="service-gist-browser-bar">' +
                  '<div class="service-gist-browser-dots" aria-hidden="true">' +
                    '<span></span><span></span><span></span>' +
                  '</div>' +
                  '<div class="service-gist-browser-url" aria-hidden="true">app.arivuu.com/dashboard</div>' +
                '</div>' +
                '<div class="service-gist-preview" id="service-gist-preview">' +
                  '<img id="service-gist-image" src="' + escapeHtml(defaultTab.image) + '" ' +
                    'alt="' + escapeHtml(defaultTab.alt || 'Software dashboard preview') + '" ' +
                    'class="service-gist-screenshot" />' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderServicePageHero(audience) {
    var eyebrow = audience.pageEyebrow || 'Our Programs';
    var breadcrumb = audience.pageBreadcrumb || 'Services';

    return (
      '<header class="page-hero bg-surface-deep border-b border-nebula/10">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16">' +
          '<nav class="page-breadcrumbs mb-6" aria-label="Breadcrumb">' +
            '<a href="#/">Home</a><span>/</span>' +
            '<a href="#/service?audience=school">Services</a><span>/</span>' +
            '<span class="page-breadcrumbs-current">' + escapeHtml(breadcrumb) + '</span>' +
          '</nav>' +
          '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + escapeHtml(eyebrow) + '</span>' +
          '<h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-3 leading-tight">' +
            escapeHtml(audience.heroLead) + ' <span class="gradient-text">' + escapeHtml(audience.heroTitle) + '</span>' +
          '</h1>' +
          '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">' + escapeHtml(audience.description) + '</p>' +
        '</div>' +
      '</header>'
    );
  }

  function renderAudiencePage(audience) {
    var contactHeading = audience.contactHeading.replace(/\n/g, '<br />');

    return (
      renderServicePageHero(audience) +

      '<section class="service-partners-section bg-surface-deep !pt-10">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-10">' +
          '<h2 class="service-partners-heading text-center">' + escapeHtml(audience.partnersHeading) + '</h2>' +
        '</div>' +
        renderLogoMarquee(data.schoolLogos) +
      '</section>' +

      '<section class="service-section service-contact-section bg-void">' +
        '<div class="service-contact-container mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-contact-grid">' +
            '<div class="service-contact-form-wrap">' +
              renderContactForm(audience) +
            '</div>' +
            '<div class="service-contact-heading-wrap">' +
              '<h2 class="service-contact-heading">' + contactHeading + '</h2>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section id="service-ace-section" class="service-section service-ace-section bg-surface-deep">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<h2 class="service-section-title text-center">We power your ACE journey in 3 steps</h2>' +
          '<div class="service-ace-steps">' +
            data.aceSteps.map(renderAceStep).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      renderWorkshopsSection() +

      '<section class="service-section bg-void">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="service-features-grid">' +
            renderPlatformFeatures(data.platformFeatures) +
          '</div>' +
        '</div>' +
      '</section>' +

      renderGistSection(audience)
    );
  }

  function bindGistTabs() {
    var tabs = document.querySelectorAll('[data-gist-tab]');
    var imgEl = document.getElementById('service-gist-image');
    var preview = document.getElementById('service-gist-preview');
    var headlineEl = document.getElementById('service-gist-headline');
    var descriptionEl = document.getElementById('service-gist-description');
    var highlightsEl = document.getElementById('service-gist-highlights');
    var statsEl = document.getElementById('service-gist-stats');
    var detailEl = document.getElementById('service-gist-detail');
    if (!tabs.length || !imgEl) return;

    function applyTab(tabData) {
      if (!tabData) return;

      if (headlineEl) headlineEl.textContent = tabData.headline || '';
      if (descriptionEl) descriptionEl.textContent = tabData.description || '';
      if (highlightsEl) highlightsEl.innerHTML = renderGistHighlights(tabData.highlights || []);
      if (statsEl) statsEl.innerHTML = renderGistStats(tabData.stats || []);

      if (preview) preview.classList.add('is-switching');
      imgEl.classList.add('is-fading');
      if (detailEl) detailEl.classList.add('is-switching');

      window.setTimeout(function () {
        imgEl.src = tabData.image;
        imgEl.alt = tabData.alt || 'Software dashboard preview';
        imgEl.classList.remove('is-fading');
        if (preview) preview.classList.remove('is-switching');
        if (detailEl) detailEl.classList.remove('is-switching');
      }, 150);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tabId = tab.getAttribute('data-gist-tab');
        var tabData = data.gistTabs.find(function (t) { return t.id === tabId; });
        if (!tabData) return;

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-pressed', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-pressed', 'true');

        applyTab(tabData);
      });
    });
  }

  function closeAllCustomSelects(except) {
    document.querySelectorAll('[data-custom-select]').forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove('is-open');
      var trigger = wrap.querySelector('.service-select-trigger');
      var menu = wrap.querySelector('.service-select-menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
    });
  }

  function bindCustomSelects() {
    document.querySelectorAll('[data-custom-select]').forEach(function (wrap) {
      if (wrap.dataset.bound === '1') return;
      wrap.dataset.bound = '1';

      var hidden = wrap.querySelector('input[type="hidden"]');
      var trigger = wrap.querySelector('.service-select-trigger');
      var valueEl = wrap.querySelector('.service-select-value');
      var menu = wrap.querySelector('.service-select-menu');
      var options = wrap.querySelectorAll('.service-select-option');
      if (!hidden || !trigger || !valueEl || !menu) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = wrap.classList.contains('is-open');
        closeAllCustomSelects();
        if (!isOpen) {
          wrap.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          menu.hidden = false;
        }
      });

      options.forEach(function (option) {
        option.addEventListener('click', function () {
          var val = option.getAttribute('data-value') || '';
          hidden.value = val;
          valueEl.textContent = val;
          valueEl.classList.remove('is-placeholder');
          options.forEach(function (o) { o.classList.remove('is-selected'); });
          option.classList.add('is-selected');
          closeAllCustomSelects();
        });
      });
    });

    if (!document.body.dataset.customSelectDocBound) {
      document.body.dataset.customSelectDocBound = '1';
      document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-custom-select]')) closeAllCustomSelects();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllCustomSelects();
      });
    }
  }

  var aceParallaxHandler = null;

  function teardownAceParallax() {
    if (aceParallaxHandler) {
      window.removeEventListener('scroll', aceParallaxHandler);
      window.removeEventListener('resize', aceParallaxHandler);
      aceParallaxHandler = null;
    }
  }

  function bindAceParallax() {
    teardownAceParallax();

    var section = document.getElementById('service-ace-section');
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rows = section.querySelectorAll('.service-ace-row');
    if (!rows.length) return;

    var ticking = false;

    function updateParallax() {
      ticking = false;
      var viewH = window.innerHeight;

      rows.forEach(function (row, index) {
        var rect = row.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewH) return;

        var progress = (rect.top + rect.height * 0.5 - viewH * 0.5) / viewH;
        progress = Math.max(-1, Math.min(1, progress));
        var dir = index % 2 === 0 ? 1 : -1;

        var imageWrap = row.querySelector('.service-ace-image-wrap');
        var watermark = row.querySelector('.service-ace-watermark');

        var imageShift = progress * 28 * dir;
        var watermarkShift = progress * 40 * dir;

        if (imageWrap) {
          imageWrap.style.transform = 'translate3d(0, ' + imageShift.toFixed(2) + 'px, 0)';
        }
        if (watermark) {
          watermark.style.transform =
            'translate3d(-50%, calc(-50% + ' + watermarkShift.toFixed(2) + 'px), 0)';
        }
      });
    }

    aceParallaxHandler = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', aceParallaxHandler, { passive: true });
    window.addEventListener('resize', aceParallaxHandler, { passive: true });
    updateParallax();
  }

  function bindServiceContactForm() {
    var form = document.getElementById('service-contact-form');
    if (!form || form.dataset.bound === '1') return;

    form.dataset.bound = '1';
    var statusEl = document.getElementById('service-contact-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (window.Arivuu.validateServiceContactForm) {
        var err = window.Arivuu.validateServiceContactForm(form);
        if (err) {
          window.Arivuu.showServiceFormStatus(statusEl, err, 'error');
          return;
        }
      }

      var site = window.ARIVUU_SITE || {};
      var subject = form.dataset.subject || 'General enquiry';
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var designation = form.designation ? form.designation.value : '';
      var institution = form.institution ? form.institution.value : '';
      var city = form.city ? form.city.value : '';
      var audience = form.dataset.audience || '';
      var to = site.email || 'info@arivuu.com';

      var payload = {
        formType: 'service-contact',
        name: name,
        email: email,
        phone: String(phone),
        subject: subject,
        message: '',
        institution: institution,
        city: city,
        designation: designation,
        audience: audience
      };

      var mailtoFallback = function () {
        var body = 'Name: ' + name + '\nEmail: ' + email + '\nMobile: ' + phone;
        if (institution && institution !== 'N/A') body += '\nSchool / Institution: ' + institution;
        if (city) body += '\nCity: ' + city;
        if (designation) body += '\nDesignation: ' + designation;
        window.location.href = 'mailto:' + encodeURIComponent(to) +
          '?subject=' + encodeURIComponent(subject + ' — ' + name) +
          '&body=' + encodeURIComponent(body);
      };

      if (window.Arivuu.handleContactFormSubmit) {
        window.Arivuu.handleContactFormSubmit({
          form: form,
          statusEl: statusEl,
          payload: payload,
          showStatus: window.Arivuu.showServiceFormStatus,
          mailtoFallback: mailtoFallback
        });
        return;
      }

      mailtoFallback();
      if (window.Arivuu.showServiceFormStatus) {
        window.Arivuu.showServiceFormStatus(statusEl, 'Opening your email client to send the message…', 'success');
      }
    });
  }

  function renderServicePage() {
    var mount = document.getElementById('service-page-mount');
    if (!mount || !data) return;

    var audience = getAudience();
    mount.innerHTML = renderAudiencePage(audience);

    document.title = audience.seoTitle + ' | Arivuu';
    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO('/service', {
        title: audience.seoTitle + ' | Arivuu',
        description: audience.seoDescription
      });
    }

    bindGistTabs();
    bindCustomSelects();
    bindServiceContactForm();
    bindAceParallax();
  }

  function renderServicesListing() {
    renderServicePage();
  }

  window.Arivuu.initServices = function (page) {
    page = page || document.body.getAttribute('data-page');
    if (page === 'services' || page === 'service') {
      renderServicePage();
    } else {
      teardownAceParallax();
    }
  };

  window.Arivuu.serviceUrl = serviceUrl;
})();
