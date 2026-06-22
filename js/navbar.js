(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  function navLink(href, label, active) {
    var cls = active
      ? 'text-sm text-stardust font-medium font-body'
      : 'text-sm text-muted-text hover:text-stardust transition-colors duration-300 font-body';
    return '<a href="' + href + '" class="' + cls + '">' + label + '</a>';
  }

  function mobileNavLink(href, label, active) {
    var cls = active
      ? 'nav-mobile-link nav-mobile-link-active'
      : 'nav-mobile-link';
    return '<a href="' + href + '" class="' + cls + '">' + label + '</a>';
  }

  window.Arivuu.renderNavbar = function (page) {
    page = page || document.body.getAttribute('data-page') || 'home';
    var isHome = page === 'home';

    var links = [
      { href: '#/', label: 'Home', active: isHome },
      { href: '#/about', label: 'About', active: page === 'about' },
      { href: '#/service?audience=school', label: 'Services', active: page === 'services' || page === 'service' },
      { href: '#/?scroll=career-library', label: 'Career Library', active: isHome },
      { href: '#/blog', label: 'Blog', active: page === 'blog' || page === 'blog-post' },
      { href: '#/contact', label: 'Contact', active: page === 'contact' }
    ];

    var html =
      '<nav id="navbar" class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-transparent">' +
        '<div class="nav-bar-head w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">' +
          '<div class="flex items-center justify-between h-16 sm:h-20">' +
            '<a href="#/" class="flex items-center shrink-0 gap-2 min-w-0">' +
              '<img src="logo/logo-one.png" alt="" class="h-7 w-7 sm:h-8 sm:w-8 object-contain" draggable="false" />' +
              '<img src="logo/logo-text.png" alt="Arivuu" class="h-5 w-auto object-contain" draggable="false" />' +
            '</a>' +
            '<div class="hidden lg:flex items-center gap-5 xl:gap-8">' +
              links.map(function (l) { return navLink(l.href, l.label, l.active); }).join('') +
            '</div>' +
            '<div class="flex items-center gap-2 sm:gap-3">' +
              '<a href="#/contact" class="pill-button pill-button-sm text-xs hidden sm:inline-flex">Begin Journey</a>' +
              '<button type="button" id="nav-toggle" class="nav-toggle lg:hidden" aria-expanded="false" aria-controls="nav-mobile-menu" aria-label="Open menu">' +
                '<svg class="nav-toggle-icon nav-toggle-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
                '<svg class="nav-toggle-icon nav-toggle-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<div id="nav-mobile-menu" class="nav-mobile-menu lg:hidden" hidden>' +
        '<div class="nav-mobile-menu-inner">' +
          links.map(function (l) { return mobileNavLink(l.href, l.label, l.active); }).join('') +
          '<a href="#/contact" class="nav-mobile-cta">Begin Journey</a>' +
        '</div>' +
      '</div>';

    var wrapper = document.getElementById('site-navbar');
    if (wrapper) {
      wrapper.innerHTML = html;
    }
    if (window.Arivuu.bindNavbar) window.Arivuu.bindNavbar();
  };

})();
