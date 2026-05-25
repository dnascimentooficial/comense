/* =============================================
   COMENSE GROUP — Main JS
   ============================================= */

// --- Nav scroll ---
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- Active nav section ---
const navLinks = document.querySelectorAll('.nav__links a');
const sections = document.querySelectorAll('main section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px' });

sections.forEach(s => sectionObserver.observe(s));

// --- Custom cursor ring ---
if (!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches) {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring hidden';
  document.body.appendChild(ring);

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let mouseX = ringX;
  let mouseY = ringY;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) { visible = true; ring.classList.remove('hidden'); }
  });

  document.addEventListener('mouseleave', () => ring.classList.add('hidden'));
  document.addEventListener('mouseenter', () => ring.classList.remove('hidden'));

  // Lag ring follows mouse with lerp
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Expand ring on interactive elements
  document.querySelectorAll('a, button, input, textarea, .bento__card, .service-card, .benefit-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

// --- Mobile menu ---
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// --- Scroll reveal ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-60px 0px' });

document.querySelectorAll('.reveal, .reveal-x').forEach(el => observer.observe(el));

// --- Hero city parallax ---
const heroCityBg = document.querySelector('.hero__city-bg');
if (heroCityBg) {
  let rafId = null;

  const updateHeroParallax = () => {
    const scrollY = window.scrollY;
    // Image moves up slower than the scroll (0.35 of scroll speed)
    heroCityBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    rafId = null;
  };

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(updateHeroParallax);
  }, { passive: true });

  // Set initial position
  updateHeroParallax();
}

// --- FAQ accordion ---
document.querySelectorAll('.faq__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq__item');
    const answer = item.querySelector('.faq__answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq__item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq__answer').style.maxHeight = '0';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// --- Contact form ---
const form = document.querySelector('.contact__form-el');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.contact__submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    const data = {
      nome:        document.getElementById('contact-name').value,
      organizacao: document.getElementById('contact-org').value,
      email:       document.getElementById('contact-email').value,
      projeto:     document.getElementById('contact-project').value,
      mensagem:    document.getElementById('contact-message').value,
      _subject:    'Novo contato — Comense Group',
      _template:   'table'
    };

    // Show success immediately for a smooth UX; also send to server
    form.style.display = 'none';
    document.querySelector('.contact__success').classList.add('show');

    fetch('https://formsubmit.co/ajax/atendimento@comense.com.br', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(data)
    }).catch(() => {/* silent — message already shown */});
  });
}
