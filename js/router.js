(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var ROUTES = {
    '/': { page: 'home' },
    '/about': { page: 'about', file: 'pages/about.html' },
    '/contact': { page: 'contact', file: 'pages/contact.html' },
    '/services': { page: 'services', file: 'pages/services.html', defaultQuery: 'audience=school' },
    '/service': { page: 'service', file: 'pages/service.html' },
    '/blog': { page: 'blog', file: 'pages/blog.html' },
    '/blog-post': { page: 'blog-post', file: 'pages/blog-post.html' }
  };

  var homeTemplate = null;
  var viewCache = {};
  var currentPath = null;

  function basePath() {
    var path = window.location.pathname;
    if (path.endsWith('/')) return path;
    var idx = path.lastIndexOf('/');
    return idx === -1 ? '/' : path.slice(0, idx + 1);
  }

  function parseRoute() {
    var raw = window.location.hash.replace(/^#/, '') || '/';
    if (!raw.startsWith('/')) raw = '/' + raw;
    var q = raw.indexOf('?');
    var path = q === -1 ? raw : raw.slice(0, q);
    var params = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
    if (!ROUTES[path]) path = '/';
    return { path: path, params: params, route: ROUTES[path] };
  }

  function cacheHome() {
    var outlet = document.getElementById('app-outlet');
    if (outlet && homeTemplate === null) homeTemplate = outlet.innerHTML;
  }

  function refreshHomeTemplate() {
    var outlet = document.getElementById('app-outlet');
    if (outlet) homeTemplate = outlet.innerHTML;
  }

  function setMeta(route, params, path) {
    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO(path || parseRoute().path);
    }
    window.Arivuu.routerParams = params;
  }

  function scrollToTarget(params) {
    var scrollId = params.get('scroll');
    if (!scrollId) return;
    requestAnimationFrame(function () {
      var el = document.getElementById(scrollId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function fetchView(file) {
    if (viewCache[file]) return Promise.resolve(viewCache[file]);

    if (window.ARIVUU_VIEWS && window.ARIVUU_VIEWS[file]) {
      viewCache[file] = window.ARIVUU_VIEWS[file];
      return Promise.resolve(viewCache[file]);
    }

    var urls = [
      new URL(file, window.location.href).href,
      new URL(basePath() + file, window.location.origin || window.location.href).href
    ];

    function tryFetch(i) {
      if (i >= urls.length) return Promise.reject(new Error('Failed to load ' + file));
      return fetch(urls[i]).then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + file);
        return res.text();
      }).catch(function () { return tryFetch(i + 1); });
    }

    return tryFetch(0).then(function (html) {
      viewCache[file] = html;
      return html;
    });
  }

  function navigate(path, params, replace) {
    var hash = path + (params.toString() ? '?' + params.toString() : '');
    var nextHash = '#' + hash;
    if (replace) {
      history.replaceState({ path: path, params: params.toString() }, '', nextHash);
    } else if (window.location.hash !== nextHash) {
      history.pushState({ path: path, params: params.toString() }, '', nextHash);
    }
    return render(path, params);
  }

  function render(path, params) {
    var route = ROUTES[path] || ROUTES['/'];
    var outlet = document.getElementById('app-outlet');
    if (!outlet) return Promise.resolve();

    if (route.defaultQuery && !params.toString()) {
      params = new URLSearchParams(route.defaultQuery);
    }

    var previousPath = currentPath;
    currentPath = path;
    outlet.classList.add('is-loading');
    setMeta(route, params, path);
    document.body.setAttribute('data-page', route.page);

    if (previousPath === '/' && path !== '/') {
      refreshHomeTemplate();
    }

    var done = function (html) {
      outlet.innerHTML = html;
      outlet.classList.remove('is-loading');
      if (window.Arivuu.initPage) window.Arivuu.initPage(route.page, params);
      window.scrollTo(0, 0);
      if (path === '/') scrollToTarget(params);
    };

    if (path === '/') {
      cacheHome();
      done(homeTemplate || '');
      return Promise.resolve();
    }

    return fetchView(route.file).then(done).catch(function () {
      outlet.innerHTML = '<main class="pt-16 sm:pt-20"><div class="section-padding text-center"><p class="text-muted-text">Unable to load this page.</p><a href="#/" class="inline-block mt-4 text-nebula text-sm font-medium">Go home</a></div></main>';
      outlet.classList.remove('is-loading');
    });
  }

  function isOnHome() {
    return currentPath === '/' || (currentPath === null && parseRoute().path === '/');
  }

  function handleLinkClick(e) {
    var link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    if (href.startsWith('#/')) {
      e.preventDefault();
      var raw = href.slice(1);
      var q = raw.indexOf('?');
      var path = q === -1 ? raw : raw.slice(0, q);
      var params = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
      navigate(path, params, false);
      return;
    }

    if (href === '#' || href === '#/') {
      e.preventDefault();
      navigate('/', new URLSearchParams(), false);
      return;
    }

    if (href.startsWith('#') && !href.startsWith('#/')) {
      var sectionId = href.slice(1);
      if (!sectionId) return;
      e.preventDefault();
      if (isOnHome()) {
        var target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      navigate('/', new URLSearchParams('scroll=' + encodeURIComponent(sectionId)), false);
    }
  }

  function boot() {
    if (/\/pages\//.test(window.location.pathname)) {
      var name = window.location.pathname.split('/').pop().replace(/\.html$/, '');
      window.location.replace(basePath() + 'index.html#/' + name + window.location.search);
      return;
    }

    cacheHome();

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', function () {
      var r = parseRoute();
      render(r.path, r.params);
    });

    var initial = parseRoute();
    if (window.location.hash) {
      history.replaceState({ path: initial.path, params: initial.params.toString() }, '', window.location.hash);
    }
    render(initial.path, initial.params);
  }

  window.Arivuu.navigate = navigate;
  window.Arivuu.parseRoute = parseRoute;
  window.Arivuu.link = function (path, query) {
    return '#/' + path.replace(/^\//, '') + (query ? '?' + query : '');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
