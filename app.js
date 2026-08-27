/* ==========================================================================
   GLOBAL DATA: 16 COUNTRIES & STATS
   ========================================================================== */
const countriesData = [
  {
    name: "India",
    stats: "11 / 16 markets",
    desc: "Connecting global brands to South Asia's digital ecosystem with localized strategies and media campaigns."
  },
  {
    name: "Japan",
    stats: "14 / 16 markets",
    desc: "Architecting immersive digital advertising and creative video assets for high-growth global technology brands."
  },
  {
    name: "Germany",
    stats: "8 / 16 markets",
    desc: "Expanding B2B SaaS reach and lead acquisition across Western Europe's programmatic advertising networks."
  },
  {
    name: "Singapore",
    stats: "16 / 16 markets",
    desc: "Managing APAC regional headquarters with optimized cross-border ad-spend analytics and performance intelligence."
  },
  {
    name: "UAE",
    stats: "12 / 16 markets",
    desc: "Pioneering premium marketing campaigns and luxury brand representation across GCC digital channels."
  },
  {
    name: "Canada",
    stats: "9 / 16 markets",
    desc: "Fostering brand relationships, customer acquisition loops, and creative production pipelines in North America."
  },
  {
    name: "Sweden",
    stats: "7 / 16 markets",
    desc: "Directing Scandinavian brand consulting, digital strategy, and localized interactive ad products."
  },
  {
    name: "Luxembourg",
    stats: "4 / 16 markets",
    desc: "Providing structured financial services marketing and cross-border European compliance operations."
  },
  {
    name: "Philippines",
    stats: "15 / 16 markets",
    desc: "Scaling digital outsourcing hubs, content moderation teams, and 24/7 client care squads."
  },
  {
    name: "Mexico",
    stats: "10 / 16 markets",
    desc: "Executing localized influencer activations and digital search/display campaigns across Latin America."
  },
  {
    name: "Saudi Arabia",
    stats: "9 / 16 markets",
    desc: "Leading corporate positioning, regional marketing, and digital transformation narratives in Riyadh."
  },
  {
    name: "New Zealand",
    stats: "6 / 16 markets",
    desc: "Engaging Oceania consumer markets with sustainability-focused digital narratives and social campaigns."
  },
  {
    name: "Italy",
    stats: "8 / 16 markets",
    desc: "Synchronizing European design aesthetics with digital creative services for premier lifestyle and fashion brands."
  },
  {
    name: "United Kingdom",
    stats: "13 / 16 markets",
    desc: "Managing search optimization, performance media buying, and programmatic trading operations from London."
  },
  {
    name: "United States",
    stats: "15 / 16 markets",
    desc: "Deploying large-scale digital growth engines, data modeling, and global outreach hubs."
  },
  {
    name: "France",
    stats: "11 / 16 markets",
    desc: "Creating sophisticated digital brand assets, localized content strategy, and luxury campaigns."
  }
];

/* ==========================================================================
   STATE VARIABLES
   ========================================================================== */
let currentCountryIndex = 0;
let countryIntervalId = null;
const AUTO_ROTATE_DELAY = 8000; // 8 seconds

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
// Country Switcher
const displayCountry = document.getElementById("display-country");
const displayStats = document.getElementById("display-stats");
const displayDesc = document.getElementById("display-desc");
const btnPrev = document.getElementById("country-prev");
const btnNext = document.getElementById("country-next");
const dotsGrid = document.getElementById("dots-grid");

// Modals
const contactModal = document.getElementById("contact-modal");
const showreelModal = document.getElementById("showreel-modal");
const openContactBtn = document.getElementById("open-contact-btn");
const viewAllJobsBtn = document.getElementById("view-all-jobs-btn");
const secondaryContactBtns = [
  document.getElementById("open-services-contact-btn"),
  document.getElementById("footer-contact-btn"),
  document.getElementById("cta-contact-btn")
];
const closeContactBtn = document.getElementById("close-contact-btn");
const successCloseBtn = document.getElementById("success-close-btn");
const showreelTrigger = document.getElementById("showreel-trigger");
const closeShowreelBtn = document.getElementById("close-showreel-btn");

// Contact Form
const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initMotion();
  initCountrySwitcher();
  initCareersAccordion();
  initModalListeners();
  initScrollSpy();
  initContactForm();
});

/* ==========================================================================
   COUNTRY SWITCHER LOGIC
   ========================================================================== */
function initCountrySwitcher() {
  // Carousel markup was replaced by the 3D hero logo — skip if absent.
  if (!dotsGrid || !btnPrev || !btnNext || !displayCountry) return;

  // Generate Dots
  countriesData.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `country-dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Go to country ${index + 1}`);
    dot.addEventListener("click", () => {
      resetAutoRotation();
      switchCountry(index, index > currentCountryIndex ? "next" : "prev");
    });
    dotsGrid.appendChild(dot);
  });

  // Next/Prev Buttons
  btnPrev.addEventListener("click", () => {
    resetAutoRotation();
    let index = currentCountryIndex - 1;
    if (index < 0) index = countriesData.length - 1;
    switchCountry(index, "prev");
  });

  btnNext.addEventListener("click", () => {
    resetAutoRotation();
    let index = (currentCountryIndex + 1) % countriesData.length;
    switchCountry(index, "next");
  });

  // Start auto-rotation
  startAutoRotation();
}

function startAutoRotation() {
  if (countryIntervalId) clearInterval(countryIntervalId);
  countryIntervalId = setInterval(() => {
    let index = (currentCountryIndex + 1) % countriesData.length;
    switchCountry(index, "next");
  }, AUTO_ROTATE_DELAY);
}

function resetAutoRotation() {
  clearInterval(countryIntervalId);
  startAutoRotation();
}

function switchCountry(newIndex, direction) {
  if (newIndex === currentCountryIndex) return;

  const outClass = direction === "next" ? "slide-exit-left" : "slide-exit-right";
  const inClass = direction === "next" ? "slide-enter-left" : "slide-enter-right";

  // Apply exit animations
  displayCountry.classList.add(outClass);
  displayStats.classList.add(outClass);
  displayDesc.classList.add(outClass);

  // Update Dots active state
  const dots = dotsGrid.querySelectorAll(".country-dot");
  dots[currentCountryIndex].classList.remove("active");
  dots[newIndex].classList.add("active");

  setTimeout(() => {
    // Swap content
    currentCountryIndex = newIndex;
    const country = countriesData[newIndex];
    
    displayCountry.textContent = country.name;
    displayStats.innerHTML = `${country.stats.split("/")[0]} <span class="divider">/</span> ${country.stats.split("/")[1]}`;
    displayDesc.textContent = country.desc;

    // Transition in
    displayCountry.classList.remove(outClass);
    displayStats.classList.remove(outClass);
    displayDesc.classList.remove(outClass);

    displayCountry.classList.add(inClass);
    displayStats.classList.add(inClass);
    displayDesc.classList.add(inClass);

    setTimeout(() => {
      displayCountry.classList.remove(inClass);
      displayStats.classList.remove(inClass);
      displayDesc.classList.remove(inClass);
    }, 150);
  }, 150);
}

/* ==========================================================================
   CAREERS ACCORDION LOGIC
   ========================================================================== */
function initCareersAccordion() {
  const summaries = document.querySelectorAll(".career-summary");
  
  summaries.forEach(summary => {
    summary.addEventListener("click", () => {
      const parent = summary.parentElement;
      const wasExpanded = parent.classList.contains("expanded");
      
      // Collapse all other items
      document.querySelectorAll(".career-item").forEach(item => {
        item.classList.remove("expanded");
      });

      // Toggle current item
      if (!wasExpanded) {
        parent.classList.add("expanded");
      }
    });
  });
}

/* ==========================================================================
   MODAL DIALOG LISTENERS
   ========================================================================== */
function initModalListeners() {
  // Open Contact
  openContactBtn.addEventListener("click", () => openModal(contactModal));
  if (viewAllJobsBtn) {
    viewAllJobsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  }

  // Secondary "speak with the team" entry points (services intro, footer)
  secondaryContactBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  });

  // Close Contact
  closeContactBtn.addEventListener("click", () => closeModal(contactModal));
  successCloseBtn.addEventListener("click", () => closeModal(contactModal));

  // Open Showreel
  showreelTrigger.addEventListener("click", () => {
    openModal(showreelModal);
    startShowreelCanvas();
  });

  // Close Showreel
  closeShowreelBtn.addEventListener("click", () => {
    closeModal(showreelModal);
    stopShowreelCanvas();
  });

  // Click outside to close modals
  window.addEventListener("click", (e) => {
    if (e.target === contactModal) closeModal(contactModal);
    if (e.target === showreelModal) {
      closeModal(showreelModal);
      stopShowreelCanvas();
    }
  });

  // ESC key to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(contactModal);
      if (showreelModal.classList.contains("active")) {
        closeModal(showreelModal);
        stopShowreelCanvas();
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable scroll
  
  // Reset contact form success state if closing contact modal
  if (modal === contactModal) {
    setTimeout(() => {
      contactSuccess.classList.remove("active");
      contactForm.style.opacity = "1";
      contactForm.reset();
    }, 400);
  }
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Simulate API request loading state
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <span class="spinner"></span>`;
    
    setTimeout(() => {
      // Transition out form panel opacity
      contactForm.style.opacity = "0";
      
      setTimeout(() => {
        // Show success screen
        contactSuccess.classList.add("active");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }, 300);
    }, 1500);
  });
}

/* ==========================================================================
   FLOATING NAVIGATION SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".floating-nav-bar .nav-link");
  const floatingNav = document.querySelector(".floating-nav-bar");
  let lastScrollTop = 0;

  // Click scroll logic
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offset = 80; // Clear the sticky header
        const top = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // Intersection Observer for highlight
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // High-accuracy window triggers
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute("id");
        
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === activeSectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Hide/Show floating nav on scroll direction
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Near bottom of screen (Marquee/Footer area), show always
    const isNearBottom = (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 180;
    
    if (isNearBottom) {
      floatingNav.classList.remove("hidden");
    } else if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scrolling Down - hide nav
      floatingNav.classList.add("hidden");
    } else {
      // Scrolling Up - show nav
      floatingNav.classList.remove("hidden");
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });
}

/* ==========================================================================
   SHOWREEL PLAYBACK
   ========================================================================== */
// The old particle "LIVE SIMULATION" placeholder was replaced by a real
// Remotion-rendered showreel video. These two functions keep the existing
// open/close call sites working by driving the <video> element instead.
function startShowreelCanvas() {
  const video = document.getElementById("showreel-video");
  if (!video) return;
  try { video.currentTime = 0; } catch (e) {}
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function stopShowreelCanvas() {
  const video = document.getElementById("showreel-video");
  if (!video) return;
  video.pause();
  try { video.currentTime = 0; } catch (e) {}
}

/* ==========================================================================
   MOTION LAYER
   Scroll reveals, parallax, ambient particles and click feedback.

   Everything here is additive and markup-free: reveal targets are tagged at
   runtime rather than in the HTML, and the ambient canvas is created here, so
   the document structure is untouched. Every effect is skipped outright when
   the visitor asks for reduced motion.
   ========================================================================== */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   Scroll-triggered staggered reveals
   -------------------------------------------------------------------------- */
// Grouped so siblings within one block stagger against each other.
const REVEAL_SELECTORS = [
  ".section-header",
  ".sub-header",
  ".about-lead",
  ".about-details",
  ".purpose-list li",
  ".story-banner",
  ".welcome-card",
  ".story-body",
  ".mission-list li",
  ".industry-card",
  ".service-box",
  ".usp-statement",
  ".careers-intro",
  ".career-item",
  ".service-row",
  ".client-tile",
  ".testimonial-card",
  ".stat-item",
  ".showreel-card",
  ".footer-col",
  ".footer-brand"
];

function initReveals() {
  const seen = new Set();

  REVEAL_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      el.setAttribute("data-reveal", "");
      // Stagger against the matching siblings inside the same parent, capped
      // so a twelve-tile grid doesn't end on a second-long delay.
      const sibs = Array.from(el.parentElement.children).filter(c => c.matches(sel));
      el.style.setProperty("--reveal-i", Math.min(sibs.indexOf(el), 7));
    });
  });

  const targets = document.querySelectorAll("[data-reveal]");
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      io.unobserve(entry.target);           // reveal once, then stop watching
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

  targets.forEach(el => io.observe(el));

  // Safety net. A fast flick or an in-page anchor jump can move the viewport
  // past an element without the observer ever reporting it as intersecting,
  // which would strand that content at opacity 0. Sweep anything that is at
  // or above the fold and reveal it regardless.
  let sweeping = false;
  function sweep() {
    sweeping = false;
    const limit = window.innerHeight * 0.92;
    let remaining = 0;
    targets.forEach(el => {
      if (el.classList.contains("is-revealed")) return;
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add("is-revealed");
        io.unobserve(el);
      } else {
        remaining++;
      }
    });
    if (!remaining) {
      window.removeEventListener("scroll", onScroll);
    }
  }
  function onScroll() {
    if (sweeping) return;
    sweeping = true;
    requestAnimationFrame(sweep);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  sweep();
}

/* --------------------------------------------------------------------------
   Parallax depth
   Background layers travel slower than the page. Offsets are written to a CSS
   custom property so each layer's own transform (centring, cover-scaling) is
   preserved instead of being overwritten.
   -------------------------------------------------------------------------- */
function initParallax() {
  if (REDUCED_MOTION) return;

  const layers = [
    { el: document.querySelector(".hero-backdrop img"), speed: 0.20, max: 140 },
    { el: document.querySelector(".story-banner img"), speed: 0.12, max: 26 },
    { el: document.querySelector(".cta-band-bg"), speed: 0.14, max: 34 }
  ].filter(l => l.el);

  if (!layers.length) return;

  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    for (const layer of layers) {
      const rect = layer.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;   // offscreen
      // Distance of this layer's centre from the viewport centre.
      const delta = (rect.top + rect.height / 2) - vh / 2;
      const offset = Math.max(-layer.max, Math.min(layer.max, -delta * layer.speed));
      layer.el.style.setProperty("--py", offset.toFixed(1) + "px");
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   Ambient particle field
   A slow drift of gold nodes behind the page, with hairlines between near
   neighbours. Canvas is created here rather than in the markup.
   -------------------------------------------------------------------------- */
function initAmbientField() {
  if (REDUCED_MOTION) return;

  const canvas = document.createElement("canvas");
  canvas.className = "ambient-field";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const LINK_DIST = 132;
  let w = 0, h = 0, dpr = 1, nodes = [], rafId = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);   // cap cost on retina
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Scale the population to the viewport so phones don't pay desktop cost.
    const count = Math.round(Math.min(70, Math.max(18, (w * h) / 26000)));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.8 + Math.random() * 1.5,
        a: 0.25 + Math.random() * 0.45
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;
      // Wrap rather than bounce, so there is no visible edge rhythm.
      if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, " + p.a.toFixed(3) + ")";
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;       // cheaper than sqrt
        const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = "rgba(212, 175, 55, " + alpha.toFixed(3) + ")";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() { if (!rafId) rafId = requestAnimationFrame(frame); }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  resize();
  start();
  window.addEventListener("resize", () => { resize(); }, { passive: true });
  // Don't burn frames on a hidden tab.
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
}

/* --------------------------------------------------------------------------
   Tactile click feedback
   A ripple that originates at the pointer, so a press feels located rather
   than global.
   -------------------------------------------------------------------------- */
function initRipples() {
  if (REDUCED_MOTION) return;

  document.addEventListener("pointerdown", e => {
    const target = e.target.closest(".btn, .play-btn-circle, .client-tile, .career-summary");
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    // Cover the furthest corner from the press point.
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

    if (getComputedStyle(target).position === "static") target.style.position = "relative";
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }, { passive: true });
}

function initMotion() {
  initReveals();
  initParallax();
  initAmbientField();
  initRipples();
}
