/* =========================================================
   JAYESH PATIL — PORTFOLIO SCRIPT
   1. Utilities
   2. Loading screen
   3. Custom cursor
   4. Navbar (hide/show, active link, scroll progress, mobile toggle)
   5. Hero typing effect
   6. Particle background
   7. Scroll reveal
   8. Back to top
   9. Contact form (mailto)
   10. Footer year
========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* 1. Utilities ------------------------------------------------------- */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* 2. Loading screen ---------------------------------------------------- */
  function initLoadingScreen() {
    const screen = $('#loading-screen');
    const bar = $('.loading-progress');
    if (!screen || !bar) return;

    let progress = 0;
    const tick = () => {
      progress += Math.random() * 18;
      bar.style.width = Math.min(progress, 100) + '%';
      if (progress < 100) {
        window.requestAnimationFrame(() => setTimeout(tick, 90));
      } else {
        setTimeout(() => screen.classList.add('loaded'), 250);
      }
    };
    tick();

    window.addEventListener('load', () => {
      progress = 100;
      bar.style.width = '100%';
      setTimeout(() => screen.classList.add('loaded'), 400);
    });
  }

  /* 3. Custom cursor ------------------------------------------------------ */
  function initCursor() {
    if (isTouch) {
      document.body.classList.add('no-touch-cursor');
      return;
    }
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = targetX + 'px';
      dot.style.top = targetY + 'px';
      document.body.classList.add('cursor-active');
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    $$('a, button, input, textarea, .stack-card, .project-card, .about-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });
  }

  /* 4. Navbar -------------------------------------------------------------- */
  function initNavbar() {
    const navbar = $('#navbar');
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    const progressBar = $('#scrollProgress');
    const navLinks = $$('.nav-link');
    const sections = $$('main section[id]');

    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      // hide on scroll down, show on scroll up
      if (navbar) {
        if (currentScroll > lastScroll && currentScroll > 120) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }
      }
      lastScroll = currentScroll;

      // scroll progress
      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
      }

      // active link highlight
      let currentId = '';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) currentId = sec.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
      });
    }, { passive: true });

    if (toggle && menu) {
      const closeMenu = () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open-lock');
      };
      const openMenu = () => {
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open-lock');
      };

      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
      });
      navLinks.forEach((link) => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          closeMenu();
          toggle.focus();
        }
      });
    }
  }

  /* 5. Hero typing effect ---------------------------------------------------- */
  function initTyping() {
    const el = $('#typing');
    if (!el) return;
    const words = ['AWS', 'Linux', 'Docker', 'CI/CD', 'Cloud Infrastructure'];

    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0, charIndex = 0, deleting = false;

    function step() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(step, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(step, deleting ? 45 : 85);
    }
    step();
  }

  /* 6. Particle background ---------------------------------------------------- */
  function initParticles() {
    const canvas = $('#particles');
    if (!canvas || prefersReducedMotion || isTouch) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(50, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.15
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize();
    createParticles();
    draw();
  }

  /* 7. Scroll reveal ---------------------------------------------------------- */
  function initReveal() {
    const targets = $$('.about-card, .stack-card, .project-card, .timeline-item, .experience-card, .resume-card, .cert-placeholder, .contact-info, .contact-form-wrap');
    targets.forEach((el) => el.setAttribute('data-reveal', ''));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach((el) => observer.observe(el));
  }

  /* 8. Back to top ------------------------------------------------------------- */
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* 9. Contact form (mailto) ----------------------------------------------------- */
  function initContactForm() {
    const submitBtn = $('#cf-submit');
    const status = $('#contactFormStatus');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
      const name = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const message = $('#cf-message').value.trim();

      if (!name || !email || !message) {
        if (status) status.textContent = 'Please fill in all fields before sending.';
        return;
      }

      // ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = submitBtn.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      submitBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:jayesh.patil0118@gmail.com?subject=${subject}&body=${body}`;

      if (status) status.textContent = 'Opening your email app…';
    });
  }

  /* 10. Footer year ----------------------------------------------------------------- */
  function initFooterYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* Init ------------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCursor();
    initNavbar();
    initTyping();
    initParticles();
    initReveal();
    initBackToTop();
    initContactForm();
    initFooterYear();
  });
})();
