document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navLinks.classList.toggle('mobile');

        // Animate Hamburger
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 6px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navLinks.classList.remove('open');
            }
        });
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Hero Animations on Load
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroPara = document.querySelector('.hero-content p');
        const heroBtn = document.querySelector('.cta-button');

        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
            heroTitle.style.transition = 'all 1s ease-out';
        }
        if (heroPara) {
            setTimeout(() => {
                heroPara.style.opacity = '1';
                heroPara.style.transform = 'translateY(0)';
                heroPara.style.transition = 'all 1s ease-out';
            }, 300);
        }
        if (heroBtn) {
            setTimeout(() => {
                heroBtn.style.opacity = '1';
                heroBtn.style.transform = 'translateY(0)';
                heroBtn.style.transition = 'all 1s ease-out';
            }, 600);
        }
    }, 100);

    // Form Validation & Success Message
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;

            // Basic animation for button
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Success!';
                btn.style.background = '#00ff88';
                btn.style.color = '#000';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-card h3');
    const animateCounter = (el) => {
        const targetStr = el.innerText;
        const targetNum = parseInt(targetStr);
        const suffix = targetStr.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        const increment = targetNum / totalFrames;

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

    // 3D Tilt Effect for Testimonial Cards
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Cinematic Map Parallax Effect
    const mapHub = document.getElementById('map-hub');
    const mapInner = document.querySelector('.map-inner');
    const mapPins = document.querySelectorAll('.map-pin');

    if (mapHub && mapInner) {
        mapHub.addEventListener('mousemove', (e) => {
            const rect = mapHub.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) / 30;
            const moveY = (y - centerY) / 30;

            // Subtle rotate for the background container
            mapInner.style.transform = `rotateY(${moveX / 2}deg) rotateX(${-moveY / 2}deg)`;

            // Opposite move for pins to create parallax depth
            mapPins.forEach(pin => {
                pin.style.transform = `translate(-50%, -50%) translateZ(80px) translateX(${-moveX}px) translateY(${-moveY}px)`;
            });
        });

        mapHub.addEventListener('mouseleave', () => {
            mapInner.style.transform = `rotateY(0deg) rotateX(0deg)`;
            mapPins.forEach(pin => {
                pin.style.transform = `translate(-50%, -50%) translateZ(80px) translateX(0) translateY(0)`;
            });
        });
    }

    // Holographic Contact Glow Effect
    const contactContainer = document.querySelector('.holographic-container');
    if (contactContainer) {
        contactContainer.addEventListener('mousemove', (e) => {
            const rect = contactContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            contactContainer.style.setProperty('--x', `${x}px`);
            contactContainer.style.setProperty('--y', `${y}px`);
        });
    }

    // --- NEXUS INTERFACE: THE SINGULARITY ---
    const canvas = document.getElementById('nexus-singularity');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 400;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update(mouseX, mouseY) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = Math.max(0, (200 - distance) / 200);

                this.x += this.speedX + dx * force * 0.02;
                this.y += this.speedY + dy * force * 0.02;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        animate();
    }

    // --- NEURAL CONNECTIVITY LINES ---
    const svg = document.querySelector('.nexus-neural-lines');
    function drawNeuralLines() {
        if (!svg) return;
        svg.innerHTML = ''; // Clear lines

        const totems = document.querySelectorAll('.nexus-totem');
        const form = document.querySelector('.aether-glass');
        if (!form) return;

        const formRect = form.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        totems.forEach(totem => {
            const totemRect = totem.getBoundingClientRect();

            const startX = (totemRect.right - svgRect.left);
            const startY = (totemRect.top + totemRect.height / 2 - svgRect.top);
            const endX = (formRect.left - svgRect.left);
            const endY = (formRect.top + formRect.height / 2 - svgRect.top);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const cp1x = startX + (endX - startX) * 0.5;
            const cp2x = startX + (endX - startX) * 0.5;

            const d = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;

            path.setAttribute('d', d);
            path.setAttribute('stroke', 'rgba(0, 242, 255, 0.15)');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('fill', 'none');
            path.classList.add('neural-path');
            svg.appendChild(path);
        });
    }

    window.addEventListener('resize', drawNeuralLines);
    window.addEventListener('scroll', drawNeuralLines);
    setTimeout(drawNeuralLines, 1000); // Initial draw delay for layouts

    // --- AETHER FORM BOX MOUSE TRACKING ---
    const aetherFormBox = document.querySelector('.aether-form-box');
    if (aetherFormBox) {
        aetherFormBox.addEventListener('mousemove', (e) => {
            const rect = aetherFormBox.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            aetherFormBox.style.setProperty('--mouse-x', `${x}%`);
            aetherFormBox.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // --- DATA RIPPLE FORM FEEDBACK ---
    const nexusForm = document.getElementById('nexusForm');
    if (nexusForm) {
        const inputs = nexusForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const lines = document.querySelectorAll('.neural-path');
                lines.forEach(line => {
                    line.style.stroke = 'rgba(0, 242, 255, 0.6)';
                    line.style.strokeWidth = '2';
                    setTimeout(() => {
                        line.style.stroke = 'rgba(0, 242, 255, 0.15)';
                        line.style.strokeWidth = '1';
                    }, 300);
                });
            });
        });

        nexusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('nexusSubmit');
            const originalText = btn.querySelector('.submit-text').innerText;

            btn.querySelector('.submit-text').innerText = 'SYNCING WITH NEXUS...';
            btn.style.background = 'var(--primary-color)';

            setTimeout(() => {
                btn.querySelector('.submit-text').innerText = 'TRANSMISSION SUCCESSFUL';
                nexusForm.reset();
                setTimeout(() => {
                    btn.querySelector('.submit-text').innerText = originalText;
                    btn.style.background = '#fff';
                }, 3000);
            }, 2000);
        });
    }

    // Back to Top Logic
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
