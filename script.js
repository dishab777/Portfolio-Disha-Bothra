document.addEventListener('DOMContentLoaded', () => 
{

  // ── 1. Page Loader ──────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 1400);
  });
  // Fallback
  setTimeout(() => loader.classList.add('done'), 2200);

  // ── 2. Custom Cursor ────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .skill-tag, .tag, .stat-chip, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ── 3. Theme Toggle ─────────────────────
  const themeBtn = document.getElementById('theme-toggle');
  const sunIcon  = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const html     = document.documentElement;

  const saved = localStorage.getItem('db-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('db-theme', next);
    updateThemeIcon(next);
  });
  function updateThemeIcon(t) {
    sunIcon.style.display  = t === 'dark' ? 'none' : 'inline';
    moonIcon.style.display = t === 'dark' ? 'inline' : 'none';
  }

  // ── 4. Typed Text Effect ─────────────────
  const roles = ['Front-End Developer', 'UI/UX Enthusiast', 'Graphic Designer', 'CSE Student', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typed-text');

  function typeEffect() {
    if (!typedEl) return;
    const current = roles[ri];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) { deleting = true; setTimeout(typeEffect, 1600); return; }
      setTimeout(typeEffect, 90);
    } else {
      typedEl.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      setTimeout(typeEffect, 50);
    }
  }
  setTimeout(typeEffect, 2000);

  // ── 5. Scroll Reveal ─────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.06) + 's';
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  // Hide scroll indicator once user scrolls
  const heroScroll = document.querySelector('.hero-scroll');
  window.addEventListener('scroll', () => {
    if (heroScroll) {
        heroScroll.classList.toggle('hidden', window.scrollY > 80);
    }
}, { passive: true });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── 6. Scroll: header + back-to-top ──────
  const header   = document.getElementById('site-header');
  const backTop  = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    backTop.classList.toggle('visible', y > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── 7. Project Filter ────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      const f = btn.dataset.filter;
      projCards.forEach((c, i) => {
        const show = f === 'all' || c.dataset.category === f;
        c.style.display = show ? 'flex' : 'none';
        if (show) {
          c.style.opacity = '0'; c.style.transform = 'translateY(20px)';
          setTimeout(() => { c.style.transition = 'all 0.5s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 80);
        }
      });
    });
  });

  // ── 8. Skill tag stagger ─────────────────
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.7) translateY(8px)';
          setTimeout(() => {
            tag.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1) translateY(0)';
          }, i * 55);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-card').forEach(el => skillObs.observe(el));

  // ── 9. Tilt effect on project cards ──────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
  });

  // ── 10. Nav active highlight on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--p1)';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => navObs.observe(s));

  // ── 11. Stat chips entrance counter ──────
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-chip').forEach((chip, i) => {
          chip.style.opacity = '0';
          chip.style.transform = 'translateY(20px)';
          setTimeout(() => {
            chip.style.transition = 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
            chip.style.opacity = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 100);
        });
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const statsRow = document.querySelector('.hero-stats');
  if (statsRow) statObs.observe(statsRow);

  // ── 12. Card hover magnetic effect ───────
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 10;
      card.style.transform = `translateY(-8px) rotateX(${-y * 0.5}deg) rotateY(${x * 0.5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      setTimeout(() => { card.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'; }, 10);
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.08s ease'; });
  });

});