(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var data = window.ARIVUU_STUDENT_TESTIMONIALS;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function carouselStarsHtml() {
    return (
      '<svg class="student-testimonial-carousel-star" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    ).repeat(5);
  }

  function renderActiveDetail(item) {
    return (
      '<div class="student-testimonial-active" id="student-testimonial-active">' +
        '<div class="student-testimonial-active-head">' +
          '<img id="student-testimonial-avatar" src="' + escapeHtml(item.avatar) + '" alt="' + escapeHtml(item.name) + '" class="student-testimonial-active-avatar" />' +
          '<p id="student-testimonial-name" class="student-testimonial-active-name">' + escapeHtml(item.name) + '</p>' +
        '</div>' +
        '<blockquote id="student-testimonial-quote" class="student-testimonial-active-quote">' + escapeHtml(item.quote) + '</blockquote>' +
        '<div class="student-testimonial-active-stars" aria-label="5 out of 5 stars">' + carouselStarsHtml() + '</div>' +
      '</div>'
    );
  }

  function renderCarouselSlide(item) {
    return (
      '<div class="carousel-slide" data-testimonial-id="' + escapeHtml(item.id) + '">' +
        '<div class="review-card glass-card glass-card-hover student-testimonial-carousel-card p-4 h-full flex flex-col relative z-0 hover:z-10">' +
          '<div class="audience-icon audience-icon-sm audience-icon--round mb-3">' +
            '<svg class="icon audience-icon-svg-fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>' +
          '</div>' +
          '<p class="text-stardust/90 text-xs leading-relaxed flex-1">' + escapeHtml(item.quote) + '</p>' +
          '<div class="flex items-center gap-2.5 mt-4 pt-3 border-t border-nebula/12">' +
            '<img src="' + escapeHtml(item.avatar) + '" alt="' + escapeHtml(item.name) + '" class="w-9 h-9 rounded-full border-2 border-nebula/20 object-cover shrink-0" />' +
            '<div>' +
              '<p class="text-xs font-medium text-stardust">' + escapeHtml(item.name) + '</p>' +
              '<p class="text-[0.6875rem] text-muted-text">' + escapeHtml(item.role) + '</p>' +
              '<div class="flex gap-0.5 mt-1">' + carouselStarsHtml() + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function parseVideoUrl(url) {
    if (!url || !String(url).trim()) return null;

    var raw = String(url).trim();

    var igMatch = raw.match(/instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (igMatch) {
      return {
        type: 'instagram',
        embedUrl: 'https://www.instagram.com/' + igMatch[1] + '/' + igMatch[2] + '/embed',
        externalUrl: raw
      };
    }

    var ytMatch = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i);
    if (ytMatch) {
      return {
        type: 'youtube',
        embedUrl: 'https://www.youtube.com/embed/' + ytMatch[1] + '?rel=0&autoplay=1&mute=1&playsinline=1'
      };
    }

    if (/\.(mp4|webm|ogg)(\?|$)/i.test(raw)) {
      return { type: 'video', embedUrl: raw };
    }

    return null;
  }

  function getInstagramMeta(item) {
    if (!item || !item.videoUrl) return null;

    var video = parseVideoUrl(item.videoUrl);
    if (!video || video.type !== 'instagram') return null;

    var handle = item.instagramHandle && String(item.instagramHandle).trim();
    if (!handle && window.ARIVUU_SITE && window.ARIVUU_SITE.social && window.ARIVUU_SITE.social.instagram) {
      var profileMatch = String(window.ARIVUU_SITE.social.instagram).match(/instagram\.com\/([^/?#]+)/i);
      if (profileMatch) handle = profileMatch[1];
    }

    return {
      username: handle || 'Instagram',
      profileUrl: handle ? 'https://www.instagram.com/' + handle + '/' : video.externalUrl,
      externalUrl: video.externalUrl,
      logo: 'logo/logo-one.png'
    };
  }

  function renderInstagramReel(item, videoSrc) {
    var ig = getInstagramMeta(item);
    var poster = item && item.poster && String(item.poster).trim();

    if (!ig) {
      return (
        '<video class="student-testimonial-video" autoplay muted playsinline loop controls preload="auto"' +
          (poster ? ' poster="' + escapeHtml(poster) + '"' : '') +
          ' src="' + escapeHtml(videoSrc) + '"></video>'
      );
    }

    return (
      '<div class="student-testimonial-ig">' +
        '<div class="student-testimonial-ig-header">' +
          '<img src="' + escapeHtml(ig.logo) + '" alt="Arivuu" class="student-testimonial-ig-avatar" />' +
          '<a href="' + escapeHtml(ig.profileUrl) + '" target="_blank" rel="noopener noreferrer" class="student-testimonial-ig-user">' +
            escapeHtml(ig.username) +
          '</a>' +
        '</div>' +
        '<div class="student-testimonial-ig-player">' +
          '<video class="student-testimonial-video" autoplay muted playsinline loop controls preload="auto"' +
            (poster ? ' poster="' + escapeHtml(poster) + '"' : '') +
            ' src="' + escapeHtml(videoSrc) + '"></video>' +
        '</div>' +
        '<a href="' + escapeHtml(ig.externalUrl) + '" target="_blank" rel="noopener noreferrer" class="student-testimonial-ig-footer">' +
          '<svg class="student-testimonial-ig-logo" viewBox="0 0 24 24" aria-hidden="true">' +
            '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="17.5" cy="6.5" r="1.25" fill="currentColor"/>' +
          '</svg>' +
          '<span>View more on Instagram</span>' +
        '</a>' +
      '</div>'
    );
  }

  function renderMedia(item) {
    var videoSrc = item && item.videoSrc && String(item.videoSrc).trim();
    var poster = item && item.poster && String(item.poster).trim();
    var igMeta = getInstagramMeta(item);

    if (videoSrc && igMeta) {
      return renderInstagramReel(item, videoSrc);
    }

    if (videoSrc) {
      return (
        '<video class="student-testimonial-video" autoplay muted playsinline loop controls preload="auto"' +
          (poster ? ' poster="' + escapeHtml(poster) + '"' : '') +
          ' src="' + escapeHtml(videoSrc) + '"></video>'
      );
    }

    var video = item ? parseVideoUrl(item.videoUrl) : null;

    if (!video) {
      return (
        '<div class="student-testimonial-placeholder">' +
          '<div class="student-testimonial-placeholder-icon" aria-hidden="true">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
          '</div>' +
          '<p class="student-testimonial-placeholder-title">Video story coming soon</p>' +
          '<p class="student-testimonial-placeholder-text">Select a review to read their experience with Arivuu.</p>' +
        '</div>'
      );
    }

    if (video.type === 'video') {
      return (
        '<video class="student-testimonial-video" autoplay muted playsinline loop controls preload="auto" src="' +
          escapeHtml(video.embedUrl) + '"></video>'
      );
    }

    if (video.type === 'instagram') {
      return (
        '<iframe class="student-testimonial-embed" ' +
          'src="' + escapeHtml(video.embedUrl) + '" ' +
          'title="Student testimonial video" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
          'allowfullscreen loading="eager"></iframe>'
      );
    }

    return (
      '<iframe class="student-testimonial-embed" ' +
        'src="' + escapeHtml(video.embedUrl) + '" ' +
        'title="Student testimonial video" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'allowfullscreen loading="eager"></iframe>'
    );
  }

  function playMedia(mediaEl, options) {
    if (!mediaEl) return;

    options = options || {};
    var video = mediaEl.querySelector('video.student-testimonial-video');

    if (video) {
      if (options.unmute) {
        video.muted = false;
        video.setAttribute('data-user-unmuted', '1');
      } else if (!video.hasAttribute('data-user-unmuted')) {
        video.muted = true;
      }

      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          video.muted = true;
          video.play();
        });
      }
      return;
    }

    var iframe = mediaEl.querySelector('iframe.student-testimonial-embed');
    if (iframe && options.reload && iframe.src) {
      var src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }
  }

  function mountMedia(mediaEl, item, options) {
    if (!mediaEl || !item) return;

    mediaEl.innerHTML = renderMedia(item);

    var video = mediaEl.querySelector('video.student-testimonial-video');
    if (video && item.videoSrc) {
      video.addEventListener(
        'error',
        function () {
          var fallback = { videoUrl: item.videoUrl, avatar: item.avatar, poster: item.poster };
          mediaEl.innerHTML = renderMedia(fallback);
          playMedia(mediaEl, options);
        },
        { once: true }
      );
    }

    playMedia(mediaEl, options);
  }

  function renderStudentTestimonialsSection() {
    if (!data || !data.items || !data.items.length) return '';

    var first = data.items[0];

    var slides = data.items
      .map(function (item) {
        return renderCarouselSlide(item);
      })
      .join('');

    return (
      '<section id="student-testimonials" class="student-testimonials-section section-padding bg-void" aria-labelledby="student-testimonials-title">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="student-testimonials-layout">' +
            '<div class="student-testimonials-video-col">' +
              '<div class="student-testimonial-media-wrap" id="student-testimonial-media">' +
                renderMedia(first) +
              '</div>' +
            '</div>' +
            '<div class="student-testimonials-side-col">' +
              '<div class="student-testimonials-header text-center lg:text-left">' +
                '<span class="text-biolume text-xs font-medium tracking-[0.15em] uppercase">' + escapeHtml(data.eyebrow) + '</span>' +
                '<h2 id="student-testimonials-title" class="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-stardust mt-4 leading-tight">' +
                  'What Our <span class="gradient-text">Students Say</span>' +
                '</h2>' +
                (data.subtitle ? '<p class="text-muted-text text-sm sm:text-base mt-4 max-w-2xl mx-auto lg:mx-0">' + escapeHtml(data.subtitle) + '</p>' : '') +
              '</div>' +
              renderActiveDetail(first) +
              '<div class="student-testimonials-carousel relative min-w-0">' +
                '<div id="student-testimonial-carousel" class="carousel-viewport w-full py-3 -my-3">' +
                  '<div id="student-testimonial-carousel-track" class="carousel-track">' + slides + '</div>' +
                '</div>' +
                '<button id="student-testimonial-carousel-prev" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--prev" aria-label="Previous testimonial">' +
                  '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>' +
                '</button>' +
                '<button id="student-testimonial-carousel-next" type="button" class="btn-outline-icon btn-outline-icon-sm btn-outline-icon-surface carousel-nav-btn carousel-nav-btn--next" aria-label="Next testimonial">' +
                  '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>' +
                '</button>' +
              '</div>' +
              '<div id="student-testimonial-carousel-dots" class="flex justify-center gap-2 mt-2"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function updateActiveDetail(item) {
    var quoteEl = document.getElementById('student-testimonial-quote');
    var nameEl = document.getElementById('student-testimonial-name');
    var avatarEl = document.getElementById('student-testimonial-avatar');
    if (!item) return;

    if (quoteEl) quoteEl.textContent = item.quote;
    if (nameEl) nameEl.textContent = item.name;
    if (avatarEl) {
      avatarEl.src = item.avatar;
      avatarEl.alt = item.name;
    }
  }

  function applyTestimonial(item, options) {
    var mediaEl = document.getElementById('student-testimonial-media');
    if (!item || !mediaEl) return;

    mountMedia(mediaEl, item, options || { reload: true });
    updateActiveDetail(item);
  }

  function initStudentTestimonialCarousel(onSelect) {
    var carousel = document.getElementById('student-testimonial-carousel');
    var track = document.getElementById('student-testimonial-carousel-track');
    var prevBtn = document.getElementById('student-testimonial-carousel-prev');
    var nextBtn = document.getElementById('student-testimonial-carousel-next');
    var dotsContainer = document.getElementById('student-testimonial-carousel-dots');
    if (!track || !carousel || carousel.dataset.bound === '1') return;
    carousel.dataset.bound = '1';

    var slides = track.querySelectorAll('.carousel-slide');
    var current = 0;
    var total = slides.length;

    function getSlideWidth() {
      return slides[0] ? slides[0].offsetWidth : 0;
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('button').forEach(function (dot, i) {
        if (i === current) {
          dot.classList.add('w-6', 'bg-nebula');
          dot.classList.remove('w-2', 'bg-nebula/30');
        } else {
          dot.classList.remove('w-6', 'bg-nebula');
          dot.classList.add('w-2', 'bg-nebula/30');
        }
      });
    }

    function goTo(index, options) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
      updateDots();
      if (onSelect) onSelect(current, options || {});
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
          dot.className =
            'h-2 rounded-full transition-all duration-300 ' +
            (idx === 0 ? 'w-6 bg-nebula' : 'w-2 bg-nebula/30 hover:bg-nebula/50');
          dot.addEventListener('click', function () {
            goTo(idx, { unmute: true, reload: true });
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    if (prevBtn) {
      prevBtn.onclick = function () {
        goTo(current - 1, { unmute: true, reload: true });
      };
    }
    if (nextBtn) {
      nextBtn.onclick = function () {
        goTo(current + 1, { unmute: true, reload: true });
      };
    }

    window.addEventListener('resize', function () {
      goTo(current);
    });

    goTo(0, { reload: false });
  }

  function bindStudentTestimonials() {
    var section = document.getElementById('student-testimonials');
    if (!section || section.dataset.bound === '1' || !data || !data.items) return;
    section.dataset.bound = '1';

    initStudentTestimonialCarousel(function (index, options) {
      var item = data.items[index];
      if (item) applyTestimonial(item, options);
    });

    var mediaEl = document.getElementById('student-testimonial-media');

    if (mediaEl && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) playMedia(mediaEl, { reload: false });
          });
        },
        { threshold: 0.45 }
      );
      observer.observe(mediaEl);
    }
  }

  window.Arivuu.renderStudentTestimonialsSection = renderStudentTestimonialsSection;
  window.Arivuu.bindStudentTestimonials = bindStudentTestimonials;
  window.Arivuu.parseTestimonialVideoUrl = parseVideoUrl;
})();
