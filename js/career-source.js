(function () {
  'use strict';

  var HEADER_ALIASES = {
    id: 'id',
    slug: 'id',
    name: 'name',
    career: 'name',
    title: 'name',
    careername: 'name',
    category: 'category',
    stream: 'stream',
    recommendedstream: 'stream',
    description: 'description',
    desc: 'description',
    summary: 'description',
    growth: 'growth',
    growthoutlook: 'growth',
    demand: 'growth',
    degrees: 'degrees',
    degree: 'degrees',
    qualifications: 'degrees',
    salary: 'salary',
    salaryrange: 'salary',
    salary_range: 'salary',
    program: 'program',
    programs: 'program',
    audience: 'program',
    stage: 'program',
    filter: 'program',
    segment: 'program',
    class: 'program',
    grade: 'program',
    classspan: 'program'
  };

  function normalizeHeader(header) {
    return String(header || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function cellValue(cell) {
    if (!cell || cell.v == null) return '';
    if (cell.f != null) return String(cell.f);
    return String(cell.v);
  }

  function mapRowToCareer(headers, row) {
    var career = {
      id: '',
      name: '',
      category: '',
      stream: '',
      description: '',
      growth: '',
      degrees: '',
      salary: '',
      program: ''
    };

    headers.forEach(function (header, index) {
      var field = HEADER_ALIASES[normalizeHeader(header)];
      if (!field) return;
      career[field] = cellValue(row.c[index]).trim();
    });

    if (!career.id && career.name) {
      career.id = slugify(career.name);
    }

    return normalizeCareerRecord(career);
  }

  function normalizeCareerRecord(career) {
    var item = Object.assign({}, career);

    // Description often lands in stream when sheet columns are shifted by one.
    if (!item.description && item.stream && item.stream.length > 35) {
      item.description = item.stream;
      item.stream = item.category || item.stream;
    }

    // Name and category are sometimes merged in the name cell.
    var knownCategories = [
      'Science & Technology',
      'Medicine & Healthcare',
      'Commerce & Finance',
      'Law & Public Service',
      'Arts, Design & Media',
      'Hospitality & Tourism',
      'Education & Training',
      'Aviation & Defense',
      'Sports & Fitness',
      'Agriculture & Environment',
      'Emerging & Interdisciplinary',
      'Engineering'
    ];

    knownCategories.forEach(function (category) {
      var marker = ' ' + category;
      if (item.name.indexOf(marker) === -1) return;

      if (!item.category || item.category.length < 16) {
        if (!item.description && item.stream && item.stream.length > 35) {
          item.stream = item.category || item.stream;
        } else if (item.category && item.category.indexOf('/') !== -1) {
          item.stream = item.category;
        }
        item.category = category;
      }

      item.name = item.name.replace(marker, '').trim();
    });

    return item;
  }

  function derivePrograms(careers) {
    var seen = {};
    var programs = [];

    careers.forEach(function (career) {
      if (!career.program || seen[career.program]) return;
      seen[career.program] = true;
      programs.push(career.program);
    });

    return programs.sort();
  }

  function deriveCategories(careers) {
    var seen = {};
    var categories = [];

    careers.forEach(function (career) {
      if (!career.category || seen[career.category]) return;
      seen[career.category] = true;
      categories.push(career.category);
    });

    return categories.sort();
  }

  function headersLookValid(headers) {
    return headers.some(function (label) {
      return HEADER_ALIASES[normalizeHeader(label)];
    });
  }

  function extractHeadersAndRows(table) {
    var rows = (table.rows || []).slice();
    var colHeaders = (table.cols || []).map(function (col) {
      return col.label || '';
    });

    // Sheet format: row 1 = column titles, row 2+ = career data.
    // When Google maps row 1 into column labels, every API row is already a data row.
    if (headersLookValid(colHeaders)) {
      return { headers: colHeaders, rows: rows, hasHeader: true };
    }

    // Otherwise row 1 is returned as the first API row — titles there, data from row 2 onward.
    if (rows.length < 2) {
      return { headers: [], rows: [], hasHeader: false };
    }

    var titleRow = (rows[0].c || []).map(cellValue);
    if (!headersLookValid(titleRow)) {
      return { headers: [], rows: [], hasHeader: false };
    }

    return {
      headers: titleRow,
      rows: rows.slice(1),
      hasHeader: true
    };
  }

  function careersFromSheetTable(table) {
    var extracted = extractHeadersAndRows(table);

    if (!extracted.hasHeader || !extracted.rows.length) {
      return [];
    }

    return extracted.rows
      .map(function (row) { return mapRowToCareer(extracted.headers, row); })
      .filter(function (career) { return career.id && career.name; });
  }

  function fetchCareersFromGoogleSheet(sheetId, sheetGid) {
    return new Promise(function (resolve, reject) {
      var callbackName = '_arivuuCareersSheet_' + Math.random().toString(36).slice(2);
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
          var careers = careersFromSheetTable(payload.table);
          finish(null, {
            meta: {
              total: careers.length,
              lastUpdated: new Date().toISOString().slice(0, 10)
            },
            categories: deriveCategories(careers),
            programs: derivePrograms(careers),
            careers: careers
          });
        } catch (error) {
          finish(error);
        }
      };

      script.onerror = function () {
        finish(new Error('Failed to fetch Google Sheet'));
      };

      var url = 'https://docs.google.com/spreadsheets/d/' +
        encodeURIComponent(sheetId) +
        '/gviz/tq?tqx=out:json;responseHandler:' + callbackName;
      if (sheetGid) {
        url += '&gid=' + encodeURIComponent(sheetGid);
      }
      script.src = url;
      document.head.appendChild(script);
    });
  }

  window.Arivuu = window.Arivuu || {};
  window.Arivuu.loadCareerData = function () {
    var env = window.ARIVUU_ENV || {};
    var sheetId = String(env.ARIVUU_CAREERS_GOOGLE_SHEET_ID || '').trim();
    if (!sheetId) {
      return Promise.reject(new Error('Career library Google Sheet ID is not configured.'));
    }
    return fetchCareersFromGoogleSheet(sheetId, env.ARIVUU_CAREERS_GOOGLE_SHEET_GID);
  };
})();
