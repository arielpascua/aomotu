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
const closeContactBtn = document.getElementById("close-contact-btn");
const successCloseBtn = document.getElementById("success-close-btn");
const showreelTrigger = document.getElementById("showreel-trigger");
const closeShowreelBtn = document.getElementById("close-showreel-btn");

// Contact Form
const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");

// Showreel Player Controls
const particleCanvas = document.getElementById("particle-canvas");
const playerPlayBtn = document.getElementById("player-play-btn");
const playPauseSvg = document.getElementById("play-pause-svg");
const timeElapsedDisplay = document.getElementById("time-elapsed");
const timelineSliderBg = document.getElementById("timeline-slider-bg");
const timelineSliderFill = document.getElementById("timeline-slider-fill");
const soundWave = document.getElementById("sound-wave");
const playerFullscreenBtn = document.getElementById("player-fullscreen-btn");

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
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
        const offset = 40; // Spacing adjustment
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
   SHOWREEL CANVAS PARTICLE PHYSICS SIMULATOR
   ========================================================================== */
let canvasContext = null;
let animationFrameId = null;
let isPlaying = true;
let canvasParticles = [];
let sparks = [];
let mouse = { x: null, y: null, active: false, radius: 120 };
let durationSeconds = 0; // Total 108 seconds (01:48)
let timerInterval = null;

// Particle Properties
const PARTICLE_COUNT = 65;
const PARTICLE_COLOR = "rgba(37, 99, 235, 0.75)";
const NODE_LINE_COLOR = "rgba(14, 39, 93, 0.18)";
const MOUSE_LINE_COLOR = "rgba(37, 99, 235, 0.4)";

class NodeParticle {
  constructor(w, h) {
    this.canvasWidth = w;
    this.canvasHeight = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 3.5 + 1.5;
    this.pulseSpeed = Math.random() * 0.05 + 0.01;
    this.pulseVal = Math.random();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce check
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;

    // Orbital pulse visual effect
    this.pulseVal += this.pulseSpeed;
  }

  draw(ctx) {
    ctx.beginPath();
    // Glowing nodes representing digital market channels
    const dynamicRadius = this.radius + Math.sin(this.pulseVal) * 1.2;
    ctx.arc(this.x, this.y, Math.max(0.5, dynamicRadius), 0, Math.PI * 2);
    ctx.fillStyle = PARTICLE_COLOR;
    ctx.fill();
    
    if (this.radius > 3.5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, dynamicRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37, 99, 235, 0.08)";
      ctx.fill();
    }
  }
}

class SparkParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.03 + 0.015;
    this.color = Math.random() > 0.4 ? "#2563EB" : "#0E275D";
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.96; // drag
    this.vy *= 0.96;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

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

function resizeCanvas() {
  const container = particleCanvas.parentElement;
  particleCanvas.width = container.clientWidth;
  particleCanvas.height = container.clientHeight;
}

function handleCanvasMouseMove(e) {
  const rect = particleCanvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  mouse.active = true;
}

function handleCanvasMouseLeave() {
  mouse.active = false;
}

function handleCanvasClick(e) {
  const rect = particleCanvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  
  // Generate interactive sparks on clicking canvas
  for (let i = 0; i < 20; i++) {
    sparks.push(new SparkParticle(clickX, clickY));
  }
}

/* Controls Click Callbacks */
function togglePlayback() {
  isPlaying = !isPlaying;
  updatePlayPauseButton();
  
  if (isPlaying) {
    simulationLoop();
    soundWave.classList.add("playing");
  } else {
    cancelAnimationFrame(animationFrameId);
    soundWave.classList.remove("playing");
  }
}

function updatePlayPauseButton() {
  // Pause icon: <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  // Play icon: <path d="M8 5v14l11-7z"/>
  if (isPlaying) {
    playPauseSvg.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>`;
  } else {
    playPauseSvg.innerHTML = `<path d="M8 5v14l11-7z" fill="currentColor"/>`;
  }
}

function toggleAudioSim() {
  soundWave.classList.toggle("playing");
}

function toggleFullscreen() {
  const container = particleCanvas.parentElement;
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function scrubTimeline(e) {
  const rect = timelineSliderBg.getBoundingClientRect();
  const clickFraction = (e.clientX - rect.left) / rect.width;
  durationSeconds = Math.floor(clickFraction * 108);
  updateTimelineUI();
}

function updateTimelineUI() {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  timeElapsedDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const percentage = (durationSeconds / 108) * 100;
  timelineSliderFill.style.width = `${percentage}%`;
}

/* SIMULATION RENDER ENGINE */
function simulationLoop() {
  if (!isPlaying) return;
  
  canvasContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  
  // Render Connecting Nodes
  for (let i = 0; i < canvasParticles.length; i++) {
    const p1 = canvasParticles[i];
    p1.update();
    p1.draw(canvasContext);
    
    // Gravity influence if mouse is active
    if (mouse.active) {
      const dx = mouse.x - p1.x;
      const dy = mouse.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < mouse.radius) {
        // Draw connection to cursor
        const alpha = (1 - dist / mouse.radius) * 0.4;
        canvasContext.beginPath();
        canvasContext.moveTo(p1.x, p1.y);
        canvasContext.lineTo(mouse.x, mouse.y);
        canvasContext.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        canvasContext.lineWidth = 1;
        canvasContext.stroke();
        
        // Gentle pull towards cursor
        p1.x += (dx / dist) * 0.45;
        p1.y += (dy / dist) * 0.45;
      }
    }

    // Connect node-to-node
    for (let j = i + 1; j < canvasParticles.length; j++) {
      const p2 = canvasParticles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const connectDist = 130;
      if (dist < connectDist) {
        const alpha = (1 - dist / connectDist) * 0.15;
        canvasContext.beginPath();
        canvasContext.moveTo(p1.x, p1.y);
        canvasContext.lineTo(p2.x, p2.y);
        canvasContext.strokeStyle = `rgba(14, 39, 93, ${alpha})`;
        canvasContext.lineWidth = 0.8;
        canvasContext.stroke();
      }
    }
  }

  // Update & Draw Sparks
  sparks = sparks.filter(spark => spark.alpha > 0.01);
  sparks.forEach(spark => {
    spark.update();
    spark.draw(canvasContext);
  });

  animationFrameId = requestAnimationFrame(simulationLoop);
}
