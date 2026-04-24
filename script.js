/* ========================================================
   script.js — R Nishanth | Agentic AI Systems Architect
   v3.0 — GSAP-Enhanced 2026
   ======================================================== */

'use strict';

// ── Particle System ────────────────────────────────────────
const particleCanvas = document.getElementById('particles');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let w = particleCanvas.width = window.innerWidth;
    let h = particleCanvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(80, Math.floor(w * h / 15000));

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        w = particleCanvas.width = window.innerWidth;
        h = particleCanvas.height = window.innerHeight;
    });
}

// ── Typewriter Effect ──────────────────────────────────────
const typewriterEl = document.getElementById('typewriter');
const roles = [
    'Multi-Agent AI Systems \uD83E\uDD16',
    'RAG Pipelines & LLM Ops \uD83D\uDD2D',
    'MCP & A2A Protocol Integrations \uD83D\uDD17',
    'Inference-Optimized AI (5s\u21922s) \u26A1',
    'HITL Governance Architectures \uD83D\uDEE1\uFE0F',
    'Distributed Systems on K8s \uD83D\uDE80',
    'Drug Discovery AI Pipelines \uD83E\uDDEC',
    'Supply Chain Intelligence \uD83C\uDFED',
];
let roleIdx = 0, charIdx = 0, deleting = false;

function typewrite() {
    if (!typewriterEl) return;
    const current = roles[roleIdx];
    if (!deleting) {
        typewriterEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typewrite, 2000);
            return;
        }
    } else {
        typewriterEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }
    }
    setTimeout(typewrite, deleting ? 50 : 80);
}
typewrite();

// ── Counter Animation (fallback if GSAP not loaded) ────────
const counters = document.querySelectorAll('.stat-number[data-target]');
if (counters.length && typeof gsap === 'undefined') {
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    const duration = 1500;
                    const step = target / (duration / 16);
                    let current = 0;
                    const interval = setInterval(() => {
                        current = Math.min(current + step, target);
                        el.textContent = Math.round(current);
                        if (current >= target) clearInterval(interval);
                    }, 16);
                    counterObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach(c => counterObserver.observe(c));
}

// ── Scroll Reveal (GSAP fallback only) ─────────────────────
function initFallbackReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
}

if (typeof gsap === 'undefined') {
    initFallbackReveal();
}

// ── Navbar: Scroll Behaviour & Active Link ─────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
    const scrollY = window.scrollY;
    if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 40);
    }
    document.getElementById('backToTop')?.classList.toggle('visible', scrollY > 400);

    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Mobile Nav Toggle ──────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

navLinksEl?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

// ── Smooth Scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Back to Top ────────────────────────────────────────────
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Contact Form Validation ────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || !error) return;
    field.style.borderColor = '#f43f5e';
    error.textContent = message;
}
function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || !error) return;
    field.style.borderColor = '';
    error.textContent = '';
}

function validateForm() {
    let valid = true;
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const type = document.getElementById('type')?.value;
    const message = document.getElementById('message')?.value.trim();

    clearError('name', 'nameError');
    clearError('email', 'emailError');
    clearError('type', 'typeError');
    clearError('message', 'messageError');

    if (!name) { showError('name', 'nameError', 'Please enter your name.'); valid = false; }
    if (!email) {
        showError('email', 'emailError', 'Please enter your email.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'emailError', 'Please enter a valid email.'); valid = false;
    }
    if (!type) { showError('type', 'typeError', 'Please select engagement type.'); valid = false; }
    if (!message || message.length < 20) {
        showError('message', 'messageError', 'Please write at least 20 characters.'); valid = false;
    }
    return valid;
}

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const btnText = submitBtn.querySelector('.btn-text');
    const original = btnText?.textContent;
    if (btnText) btnText.textContent = 'Sending\u2026';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute('action');

        if (action && action.includes('formspree.io') && !action.includes('YOUR_FORM_ID')) {
            const res = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error('Server error');
        } else {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const type = document.getElementById('type').value;
            const message = document.getElementById('message').value;
            const subject = encodeURIComponent('[Agentic AI Services] ' + type + ' \u2014 from ' + name);
            const body = encodeURIComponent('Hi Nishanth,\n\nName: ' + name + '\nEmail: ' + email + '\nType: ' + type + '\n\n' + message);
            window.location.href = 'mailto:nishanth0962333@gmail.com?subject=' + subject + '&body=' + body;
        }

        contactForm.reset();
        if (formSuccess) {
            formSuccess.removeAttribute('hidden');
            setTimeout(() => formSuccess.setAttribute('hidden', ''), 6000);
        }
    } catch {
        alert('Something went wrong. Please email me directly at nishanth0962333@gmail.com');
    } finally {
        if (btnText) btnText.textContent = original;
        submitBtn.disabled = false;
    }
});

// ── Parallax orbs on mouse move (Hero) ─────────────────────
const heroSection = document.getElementById('home');
heroSection?.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const mw = window.innerWidth, mh = window.innerHeight;
    const xPct = (clientX / mw - 0.5) * 20;
    const yPct = (clientY / mh - 0.5) * 20;
    document.querySelectorAll('.orb').forEach((orb, i) => {
        const factor = (i + 1) * 0.3;
        orb.style.transform = 'translate(' + (xPct * factor) + 'px, ' + (yPct * factor) + 'px)';
    });
});

// ── Service card hover micro-animation ─────────────────────
document.querySelectorAll('.service-card, .project-card-sub').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.service-icon-wrap')?.classList.add('icon-pulse');
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.service-icon-wrap')?.classList.remove('icon-pulse');
    });
});

console.log('%cR Nishanth | Agentic AI Systems Architect \uD83E\uDD16', 'color:#7c3aed;font-size:16px;font-weight:bold;');
console.log('%cPowered by GSAP + ScrollTrigger \u2014 nishanth0962333@gmail.com', 'color:#22d3ee;font-size:12px;');
console.log('%c72+ repos \u2022 IIIT-H Research Fellow \u2022 ChainMind \u2022 Scikit-learn & PyTorch Contributor', 'color:#10b981;font-size:11px;');
