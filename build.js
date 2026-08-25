#!/usr/bin/env node
'use strict';

/*
 * AOMOTU static site generator.
 *
 *   node build.js           build the site
 *   node build.js --check   build, then assert nothing from the profile was lost
 *
 * Zero dependencies. Reads content/aomotu.json, writes plain .html to the repo
 * root and services/. The generated HTML is committed, so hosting stays a plain
 * folder of static files — no server, no npm install.
 */

const fs = require('fs');
const path = require('path');
const R = require('./build/render');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'content', 'aomotu.json');
/* Canonical origin for sitemap.xml and robots.txt. Change this one line and
   re-run the build when a custom domain is pointed at the deployment. */
const SITE_URL = process.env.SITE_URL || 'https://aomotu-web-production.up.railway.app';

const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));

/* Same escaping the renderer uses, so checks compare like with like. */
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const written = [];

function write(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  written.push(rel);
}

/* ---------------------------------------------------------------- build --- */

write('index.html', R.home(d));
write('about.html', R.about(d));
write('business-model.html', R.businessModel(d));
write('services.html', R.servicesHub(d));
write('partners.html', R.partners(d));
write('contact.html', R.contact(d));

for (const family of d.services) {
  write(path.join('services', family.slug + '.html'), R.servicePage(d, family));
}

/* sitemap */
const urls = written
  .map((rel) => rel.split(path.sep).join('/'))
  .map((rel) => (rel === 'index.html' ? '' : rel))
  .map(
    (rel) =>
      `  <url><loc>${SITE_URL}/${rel}</loc><changefreq>monthly</changefreq></url>`
  )
  .join('\n');

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${written.length} files:`);
for (const w of written) console.log('  ' + w.split(path.sep).join('/'));

/* ---------------------------------------------------------------- check --- */

if (!process.argv.includes('--check')) process.exit(0);

console.log('\nRunning coverage check…');

const pages = written.filter((w) => w.endsWith('.html'));
const corpus = pages
  .map((rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8'))
  .join('\n');

const failures = [];

/* 1. Every service family and every sub-service must appear somewhere. */
let subCount = 0;
for (const family of d.services) {
  if (!corpus.includes(esc(family.title))) {
    failures.push(`family missing from output: ${family.title}`);
  }
  const pageRel = path.join('services', family.slug + '.html');
  const page = fs.readFileSync(path.join(ROOT, pageRel), 'utf8');

  for (const group of family.groups) {
    subCount++;
    if (!page.includes(esc(group.title))) {
      failures.push(`sub-service missing from ${family.slug}.html: ${group.title}`);
    }
    for (const item of group.items) {
      if (!page.includes(esc(item.body))) {
        failures.push(
          `detail missing from ${family.slug}.html: ${group.title} → ${
            item.label || item.body.slice(0, 40)
          }`
        );
      }
    }
  }
}

/* 2. Every portfolio brand must appear. */
const brands = [...d.portfolio.house, ...d.portfolio.clients];
for (const b of brands) {
  if (!corpus.includes(esc(b.name))) {
    failures.push(`portfolio brand missing from output: ${b.name}`);
  }
}

/* 3. Company-level facts must appear. */
const facts = [
  d.contact.email,
  d.contact.phone,
  ...d.contact.addressLines,
  d.company.tagline,
  d.welcome.author,
  d.vision,
  d.story.closing,
];
for (const f of facts) {
  if (!corpus.includes(esc(f))) {
    failures.push(`profile fact missing from output: ${String(f).slice(0, 60)}`);
  }
}

/* 4. Values, business-model blocks and partnership categories. */
for (const v of d.values)
  if (!corpus.includes(esc(v.body))) failures.push(`core value missing: ${v.title}`);
for (const b of d.businessModel)
  for (const i of b.items)
    if (!corpus.includes(esc(i)))
      failures.push(`business-model item missing: ${b.title} → ${i.slice(0, 40)}`);
for (const c of d.partnerships.categories)
  for (const i of c.items)
    if (!corpus.includes(esc(i.body)))
      failures.push(`partnership item missing: ${c.title} → ${i.label}`);

/* 5. No invented content from the previous site may survive. */
const banned = [
  'growth@aomotu.inc',
  'Singapore, 018981',
  'FinTech',
  'Senior Media Buyer',
  'Creative Director (Motion Design)',
  'Operations Lead',
  'What we think',
  'Navigating Cross-Border Ad Regulation',
  'LUXEMBOURG',
  'Talents Worldwide',
  'Client Retention',
  'aomotu.inc',
];
for (const b of banned) {
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    if (html.includes(b)) {
      failures.push(`stale invented content "${b}" still present in ${rel}`);
    }
  }
}

/* 6. Structural expectations. */
if (d.services.length !== 12) failures.push(`expected 12 families, got ${d.services.length}`);
if (subCount !== 75) failures.push(`expected 75 sub-services, got ${subCount}`);
if (pages.length !== 18) failures.push(`expected 18 html pages, got ${pages.length}`);

/* 7. Every internal link must resolve to a file that exists. */
const linkRe = /(?:href|src)="([^"#:]+?)"/g;
for (const rel of pages) {
  const dir = path.dirname(path.join(ROOT, rel));
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  let m;
  while ((m = linkRe.exec(html))) {
    const target = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(dir, target))) {
      failures.push(`broken link in ${rel}: ${target}`);
    }
  }
}

const totalBullets = d.services.reduce(
  (a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0),
  0
);

console.log(`  pages emitted        : ${pages.length}`);
console.log(`  families verified    : ${d.services.length}`);
console.log(`  sub-services verified: ${subCount}`);
console.log(`  detail bullets       : ${totalBullets}`);
console.log(`  portfolio brands     : ${brands.length}`);
console.log(`  banned strings       : ${banned.length} checked`);

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} problem(s):`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}

console.log('\nPASS — all profile content accounted for, no stale content, no broken links.');
