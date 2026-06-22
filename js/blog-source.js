(function () {
  'use strict';

  var HEADER_ALIASES = {
    id: 'id',
    slug: 'id',
    title: 'title',
    excerpt: 'excerpt',
    summary: 'excerpt',
    content: 'content',
    body: 'content',
    category: 'category',
    author: 'author',
    date: 'date',
    publisheddate: 'date',
    readtime: 'readTime',
    read_time: 'readTime',
    image: 'image',
    imageurl: 'image',
    image_url: 'image',
    featured: 'featured'
  };

  function normalizeHeader(header) {
    return String(header || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function parseBool(value) {
    if (typeof value === 'boolean') return value;
    var normalized = String(value || '').trim().toLowerCase();
    return normalized === 'true' || normalized === 'yes' || normalized === '1';
  }

  function cellValue(cell) {
    if (!cell || cell.v == null) return '';
    if (cell.f != null) return String(cell.f);
    return String(cell.v);
  }

  function mapRowToPost(headers, row) {
    var post = {
      id: '',
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      date: '',
      readTime: '',
      image: '',
      featured: false
    };

    headers.forEach(function (header, index) {
      var field = HEADER_ALIASES[normalizeHeader(header)];
      if (!field) return;
      var value = cellValue(row.c[index]);
      if (field === 'featured') {
        post.featured = parseBool(value);
      } else if (field === 'id') {
        post.id = String(value).trim();
      } else {
        post[field] = value.trim();
      }
    });

    return post;
  }

  function postsFromSheetTable(table) {
    var headers = (table.cols || []).map(function (col) {
      return col.label || '';
    });
    var hasHeader = headers.some(function (label) {
      return normalizeHeader(label) && HEADER_ALIASES[normalizeHeader(label)];
    });

    var rows = table.rows || [];
    if (!hasHeader || !rows.length) {
      return [];
    }

    return rows
      .map(function (row) { return mapRowToPost(headers, row); })
      .filter(function (post) { return post.id && post.title; })
      .sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
  }

  function fetchBlogFromGoogleSheet(sheetId) {
    return new Promise(function (resolve, reject) {
      var callbackName = '_arivuuBlogSheet_' + Math.random().toString(36).slice(2);
      var script = document.createElement('script');
      var settled = false;

      function cleanup() {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      function finish(err, data) {
        if (settled) return;
        settled = true;
        cleanup();
        if (err) reject(err);
        else resolve(data);
      }

      window[callbackName] = function (payload) {
        try {
          if (!payload || payload.status !== 'ok') {
            throw new Error('Google Sheets query failed');
          }
          var posts = postsFromSheetTable(payload.table);
          finish(null, {
            meta: {
              total: posts.length,
              lastUpdated: new Date().toISOString().slice(0, 10)
            },
            posts: posts
          });
        } catch (error) {
          finish(error);
        }
      };

      script.onerror = function () {
        finish(new Error('Failed to fetch Google Sheet'));
      };

      script.src = 'https://docs.google.com/spreadsheets/d/' +
        encodeURIComponent(sheetId) +
        '/gviz/tq?tqx=out:json;responseHandler:' + callbackName;
      document.head.appendChild(script);
    });
  }

  window.Arivuu = window.Arivuu || {};
  window.Arivuu.loadBlogData = function () {
    var env = window.ARIVUU_ENV || {};
    var sheetId = String(env.ARIVUU_BLOGS_GOOGLE_SHEET_ID || '').trim();
    if (!sheetId) {
      return Promise.reject(new Error('Blog Google Sheet ID is not configured.'));
    }
    return fetchBlogFromGoogleSheet(sheetId);
  };
})();
