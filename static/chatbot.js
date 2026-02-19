document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar Scroll Effect ──────────────────────────────
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── Mobile Menu Toggle ────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navLinks.classList.toggle('mobile');

        const spans = menuToggle.querySelectorAll('span');
        const isOpen = navLinks.classList.contains('open');
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none';
        spans[1].style.opacity  = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
    });

    // ── Smooth Scrolling ──────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                navLinks.classList.remove('open');
            }
        });
    });

    // ── Reveal on Scroll ──────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Active Nav on Scroll ──────────────────────────────
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) a.classList.add('active');
        });
    });

    // ── Hero Animations ───────────────────────────────────
    // ✅ FIXED: Removed the broken mid-line split; each element animates cleanly
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroPara  = document.querySelector('.hero-content p');
        const heroBtn   = document.querySelector('.cta-button');

        if (heroTitle) {
            heroTitle.style.cssText += 'opacity:1; transform:translateY(0); transition:all 1s ease-out;';
        }
        if (heroPara) {
            setTimeout(() => {
                heroPara.style.cssText += 'opacity:1; transform:translateY(0); transition:all 1s ease-out;';
            }, 300);
        }
        if (heroBtn) {
            setTimeout(() => {
                heroBtn.style.cssText += 'opacity:1; transform:translateY(0); transition:all 1s ease-out;';
            }, 600);
        }
    }, 100);

    // ── Contact Form ──────────────────────────────────────
    // ✅ FIXED: Was "rm.addEventListener" — now correctly "contactForm.addEventListener"
    // ✅ FIXED: Wrapped in proper if-block
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !message) {
                alert("Name and message are required.");
                return;
            }

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch("/save-lead", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    btn.innerText = "✓ Message Sent!";
                    btn.style.background = "#00ff88";
                    btn.style.color = "#000";
                    contactForm.reset();
                } else {
                    throw new Error(result.message || "Failed to send.");
                }

            } catch (error) {
                console.error("Submit error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = "";
                    btn.style.color = "";
                }, 3000);
            }
        });
    }

    // ── FAQ Accordion ─────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ── Stats Counter Animation ───────────────────────────
    const animateCounter = (el) => {
        const targetStr = el.innerText;
        const targetNum = parseInt(targetStr);
        const suffix    = targetStr.replace(/[0-9]/g, '');
        let count       = 0;
        const increment = targetNum / Math.round(2000 / (1000 / 60));

        const update = () => {
            count += increment;
            if (count < targetNum) {
                el.innerText = Math.floor(count) + suffix;
                requestAnimationFrame(update);
            } else {
                el.innerText = targetNum + suffix;
            }
        };
        update();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target.querySelector('h3');
                if (counter) animateCounter(counter);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));

    // ── Chatbot: Handle action & lead flags from Flask ────
    // ✅ NEW: Handles "action" and "lead" response flags your Flask sends
    window.handleChatResponse = (data) => {
        if (data.action === "contact") {
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }
        if (data.action === "team") {
            document.querySelector('#team')?.scrollIntoView({ behavior: 'smooth' });
        }
        if (data.lead === true) {
            // Scroll to contact form for lead capture
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }
    };
});