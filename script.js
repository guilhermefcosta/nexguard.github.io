/* ============================================
   NEXGUARD — script.js
   ============================================ */

// ── Fade-in on page load ──────────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ── Smooth scrolling ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Navbar scroll effect ─────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
        navbar.style.borderBottomColor = 'rgba(51,65,85,0.8)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottomColor = 'var(--border)';
    }
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const open = navLinks.style.display === 'flex';
        if (open) {
            navLinks.style.display = 'none';
            navToggle.classList.remove('open');
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '64px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(10,15,30,0.98)';
            navLinks.style.padding = '1.5rem 1.5rem';
            navLinks.style.gap = '1.25rem';
            navLinks.style.borderBottom = '1px solid var(--border)';
            navLinks.style.zIndex = '999';
            navToggle.classList.add('open');
        }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.style.display = 'none';
            navToggle.classList.remove('open');
        });
    });
}

// ── Active nav link highlight ─────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + current && !a.classList.contains('nav-cta')) {
            a.style.color = 'var(--text)';
        }
    });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── Intersection Observer helper ──────────────
function observe(selector, options = {}) {
    const defaults = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
    const opts = { ...defaults, ...options };
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, opts);
    document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

// ── Generic card animations ───────────────────
function prepareCards(selector, stagger = 120) {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity 0.55s ease ${i * stagger}ms, transform 0.55s ease ${i * stagger}ms`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(selector).forEach(el => io.observe(el));
}

prepareCards('.service-card', 100);
prepareCards('.risk-card', 80);
prepareCards('.feature-item', 100);
prepareCards('.authority-card', 60);
prepareCards('.faq-item', 70);

// ── Pentest flow step animations ─────────────
observe('.flow-step', { threshold: 0.15 });

// ── Stats counter animation ───────────────────
function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number[data-target]').forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    animateCounter(el, target);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
}

// ── FAQ keyboard accessibility ────────────────
document.querySelectorAll('.faq-item summary').forEach(summary => {
    summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            summary.click();
        }
    });
});

// ── Hero parallax (subtle) ────────────────────
const heroBg = document.querySelector('.hero-background');
if (heroBg) {
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
    }, { passive: true });
}

// ── Carousel pause on hover (CSS handles it,
//    JS adds touch support) ────────────────────
const track = document.getElementById('carouselTrack');
if (track) {
    track.addEventListener('touchstart', () => {
        track.style.animationPlayState = 'paused';
    }, { passive: true });
    track.addEventListener('touchend', () => {
        track.style.animationPlayState = 'running';
    }, { passive: true });
}

// ── Service card glow on hover ────────────────
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59,130,246,0.06), var(--surface) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

// ── Section header animations ─────────────────
document.querySelectorAll('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(16px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    io.observe(header);
});

// ── CTA section entrance ──────────────────────
const ctaContent = document.querySelector('.cta-content');
if (ctaContent) {
    ctaContent.style.opacity = '0';
    ctaContent.style.transform = 'translateY(24px)';
    ctaContent.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    io.observe(ctaContent);
}

console.log('%c🛡️ NexGuard', 'color:#3b82f6;font-size:1.4rem;font-weight:bold;font-family:monospace');
console.log('%cSecurity first.', 'color:#94a3b8;font-size:0.9rem;font-family:monospace');
