// <head> for every page: title, description, canonical, Open Graph, Twitter/X card,
// icons, preloaded fonts, the stylesheet and the deferred script bundle.
const site = require('../data/site.js');
const { esc } = require('./ui.js');

// runs before first paint: marks JavaScript as available (progressive enhancement)
// and, on the homepage, sends old shareable links (#/trk-01 … #/trk-05) to their case studies
const boot = (legacy) => `<script>
(function (r) {
${legacy ? `  var m = location.hash.match(/^#\\/trk-0([1-5])$/);
  if (m) { location.replace('work/' + ['knowledge-portal', 'business-sheet', 'contract-intelligence', 'resume-matching', 'data-migration'][m[1] - 1] + '/'); return; }
` : ''}  r.className += ' js';
  try { if (localStorage.getItem('df-motion') === 'off') r.className += ' motion-off'; } catch (e) {}
  // page transitions are decorative: when one is cut short, its promises settle quietly
  var q = function () {};
  ['pageswap', 'pagereveal'].forEach(function (t) {
    addEventListener(t, function (e) {
      var v = e.viewTransition;
      if (v) { v.ready.catch(q); v.updateCallbackDone.catch(q); v.finished.catch(q); }
    });
  });
})(document.documentElement);
</script>`;

const head = ({ base, title, description, url = '', ogType = 'website', ogTitle, ogDescription, robots = '', jsonld = null, legacy = false, v }) => {
  [title, description, ogTitle, ogDescription] = [title, description, ogTitle, ogDescription].map((x) => (x == null ? x : esc(x)));
  const img = `${site.siteUrl}assets/og.jpg`;
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="author" content="${site.name}" />
${robots ? `<meta name="robots" content="${robots}" />\n` : ''}<meta name="color-scheme" content="dark" />
<meta name="theme-color" content="#05070D" />
${url ? `<link rel="canonical" href="${url}" />
<meta property="og:site_name" content="${site.brand} — ${site.name}" />
<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${ogTitle || title}" />
<meta property="og:description" content="${ogDescription || description}" />
<meta property="og:image" content="${img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="DataForge — Gaurang Ashava, Engineering Intelligence: data engineering, AI and automation." />
<meta property="og:locale" content="en_IN" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogTitle || title}" />
<meta name="twitter:description" content="${ogDescription || description}" />
<meta name="twitter:image" content="${img}" />
<meta name="twitter:image:alt" content="DataForge — Gaurang Ashava, Engineering Intelligence." />
` : ''}<link rel="icon" href="${base}assets/icons/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="${base}assets/icons/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="${base}assets/icons/apple-touch-icon.png" />
<link rel="preload" href="${base}assets/fonts/space-grotesk-latin-var.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="${base}assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin />
${boot(legacy)}
<link rel="stylesheet" href="${base}assets/css/dataforge.css?v=${v.css}" />
<script src="${base}assets/js/dataforge.js?v=${v.js}" defer></script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n` : ''}</head>`;
};

module.exports = { head };
