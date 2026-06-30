(function () {
  'use strict';

  window.Arivuu = window.Arivuu || {};

  var BRAND = 'Arivuu';
  var OG_IMAGE = 'images/og-image.jpg';
  var OG_IMAGE_WIDTH = '1200';
  var OG_IMAGE_HEIGHT = '630';
  var OG_IMAGE_ALT = 'Arivuu — India\'s career guidance platform for students, parents and teachers';
  var DEFAULT_KEYWORDS =
    'Arivuu, arivuu.com, Arivuu career guidance, Arivuu career counselling, Arivuu Bangalore, ' +
    'career guidance India, career counselling India, career counselling students, career guidance for parents, ' +
    'career counselling for teachers, Class 8 9 10 11 12 career guidance, stream selection counselling, ' +
    'psychometric career assessment, career counsellor India, school career guidance program, ' +
    'career library India, ACE journey career counselling, Bengaluru career guidance, ' +
    'best career counselling India, online career counselling India, career guidance platform India';

  var PAGE_SEO = {
    '/': {
      title: 'Arivuu — Career Guidance & Counselling for Students, Parents & Schools in India',
      description:
        'Arivuu (arivuu.com) is India\'s trusted career guidance platform for students (Class 8–12), parents & teachers. ' +
        'Psychometric assessments, 250+ expert counsellors, 155+ career paths & 320+ partner schools.',
      keywords: DEFAULT_KEYWORDS
    },
    '/about': {
      title: 'About Arivuu | Career Guidance Experts for Indian Students & Schools',
      description:
        'Learn how Arivuu guides 55,000+ students across India with psychometric science, certified counsellors ' +
        'and school partnerships — helping families make confident career decisions.',
      keywords: 'about Arivuu, Arivuu company, career guidance company India, student career counselling, school career partner, Arivuu Bangalore'
    },
    '/services': {
      title: 'Career Guidance Programs & Services | Arivuu India',
      description:
        'Explore Arivuu programs: Discovery (Class 8–10), Stream Selection, Career Roadmap, school partnerships ' +
        'and workshops for students, parents and educators across India.',
      keywords: 'Arivuu services, career guidance programs India, stream selection program, career roadmap counselling, school partnership, Arivuu ACE journey'
    },
    '/service': {
      title: 'Career Program Details | Arivuu Services',
      description:
        'Detailed career guidance program from Arivuu for Indian students and schools — assessments, counselling sessions, ' +
        'and personalised roadmaps from Class 8 through 12.',
      keywords: 'Arivuu career program, student counselling program, career assessment program India, psychometric test Arivuu'
    },
    '/blog': {
      title: 'Career Guidance Blog — Tips for Students, Parents & Teachers | Arivuu',
      description:
        'Expert articles from Arivuu on career planning, stream selection, exam preparation and counselling for students, ' +
        'parents and educators across India.',
      keywords: 'Arivuu blog, career guidance blog, career tips students India, parent career counselling advice, stream selection tips'
    },
    '/blog-post': {
      title: 'Career Guidance Article | Arivuu Blog',
      description:
        'In-depth career guidance article from Arivuu — practical advice for students, parents and teachers in India.',
      keywords: 'Arivuu article, career guidance article, student career advice India'
    },
    '/student/guide': {
      title: 'Student Career Guide — Assessments & Counselling | Arivuu',
      description:
        'Explore Arivuu\'s psychometric assessments, career counselling, sample reports, and personalised guidance for students from Class 8 through college.',
      keywords: 'Arivuu student guide, student career counselling, psychometric test students, career guidance Class 8 12, Arivuu assessment'
    },
    '/student': {
      title: 'Career Guidance for Students | Arivuu',
      description:
        'Arivuu offers smart, scientific, human-centric career counselling for every student — psychometric assessments, ' +
        '1:1 sessions, 3,000+ careers, scholarship information, and a personalised dashboard & roadmap.',
      keywords: 'Arivuu students, career guidance students India, student career counselling, psychometric assessment students, career roadmap Arivuu'
    },
    '/contact': {
      title: 'Contact Arivuu | Book Career Counselling for Students & Schools',
      description:
        'Contact Arivuu at arivuu.com for career counselling, school partnerships, workshops or counsellor network enquiries. ' +
        'Serving students, parents and teachers across India.',
      keywords: 'contact Arivuu, contact career counsellor India, book career counselling, school career guidance enquiry, Arivuu phone number'
    }
  };

  var BREADCRUMB_LABELS = {
    '/': 'Home',
    '/about': 'About Us',
    '/services': 'Services',
    '/service': 'Program Details',
    '/student': 'Students',
    '/student/guide': 'Student Guide',
    '/blog': 'Blog',
    '/blog-post': 'Article',
    '/contact': 'Contact'
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
    var content = block
      ? 'noindex, nofollow, noarchive'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots', content);
    upsertMeta('name', 'googlebot', content);
  }

  function buildFaqSchema(url) {
    var faq = window.ARIVUU_FAQ;
    if (!faq || !faq.items || !faq.items.length) return null;

    return {
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: faq.items.map(function (item) {
        var text = item.isList
          ? item.answer.join('. ')
          : item.answer.join(' ');
        return {
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: text
          }
        };
      })
    };
  }

  function buildBreadcrumbSchema(path, url) {
    if (path === '/') return null;

    var items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: url + '/' }];
    var label = BREADCRUMB_LABELS[path];
    if (label) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: canonicalForPath(path)
      });
    }

    return {
      '@type': 'BreadcrumbList',
      '@id': canonicalForPath(path) + '#breadcrumb',
      itemListElement: items
    };
  }

  function buildServiceCatalog(url, cfg) {
    var services = (window.ARIVUU_SERVICES && window.ARIVUU_SERVICES.services) || [];
    if (!services.length) return null;

    return {
      '@type': 'OfferCatalog',
      name: 'Arivuu Career Guidance Programs',
      itemListElement: services.map(function (svc, i) {
        return {
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Service',
            name: svc.title,
            description: svc.excerpt || svc.tagline,
            provider: { '@id': url + '#organization' },
            areaServed: 'India'
          }
        };
      })
    };
  }

  function injectStructuredData(path) {
    path = path || hashPath();
    var existing = document.getElementById('arivuu-jsonld');
    if (existing) existing.remove();

    var cfg = siteConfig();
    var url = siteUrl();
    var seo = PAGE_SEO[path] || PAGE_SEO['/'];
    var parts = cfg.addressParts || {};
    var sameAs = [];
    if (cfg.social && cfg.social.instagram) sameAs.push(cfg.social.instagram);
    if (cfg.social && cfg.social.linkedin) sameAs.push(cfg.social.linkedin);

    var graph = [
      {
        '@type': ['Organization', 'EducationalOrganization', 'LocalBusiness'],
        '@id': url + '#organization',
        name: cfg.name || BRAND,
        alternateName: ['Arivuu Careers', 'Arivuu Career Guidance', 'arivuu.com'],
        url: url,
        logo: absoluteUrl('images/arivuu-logo.png'),
        image: absoluteUrl(OG_IMAGE),
        description: cfg.description,
        email: cfg.email,
        telephone: cfg.phone,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: parts.streetAddress || cfg.address,
          addressLocality: parts.addressLocality || 'Bangalore',
          addressRegion: parts.addressRegion || 'Karnataka',
          postalCode: parts.postalCode || '560033',
          addressCountry: parts.addressCountry || 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          addressCountry: 'IN',
          addressRegion: 'Karnataka',
          addressLocality: 'Bangalore'
        },
        areaServed: { '@type': 'Country', name: 'India' },
        knowsAbout: [
          'Career counselling',
          'Career guidance',
          'Psychometric assessment',
          'Stream selection',
          'School career programs',
          'Student career planning'
        ],
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
        alternateName: 'arivuu.com',
        description: cfg.description,
        publisher: { '@id': url + '#organization' },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: url + '/#/?scroll=career-library'
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': canonicalForPath(path) + '#webpage',
        url: canonicalForPath(path),
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': url + '#website' },
        about: { '@id': url + '#organization' },
        inLanguage: 'en-IN'
      },
      {
        '@type': 'Service',
        '@id': url + '#career-guidance-service',
        name: 'Arivuu Career Guidance & Counselling',
        provider: { '@id': url + '#organization' },
        areaServed: 'India',
        serviceType: 'Career Counselling',
        audience: {
          '@type': 'Audience',
          audienceType: 'Students, Parents, Teachers and Schools'
        },
        description:
          'Psychometric assessments, one-on-one career counselling, stream selection guidance, ' +
          'career library and school partnership programs for Class 8–12 students across India.'
      }
    ];

    var catalog = buildServiceCatalog(url, cfg);
    if (catalog) {
      graph[0].hasOfferCatalog = catalog;
    }

    var faqSchema = buildFaqSchema(url);
    if (faqSchema && (path === '/' || path === '/student' || path === '/student/guide')) {
      graph.push(faqSchema);
    }

    var breadcrumb = buildBreadcrumbSchema(path, url);
    if (breadcrumb) graph.push(breadcrumb);

    var script = document.createElement('script');
    script.id = 'arivuu-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
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
    upsertMeta('name', 'twitter:site', '@arivuu_careers');
    upsertMeta('name', 'twitter:creator', '@arivuu_careers');
    upsertMeta('name', 'twitter:domain', siteUrl().replace(/^https?:\/\//, ''));
    upsertMeta('name', 'twitter:url', canonical);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', OG_IMAGE_ALT);

    applyRobotsDirective();
    injectStructuredData(path);
  };

  window.Arivuu.initSEO = function () {
    applyRobotsDirective();
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
