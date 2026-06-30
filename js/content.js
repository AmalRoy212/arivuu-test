(function () {
  'use strict';

  var careersData = null;
  var blogData = null;
  var careerState = { program: 'All', search: '' };
  var blogState = { category: 'All' };
  var modalReady = false;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  }

  function growthClass(growth) {
    if (growth === 'High') return 'bg-nebula/10 text-nebula border-nebula/20';
    if (growth === 'Emerging') return 'bg-biolume/10 text-biolume border-biolume/20';
    return 'bg-surface-deep text-muted-text border-nebula/15';
  }

  function authorInitials(name) {
    return name.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
  }

  function blogPostUrl(id) {
    return '#/blog-post?id=' + encodeURIComponent(id);
  }

  function getQueryParam(name) {
    if (window.Arivuu && window.Arivuu.routerParams) {
      return window.Arivuu.routerParams.get(name);
    }
    return new URLSearchParams(window.location.search).get(name);
  }

  function openModal(title, bodyHtml) {
    var overlay = document.getElementById('content-modal');
    var titleEl = document.getElementById('content-modal-title');
    var bodyEl = document.getElementById('content-modal-body');
    if (!overlay || !titleEl || !bodyEl) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var overlay = document.getElementById('content-modal');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModal() {
    var overlay = document.getElementById('content-modal');
    if (!overlay) return;
    overlay.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openCareerDetail(career) {
    openModal(career.name,
      '<div class="space-y-4">' +
        '<div class="flex flex-wrap gap-2">' +
          '<span class="text-xs font-medium px-2 py-1 rounded-full bg-nebula/10 text-nebula">' + escapeHtml(career.category) + '</span>' +
          '<span class="text-xs font-medium px-2 py-1 rounded-full border ' + growthClass(career.growth) + '">' + escapeHtml(career.growth) + ' Demand</span>' +
        '</div>' +
        '<p class="text-sm text-muted-text leading-relaxed">' + escapeHtml(career.description) + '</p>' +
        '<div class="glass-card p-4 space-y-2">' +
          '<p class="text-xs text-muted-text"><span class="font-medium text-stardust">Recommended Stream:</span> ' + escapeHtml(career.stream) + '</p>' +
          '<p class="text-xs text-muted-text"><span class="font-medium text-stardust">Growth Outlook:</span> ' + escapeHtml(career.growth) + '</p>' +
          (career.degrees ? '<p class="text-xs text-muted-text"><span class="font-medium text-stardust">Degrees:</span> ' + escapeHtml(career.degrees) + '</p>' : '') +
          (career.salary ? '<p class="text-xs text-muted-text"><span class="font-medium text-stardust">Salary:</span> ' + escapeHtml(career.salary) + '</p>' : '') +
        '</div>' +
        '<p class="text-xs text-muted-text">Take the Arivuu assessment to see if this career aligns with your profile, or speak with a counsellor for a personalized roadmap.</p>' +
        '<a href="#/?scroll=journey" class="inline-block pill-button text-xs" data-close-modal>Explore Assessment</a>' +
      '</div>'
    );
  }

  function bindCareerDetailHandlers(root) {
    if (!root) return;
    root.querySelectorAll('[data-career-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var career = careersData.careers.find(function (c) { return c.id === btn.dataset.careerDetail; });
        if (career) openCareerDetail(career);
      });
    });
  }

  function renderCareerCard(career) {
    return '<article class="career-card glass-card glass-card-hover reveal show">' +
      '<div class="career-card-header">' +
        '<h3 class="career-card-title">' + escapeHtml(career.name) + '</h3>' +
        (career.growth ? '<span class="career-card-growth">' + escapeHtml(career.growth) + '</span>' : '') +
      '</div>' +
      (career.category ? '<span class="career-card-category">' + escapeHtml(career.category) + '</span>' : '') +
      '<p class="career-card-description">' + escapeHtml(career.description || '') + '</p>' +
      '<div class="career-card-divider" aria-hidden="true"></div>' +
      '<div class="career-card-footer">' +
        '<span class="career-card-stream">Stream: ' + escapeHtml(career.stream) + '</span>' +
      '</div>' +
    '</article>';
  }

  var MAX_CAREER_PROGRAM_FILTERS = 3;
  var MAX_CAREER_CARDS = 8;

  function renderCareerCardSkeleton() {
    return '<article class="career-card glass-card career-skeleton-card reveal show" aria-hidden="true">' +
      '<div class="skeleton skeleton-title"></div>' +
      '<div class="skeleton skeleton-pill"></div>' +
      '<div class="skeleton skeleton-line"></div>' +
      '<div class="skeleton skeleton-line short"></div>' +
      '<div class="career-card-divider" aria-hidden="true"></div>' +
      '<div class="skeleton skeleton-footer"></div>' +
    '</article>';
  }

  function renderCareerFiltersSkeleton() {
    return Array(MAX_CAREER_PROGRAM_FILTERS).fill(0).map(function () {
      return '<span class="skeleton skeleton-filter-pill" aria-hidden="true"></span>';
    }).join('');
  }

  function showCareerLibraryLoading() {
    var grid = document.getElementById('career-library-grid');
    var filters = document.getElementById('career-filters-home');
    if (filters) filters.innerHTML = renderCareerFiltersSkeleton();
    if (grid) {
      grid.innerHTML = Array(MAX_CAREER_CARDS).fill(0).map(function () {
        return renderCareerCardSkeleton();
      }).join('');
    }
  }

  function getCareerProgramOptions() {
    if (!careersData || !careersData.careers) return [];

    var programs = [];
    if (careersData.programs && careersData.programs.length) {
      programs = careersData.programs.slice();
    } else {
      var seen = {};
      careersData.careers.forEach(function (career) {
        if (!career.program || seen[career.program]) return;
        seen[career.program] = true;
        programs.push(career.program);
      });
      programs.sort();
    }

    return programs.slice(0, MAX_CAREER_PROGRAM_FILTERS);
  }

  function filterCareers() {
    if (!careersData) return [];
    return careersData.careers.filter(function (career) {
      var matchProgram = careerState.program === 'All' || career.program === careerState.program;
      var q = careerState.search.toLowerCase().trim();
      var matchSearch = !q ||
        career.name.toLowerCase().indexOf(q) !== -1 ||
        career.category.toLowerCase().indexOf(q) !== -1 ||
        career.description.toLowerCase().indexOf(q) !== -1 ||
        career.stream.toLowerCase().indexOf(q) !== -1 ||
        (career.program && career.program.toLowerCase().indexOf(q) !== -1);
      return matchProgram && matchSearch;
    });
  }

  function pickPreviewCareers(careers, limit) {
    var picked = [];
    var seen = {};
    careers.forEach(function (career) {
      if (picked.length >= limit) return;
      if (!seen[career.category]) {
        seen[career.category] = true;
        picked.push(career);
      }
    });
    var i = 0;
    while (picked.length < limit && i < careers.length) {
      if (picked.indexOf(careers[i]) === -1) picked.push(careers[i]);
      i += 1;
    }
    return picked.slice(0, limit);
  }

  function renderCareerFilters(containerId) {
    var container = document.getElementById(containerId);
    if (!container || !careersData) return;

    var programOptions = getCareerProgramOptions();
    if (careerState.program !== 'All' && programOptions.indexOf(careerState.program) === -1) {
      careerState.program = 'All';
    }

    var programs = ['All'].concat(programOptions);
    container.innerHTML = programs.map(function (program) {
      var active = careerState.program === program;
      var label = program === 'All' ? 'All Programs' : program;
      return '<button type="button" data-career-program="' + escapeHtml(program) + '" class="career-filter-btn px-4 py-2 rounded-full text-xs font-medium ' +
        (active
          ? 'bg-nebula text-white shadow-accent-sm'
          : 'btn-outline btn-outline-muted') +
        '">' + escapeHtml(label) + '</button>';
    }).join('');

    container.querySelectorAll('[data-career-program]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        careerState.program = btn.dataset.careerProgram;
        renderCareerFilters('career-filters-home');
        renderCareerPreview();
      });
    });
  }

  function renderCareerPreview() {
    var grid = document.getElementById('career-library-grid');
    if (!grid || !careersData) return;
    var preview = pickPreviewCareers(filterCareers(), MAX_CAREER_CARDS);
    grid.innerHTML = preview.map(renderCareerCard).join('');
    bindCareerDetailHandlers(grid);
  }

  function renderBlogFilters() {
    var container = document.getElementById('blog-filters');
    if (!container || !blogData) return;

    var cats = ['All'];
    blogData.posts.forEach(function (post) {
      if (cats.indexOf(post.category) === -1) cats.push(post.category);
    });

    container.innerHTML = cats.map(function (cat) {
      var active = blogState.category === cat;
      return '<button type="button" data-blog-category="' + escapeHtml(cat) + '" class="blog-filter-btn px-4 py-2 rounded-full text-xs font-medium ' +
        (active
          ? 'bg-nebula text-white shadow-accent-sm'
          : 'btn-outline btn-outline-muted') +
        '">' + escapeHtml(cat === 'All' ? 'All Posts' : cat) + '</button>';
    }).join('');

    container.querySelectorAll('[data-blog-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        blogState.category = btn.dataset.blogCategory;
        renderBlogFilters();
        renderBlogGrid();
      });
    });
  }

  function renderFeaturedBlogCard(post) {
    return '<a href="' + blogPostUrl(post.id) + '" class="blog-card-featured reveal show group block">' +
      '<div class="blog-card-featured-inner">' +
        '<div class="blog-card-featured-media">' +
          '<img src="' + escapeHtml(post.image) + '" alt="" loading="lazy" />' +
          '<div class="blog-card-featured-badge">' +
            '<span class="blog-card-featured-dot"></span>Featured article' +
          '</div>' +
        '</div>' +
        '<div class="blog-card-featured-content">' +
          '<span class="blog-card-eyebrow">' + escapeHtml(post.category) + '</span>' +
          '<h3 class="blog-card-featured-title">' + escapeHtml(post.title) + '</h3>' +
          '<p class="blog-card-featured-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
          '<div class="blog-card-meta">' +
            '<div class="blog-card-author">' +
              '<span class="blog-card-avatar" aria-hidden="true">' + escapeHtml(authorInitials(post.author)) + '</span>' +
              '<div><span class="blog-card-author-name">' + escapeHtml(post.author) + '</span>' +
              '<span class="blog-card-author-meta">' + escapeHtml(formatDate(post.date)) + ' · ' + escapeHtml(post.readTime) + '</span></div>' +
            '</div>' +
            '<span class="blog-card-read-link">' +
              'Continue reading' +
              '<svg class="blog-card-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  function renderBlogCard(post) {
    return '<a href="' + blogPostUrl(post.id) + '" class="blog-card reveal show group block h-full">' +
      '<div class="blog-card-media">' +
        '<img src="' + escapeHtml(post.image) + '" alt="" loading="lazy" />' +
        '<span class="blog-card-category">' + escapeHtml(post.category) + '</span>' +
      '</div>' +
      '<div class="blog-card-body">' +
        '<div class="blog-card-date">' + escapeHtml(formatDate(post.date)) + ' · ' + escapeHtml(post.readTime) + '</div>' +
        '<h3 class="blog-card-title">' + escapeHtml(post.title) + '</h3>' +
        '<p class="blog-card-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
        '<div class="blog-card-footer">' +
          '<div class="blog-card-author">' +
            '<span class="blog-card-avatar blog-card-avatar-sm" aria-hidden="true">' + escapeHtml(authorInitials(post.author)) + '</span>' +
            '<span class="blog-card-author-name">' + escapeHtml(post.author) + '</span>' +
          '</div>' +
          '<span class="blog-card-read-link blog-card-read-link-sm">' +
            'Read' +
            '<svg class="blog-card-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  function renderBlogPreview() {
    var grid = document.getElementById('blog-grid');
    if (!grid || !blogData) return;

    var featured = blogData.posts.find(function (p) { return p.featured; });
    var others = blogData.posts.filter(function (p) { return !featured || p.id !== featured.id; });
    var html = '';

    if (featured) {
      html += renderFeaturedBlogCard(featured);
    }

    var cards = others.slice(0, featured ? 2 : 3);
    if (cards.length) {
      html += '<div class="blog-card-grid">' + cards.map(renderBlogCard).join('') + '</div>';
    }

    grid.innerHTML = html;
  }

  function renderBlogGrid() {
    var grid = document.getElementById('blog-grid');
    if (!grid || !blogData) return;

    var posts = blogData.posts.filter(function (post) {
      return blogState.category === 'All' || post.category === blogState.category;
    });

    if (posts.length === 0) {
      grid.innerHTML = '<div class="col-span-full text-center py-16"><p class="text-muted-text text-sm">No blog posts in this category yet.</p></div>';
      return;
    }

    var showFeatured = blogState.category === 'All';
    var featured = showFeatured ? posts.find(function (p) { return p.featured; }) : null;
    var rest = showFeatured && featured
      ? posts.filter(function (p) { return p.id !== featured.id; })
      : posts;

    var html = '';
    if (featured && showFeatured) {
      html += renderFeaturedBlogCard(featured);
    }
    if (rest.length) {
      html += '<div class="blog-card-grid">' + rest.map(renderBlogCard).join('') + '</div>';
    }
    grid.innerHTML = html;
  }

  function renderBlogPostDetail(post) {
    document.title = post.title + ' | Arivuu Blog';
    if (window.Arivuu.setPageSEO) {
      window.Arivuu.setPageSEO('/blog-post', {
        title: post.title + ' | Arivuu Career Guidance Blog',
        description: post.excerpt || post.title
      });
    }
    var root = document.getElementById('blog-article');
    if (!root) return;

    var paragraphs = post.content.split('\n\n').map(function (p) {
      return '<p>' + escapeHtml(p) + '</p>';
    }).join('');

    root.innerHTML =
      '<nav class="page-breadcrumbs" aria-label="Breadcrumb">' +
        '<a href="#/">Home</a><span>/</span><a href="#/blog">Blog</a><span>/</span><span class="page-breadcrumbs-current">' + escapeHtml(post.category) + '</span>' +
      '</nav>' +
      '<header class="article-header">' +
        '<span class="blog-card-eyebrow">' + escapeHtml(post.category) + '</span>' +
        '<h1 class="article-title">' + escapeHtml(post.title) + '</h1>' +
        '<p class="article-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
        '<div class="article-meta">' +
          '<div class="blog-card-author">' +
            '<span class="blog-card-avatar" aria-hidden="true">' + escapeHtml(authorInitials(post.author)) + '</span>' +
            '<div>' +
              '<span class="blog-card-author-name">' + escapeHtml(post.author) + '</span>' +
              '<span class="blog-card-author-meta">' + escapeHtml(formatDate(post.date)) + ' · ' + escapeHtml(post.readTime) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="article-hero"><img src="' + escapeHtml(post.image) + '" alt="" /></div>' +
      '<div class="article-content">' + paragraphs + '</div>' +
      '<div class="article-cta glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">' +
        '<div>' +
          '<h2 class="font-display text-lg font-medium text-stardust">Ready for personalised guidance?</h2>' +
          '<p class="text-muted-text text-sm mt-1">Take the Arivuu assessment and speak with a certified counsellor.</p>' +
        '</div>' +
        '<a href="#/?scroll=journey" class="pill-button text-sm whitespace-nowrap">Start Your Journey</a>' +
      '</div>';

    var relatedEl = document.getElementById('blog-related');
    if (relatedEl) {
      var related = blogData.posts.filter(function (p) {
        return p.id !== post.id && p.category === post.category;
      }).slice(0, 3);
      if (related.length < 3) {
        blogData.posts.forEach(function (p) {
          if (related.length >= 3) return;
          if (p.id !== post.id && related.indexOf(p) === -1) related.push(p);
        });
      }
      relatedEl.innerHTML =
        '<h2 class="font-display text-2xl font-medium text-stardust mb-6">Related articles</h2>' +
        '<div class="blog-card-grid">' + related.map(renderBlogCard).join('') + '</div>';
    }
  }

  function showCareerError() {
    var grid = document.getElementById('career-library-grid');
    var filters = document.getElementById('career-filters-home');
    if (filters) filters.innerHTML = '';
    if (grid) {
      grid.innerHTML =
        '<div class="career-library-error">' +
          '<p>Couldn\'t load Career Library at the moment. Please try again later.</p>' +
          '<button type="button" id="career-library-retry" class="pill-button text-xs">Try again</button>' +
        '</div>';
      var retryBtn = document.getElementById('career-library-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', function () {
          loadCareerLibrary();
        });
      }
    }
  }

  function loadCareerLibrary() {
    showCareerLibraryLoading();
    return window.Arivuu.loadCareerData().then(function (data) {
      careersData = data;
      var totalEl = document.getElementById('career-total');
      if (totalEl && data.meta) totalEl.textContent = data.meta.total + '+';
      renderCareerFilters('career-filters-home');
      renderCareerPreview();
      return data;
    }).catch(showCareerError);
  }

  function showBlogError() {
    var grid = document.getElementById('blog-grid');
    if (grid) {
      grid.innerHTML = '<div class="col-span-full text-center py-16"><p class="text-muted-text text-sm">Unable to load blog posts. Please try again later.</p></div>';
    }
  }

  function initHome() {
    loadCareerLibrary();

    window.Arivuu.loadBlogData().then(function (data) {
      blogData = data;
      renderBlogPreview();
    }).catch(showBlogError);
  }

  function initBlogPage() {
    window.Arivuu.loadBlogData().then(function (data) {
      blogData = data;
      renderBlogFilters();
      renderBlogGrid();
    }).catch(showBlogError);
  }

  function initBlogPostPage() {
    var postId = getQueryParam('id');
    var article = document.getElementById('blog-article');

    window.Arivuu.loadBlogData().then(function (data) {
      blogData = data;
      var post = data.posts.find(function (p) { return p.id === postId; });
      if (!post) {
        if (article) {
          article.innerHTML = '<div class="text-center py-16"><p class="text-muted-text mb-4">Article not found.</p><a href="#/blog" class="pill-button text-sm">Back to Blog</a></div>';
        }
        return;
      }
      renderBlogPostDetail(post);
    }).catch(function () {
      if (article) {
        article.innerHTML = '<div class="text-center py-16"><p class="text-muted-text">Unable to load article.</p></div>';
      }
    });
  }

  window.Arivuu = window.Arivuu || {};
  window.Arivuu.initContent = function (page) {
    page = page || document.body.getAttribute('data-page') || 'home';
    if (!modalReady) {
      initModal();
      modalReady = true;
    }
    if (page === 'home') initHome();
    else if (page === 'blog') initBlogPage();
    else if (page === 'blog-post') initBlogPostPage();
  };
})();
