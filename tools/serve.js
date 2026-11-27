#!/usr/bin/env node
// Local preview that behaves like GitHub Pages for this repository:
//   - the site is served under /portfoliowebiste/ (the repository subpath)
//   - a folder URL serves its index.html; a missing path serves 404.html with status 404
// Usage: node tools/serve.js [port] [--watch]
//   --watch rebuilds the pages (node tools/build.js) when a file in src/ changes.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = '/portfoliowebiste/';
const args = process.argv.slice(2);
const PORT = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.zip': 'application/zip',
};

// text is gzipped when the browser accepts it, as GitHub Pages does
const COMPRESS = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;
function send(req, res, status, file) {
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache' };
  if (COMPRESS.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    const body = zlib.gzipSync(fs.readFileSync(file));
    res.writeHead(status, { ...headers, 'Content-Encoding': 'gzip', 'Content-Length': body.length, Vary: 'Accept-Encoding' });
    return res.end(body);
  }
  res.writeHead(status, { ...headers, 'Content-Length': fs.statSync(file).size });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/' || url.pathname === BASE.slice(0, -1)) { res.writeHead(302, { Location: BASE }); return res.end(); }
  const notFound = () => send(req, res, 404, path.join(ROOT, '404.html'));
  if (!url.pathname.startsWith(BASE)) return notFound();
  let rel;
  try { rel = decodeURIComponent(url.pathname.slice(BASE.length)); } catch { return notFound(); }
  let file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) return notFound();
  // dot-files and dot-folders (.git, .github) are never served
  if (rel.split('/').some((p) => p.startsWith('.'))) return notFound();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' + url.search }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return notFound();
  send(req, res, 200, file);
});

if (args.includes('--watch')) {
  const src = path.join(ROOT, 'src');
  let timer = null;
  const rebuild = () => {
    try { execFileSync(process.execPath, [path.join(ROOT, 'tools/build.js')], { stdio: 'inherit' }); }
    catch { console.error('build failed; fix the error and save again'); }
  };
  if (fs.existsSync(src)) {
    fs.watch(src, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 120); });
    console.log('watching src/ for changes');
  }
}

server.listen(PORT, HOST, () => console.log(`Preview: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}${BASE}`));
