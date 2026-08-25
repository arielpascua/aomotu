# AOMOTU Website Rebuild — Design Spec

**Date:** 2026-08-25
**Source of truth:** `AOM OTU.pdf` (39-page official company profile)
**Status:** Awaiting approval to implement

---

## 1. Why

The live site's content is largely invented and contradicts the official profile.

| Live site claims | Profile says |
|---|---|
| `growth@aomotu.inc`, "Global Hub: Singapore, 018981" | `acquireinfodesk@aomotu.com`, Sugi Tower, Kai Garden, M Vicente St. Malamig, Mandaluyong City, +63 960 656 4910 |
| Named list of 16 countries (Luxembourg, Sweden, …) | "we span of 16 countries" — the **count** is real, the **list** is not in the profile |
| 3 fabricated job posts (Germany / Tokyo / Manila) | No careers content at all |
| "What we think" blog cards (3 invented articles) | No thought-leadership content |
| Industries: FinTech / E-Commerce / Gaming / SaaS | Customer segments: Retail & E-commerce, Corporate, SMEs & Startups, Manufacturers & Distributors, Real Estate & Construction |
| 3 services, 4 service rows | **12 service families, 75 sub-services, ~250 detail bullets** |
| No founder, no story, no values, no business model | Jamaica B. Escolano (CEO/Founder), 2023 founding, 7 core values, 8-block business model, 6 partnership categories, 13 portfolio brands |

The rebuild replaces invented content with the profile's content in full, and restructures the site to carry a catalogue roughly 20x larger than the current one.

## 2. Decisions (confirmed with the user)

| # | Decision | Choice |
|---|---|---|
| D1 | Architecture | Hub + dedicated service-family pages |
| D2 | Brand | Adopt the profile's identity: maroon + gold on cream, hexagon motifs |
| D3 | Legacy content | Keep the 3D starburst logo. Drop the showreel card, careers, blog cards, industries grid, country list |
| D4 | Production | Content in one JSON, rendered by a dependency-free Node generator, generated HTML committed |
| D5 | Portfolio logos | Typographic wordmark cards, markup-ready for a later `<img>` swap |
| D6 | Contact form | `mailto:` composition that genuinely works, with a marked one-line switch to Formspree |

**D3 note:** `showreel.mp4`, `showreel-poster.jpg` and `video/` are **not deleted from disk** — they are simply no longer referenced by the site, so restoring the showreel later is a markup change, not a re-render.

## 3. Information architecture

18 pages. Every page of the profile maps to exactly one destination; nothing is dropped.

```
/                              index.html          Home — the whole story in one scroll
/about.html                                        Welcome, Background, Purpose, Vision, Mission, Values, Story
/business-model.html                               UVP/USP + the 8 business-model blocks
/services.html                                     Hub: all 12 families, filterable
/services/digital-marketing.html                   Family 1  (4 sub-services)
/services/outsourcing.html                         Family 2  (4)
/services/manufacturing-printing.html              Family 3  (3)
/services/corporate-giveaways.html                 Family 4  (3)
/services/trading-distribution.html                Family 5  (4)
/services/creative-digital.html                    Family 6  (11)
/services/production.html                          Family 7  (10)
/services/events-activations.html                  Family 8  (10)
/services/fabrication.html                         Family 9  (9)
/services/music-audio.html                         Family 10 (6)
/services/pr-communications.html                   Family 11 (6)
/services/talent-kol-influencer.html               Family 12 (5)
/partners.html                                     Portfolio Highlights + 6 Strategic Partnership categories
/contact.html                                      Address, email, phone, working form
```

### Profile → page mapping (coverage proof)

| Profile pages | Content | Destination |
|---|---|---|
| 1 | Cover, tagline "When Tradition Meets Innovation" | Home hero |
| 2 | Table of contents | becomes the site navigation |
| 3 | Welcome Message + CEO quote | About (leader block) + Home pull-quote |
| 4 | Company Background | About + Home intro |
| 5 | Our Purpose (5 bullets) | About |
| 6 | Vision | About |
| 7 | Mission (6 bullets) | About |
| 8 | Core Values (7) | About |
| 9 | Our Story (incl. "16 countries") | About + Home stat |
| 10 | UVP / USP / 4 differentiators | Business model + Home differentiators |
| 11–14 | Business Model blocks 1–8 | Business model |
| 15–35 | Products & Services — 12 families, 75 sub-services | Services hub + 12 family pages |
| 36 | Portfolio Highlights (13 brands) | Partners |
| 37–38 | Strategic Partnerships (6 categories) | Partners |
| 39 | Contact details | Contact + global footer |

### Home page section order

```
01  Hero          Starburst emblem, "When Tradition Meets Innovation", 16-countries stat
02  Background    Who AOMOTU is (profile p.4), 3 stats
03  Purpose       The 5 purpose statements (p.5)
04  Difference    UVP + the 4 differentiators (p.10)
05  Services      All 12 families as cards, deep-linked to family pages
06  Story         Founding narrative + CEO pull-quote (p.3, p.9)
07  Partners      Portfolio wall + partnership categories teaser
08  Contact       Address / email / phone + CTA
```

## 4. Content model

Single file `content/aomotu.json`:

```jsonc
{
  "company":  { "name", "tagline", "founded", "founder", "countries" },
  "contact":  { "address[]", "email", "phone" },
  "welcome":  { "author", "role", "quote[]" },
  "background": ["…paragraphs"],
  "purpose":  { "intro", "points[]" },
  "vision":   "…",
  "mission":  { "intro", "points[]" },
  "values":   [{ "n", "title", "body" }],
  "story":    ["…paragraphs"],
  "uvp":      { "statement", "usp", "pillars": [{ "title", "body" }] },
  "businessModel": [{ "n", "title", "items[]" }],
  "services": [{
      "slug", "n", "title", "blurb",
      "groups": [{ "title", "items": [{ "label", "body" }] }]
  }],
  "portfolio":    [{ "name", "sub" }],
  "partnerships": [{ "n", "title", "items": [{ "label", "body" }] }]
}
```

Rule: **no copy lives in a template.** Every profile sentence lives in the JSON, verbatim or lightly corrected for typos in the source (e.g. "printed materials.pport." → "printed materials.", "rich rich-media" duplications). Corrections are limited to unambiguous typographical errors. No claim is added, softened, or invented.

## 5. Build

`build.js` — zero dependencies, Node stdlib only.

- Reads `content/aomotu.json`.
- Renders `build/templates/{layout,home,about,business-model,services-hub,service,partners,contact}.html` through a small `{{token}}` / `{{#each}}` replacer.
- Writes plain `.html` to the repo root and `services/`.
- Emits `sitemap.xml`.
- Idempotent: re-running with unchanged JSON produces byte-identical output.

Generated HTML is committed, so the site stays a folder of static files. Editing the generated HTML directly still works; re-running the generator overwrites it.

**Verification gate:** a `--check` mode asserts that every one of the 75 sub-services and 13 portfolio brands appears in the emitted HTML, and that no page still contains a stale invented string (`growth@aomotu.inc`, `Singapore, 018981`, `FinTech`, `Programmatic`). This runs before I report the work complete.

## 6. Design system

Rewritten `style.css`, single stylesheet, token-driven.

```css
--cream:      #EDE7E3;   /* page ground, matches the profile's paper */
--cream-deep: #E3DAD4;   /* alternating band */
--paper:      #FAF7F5;   /* card surface */
--maroon:     #6B1414;   /* primary ink, headings, rules */
--maroon-dp:  #4A0E0E;   /* hover / depth */
--gold:       #C9A227;   /* accent, section numerals, secondary headings */
--gold-deep:  #A67C21;
--ink:        #2A1A16;   /* body copy */
--ink-soft:   #6A5A54;   /* secondary copy */
```

- **Type:** Outfit (display), Inter (body), Space Grotesk (numerals/tags), Dancing Script (the CEO's handwritten quote, mirroring p.3).
- **Motifs:** reusable outlined/filled hexagon clusters in section corners (profile pp.2–8); a gold rule plus an oversized page numeral closing each section, echoing the profile's page furniture.
- **Starburst:** the existing Three.js emblem is retained and recolored — gold `#C9A227`, dark spokes `#2A1A16`, warm studio environment. It already matches the real logo.
- **Responsive:** 3-col → 2-col → 1-col at 1024/720. Long service lists become accordions under 720px.
- **A11y:** semantic landmarks, visible focus rings, `prefers-reduced-motion` halts the starburst and marquees, 4.5:1 minimum contrast (maroon on cream ≈ 9.8:1, gold-deep on cream ≈ 4.6:1 — plain `--gold` is reserved for large text and rules only).

## 7. JavaScript

`app.js` rewritten, roughly 40% smaller. Kept: scroll-spy nav, accordions, modal, contact form, mobile nav. Removed: country carousel (`countriesData`, ~85 lines), showreel particle player (~140 lines), auto-rotation timers. Added: services hub filter.

The Three.js starburst module moves out of `index.html` into `starburst.js` so the home page and the services hub can share it instead of duplicating 150 lines.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Profile text contains typos and grammatical errors | Fix only unambiguous typos; never rewrite claims. Log corrections in the commit message. |
| 13 portfolio logos unavailable as assets | Typographic cards (D5), with `/logos/` and the `<img>` hook prepared. |
| One portfolio mark on p.36 is an unlabelled teal "W" glyph with no readable company name | Rendered as 12 named cards; the unidentified mark is omitted rather than given an invented name. Flagged to the user — one JSON line to add once named. |
| Business claims ("16 countries", "the only partner that…") are the client's, not independently verifiable | Reproduced as the company's own positioning, exactly as the profile states it. Not amplified. |
| A page could silently lose content during generation | `--check` coverage gate (§5) blocks the completion claim. |

## 9. Out of scope

Careers, blog/insights, pricing, e-commerce, CMS, multi-language, analytics, deployment. None appear in the profile; none were requested.
