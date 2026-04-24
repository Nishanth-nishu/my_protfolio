/* ========================================================
   gsap-animations.js — R Nishanth | Agentic AI Systems Architect
   GSAP 3 + ScrollTrigger — Premium Animation System v3.0
   ======================================================== */

'use strict';

// Wait for GSAP to be loaded
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Retry after a short delay
    setTimeout(initGSAP, 100);
    return;
  }

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ── Global GSAP defaults ─────────────────────────────────
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  // ── Utility: split text into spans for char animation ───
  function splitIntoChars(el) {
    if (!el) return [];
    const text = el.textContent;
    el.innerHTML = '';
    return text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      el.appendChild(span);
      return span;
    });
  }

  function splitIntoWords(el) {
    if (!el) return [];
    const text = el.textContent;
    el.innerHTML = '';
    return text.split(/(\s+)/).filter(Boolean).map(word => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      if (word.trim()) {
        span.style.overflow = 'hidden';
      }
      el.appendChild(span);
      return span;
    });
  }

  // ── HERO ENTRANCE ANIMATION ──────────────────────────────
  function initHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const badge   = hero.querySelector('.badge');
    const title   = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-subtitle');
    const desc    = hero.querySelector('.hero-desc');
    const btns    = hero.querySelector('.hero-btns');
    const stats   = hero.querySelector('.hero-stats');
    const visual  = hero.querySelector('.hero-visual');
    const orbs    = hero.querySelectorAll('.orb');

    // Timeline — master hero entrance
    const tl = gsap.timeline({ delay: 0.2 });

    // Orbs drift in
    if (orbs.length) {
      tl.fromTo(orbs,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.25, scale: 1, duration: 1.5, stagger: 0.2, ease: 'power2.out' },
        0
      );
    }

    // Badge slides down
    if (badge) {
      tl.fromTo(badge,
        { opacity: 0, y: -24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(2)' },
        0.3
      );
    }

    // Hero title — word-by-word reveal
    if (title) {
      const words = splitIntoWords(title);
      const textWords = words.filter(s => s.textContent.trim());
      tl.fromTo(textWords,
        { opacity: 0, y: 40, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.07, ease: 'power4.out' },
        0.5
      );
    }

    // Subtitle + desc
    if (subtitle) {
      tl.fromTo(subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.95
      );
    }

    if (desc) {
      tl.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      );
    }

    if (btns) {
      const btnItems = btns.querySelectorAll('.btn');
      tl.fromTo(btnItems,
        { opacity: 0, y: 20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(1.5)' },
        1.25
      );
    }

    if (stats) {
      const statItems = stats.children;
      tl.fromTo(statItems,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
        1.4
      );
    }

    if (visual) {
      tl.fromTo(visual,
        { opacity: 0, x: 60, rotateY: 15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1.0, ease: 'power3.out' },
        0.6
      );

      // Floating tags stagger animation  
      const tags = visual.querySelectorAll('.floating-tag');
      tl.fromTo(tags,
        { opacity: 0, scale: 0, y: 20 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(2)' },
        1.2
      );
    }
  }

  // ── SECTION TITLE ANIMATED REVEAL ────────────────────────
  function initSectionTitles() {
    document.querySelectorAll('.section-title').forEach(el => {
      // Skip hero (already handled)
      if (el.closest('.hero')) return;

      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    document.querySelectorAll('.section-label').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -20, scale: 0.9 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.6,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ── STAGGER CARD REVEALS ──────────────────────────────────
  function initCardAnimations() {
    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    if (problemCards.length) {
      gsap.fromTo(problemCards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.65,
          scrollTrigger: {
            trigger: '.problem-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Project items — slide in from left
    const projectItems = document.querySelectorAll('.project-item, .project-card-sub');
    projectItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
        {
          opacity: 1, x: 0, y: 0, duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Demo cards
    const demoCards = document.querySelectorAll('.demo-card');
    if (demoCards.length) {
      gsap.fromTo(demoCards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6,
          scrollTrigger: {
            trigger: '.demos-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length) {
      gsap.fromTo(pricingCards,
        { opacity: 0, y: 40, rotate: -1 },
        {
          opacity: 1, y: 0, rotate: 0, stagger: 0.12, duration: 0.7,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: '.pricing-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // ── CHAINMIND ARCHITECTURE VISUALIZATION ─────────────────
  function initChainMindViz() {
    const chainmindCard = document.getElementById('proj-chainmind') ||
                          document.querySelector('.chainmind-card');
    if (!chainmindCard) return;

    // Animate the architecture layers in sequence
    const layers = chainmindCard.querySelectorAll('.arch-layer');
    if (layers.length) {
      gsap.fromTo(layers,
        { opacity: 0, x: -20, scaleX: 0.85 },
        {
          opacity: 1, x: 0, scaleX: 1, stagger: 0.1, duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: chainmindCard,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Animate tech badges
    const techTags = chainmindCard.querySelectorAll('.tech-tag, .project-tech span');
    if (techTags.length) {
      gsap.fromTo(techTags,
        { opacity: 0, scale: 0.7, y: 10 },
        {
          opacity: 1, scale: 1, y: 0, stagger: 0.05, duration: 0.4,
          ease: 'back.out(1.5)',
          delay: 0.4,
          scrollTrigger: {
            trigger: chainmindCard,
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // ── COMPARISON TABLE ROW ANIMATION ───────────────────────
  function initComparisonTable() {
    const table = document.querySelector('.comparison-table');
    if (!table) return;

    const rows = table.querySelectorAll('.comparison-row');
    gsap.fromTo(rows,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, stagger: 0.07, duration: 0.5,
        scrollTrigger: {
          trigger: table,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ── CREDENTIAL ITEMS STAGGER ──────────────────────────────
  function initCredentialsAnimation() {
    const credBar = document.querySelector('.credentials-bar');
    if (!credBar) return;

    const items = credBar.querySelectorAll('.credential-item');
    gsap.fromTo(items,
      { opacity: 0, y: 30, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: credBar,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ── CONTACT FORM REVEAL ───────────────────────────────────
  function initContactAnimation() {
    const contactSection = document.querySelector('.contact');
    if (!contactSection) return;

    const info = contactSection.querySelector('.contact-info');
    const form = contactSection.querySelector('.contact-form-wrap');

    if (info) {
      gsap.fromTo(info,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.9,
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    if (form) {
      gsap.fromTo(form,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.9,
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // ── SCROLL PROGRESS INDICATOR ─────────────────────────────
  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // ── IMPACT NUMBERS COUNTER (GSAP-powered) ────────────────
  function initImpactCounters() {
    const impactItems = document.querySelectorAll('.impact-num');
    impactItems.forEach(item => {
      const text = item.textContent.trim();
      const hasPercent = text.includes('%');
      const hasPx = text.includes('px') || text.includes('s') || text.includes('d');
      const numMatch = text.match(/[\d.]+/);

      if (!numMatch || hasPx) return;

      const target = parseFloat(numMatch[0]);
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: item,
        start: 'top 82%',
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              const val = target % 1 === 0
                ? Math.round(obj.val)
                : obj.val.toFixed(1);
              item.textContent = val + (hasPercent ? '%' : '');
            }
          });
        },
        once: true
      });
    });
  }

  // ── NAVBAR LOGO MICRO-ANIMATION ───────────────────────────
  function initNavAnimation() {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
      gsap.fromTo(logo,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );
    }

    const navLinks = document.querySelectorAll('.nav-link');
    gsap.fromTo(navLinks,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, delay: 0.2 }
    );
  }

  // ── HOVER MAGNETIC EFFECT ON BUTTONS ─────────────────────
  function initMagneticButtons() {
    const btns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-accent');
    btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ── SECTION PARALLAX ─────────────────────────────────────
  function initParallax() {
    document.querySelectorAll('.section-label').forEach(el => {
      gsap.to(el, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });
  }

  // ── CODE CARD TYPEWRITER → already in script.js but GSAP-enhanced glitch ──
  function initCodeCardGlitch() {
    const codeCard = document.querySelector('.code-card');
    if (!codeCard) return;

    // Subtle periodic glitch effect
    const glitch = () => {
      const tl = gsap.timeline({ repeat: 0 });
      tl.to(codeCard, { x: 2, skewX: 0.5, duration: 0.05, ease: 'none' })
        .to(codeCard, { x: -2, skewX: -0.5, duration: 0.05, ease: 'none' })
        .to(codeCard, { x: 0, skewX: 0, duration: 0.05, ease: 'none' });
    };

    // Random glitch interval
    const scheduleGlitch = () => {
      const delay = 4000 + Math.random() * 8000;
      setTimeout(() => {
        glitch();
        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
  }

  // ── GSAP PAGE TRANSITION (for multi-page nav) ────────────
  function initPageTransition() {
    const overlay = document.getElementById('pageTransitionOverlay');
    if (!overlay) return;

    // Entrance: fade overlay out
    gsap.fromTo(overlay,
      { opacity: 1 },
      { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => {
        overlay.style.pointerEvents = 'none';
      }}
    );

    // Exit: fade in on nav clicks
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.href;
        if (href.includes('#') || link.target === '_blank') return;
        e.preventDefault();
        overlay.style.pointerEvents = 'all';
        gsap.to(overlay, {
          opacity: 1, duration: 0.4, ease: 'power2.in',
          onComplete: () => { window.location.href = href; }
        });
      });
    });
  }

  // ── GSAP HOVER LIFT FOR GLASS CARDS ──────────────────────
  function initCardHoverGSAP() {
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, scale: 1.01, duration: 0.35, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
      });
    });
  }

  // ── INITIALIZE ALL ────────────────────────────────────────
  function init() {
    // Kill old reveal observers from script.js (GSAP takes over)
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '';
      el.style.transform = '';
    });

    initNavAnimation();
    initHeroAnimation();
    initSectionTitles();
    initCardAnimations();
    initChainMindViz();
    initComparisonTable();
    initCredentialsAnimation();
    initContactAnimation();
    initScrollProgress();
    initImpactCounters();
    initMagneticButtons();
    initParallax();
    initCodeCardGlitch();
    initPageTransition();
    initCardHoverGSAP();

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
