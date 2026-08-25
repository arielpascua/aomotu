'use strict';

/* Page renderers for the AOMOTU site.
   Every string of copy comes from content/aomotu.json — never from this file. */

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ *
 * Shared chrome
 * ------------------------------------------------------------------ */

const hexCluster = (variant = 'a') => `
<svg class="hex-cluster hex-${variant}" viewBox="0 0 200 160" aria-hidden="true" focusable="false">
  <path class="hex-line" d="M40 8 76 29v42L40 92 4 71V29z"/>
  <path class="hex-fill" d="M118 46 148 63v34l-30 17-30-17V63z"/>
  <path class="hex-line" d="M150 6 182 24v36l-32 18-32-18V24z"/>
</svg>`;

const mark = (cls = 'brand-mark') => `
<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M24 24 24 5M24 24 43 24M24 24 24 43M24 24 5 24"/>
    <path d="M24 24 37.4 10.6M24 24 37.4 37.4M24 24 10.6 37.4M24 24 10.6 10.6"/>
  </g>
  <g fill="currentColor">
    <circle cx="24" cy="5" r="2.6"/><circle cx="43" cy="24" r="2.6"/>
    <circle cx="24" cy="43" r="2.6"/><circle cx="5" cy="24" r="2.6"/>
    <circle cx="37.4" cy="10.6" r="2.2"/><circle cx="37.4" cy="37.4" r="2.2"/>
    <circle cx="10.6" cy="37.4" r="2.2"/><circle cx="10.6" cy="10.6" r="2.2"/>
  </g>
  <circle cx="24" cy="24" r="5.4" fill="var(--mark-core, var(--highlight))"/>
</svg>`;

function header(d, active, root) {
  const links = d.nav
    .map(
      (n) =>
        `<li><a href="${root}${n.href}" class="nav-link${
          active === n.href ? ' is-active' : ''
        }">${esc(n.label)}</a></li>`
    )
    .join('\n        ');

  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="shell header-inner">
    <a href="${root}index.html" class="brand" aria-label="${esc(d.company.name)} — home">
      ${mark()}
      <span class="brand-text">
        <span class="brand-name">${esc(d.company.name)}</span>
        <span class="brand-tag">${esc(d.company.tagline)}</span>
      </span>
    </a>

    <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-bar"></span>
      <span class="sr-only">Menu</span>
    </button>

    <nav class="site-nav" id="site-nav" aria-label="Primary">
      <ul>
        ${links}
      </ul>
      <a href="${root}contact.html" class="btn btn-primary btn-sm nav-cta">Speak with the team</a>
    </nav>
  </div>
</header>`;
}

function footer(d, root) {
  const cols = d.services
    .map(
      (s) =>
        `<li><a href="${root}services/${s.slug}.html">${esc(s.short)}</a></li>`
    )
    .join('\n            ');

  return `<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        ${mark('brand-mark brand-mark-lg')}
        <p class="footer-name">${esc(d.company.legal)}</p>
        <p class="footer-tagline">${esc(d.company.tagline)}</p>
        <p class="footer-blurb">${esc(d.company.shortDescription)}</p>
      </div>

      <div class="footer-col">
        <h3>Divisions</h3>
        <ul>
            ${cols}
        </ul>
      </div>

      <div class="footer-col">
        <h3>Company</h3>
        <ul>
          ${d.nav
            .map((n) => `<li><a href="${root}${n.href}">${esc(n.label)}</a></li>`)
            .join('\n          ')}
        </ul>
      </div>

      <div class="footer-col footer-contact">
        <h3>Get in touch</h3>
        <address>
          ${d.contact.addressLines.map((l) => esc(l)).join('<br>')}
        </address>
        <p><a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a></p>
        <p><a href="tel:${esc(d.contact.phoneHref)}">${esc(d.contact.phone)}</a></p>
      </div>
    </div>

    <div class="footer-base">
      <p>&copy; <span id="year">2026</span> ${esc(d.company.legal)}. All rights reserved.</p>
      <p class="footer-base-note">Headquartered in the ${esc(d.company.hq)} &middot; Serving ${esc(
    d.company.countries
  )} countries</p>
    </div>
  </div>
</footer>`;
}

function layout({ d, title, description, active, body, root = '', extraScripts = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0E275D">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@300;500;700;800&family=Space+Grotesk:wght@500;700&family=Dancing+Script:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}style.css">
</head>
<body>
${header(d, active, root)}
<main id="main">
${body}
</main>
${footer(d, root)}
<script src="${root}app.js"></script>
${extraScripts}
</body>
</html>
`;
}

/* Section heading with the profile's numeral + rule furniture. */
const sectionHead = (n, title, kicker) => `
  <div class="section-head">
    <span class="section-num">${esc(n)}</span>
    <div>
      ${kicker ? `<span class="section-kicker">${esc(kicker)}</span>` : ''}
      <h2 class="section-title">${esc(title)}</h2>
    </div>
  </div>`;

/* ------------------------------------------------------------------ *
 * Home
 * ------------------------------------------------------------------ */

function home(d) {
  const serviceCards = d.services
    .map(
      (s) => `
        <a class="svc-card" href="services/${s.slug}.html">
          <span class="svc-num">${esc(s.n)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.blurb)}</p>
          <span class="svc-count">${s.groups.length} service${
        s.groups.length === 1 ? '' : 's'
      }</span>
        </a>`
    )
    .join('');

  const pillars = d.uvp.pillars
    .map(
      (p) => `
        <article class="pillar">
          <span class="pillar-num">${esc(p.n)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
        </article>`
    )
    .join('');

  const stats = d.stats
    .map(
      (s) => `
          <div class="stat">
            <span class="stat-value">${esc(s.value)}</span>
            <span class="stat-label">${esc(s.label)}</span>
          </div>`
    )
    .join('');

  const purpose = d.purpose.points
    .map((p) => `<li>${esc(p)}</li>`)
    .join('\n            ');

  const wall = [...d.portfolio.house, ...d.portfolio.clients]
    .map(
      (b) => `
          <div class="logo-card"${b.logo ? '' : ' data-logo-placeholder'}>
            ${
              b.logo
                ? `<img src="logos/${esc(b.logo)}" alt="${esc(b.name)}">`
                : `<span class="logo-name">${esc(b.name)}</span>${
                    b.sub ? `<span class="logo-sub">${esc(b.sub)}</span>` : ''
                  }`
            }
          </div>`
    )
    .join('');

  const body = `
<section class="hero">
  ${hexCluster('a')}
  <div class="shell hero-inner">
    <div class="hero-copy">
      <span class="eyebrow"><span class="dot"></span>${esc(d.company.legal)} &middot; ${esc(
    d.company.hq
  )}</span>
      <h1 class="hero-title">When Tradition<br><em>Meets Innovation</em></h1>
      <p class="hero-lede">${esc(d.company.shortDescription)} Digital advertising, marketing strategy, outsourcing, manufacturing, offset printing, corporate giveaways and trading — all under one unified ecosystem.</p>
      <div class="hero-actions">
        <a href="services.html" class="btn btn-primary">Explore our services</a>
        <a href="contact.html" class="btn btn-ghost">Speak with the team</a>
      </div>
      <div class="hero-stats">${stats}</div>
    </div>
    <div class="hero-emblem">
      <canvas id="hero-logo-canvas" width="440" height="440" role="img"
              aria-label="${esc(d.company.name)} rotating starburst emblem"></canvas>
    </div>
  </div>
</section>

<section class="band" id="background">
  <div class="shell">
    ${sectionHead('01', 'Company Background', 'Who we are')}
    <div class="split">
      <p class="lede">${esc(d.background[0])}</p>
      <div class="stack">
        <p>${esc(d.background[1])}</p>
        <p>${esc(d.background[2])}</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt" id="purpose">
  ${hexCluster('b')}
  <div class="shell">
    ${sectionHead('02', 'Our Purpose', 'Why we exist')}
    <p class="lede lede-wide">${esc(d.purpose.intro)}</p>
    <ul class="check-list">
            ${purpose}
    </ul>
  </div>
</section>

<section class="band" id="difference">
  <div class="shell">
    ${sectionHead('03', 'What Makes Us Different', 'Unique value proposition')}
    <blockquote class="statement">${esc(d.uvp.statement)}</blockquote>
    <div class="grid grid-4 pillars">${pillars}</div>
  </div>
</section>

<section class="band band-deep" id="services">
  <div class="shell">
    ${sectionHead('04', 'Products & Services', 'Twelve divisions, one ecosystem')}
    <p class="lede lede-wide">From the first strategy deck to the pallet leaving the warehouse — ${
      d.services.length
    } divisions covering ${d.services.reduce(
    (a, s) => a + s.groups.length,
    0
  )} distinct services.</p>
    <div class="grid grid-3 svc-grid">${serviceCards}</div>
    <div class="band-cta"><a href="services.html" class="btn btn-primary">See the full catalogue</a></div>
  </div>
</section>

<section class="band band-story" id="story">
  ${hexCluster('c')}
  <div class="shell">
    ${sectionHead('05', 'Our Story', 'Founded ' + d.company.founded)}
    <div class="split split-story">
      <figure class="quote-card">
        <blockquote class="script-quote">${d.welcome.quote
          .map((q) => `<p>${esc(q)}</p>`)
          .join('')}</blockquote>
        <figcaption>
          <span class="quote-name">${esc(d.welcome.author)}</span>
          <span class="quote-role">${esc(d.welcome.role)}</span>
        </figcaption>
      </figure>
      <div class="stack">
        ${d.story.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}
        <p class="story-closing">${esc(d.story.closing)}</p>
        <a href="about.html" class="link-arrow">Read the full story</a>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt" id="partners">
  <div class="shell">
    ${sectionHead('06', 'Portfolio Highlights', 'Brands we build and move')}
    <p class="lede lede-wide">${esc(d.portfolio.intro)}</p>
    <div class="logo-wall">${wall}</div>
    <div class="band-cta"><a href="partners.html" class="btn btn-ghost">Our strategic partnerships</a></div>
  </div>
</section>

<section class="band band-invert" id="contact">
  ${hexCluster('d')}
  <div class="shell contact-strip">
    <div>
      <span class="section-kicker">Get in touch</span>
      <h2 class="section-title">Let's build something<br>worth keeping.</h2>
      <p class="lede">Tell us the market you want to win and we'll bring the strategy, the studio, the press and the supply chain to the same table.</p>
    </div>
    <div class="contact-card">
      <address>${d.contact.addressLines.map((l) => esc(l)).join('<br>')}</address>
      <p><a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a></p>
      <p><a href="tel:${esc(d.contact.phoneHref)}">${esc(d.contact.phone)}</a></p>
      <a href="contact.html" class="btn btn-highlight">Start a conversation</a>
    </div>
  </div>
</section>`;

  return layout({
    d,
    title: `${d.company.name} | ${d.company.tagline}`,
    description: `${d.company.legal} — ${d.company.shortDescription} Digital advertising, marketing, outsourcing, manufacturing, offset printing, corporate giveaways and trading.`,
    active: '',
    body,
    extraScripts: '<script type="module" src="starburst.js"></script>',
  });
}

/* ------------------------------------------------------------------ *
 * About
 * ------------------------------------------------------------------ */

function about(d) {
  const values = d.values
    .map(
      (v) => `
        <article class="value-card">
          <span class="value-num">${esc(v.n)}</span>
          <h3>${esc(v.title)}</h3>
          <p>${esc(v.body)}</p>
        </article>`
    )
    .join('');

  const body = `
<section class="page-hero">
  ${hexCluster('a')}
  <div class="shell">
    <span class="eyebrow"><span class="dot"></span>About</span>
    <h1 class="page-title">A one-stop shop built on people.</h1>
    <p class="page-lede">${esc(d.background[2])}</p>
  </div>
</section>

<section class="band" id="welcome">
  <div class="shell">
    ${sectionHead('01', 'Welcome Message', 'From the founder')}
    <figure class="quote-card quote-card-wide">
      <blockquote class="script-quote">${d.welcome.quote
        .map((q) => `<p>${esc(q)}</p>`)
        .join('')}</blockquote>
      <figcaption>
        <span class="quote-name">${esc(d.welcome.author)}</span>
        <span class="quote-role">${esc(d.welcome.role)}</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="band band-alt" id="background">
  <div class="shell">
    ${sectionHead('02', 'Company Background', 'What we are')}
    <div class="stack stack-prose">
      ${d.background.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="band" id="purpose">
  <div class="shell">
    ${sectionHead('03', 'Our Purpose', 'What we set out to do')}
    <p class="lede lede-wide">${esc(d.purpose.intro)}</p>
    <ul class="check-list">
      ${d.purpose.points.map((p) => `<li>${esc(p)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="band band-deep" id="vision-mission">
  ${hexCluster('b')}
  <div class="shell">
    ${sectionHead('04', 'Vision & Mission', 'Where we are going')}
    <div class="split">
      <div class="vm-card">
        <h3 class="vm-heading">Vision</h3>
        <p>${esc(d.vision)}</p>
      </div>
      <div class="vm-card">
        <h3 class="vm-heading">Mission</h3>
        <p class="vm-intro">${esc(d.mission.intro)}</p>
        <ul class="check-list check-list-tight">
          ${d.mission.points.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt" id="values">
  <div class="shell">
    ${sectionHead('05', 'Core Values', 'What we hold to')}
    <div class="grid grid-3 values-grid">${values}</div>
  </div>
</section>

<section class="band band-story" id="story">
  ${hexCluster('c')}
  <div class="shell">
    ${sectionHead('06', 'Our Story', 'Founded ' + d.company.founded)}
    <div class="stack stack-prose">
      ${d.story.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
    <p class="story-closing story-closing-lg">${esc(d.story.closing)}</p>
  </div>
</section>

${ctaStrip(d, '')}`;

  return layout({
    d,
    title: `About | ${d.company.name}`,
    description: `The story, purpose, vision, mission and core values of ${d.company.legal} — founded ${d.company.founded} by ${d.welcome.author}.`,
    active: 'about.html',
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Business model
 * ------------------------------------------------------------------ */

function businessModel(d) {
  const blocks = d.businessModel
    .map(
      (b) => `
        <article class="bm-card">
          <span class="bm-num">${esc(b.n)}</span>
          <h3>${esc(b.title)}</h3>
          <ul>
            ${b.items.map((i) => `<li>${esc(i)}</li>`).join('\n            ')}
          </ul>
        </article>`
    )
    .join('');

  const pillars = d.uvp.pillars
    .map(
      (p) => `
        <article class="pillar">
          <span class="pillar-num">${esc(p.n)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
        </article>`
    )
    .join('');

  const body = `
<section class="page-hero">
  ${hexCluster('a')}
  <div class="shell">
    <span class="eyebrow"><span class="dot"></span>Business Model</span>
    <h1 class="page-title">How the ecosystem earns its keep.</h1>
    <p class="page-lede">${esc(d.uvp.statement)}</p>
  </div>
</section>

<section class="band" id="usp">
  <div class="shell">
    ${sectionHead('01', d.uvp.uspTitle, 'The short version')}
    <blockquote class="statement statement-lg">${esc(d.uvp.usp)}</blockquote>
    <div class="grid grid-4 pillars">${pillars}</div>
  </div>
</section>

<section class="band band-alt" id="model">
  ${hexCluster('b')}
  <div class="shell">
    ${sectionHead('02', 'Our Business Model', 'Eight building blocks')}
    <div class="grid grid-2 bm-grid">${blocks}</div>
  </div>
</section>

${ctaStrip(d, '')}`;

  return layout({
    d,
    title: `Business Model | ${d.company.name}`,
    description: `${d.company.legal}'s business model — customer segments, value proposition, channels, revenue streams, key resources, activities and partnerships.`,
    active: 'business-model.html',
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Services hub
 * ------------------------------------------------------------------ */

function servicesHub(d) {
  const totalSubs = d.services.reduce((a, s) => a + s.groups.length, 0);

  const cards = d.services
    .map(
      (s) => `
        <article class="hub-card" data-family="${esc(s.slug)}">
          <a class="hub-card-link" href="services/${s.slug}.html">
            <span class="svc-num">${esc(s.n)}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.blurb)}</p>
          </a>
          <ul class="hub-list">
            ${s.groups
              .map((g) => `<li>${esc(g.title)}</li>`)
              .join('\n            ')}
          </ul>
          <a class="link-arrow" href="services/${s.slug}.html">View ${esc(
        s.short
      )}</a>
        </article>`
    )
    .join('');

  const filters = d.services
    .map(
      (s) =>
        `<button class="filter-chip" data-filter="${esc(s.slug)}">${esc(
          s.short
        )}</button>`
    )
    .join('\n        ');

  const body = `
<section class="page-hero">
  ${hexCluster('a')}
  <div class="shell">
    <span class="eyebrow"><span class="dot"></span>Products &amp; Services</span>
    <h1 class="page-title">Twelve divisions.<br>${totalSubs} services.<br>One partner.</h1>
    <p class="page-lede">Concept to consumer, online and offline. Filter by division, or open any one for the full detail.</p>
  </div>
</section>

<section class="band" id="catalogue">
  <div class="shell">
    <div class="filter-bar" role="group" aria-label="Filter services by division">
      <button class="filter-chip is-active" data-filter="all">All divisions</button>
        ${filters}
    </div>
    <div class="grid grid-3 hub-grid" id="hub-grid">${cards}</div>
    <p class="filter-empty" id="filter-empty" hidden>No divisions match that filter.</p>
  </div>
</section>

${ctaStrip(d, '')}`;

  return layout({
    d,
    title: `Services | ${d.company.name}`,
    description: `All ${d.services.length} ${d.company.name} divisions and ${totalSubs} services — digital marketing, outsourcing, manufacturing, printing, giveaways, trading, creative, production, events, fabrication, music, PR and talent.`,
    active: 'services.html',
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Single service family
 * ------------------------------------------------------------------ */

function servicePage(d, family) {
  const idx = d.services.findIndex((s) => s.slug === family.slug);
  const prev = d.services[(idx - 1 + d.services.length) % d.services.length];
  const next = d.services[(idx + 1) % d.services.length];

  const toc = family.groups
    .map(
      (g, i) =>
        `<li><a href="#g${i + 1}"><span>${String(i + 1).padStart(
          2,
          '0'
        )}</span>${esc(g.title)}</a></li>`
    )
    .join('\n          ');

  const groups = family.groups
    .map((g, i) => {
      const items = g.items
        .map(
          (it) => `
              <li class="detail">
                ${it.label ? `<span class="detail-label">${esc(it.label)}</span>` : ''}
                <span class="detail-body">${esc(it.body)}</span>
              </li>`
        )
        .join('');

      return `
        <article class="svc-group" id="g${i + 1}">
          <div class="svc-group-head">
            <span class="svc-group-num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${esc(g.title)}</h2>
          </div>
          <ul class="detail-list">${items}</ul>
        </article>`;
    })
    .join('');

  const body = `
<section class="page-hero page-hero-svc">
  ${hexCluster('a')}
  <div class="shell">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Home</a>
      <span aria-hidden="true">/</span>
      <a href="../services.html">Services</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(family.short)}</span>
    </nav>
    <span class="eyebrow"><span class="dot"></span>Division ${esc(family.n)}</span>
    <h1 class="page-title">${esc(family.title)}</h1>
    <p class="page-lede">${esc(family.blurb)}</p>
    <p class="page-meta">${family.groups.length} service${
    family.groups.length === 1 ? '' : 's'
  } &middot; ${family.groups.reduce((a, g) => a + g.items.length, 0)} capabilities</p>
  </div>
</section>

<section class="band svc-body">
  <div class="shell svc-layout">
    <aside class="svc-toc">
      <h2 class="svc-toc-title">In this division</h2>
      <ol class="svc-toc-list">
          ${toc}
      </ol>
      <a href="../contact.html" class="btn btn-primary btn-sm svc-toc-cta">Request a quote</a>
    </aside>
    <div class="svc-groups">${groups}</div>
  </div>
</section>

<section class="band band-alt svc-nav-band">
  <div class="shell svc-pager">
    <a class="pager pager-prev" href="${prev.slug}.html">
      <span class="pager-dir">&larr; Previous division</span>
      <span class="pager-title">${esc(prev.title)}</span>
    </a>
    <a class="pager pager-next" href="${next.slug}.html">
      <span class="pager-dir">Next division &rarr;</span>
      <span class="pager-title">${esc(next.title)}</span>
    </a>
  </div>
</section>

${ctaStrip(d, '../')}`;

  return layout({
    d,
    title: `${family.title} | ${d.company.name}`,
    description: `${family.title} at ${d.company.legal}: ${family.groups
      .map((g) => g.title)
      .join(', ')}.`,
    active: 'services.html',
    root: '../',
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Partners
 * ------------------------------------------------------------------ */

function partners(d) {
  const card = (b) => `
          <div class="logo-card"${b.logo ? '' : ' data-logo-placeholder'}>
            ${
              b.logo
                ? `<img src="logos/${esc(b.logo)}" alt="${esc(b.name)}">`
                : `<span class="logo-name">${esc(b.name)}</span>${
                    b.sub ? `<span class="logo-sub">${esc(b.sub)}</span>` : ''
                  }`
            }
          </div>`;

  const cats = d.partnerships.categories
    .map(
      (c) => `
        <article class="partner-card">
          <span class="bm-num">${esc(c.n)}</span>
          <h3>${esc(c.title)}</h3>
          <ul class="detail-list detail-list-tight">
            ${c.items
              .map(
                (i) => `<li class="detail">
              <span class="detail-label">${esc(i.label)}</span>
              <span class="detail-body">${esc(i.body)}</span>
            </li>`
              )
              .join('\n            ')}
          </ul>
        </article>`
    )
    .join('');

  const body = `
<section class="page-hero">
  ${hexCluster('a')}
  <div class="shell">
    <span class="eyebrow"><span class="dot"></span>Portfolio &amp; Partnerships</span>
    <h1 class="page-title">The network behind the work.</h1>
    <p class="page-lede">${esc(d.partnerships.intro)}</p>
  </div>
</section>

<section class="band" id="house">
  <div class="shell">
    ${sectionHead('01', 'House Brands', 'Built and owned in-house')}
    <div class="logo-wall logo-wall-house">${d.portfolio.house
      .map(card)
      .join('')}</div>
  </div>
</section>

<section class="band band-alt" id="portfolio">
  ${hexCluster('b')}
  <div class="shell">
    ${sectionHead('02', 'Portfolio Highlights', 'Client and partner work')}
    <p class="lede lede-wide">${esc(d.portfolio.intro)}</p>
    <div class="logo-wall">${d.portfolio.clients.map(card).join('')}</div>
  </div>
</section>

<section class="band" id="partnerships">
  <div class="shell">
    ${sectionHead('03', 'Strategic Partnerships', 'Six alliance categories')}
    <div class="grid grid-2 partner-grid">${cats}</div>
  </div>
</section>

${ctaStrip(d, '')}`;

  return layout({
    d,
    title: `Partners & Portfolio | ${d.company.name}`,
    description: `${d.company.legal} house brands, portfolio highlights and six categories of strategic partnerships spanning advertising, outsourcing, manufacturing, giveaways, trading and sustainability.`,
    active: 'partners.html',
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Contact
 * ------------------------------------------------------------------ */

function contact(d) {
  const options = d.services
    .map((s) => `<option value="${esc(s.title)}">${esc(s.title)}</option>`)
    .join('\n                  ');

  const body = `
<section class="page-hero">
  ${hexCluster('a')}
  <div class="shell">
    <span class="eyebrow"><span class="dot"></span>Contact</span>
    <h1 class="page-title">Speak with the team.</h1>
    <p class="page-lede">Tell us what you're launching, printing, staffing or shipping. We'll route you to the division that owns it.</p>
  </div>
</section>

<section class="band" id="contact-main">
  <div class="shell contact-layout">
    <div class="contact-details">
      <h2 class="vm-heading">${esc(d.company.legal)}</h2>
      <address class="contact-address">${d.contact.addressLines
        .map((l) => esc(l))
        .join('<br>')}</address>

      <dl class="contact-dl">
        <dt>Email</dt>
        <dd><a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a></dd>
        <dt>Phone</dt>
        <dd><a href="tel:${esc(d.contact.phoneHref)}">${esc(d.contact.phone)}</a></dd>
        <dt>Headquarters</dt>
        <dd>${esc(d.company.hq)}</dd>
        <dt>Reach</dt>
        <dd>${esc(d.company.countries)} countries</dd>
      </dl>

      ${hexCluster('b')}
    </div>

    <div class="contact-form-panel">
      <form id="contact-form" novalidate>
        <div class="field">
          <label for="f-name">Your name</label>
          <input type="text" id="f-name" name="name" required autocomplete="name">
          <span class="field-error" data-for="f-name"></span>
        </div>

        <div class="field">
          <label for="f-company">Company</label>
          <input type="text" id="f-company" name="company" autocomplete="organization">
        </div>

        <div class="field">
          <label for="f-email">Business email</label>
          <input type="email" id="f-email" name="email" required autocomplete="email">
          <span class="field-error" data-for="f-email"></span>
        </div>

        <div class="field">
          <label for="f-service">Which division do you need?</label>
          <div class="select-wrap">
            <select id="f-service" name="service">
                  ${options}
              <option value="Multiple divisions / not sure">Multiple divisions / not sure</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="f-message">Project details</label>
          <textarea id="f-message" name="message" rows="5" required></textarea>
          <span class="field-error" data-for="f-message"></span>
        </div>

        <button type="submit" class="btn btn-primary btn-block">Send enquiry</button>
        <p class="form-note">Opens your email client addressed to ${esc(
          d.contact.email
        )}.</p>
      </form>

      <div class="form-sent" id="form-sent" hidden>
        <h3>Your email is ready to send.</h3>
        <p>We've opened a pre-filled message to <strong>${esc(
          d.contact.email
        )}</strong>. If nothing opened, email us directly or call ${esc(
    d.contact.phone
  )}.</p>
        <button type="button" class="btn btn-ghost btn-sm" id="form-reset">Write another</button>
      </div>
    </div>
  </div>
</section>`;

  return layout({
    d,
    title: `Contact | ${d.company.name}`,
    description: `Contact ${d.company.legal} — ${d.contact.addressLines.join(
      ', '
    )}. Email ${d.contact.email} or call ${d.contact.phone}.`,
    active: 'contact.html',
    body,
  });
}

/* Shared closing CTA. */
function ctaStrip(d, root) {
  return `
<section class="band band-invert cta-strip">
  ${hexCluster('d')}
  <div class="shell contact-strip">
    <div>
      <span class="section-kicker">Next step</span>
      <h2 class="section-title">One partner, concept to consumer.</h2>
      <p class="lede">We make it. We print it. We package it. We take it to market.</p>
    </div>
    <div class="contact-card">
      <address>${d.contact.addressLines.map((l) => esc(l)).join('<br>')}</address>
      <p><a href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a></p>
      <p><a href="tel:${esc(d.contact.phoneHref)}">${esc(d.contact.phone)}</a></p>
      <a href="${root}contact.html" class="btn btn-highlight">Speak with the team</a>
    </div>
  </div>
</section>`;
}

module.exports = {
  home,
  about,
  businessModel,
  servicesHub,
  servicePage,
  partners,
  contact,
};
