'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var envPath = path.join(root, '.env');
var outPath = path.join(root, 'js', 'env.js');
var robotsPath = path.join(root, 'robots.txt');
var env = {};

var KNOWN_KEYS = [
  'PREVENT_INDEXING',
  'UNDER_CONSTRUCTION',
  'SITE_URL',
  'ARIVUU_BLOGS_GOOGLE_SHEET_ID',
  'ARIVUU_CAREERS_GOOGLE_SHEET_ID',
  'ARIVUU_CAREERS_GOOGLE_SHEET_GID',
  'ARIVUU_CONTACT_FORM_GOOGLE_SHEET_ID',
  'ARIVUU_CONTACT_FORM_APPS_SCRIPT_URL'
];

function parseValue(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}

function setEnv(key, raw) {
  if (raw === undefined || raw === null || raw === '') return;
  env[key] = parseValue(String(raw).trim());
}

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(function (line) {
    line = line.trim();
    if (!line || line.charAt(0) === '#') return;
    var eq = line.indexOf('=');
    if (eq === -1) return;
    var key = line.slice(0, eq).trim();
    var val = line.slice(eq + 1).trim();
    if ((val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') ||
        (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'")) {
      val = val.slice(1, -1);
    }
    setEnv(key, val);
  });
}

KNOWN_KEYS.forEach(function (key) {
  if (process.env[key] !== undefined) {
    setEnv(key, process.env[key]);
  }
});

var preventIndexing = env.PREVENT_INDEXING === true || env.UNDER_CONSTRUCTION === true;
var siteUrl = (env.SITE_URL || 'https://arivuu.com').replace(/\/$/, '');
var indexPath = path.join(root, 'index.html');

fs.writeFileSync(
  outPath,
  '/* Generated from .env — run: node scripts/build-env.js */\n' +
  'window.ARIVUU_ENV = ' + JSON.stringify(env, null, 2) + ';\n'
);

var robots = preventIndexing
  ? 'User-agent: *\nDisallow: /\n'
  : 'User-agent: *\nAllow: /\n\nSitemap: ' + siteUrl + '/sitemap.xml\n';

fs.writeFileSync(robotsPath, robots);

function updateIndexSocialMeta(html, siteUrl) {
  var ogImage = siteUrl + '/images/og-image.jpg';
  var domain = siteUrl.replace(/^https?:\/\//, '');

  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/,
    '<link rel="canonical" href="' + siteUrl + '/" />');
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/,
    '<meta property="og:url" content="' + siteUrl + '/" />');
  html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/,
    '<meta property="og:image" content="' + ogImage + '" />');
  html = html.replace(/<meta property="og:image:secure_url" content="[^"]*"\s*\/?>/,
    '<meta property="og:image:secure_url" content="' + ogImage + '" />');
  html = html.replace(/<meta name="twitter:domain" content="[^"]*"\s*\/?>/,
    '<meta name="twitter:domain" content="' + domain + '" />');
  html = html.replace(/<meta name="twitter:url" content="[^"]*"\s*\/?>/,
    '<meta name="twitter:url" content="' + siteUrl + '/" />');
  html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    '<meta name="twitter:image" content="' + ogImage + '" />');
  return html;
}

function updateIndexRobotsMeta(html, preventIndexing) {
  var content = preventIndexing
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  html = html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/,
    '<meta name="robots" content="' + content + '" />');
  html = html.replace(/<meta name="googlebot" content="[^"]*"\s*\/?>/,
    '<meta name="googlebot" content="' + content + '" />');
  return html;
}

if (fs.existsSync(indexPath)) {
  var html = fs.readFileSync(indexPath, 'utf8');
  var updated = updateIndexSocialMeta(html, siteUrl);
  updated = updateIndexRobotsMeta(updated, preventIndexing);
  if (updated !== html) {
    fs.writeFileSync(indexPath, updated);
    console.log('Updated SEO URLs in index.html → ' + siteUrl);
  }
}

console.log('Wrote js/env.js');
console.log('Wrote robots.txt (' + (preventIndexing ? 'noindex' : 'index') + ')');
console.log('Social preview image: ' + siteUrl + '/images/og-image.jpg');
