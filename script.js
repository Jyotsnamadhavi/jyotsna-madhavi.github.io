// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initBackToTop();
    initAnimations();
    initContactForm();
    initTypingEffect();
    initScrollEffects();
    initSkillTags();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .blog-card, .experience-card, .skill-category');
    animateElements.forEach(el => observer.observe(el));
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 2000);
        });
    }
}

// Typing effect for hero section - SPEEDED UP
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // Reduced from 100ms to 30ms for faster typing
        }
    };

    // Start typing effect after a short delay
    setTimeout(typeWriter, 200); // Reduced from 500ms to 200ms
}

// Scroll effects - REMOVED PARALLAX
function initScrollEffects() {
    // Progress bar for reading
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Skill tags click functionality
function initSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Toggle clicked state
            this.classList.toggle('clicked');
            
            // Optional: Track which skills are clicked
            const skillName = this.textContent;
            trackEvent('skill_clicked', {
                skill: skillName,
                category: this.closest('.skill-category')?.querySelector('h3')?.textContent || 'Unknown'
            });
            
            // Optional: Show notification
            if (this.classList.contains('clicked')) {
                showNotification(`Skill highlighted: ${skillName}`, 'info');
            }
        });
    });
}

// Experience toggle functionality
function toggleExperience(button) {
    const experienceCard = button.closest('.experience-card');
    const details = experienceCard.querySelector('.experience-details');
    const isVisible = details.style.display !== 'none';
    
    if (isVisible) {
        details.style.display = 'none';
        button.textContent = 'Read More';
    } else {
        details.style.display = 'block';
        button.textContent = 'Read Less';
    }
}

// Load more projects functionality
function loadMoreProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    const button = document.querySelector('.projects-cta .btn');
    
    // Simulate loading more projects
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        // Add more project cards here
        const newProject = `
            <div class="project-card">
                <div class="project-image">
                    <img src="project3.jpg" alt="Additional Project">
                </div>
                <div class="project-content">
                    <h3>Additional Project</h3>
                    <p>
                        Description of an additional project showcasing different 
                        skills and technologies.
                    </p>
                    <div class="project-tech">
                        <span class="tech">React</span>
                        <span class="tech">TypeScript</span>
                        <span class="tech">Node.js</span>
                    </div>
                    <div class="project-links">
                        <a href="#" class="project-link">Live Demo</a>
                        <a href="#" class="project-link">GitHub</a>
                    </div>
                </div>
            </div>
        `;
        
        projectsGrid.insertAdjacentHTML('beforeend', newProject);
        button.textContent = 'Show More Projects';
        button.disabled = false;
        
        // Re-observe new elements for animations
        const newCards = projectsGrid.querySelectorAll('.project-card:not(.fade-in-up)');
        newCards.forEach(card => {
            card.classList.add('fade-in-up');
        });
    }, 1000);
}

// Load more blog posts functionality
let currentBlogPage = 1;
const blogPostsPerPage = 5;

function loadMoreBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    const button = document.querySelector('.blog-pagination .btn');
    
    // Simulate loading more blog posts
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        // Add more blog posts here
        const newBlogPosts = [
            {
                date: 'Dec 15, 2024',
                category: 'Microservices',
                title: 'Microservices Communication Patterns',
                description: 'Exploring different communication patterns between microservices and their trade-offs.'
            },
            {
                date: 'Dec 10, 2024',
                category: 'Security',
                title: 'API Security Best Practices',
                description: 'Essential security practices for building and maintaining secure APIs.'
            },
            {
                date: 'Dec 5, 2024',
                category: 'Monitoring',
                title: 'Observability in Distributed Systems',
                description: 'Understanding observability patterns and tools for monitoring distributed systems.'
            },
            {
                date: 'Nov 30, 2024',
                category: 'Database',
                title: 'Database Sharding Strategies',
                description: 'Different approaches to database sharding and when to use each strategy.'
            },
            {
                date: 'Nov 25, 2024',
                category: 'Cloud',
                title: 'Multi-Cloud Architecture Patterns',
                description: 'Designing applications that can run across multiple cloud providers.'
            }
        ];
        
        newBlogPosts.forEach(post => {
            const newPost = `
                <article class="blog-card">
                    <div class="blog-meta">
                        <span class="blog-date">${post.date}</span>
                        <span class="blog-category">${post.category}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <a href="#" class="read-more">Read More →</a>
                </article>
            `;
            blogGrid.insertAdjacentHTML('beforeend', newPost);
        });
        
        currentBlogPage++;
        button.textContent = 'Load More Posts';
        button.disabled = false;
        
        // Re-observe new elements for animations
        const newPosts = blogGrid.querySelectorAll('.blog-card:not(.fade-in-up)');
        newPosts.forEach(post => {
            post.classList.add('fade-in-up');
        });
        
        // Hide button if no more posts
        if (currentBlogPage >= 3) { // Assuming 3 pages total
            button.style.display = 'none';
        }
    }, 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 600;
        z-index: 1002;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (example)
function trackEvent(eventName, properties = {}) {
    // Replace with your analytics service
    console.log('Event tracked:', eventName, properties);
}

// Track page views
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title
    });
});

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'contact-form') {
        trackEvent('form_submit', {
            form: 'contact',
            page: window.location.pathname
        });
    }
});

// Track link clicks
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href) {
        trackEvent('link_click', {
            url: e.target.href,
            text: e.target.textContent
        });
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load performance
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
        trackEvent('page_load_performance', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
        });
    }
});

// Error tracking
window.addEventListener('error', function(e) {
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Export functions for potential use in other scripts
window.PortfolioUtils = {
    showNotification,
    trackEvent,
    debounce,
    throttle,
    toggleExperience,
    loadMoreProjects,
    loadMoreBlogPosts
}; 