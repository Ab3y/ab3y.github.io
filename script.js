/* ============================
   Mobile Nav Toggle
   ============================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

/* ============================
   Active Nav Highlight on Scroll
   ============================ */
const sections = document.querySelectorAll('.section, .hero');
const navItems = document.querySelectorAll('.nav-links a');

function highlightNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

/* ============================
   Staggered Scroll-in Animations
   ============================ */
function initFadeIn() {
  // Section titles slide in from left
  document.querySelectorAll('.section-title').forEach(el => el.classList.add('fade-in-left'));

  // About text fades in from left, stats from right
  document.querySelectorAll('.about-text').forEach(el => el.classList.add('fade-in-left'));
  document.querySelectorAll('.about-stats').forEach(el => el.classList.add('fade-in-right'));

  // Experience cards get staggered fade-in
  document.querySelectorAll('.exp-card').forEach((el, i) => {
    el.classList.add('fade-in-scale', `stagger-${i + 1}`);
  });

  // Stat cards stagger
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.classList.add('fade-in', `stagger-${i + 1}`);
  });

  // Interest tags stagger
  document.querySelectorAll('.interest-tag').forEach((el, i) => {
    el.classList.add('fade-in', `stagger-${i + 1}`);
  });

  // Connect elements
  document.querySelectorAll('.connect-subtitle').forEach(el => el.classList.add('fade-in'));
  document.querySelectorAll('.connect-card').forEach((el, i) => {
    el.classList.add('fade-in-scale', `stagger-${i + 1}`);
  });

  const allAnimated = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  allAnimated.forEach(el => observer.observe(el));
}

initFadeIn();

/* ============================
   Stat Counter Animation
   ============================ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            el.textContent = current;
          }, 30);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

animateCounters();

/* ============================
   Typewriter Effect
   ============================ */
(() => {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Senior Cloud Solutions Architect',
    'Cloud & AI Applications',
    'Financial Services',
    'GitHub Copilot Adoption Lead',
    'AI Agent Builder'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseEnd = 0;

  function tick() {
    const phrase = phrases[phraseIdx];
    const now = Date.now();

    if (now < pauseEnd) {
      requestAnimationFrame(tick);
      return;
    }

    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        pauseEnd = now + 2000;
      }
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = deleting ? 30 : 60;
    setTimeout(() => requestAnimationFrame(tick), speed);
  }

  tick();
})();

/* ============================
   Particle / Constellation Background
   ============================ */
(() => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse;
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 140;
  const MOUSE_DIST = 180;

  mouse = { x: -9999, y: -9999 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.2;
          ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Mouse connection
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_DIST) {
        const alpha = (1 - mDist / MOUSE_DIST) * 0.5;
        ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 255, ${p.alpha})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Gentle mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_DIST && mDist > 0) {
        p.vx += (mdx / mDist) * 0.02;
        p.vy += (mdy / mDist) * 0.02;
      }

      // Dampen velocity
      p.vx *= 0.999;
      p.vy *= 0.999;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  createParticles();
  loop();
})();

/* ============================
   3D Card Tilt Effect
   ============================ */
(() => {
  const cards = document.querySelectorAll('.exp-card, .stat-card, .connect-card');

  cards.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

/* ============================
   Parallax Scrolling
   ============================ */
(() => {
  const hero = document.getElementById('hero');
  const heroContent = hero ? hero.querySelector('.hero-content') : null;
  const heroGlow = hero ? hero.querySelector('.hero-glow') : null;

  function onScroll() {
    const scrollY = window.scrollY;

    // Hero parallax: content moves up slower, glow shifts
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.7));
    }
    if (heroGlow && scrollY < window.innerHeight) {
      heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px)) scale(${1 + scrollY * 0.0005})`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
