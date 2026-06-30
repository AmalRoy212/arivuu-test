(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var CARD_ICONS = {
    chart:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>',
    compass:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    users:
      '<svg class="flip-card-icon audience-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderFeatureBar(items) {
    items = items || (window.ARIVUU_STUDENT_GUIDE && window.ARIVUU_STUDENT_GUIDE.featureBar) || [];
    var cells = items
      .map(function (item) {
        return '<div class="feature-highlights-item"><span>' + escapeHtml(item) + '</span></div>';
      })
      .join('');

    return (
      '<section class="feature-highlights-bar bg-surface-deep" aria-label="Key features">' +
        '<div class="feature-highlights-track">' + cells + '</div>' +
      '</section>'
    );
  }

  function renderFAQSection() {
    var data = window.ARIVUU_FAQ;
    if (!data) return '';

    var items = (data.items || [])
      .map(function (item, index) {
        var answerHtml;
        if (item.isList) {
          answerHtml =
            '<ul class="faq-answer-list">' +
            item.answer
              .map(function (line) {
                return '<li>' + escapeHtml(line) + '</li>';
              })
              .join('') +
            '</ul>';
        } else {
          answerHtml = item.answer
            .map(function (para) {
              return '<p>' + escapeHtml(para) + '</p>';
            })
            .join('');
        }

        var indexLabel = String(index + 1).padStart(2, '0');

        return (
          '<div class="faq-item">' +
            '<button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-answer-' + index + '" id="faq-question-' + index + '">' +
              '<span class="faq-index" aria-hidden="true">' + indexLabel + '</span>' +
              '<span class="faq-question-text">' + escapeHtml(item.question) + '</span>' +
              '<span class="faq-chevron" aria-hidden="true">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>' +
              '</span>' +
            '</button>' +
            '<div class="faq-answer" id="faq-answer-' + index + '" role="region" aria-labelledby="faq-question-' + index + '" aria-hidden="true">' +
              '<div class="faq-answer-inner">' + answerHtml + '</div>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');

    var eyebrow = data.eyebrow ? escapeHtml(data.eyebrow) : 'FAQ';

    return (
      '<section id="faq" class="faq-section section-padding bg-void" aria-labelledby="faq-title">' +
        '<div class="faq-section-glow" aria-hidden="true"></div>' +
        '<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">' +
          '<div class="faq-layout">' +
            '<div class="faq-aside">' +
              '<span class="faq-eyebrow text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + eyebrow + '</span>' +
              '<h2 id="faq-title" class="faq-title font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-stardust mt-4 leading-tight">' +
                'Got <span class="gradient-text">Questions?</span>' +
              '</h2>' +
              '<p class="faq-intro">' + escapeHtml(data.intro) + '</p>' +
              '<div class="faq-aside-card glass-card">' +
                '<div class="faq-aside-icon" aria-hidden="true">' +
                  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
                '</div>' +
                '<div>' +
                  '<p class="faq-aside-card-title">Still need help?</p>' +
                  '<p class="faq-aside-card-text">Our counsellors are happy to walk you through assessments, reports, and next steps.</p>' +
                  '<a href="#/contact" class="faq-aside-link">Talk to Arivuu</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="faq-list">' + items + '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderTestimonialsSection() {
    return (
      '<section id="testimonials" class="section-padding bg-void relative overflow-x-clip">' +
        '<div class="max-w-7xl mx-auto w-full">' +
          '<div class="min-w-0">' +
            '<div class="text-center mb-6 sm:mb-8">' +
              '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">Student Success Stories</span>' +
              '<h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-4 leading-tight">What Our <span class="gradient-text">Students Say</span></h2>' +
            '</div>' +
            '<div class="relative min-w-0 px-9 sm:px-6 md:px-8 lg:px-0">' +
              '<div id="testimonial-carousel" class="carousel-viewport w-full py-6 sm:py-8 -my-4 sm:-my-6">' +
                '<div id="carousel-track" class="carousel-track">' +
                  renderTestimonialSlide(
                    'Arivuu transformed my career path. The psychometric assessment mapped my strengths accurately and the counsellors helped me discover a passion for data science I never knew I had.',
                    'images/avatar-1.jpg',
                    'Aryan Sharma',
                    'Grade 12 Student'
                  ) +
                  renderTestimonialSlide(
                    'As a parent, I was worried about my child\'s future. Arivuu gave us clarity and a solid roadmap. The 32-page report was detailed and eye-opening.',
                    'images/avatar-2.jpg',
                    'Priya Patel',
                    'Parent'
                  ) +
                  renderTestimonialSlide(
                    'We integrated Arivuu into our school system and the results have been phenomenal. Our students are more confident about their career choices than ever before.',
                    'images/avatar-3.jpg',
                    'Dr. Rajesh Iyer',
                    'Principal, DPS Bangalore'
                  ) +
                  renderTestimonialSlide(
                    'The hands-on approach and the detailed career exploration helped me narrow down my options. I went from being completely confused to having a clear plan.',
                    'images/avatar-4.jpg',
                    'Ananya Krishnan',
                    'Grade 11 Student'
                  ) +
                  renderTestimonialSlide(
                    'Best decision I ever made! The career guidance workshop at our school was amazing. I discovered so many new-age career options I had never heard of.',
                    'images/avatar-5.jpg',
                    'Rohan Verma',
                    'Grade 10 Student'
                  ) +
                '</div>' +
              '</div>' +
              '<button id="carousel-prev" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--prev" aria-label="Previous testimonial">' +
                '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>' +
              '</button>' +
              '<button id="carousel-next" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--next" aria-label="Next testimonial">' +
                '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>' +
              '</button>' +
            '</div>' +
            '<div id="carousel-dots" class="flex justify-center gap-2 mt-4 sm:mt-6 px-2"></div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function starsHtml() {
    return (
      '<svg class="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    ).repeat(5);
  }

  function renderTestimonialSlide(quote, avatar, name, role) {
    return (
      '<div class="carousel-slide">' +
        '<div class="review-card glass-card glass-card-hover p-5 sm:p-6 h-full min-h-[240px] sm:min-h-[260px] lg:min-h-[280px] flex flex-col relative z-0 hover:z-10">' +
          '<div class="audience-icon audience-icon-sm audience-icon--round mb-5">' +
            '<svg class="icon audience-icon-svg-fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>' +
          '</div>' +
          '<p class="text-stardust/90 text-sm leading-relaxed flex-1">' + escapeHtml(quote) + '</p>' +
          '<div class="flex items-center gap-3 mt-6 pt-5 border-t border-nebula/12">' +
            '<img src="' + escapeHtml(avatar) + '" alt="' + escapeHtml(name) + '" class="w-11 h-11 rounded-full border-2 border-nebula/20 object-cover shrink-0" />' +
            '<div>' +
              '<p class="text-sm font-medium text-stardust">' + escapeHtml(name) + '</p>' +
              '<p class="text-xs text-muted-text">' + escapeHtml(role) + '</p>' +
              '<div class="flex gap-0.5 mt-1.5">' + starsHtml() + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function bindFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var item = btn.closest('.faq-item');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var section = btn.closest('.faq-section');

        if (section && !expanded) {
          section.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
            if (openItem === item) return;
            openItem.classList.remove('is-open');
            var openBtn = openItem.querySelector('.faq-question');
            var openPanel = openItem.querySelector('.faq-answer');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            if (openPanel) openPanel.setAttribute('aria-hidden', 'true');
          });
        }

        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (item) item.classList.toggle('is-open', !expanded);
        if (panel) panel.setAttribute('aria-hidden', expanded ? 'true' : 'false');
      });
    });
  }

  function mountFAQ(target) {
    if (!target || target.dataset.mounted === '1') return;
    target.innerHTML = renderFAQSection();
    target.dataset.mounted = '1';
    bindFAQ();
  }

  window.Arivuu.renderFeatureBar = renderFeatureBar;
  window.Arivuu.renderFAQSection = renderFAQSection;
  window.Arivuu.renderTestimonialsSection = renderTestimonialsSection;
  window.Arivuu.bindFAQ = bindFAQ;
  window.Arivuu.mountFAQ = mountFAQ;
  window.Arivuu.CARD_ICONS = CARD_ICONS;
})();
