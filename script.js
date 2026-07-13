'use strict';

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Minimum display time so it doesn't flash
  setTimeout(() => {
    preloader.classList.add('loaded');
    document.body.style.overflow = '';
    // Trigger hero animations
    document.querySelectorAll('.hero-stat .stat-num').forEach(el => {
      animateCounter(el);
    });
  }, 1200);

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
});

const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

if (cursorDot && cursorOutline) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth trailing cursor
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .filter-btn, .skill-pill, .cert-card, .project-card, .edu-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

const nav = document.getElementById('main-nav');

// Scroll behavior
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (nav) {
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  lastScrollY = scrollY;
  updateActiveNavLink();
});

// Hamburger menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!link) return;

    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

const themeBtn = document.querySelector('.theme-toggle');
const THEME_KEY = 'disha-portfolio-theme';

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.body.classList.remove('light-mode');
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

// Load saved preference
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('light-mode');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // Ripple effect
    themeBtn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
      themeBtn.style.transform = '';
    }, 400);
  });
}

const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const words = [
    'Creative Technologist',
    'Frontend Developer',
    'UI/UX Designer',
    'Brand Creator',
    'Problem Solver',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  // Start after preloader
  setTimeout(type, 2200);
}

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after first trigger for performance
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

initReveal();

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
  if (isNaN(target)) return;

  const duration = 1500;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + '+';
  }

  requestAnimationFrame(update);
}

// Trigger on scroll into view
const statNums = document.querySelectorAll('.stat-num[data-target]');
if (statNums.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));
}

const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const matches  = filter === 'all' || category.includes(filter);

        if (matches) {
          card.style.display = '';
          // Re-trigger entrance animation
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = '';
          card.classList.remove('reveal');
          card.offsetHeight;
          card.classList.add('reveal', 'visible');
        } else {
          // Fade out
          card.style.opacity = '0';
          card.style.transform = 'scale(0.94)';
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          setTimeout(() => {
            card.style.display = 'none';
            card.style.opacity = '';
            card.style.transform = '';
            card.style.transition = '';
          }, 300);
        }
      });
    });
  });
}

const heroGlow = document.querySelector('#hero::before');
window.addEventListener('mousemove', e => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const rect   = hero.getBoundingClientRect();
  const xRel   = (e.clientX - rect.left) / rect.width;
  const yRel   = (e.clientY - rect.top)  / rect.height;
  const xShift = (xRel - 0.5) * 60;
  const yShift = (yRel - 0.5) * 60;

  hero.style.setProperty('--glow-x', `calc(50% + ${xShift}px)`);
  hero.style.setProperty('--glow-y', `calc(30% + ${yShift}px)`);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

function initTilt() {
  const tiltEls = document.querySelectorAll('.tilt-card, .project-card, .cert-card, .edu-card');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const xRel   = (x / rect.width  - 0.5) * 16;
      const yRel   = (y / rect.height - 0.5) * 16;

      el.style.transform = `perspective(800px) rotateY(${xRel}deg) rotateX(${-yRel}deg) translateZ(8px) translateY(-4px)`;
      el.style.transition = 'transform 0.08s linear';

      // Move glow to follow cursor
      const glow = el.querySelector('.exp-card-glow');
      if (glow) {
        const xPct = (x / rect.width)  * 100;
        const yPct = (y / rect.height) * 100;
        glow.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(74,158,255,0.15) 0%, transparent 65%)`;
        glow.style.inset = '0';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.top = '0';
        glow.style.right = '0';
        glow.style.borderRadius = 'inherit';
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

// Only on desktop
if (window.innerWidth > 900) {
  initTilt();
}

/* ---- PARTICLE CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 80;
  const MAX_DIST       = 130;
  const MOUSE_RADIUS   = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.4 + 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.15;
    }
    update() {
      // Subtle cursor repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.3;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      // Dampen velocity
      this.vx *= 0.97;
      this.vy *= 0.97;

      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset(false);
      if (this.x < -10 || this.x > W + 10) this.x = Math.random() * W;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,158,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.strokeStyle = `rgba(74,158,255,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();


const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  // Duplicate content for seamless loop
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #4a9eff, #c9a84c);
  z-index: 10001;
  transition: width 0.1s linear;
  width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
});

const terminalBody = document.querySelector('.terminal-body');
if (terminalBody) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      terminalBody.querySelectorAll('.terminal-json').forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateX(0)';
        }, i * 50 + 200);
      });
      observer.unobserve(terminalBody);
    }
  }, { threshold: 0.3 });

  observer.observe(terminalBody);
}

// Add subtle entrance animation delay to grid items
document.querySelectorAll('.cert-grid .cert-card, .project-grid .project-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 3) * 0.08}s`;
});

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.classList.add('reveal');
  item.style.transitionDelay = `${i * 0.1}s`;
  item.dataset.delay = i;
});

// Re-observe after adding classes
initReveal();

document.querySelectorAll('.nav-links a[data-num]').forEach(() => {
  // Already set in HTML — this just ensures they work
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (navLinks && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.style.cssText = `
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(74,158,255,0.3);
  background: rgba(8,10,14,0.85);
  color: #4a9eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: none;
  z-index: 500;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s, border-color 0.2s, background 0.2s;
  backdrop-filter: blur(10px);
`;
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'translateY(20px)';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseenter', () => {
  backToTop.style.borderColor = 'rgba(74,158,255,0.7)';
  backToTop.style.background  = 'rgba(74,158,255,0.15)';
  cursorOutline && cursorOutline.classList.add('cursor-hover');
});

backToTop.addEventListener('mouseleave', () => {
  backToTop.style.borderColor = '';
  backToTop.style.background  = '';
  cursorOutline && cursorOutline.classList.remove('cursor-hover');
});

const yearEl = document.querySelector('.footer-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}