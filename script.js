/* ============================================
   Orion Web – Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Starfield Canvas ===
    initStarfield();

    // === Navbar ===
    initNavbar();

    // === Mobile Menu ===
    initMobileMenu();

    // === Scroll Reveal ===
    initScrollReveal();

    // === Counter Animation ===
    initCounters();

    // === Contact Form ===
    initContactForm();

    // === Smooth Scroll ===
    initSmoothScroll();
});

// ─────────────────────────────────────
// Starfield Background + Shooting Stars
// ─────────────────────────────────────
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let animationId;
    let lastShootingStarTime = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 8000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.3,
                opacity: Math.random() * 0.6 + 0.1,
                speed: Math.random() * 0.0008 + 0.0002,
                phase: Math.random() * Math.PI * 2,
                isGold: Math.random() < 0.15,
            });
        }
    }

    function spawnShootingStar() {
        // Random start along top or right edge
        const fromTop = Math.random() < 0.7;
        const x = fromTop ? Math.random() * canvas.width * 0.8 : canvas.width * (0.6 + Math.random() * 0.4);
        const y = fromTop ? -10 : Math.random() * canvas.height * 0.3;

        // Angle: roughly diagonal down-left or down-right
        const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4); // 30°–75°

        const speed = 6 + Math.random() * 6; // px per frame
        const tailLength = 60 + Math.random() * 80;

        shootingStars.push({
            x, y,
            vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
            vy: Math.sin(angle) * speed,
            tailLength,
            life: 1.0, // fades from 1 to 0
            decay: 0.008 + Math.random() * 0.008,
            size: 1.5 + Math.random() * 1,
        });
    }

    function drawShootingStars() {
        shootingStars.forEach(ss => {
            // Move
            ss.x += ss.vx;
            ss.y += ss.vy;
            ss.life -= ss.decay;

            if (ss.life <= 0) return;

            const alpha = ss.life;

            // Draw glowing trail
            const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.tailLength;
            const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.tailLength;

            const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(212, 175, 55, ${alpha * 0.9})`);
            gradient.addColorStop(0.3, `rgba(212, 175, 55, ${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(212, 175, 55, 0)`);

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = ss.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw bright head
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, ss.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 240, 200, ${alpha * 0.9})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = `rgba(212, 175, 55, ${alpha * 0.6})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Remove dead shooting stars
        shootingStars = shootingStars.filter(ss => ss.life > 0);
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw static stars
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.speed + star.phase) * 0.3 + 0.7;
            const alpha = star.opacity * twinkle;
            if (star.isGold) {
                ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
            } else {
                ctx.fillStyle = `rgba(168, 181, 176, ${alpha * 0.5})`;
                ctx.shadowBlur = 0;
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Spawn shooting stars occasionally (every 3–8 seconds)
        if (time - lastShootingStarTime > (3000 + Math.random() * 5000)) {
            spawnShootingStar();
            lastShootingStarTime = time;
            // Occasionally spawn a second one close behind for a dramatic effect
            if (Math.random() < 0.25) {
                setTimeout(() => spawnShootingStar(), 300 + Math.random() * 500);
            }
        }

        // Draw shooting stars
        drawShootingStars();

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    animationId = requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

// ─────────────────────────────────────
// Navbar Scroll Effect
// ─────────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// ─────────────────────────────────────
// Mobile Menu Toggle
// ─────────────────────────────────────
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
        }
    });
}

// ─────────────────────────────────────
// Scroll Reveal Animation
// ─────────────────────────────────────
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation within the same section
                const parent = entry.target.closest('.services-grid, .portfolio-grid, .pricing-grid, .about-grid, .contact-grid');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal');
                    const idx = Array.from(siblings).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, idx * 100);
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────
// Counter Animation (About section)
// ─────────────────────────────────────
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(target * eased);
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ─────────────────────────────────────
// Contact Form
// ─────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Skickar...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            success.classList.add('visible');
            form.reset();

            setTimeout(() => {
                success.classList.remove('visible');
            }, 5000);
        }, 1500);
    });
}

// ─────────────────────────────────────
// Smooth Scroll
// ─────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
