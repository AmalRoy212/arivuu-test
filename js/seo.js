(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var BRAND = 'Arivuu';
  var OG_IMAGE = 'images/og-image.jpg';
  var OG_IMAGE_WIDTH = '1200';
  var OG_IMAGE_HEIGHT = '679';
  var OG_IMAGE_ALT = 'Arivuu — Career guidance for students, parents and teachers across India';
  var DEFAULT_KEYWORDS =
    'career guidance India, career counselling students, career guidance for parents, ' +
    'career counselling for teachers, Class 8 9 10 11 12 career guidance, stream selection counselling, ' +
    'psychometric career assessment, career counsellor India, school career guidance program, ' +
    'career library India, ACE journey career counselling, Bengaluru career guidance';

  var PAGE_SEO = {
    '/': {
      title: 'Arivuu | Career Guidance for Students, Parents & Teachers in India',
      description:
        'India\'s trusted career guidance platform for students (Class 8–12), parents & teachers. ' +
        'Psychometric assessments, 250+ expert counsellors, 155+ career paths & 320+ partner schools.',
      keywords: DEFAULT_KEYWORDS
    },
    '/about': {
      title: 'About Arivuu | Career Guidance Experts for Indian Students & Schools',
      description:
        'Learn how Arivuu guides 55,000+ students across India with psychometric science, certified counsellors ' +
        'and school partnerships — helping families make confident career decisions.',
      keywords: 'about Arivuu, career guidance company India, student career counselling, school career partner'
    },
    '/services': {
      title: 'Career Guidance Programs & Services | Arivuu India',
      description:
        'Explore Arivuu programs: Discovery (Class 8–10), Stream Selection, Career Roadmap, school partnerships ' +
        'and workshops for students, parents and educators across India.',
      keywords: 'career guidance programs India, stream selection program, career roadmap counselling, school partnership'
    },
    '/service': {
      title: 'Career Program Details | Arivuu Services',
      description:
        'Detailed career guidance program for Indian students and schools — assessments, counselling sessions, ' +
        'and personalised roadmaps from Class 8 through 12.',
      keywords: 'career program India, student counselling program, career assessment program'
    },
    '/blog': {
      title: 'Career Guidance Blog — Tips for Students, Parents & Teachers | Arivuu',
      description:
        'Expert articles on career planning, stream selection, exam preparation and counselling for students, ' +
        'parents and educators across India.',
      keywords: 'career guidance blog, career tips students India, parent career counselling advice'
    },
    '/blog-post': {
      title: 'Career Guidance Article | Arivuu Blog',
      description:
        'In-depth career guidance article from Arivuu — practical advice for students, parents and teachers in India.',
      keywords: 'career guidance article, student career advice India'
    },
    '/contact': {
      title: 'Contact Arivuu | Book Career Counselling for Students & Schools',
      description:
        'Contact Arivuu for career counselling, school partnerships, workshops or counsellor network enquiries. ' +
        'Serving students, parents and teachers across India.',
      keywords: 'contact career counsellor India, book career counselling, school career guidance enquiry'
    }
  };

  function env() {
    return window.ARIVUU_ENV || {};
  }

  function siteConfig() {
    return window.ARIVUU_SITE || {};
  }

  function basePath() {
    var path = window.location.pathname;
    if (path.endsWith('/')) return path;
    var idx = path.lastIndexOf('/');
    return idx === -1 ? '/' : path.slice(0, idx + 1);
  }

  function siteUrl() {
    var configured = env().SITE_URL || siteConfig().url;
    if (configured) return String(configured).replace(/\/$/, '');
    return (window.location.origin + basePath()).replace(/\/$/, '');
  }

  function absoluteUrl(relativePath) {
    var base = siteUrl();
    var path = relativePath.charAt(0) === '/' ? relativePath : '/' + relativePath;
    return base + path;
  }

  function shouldPreventIndexing() {
    var e = env();
    return e.PREVENT_INDEXING === true || e.UNDER_CONSTRUCTION === true;
  }

  function upsertMeta(attr, key, content) {
    if (!content && content !== '') return;
    var selector = 'meta[' + attr + '="' + key + '"]';
    var el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function upsertLink(rel, href) {
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function applyRobotsDirective() {
    var block = shouldPreventIndexing();
    var content = block ? 'noindex, nofollow, noarchive' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots', content);
    upsertMeta('name', 'googlebot', content);
  }

  function injectStructuredData() {
    var existing = document.getElementById('arivuu-jsonld');
    if (existing) existing.remove();

    var cfg = siteConfig();
    var url = siteUrl();
    var parts = cfg.addressParts || {};
    var sameAs = [];
    if (cfg.social && cfg.social.instagram) sameAs.push(cfg.social.instagram);
    if (cfg.social && cfg.social.linkedin) sameAs.push(cfg.social.linkedin);
    var data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'EducationalOrganization'],
          '@id': url + '#organization',
          name: cfg.name || BRAND,
          url: url,
          logo: absoluteUrl('images/arivuu-logo.png'),
          image: absoluteUrl(OG_IMAGE),
          description: cfg.description,
          email: cfg.email,
          telephone: cfg.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: parts.streetAddress || cfg.address,
            addressLocality: parts.addressLocality || 'Bangalore',
            addressRegion: parts.addressRegion || 'Karnataka',
            postalCode: parts.postalCode || '560033',
            addressCountry: parts.addressCountry || 'IN'
          },
          areaServed: { '@type': 'Country', name: 'India' },
          audience: [
            { '@type': 'EducationalAudience', educationalRole: 'student' },
            { '@type': 'PeopleAudience', audienceType: 'Parents' },
            { '@type': 'EducationalAudience', educationalRole: 'teacher' }
          ],
          sameAs: sameAs
        },
        {
          '@type': 'WebSite',
          '@id': url + '#website',
          url: url,
          name: cfg.name || BRAND,
          description: cfg.description,
          publisher: { '@id': url + '#organization' },
          inLanguage: 'en-IN'
        },
        {
          '@type': 'WebPage',
          '@id': url + '/#webpage',
          url: url + '/',
          name: PAGE_SEO['/'].title,
          description: PAGE_SEO['/'].description,
          isPartOf: { '@id': url + '#website' },
          about: { '@id': url + '#organization' },
          inLanguage: 'en-IN'
        },
        {
          '@type': 'Service',
          '@id': url + '#career-guidance-service',
          name: 'Career Guidance & Counselling',
          provider: { '@id': url + '#organization' },
          areaServed: 'India',
          audience: {
            '@type': 'Audience',
            audienceType: 'Students, Parents, Teachers and Schools'
          },
          description:
            'Psychometric assessments, one-on-one career counselling, stream selection guidance, ' +
            'career library and school partnership programs for Class 8–12 students across India.'
        }
      ]
    };

    var script = document.createElement('script');
    script.id = 'arivuu-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function hashPath() {
    var raw = window.location.hash.replace(/^#/, '') || '/';
    if (!raw.startsWith('/')) raw = '/' + raw;
    var q = raw.indexOf('?');
    return q === -1 ? raw : raw.slice(0, q);
  }

  function canonicalForPath(path) {
    var base = siteUrl();
    if (path === '/') return base + '/';
    return base + '/#' + path;
  }

  window.Arivuu.setPageSEO = function (path, overrides) {
    path = path || hashPath();
    var seo = PAGE_SEO[path] || PAGE_SEO['/'];
    if (overrides) {
      seo = Object.assign({}, seo, overrides);
    }

    var title = seo.title;
    var description = seo.description;
    var keywords = seo.keywords || DEFAULT_KEYWORDS;
    var image = absoluteUrl(OG_IMAGE);
    var canonical = canonicalForPath(path);

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'author', BRAND);
    upsertMeta('name', 'application-name', BRAND);
    upsertMeta('name', 'geo.region', 'IN-KA');
    upsertMeta('name', 'geo.placename', 'Bengaluru, India');

    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', BRAND);
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:secure_url', image);
    upsertMeta('property', 'og:image:type', 'image/jpeg');
    upsertMeta('property', 'og:image:alt', OG_IMAGE_ALT);
    upsertMeta('property', 'og:image:width', OG_IMAGE_WIDTH);
    upsertMeta('property', 'og:image:height', OG_IMAGE_HEIGHT);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:domain', siteUrl().replace(/^https?:\/\//, ''));
    upsertMeta('name', 'twitter:url', canonical);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', OG_IMAGE_ALT);

    applyRobotsDirective();
  };

  window.Arivuu.initSEO = function () {
    applyRobotsDirective();
    injectStructuredData();
    window.Arivuu.setPageSEO(hashPath());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.Arivuu.initSEO) window.Arivuu.initSEO();
    });
  } else if (window.Arivuu.initSEO) {
    window.Arivuu.initSEO();
  }
})();
