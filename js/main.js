(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var scrollHandler = null;
  var gridScrollHandler = null;
  var statsObserver = null;
  var revealObserver = null;
  var statsAnimated = false;
  var navBound = false;
  var lockedScrollY = 0;

  function getPage() {
    return document.body.getAttribute('data-page') || 'home';
  }

  function initGridLines() {
    var gridContainer = document.getElementById('grid-lines');
    if (!gridContainer || gridContainer.childElementCount) return;
    for (var i = 0; i < 100; i++) {
      var cell = document.createElement('div');
      cell.className = 'grid-line';
      gridContainer.appendChild(cell);
    }
  }

  function updateNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar || navbar.classList.contains('nav-open')) return;
    var isHome = getPage() === 'home';
    if (!isHome || window.scrollY > 50) {
      navbar.classList.add('bg-surface-deep/80', 'backdrop-blur-xl', 'border-b', 'border-nebula/12');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('bg-surface-deep/80', 'backdrop-blur-xl', 'border-b', 'border-nebula/12');
      navbar.classList.add('bg-transparent');
    }
  }

  function setMobileNavOpen(open) {
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('nav-toggle');
    var navMobileMenu = document.getElementById('nav-mobile-menu');
    if (!navbar || !navToggle || !navMobileMenu) return;

    navbar.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navMobileMenu.hidden = !open;
    document.body.classList.toggle('nav-menu-open', open);

    if (open) {
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + lockedScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      navbar.classList.remove('bg-surface-deep/80', 'backdrop-blur-xl', 'border-b', 'border-nebula/12', 'bg-transparent');
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, lockedScrollY);
      updateNavbarScroll();
    }
  }

  window.Arivuu.bindNavbar = function () {
    var navToggle = document.getElementById('nav-toggle');
    var navMobileMenu = document.getElementById('nav-mobile-menu');
    if (!navToggle || !navMobileMenu || navToggle.dataset.bound === '1') return;

    navToggle.dataset.bound = '1';
    navToggle.addEventListener('click', function () {
      setMobileNavOpen(navMobileMenu.hidden);
    });

    navMobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMobileNavOpen(false); });
    });
  };

  function initScrollReveal() {
    if (revealObserver) revealObserver.disconnect();
    var revealEls = document.querySelectorAll('.reveal, .reveal-x-left, .reveal-x-right, .timeline-line');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('show'); });
    }
  }

  function animateCounter(el, target, suffix) {
    var duration = 2000;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 2);
      var val = Math.floor(target * eased);
      if (val >= 1000) {
        el.textContent = Math.floor(val / 1000) + 'K' + suffix;
      } else {
        el.textContent = val + suffix;
      }
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function formatCounterValue(target, suffix) {
    if (target >= 1000) return Math.floor(target / 1000) + 'K' + suffix;
    return target + suffix;
  }

  function initStats() {
    if (statsObserver) statsObserver.disconnect();

    var statsSection = document.getElementById('stats-bar');
    if (!statsSection) return;

    var counters = statsSection.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var needsAnimation = false;
    counters.forEach(function (el) {
      var target = parseInt(el.dataset.counter, 10);
      var suffix = el.dataset.suffix || '';
      if (el.textContent === formatCounterValue(target, suffix)) return;
      el.textContent = '0' + suffix;
      needsAnimation = true;
    });

    if (!needsAnimation) {
      statsAnimated = true;
      return;
    }

    statsAnimated = false;

    function runCounters() {
      if (statsAnimated) return;
      statsAnimated = true;
      counters.forEach(function (el) {
        animateCounter(el, parseInt(el.dataset.counter, 10), el.dataset.suffix || '');
      });
      if (statsObserver) statsObserver.disconnect();
    }

    statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);

    requestAnimationFrame(function () {
      var rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) runCounters();
    });
  }

  function initHero() {
    document.querySelectorAll('.hero-animate').forEach(function (el) {
      el.classList.remove('show');
    });
    setTimeout(function () {
      document.querySelectorAll('.hero-animate').forEach(function (el) {
        el.classList.add('show');
      });
    }, 200);
  }

  function initProgramFilters() {
    var filterBtns = document.querySelectorAll('[data-filter]');
    var programCards = document.querySelectorAll('[data-category]');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.onclick = function () {
        var filter = btn.dataset.filter;
        filterBtns.forEach(function (b) {
          var active = b.dataset.filter === filter;
          b.classList.toggle('bg-nebula', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('shadow-accent-sm', active);
          b.classList.toggle('border', !active);
          b.classList.toggle('border-nebula/25', !active);
          b.classList.toggle('text-muted-text', !active);
        });
        programCards.forEach(function (card) {
          var show = filter === 'All Programs' || card.dataset.category === filter;
          card.classList.toggle('hidden-card', !show);
        });
      };
    });
  }

  function initCarousel() {
    var carousel = document.getElementById('testimonial-carousel');
    var track = document.getElementById('carousel-track');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    var dotsContainer = document.getElementById('carousel-dots');
    if (!track || !carousel) return;

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

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
      updateDots();
    }

    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
        dot.className = 'h-2 rounded-full transition-all duration-300 ' + (idx === 0 ? 'w-6 bg-nebula' : 'w-2 bg-nebula/30 hover:bg-nebula/50');
        dot.addEventListener('click', function () { goTo(idx); });
        dotsContainer.appendChild(dot);
      })(i);
    }

    if (prevBtn) prevBtn.onclick = function () { goTo(current - 1); };
    if (nextBtn) nextBtn.onclick = function () { goTo(current + 1); };
    window.addEventListener('resize', function () { goTo(current); });
    goTo(0);
  }

  function initGridScroll() {
    if (gridScrollHandler) {
      window.removeEventListener('scroll', gridScrollHandler);
      gridScrollHandler = null;
    }
    var whySection = document.getElementById('why-choose');
    var gridLines = document.querySelectorAll('.grid-line');
    if (!whySection || !gridLines.length) return;

    gridScrollHandler = function () {
      var rect = whySection.getBoundingClientRect();
      var viewH = window.innerHeight;
      var start = viewH;
      var end = -rect.height;
      var progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      gridLines.forEach(function (line, i) {
        line.style.animationDelay = '-' + (progress * 3 + i * 0.05) + 's';
      });
    };
    window.addEventListener('scroll', gridScrollHandler, { passive: true });
  }

  if (!scrollHandler) {
    scrollHandler = function () { updateNavbarScroll(); };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  window.Arivuu.initMain = function (page) {
    page = page || getPage();
    initGridLines();
    updateNavbarScroll();
    window.Arivuu.bindNavbar();
    initScrollReveal();

    if (page === 'home') {
      initHero();
      initStats();
      initGridScroll();
      initProgramFilters();
    }

    if (page === 'home') {
      initCarousel();
    }
  };

})();
