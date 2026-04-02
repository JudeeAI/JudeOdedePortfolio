        document.addEventListener('DOMContentLoaded', () => {

            // 1. Navbar Scroll Behavior
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // 2. Smooth Scroll for Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if(targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if(mobileMenu.classList.contains('open')) {
                            toggleMenu();
                        }
                    }
                });
            });

            // 3. Active Nav Highlighting
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links .nav-link');
            
            const navObserver = new IntersectionObserver((entries) => {
                let current = '';
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        current = entry.target.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
            }, { threshold: 0.4 });
            
            sections.forEach(section => navObserver.observe(section));

            // 4. Scroll Reveal Animations
            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            
            revealElements.forEach(el => revealObserver.observe(el));

            // 5. Cursor Glow Effect (desktop only)
            const cursor = document.getElementById('cursor-glow');
            window.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 768 && cursor) {
                    cursor.style.left = `${e.clientX}px`;
                    cursor.style.top = `${e.clientY}px`;
                }
            });

            // 6. Stat Counter Animation
            const stats = document.querySelectorAll('.stat-num');
            let hasAnimatedStats = false;
            
            const easeOutQuart = (t) => 1 - (--t) * t * t * t;
            
            const animateStats = () => {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const suffix = stat.getAttribute('data-suffix') || '';
                    const duration = 1500;
                    let startTime = null;
                    
                    const updateCounter = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        const easedProgress = easeOutQuart(progress);
                        
                        stat.innerText = Math.floor(easedProgress * target) + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target + suffix;
                        }
                    };
                    requestAnimationFrame(updateCounter);
                });
            };

            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    animateStats();
                }
            }, { threshold: 0.5 });
            
            const statsContainer = document.querySelector('.hero-stats');
            if(statsContainer) statsObserver.observe(statsContainer);

            // 7. Mobile Menu Toggle
            const toggleBtn = document.getElementById('mobile-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            
            const toggleMenu = () => {
                toggleBtn.classList.toggle('open');
                mobileMenu.classList.toggle('open');
                document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
            };
            
            toggleBtn.addEventListener('click', toggleMenu);

            // 8. Scroll Indicator Hide
            const scrollIndicator = document.getElementById('scroll-indicator');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    scrollIndicator.classList.add('hidden');
                } else {
                    scrollIndicator.classList.remove('hidden');
                }
            });

            // 9. Form Validation & Submission
            const form = document.getElementById('contactForm');
            const formSuccess = document.getElementById('formSuccess');
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let isValid = true;
                
                // Validate Name
                const nameInput = document.getElementById('name');
                const nameGroup = document.getElementById('group-name');
                if (nameInput.value.trim().length < 3) {
                    nameGroup.classList.add('invalid');
                    isValid = false;
                } else {
                    nameGroup.classList.remove('invalid');
                }
                
                // Validate Email
                const emailInput = document.getElementById('email');
                const emailGroup = document.getElementById('group-email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailGroup.classList.add('invalid');
                    isValid = false;
                } else {
                    emailGroup.classList.remove('invalid');
                }
                
                // Validate Message
                const msgInput = document.getElementById('message');
                const msgGroup = document.getElementById('group-message');
                if (msgInput.value.trim().length < 10) {
                    msgGroup.classList.add('invalid');
                    isValid = false;
                } else {
                    msgGroup.classList.remove('invalid');
                }
                
                if (isValid) {
                    form.style.display = 'none';
                    formSuccess.classList.add('active');
                }
            });

            // Remove invalid class on input
            document.querySelectorAll('.form-control').forEach(input => {
                input.addEventListener('input', function() {
                    this.parentElement.classList.remove('invalid');
                });
            });

            // 10. Filter System for Projects
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filter = btn.getAttribute('data-filter');
                    
                    projectCards.forEach(card => {
                        // Reset animations
                        card.classList.remove('revealed');
                        card.style.transition = 'none';
                        
                        setTimeout(() => {
                            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                                card.classList.remove('hidden');
                                setTimeout(() => {
                                    card.style.transition = 'opacity var(--transition-slow), transform var(--transition-slow)';
                                    card.classList.add('revealed');
                                }, 50);
                            } else {
                                card.classList.add('hidden');
                            }
                        }, 10);
                    });
                });
            });

        });