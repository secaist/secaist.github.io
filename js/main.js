// SECA Website JavaScript
// Handles animations, form submissions, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initNavbarScrollEffect();
    initAnimations();
    initContactForm();
    initPricingCards();
    initStatCounters();
    initWasteCounters();
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse);
                    bootstrapCollapse.hide();
                }
            }
        });
    });
}

/**
 * Initialize navbar scroll effect
 */
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove backdrop blur based on scroll position
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize scroll animations
 */
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
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.problem-card, .feature-card, .pricing-card, .solution-content, .tech-item'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize contact form handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Add form values from individual inputs
            formObject.firstName = document.getElementById('firstName').value;
            formObject.lastName = document.getElementById('lastName').value;
            formObject.email = document.getElementById('email').value;
            formObject.phone = document.getElementById('phone').value;
            formObject.company = document.getElementById('company').value;
            formObject.farmSize = document.getElementById('farmSize').value;
            formObject.plan = document.getElementById('plan').value;
            formObject.message = document.getElementById('message').value;
            
            // Validate required fields
            if (!formObject.firstName || !formObject.lastName || !formObject.email) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(formObject.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitContactForm(formObject);
        });
    }
}

/**
 * Submit contact form (simulate API call)
 */
function submitContactForm(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Show success message
        showNotification('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Log form data (in real app, this would be sent to server)
        console.log('Contact form submitted:', formData);
        
        // Track conversion (placeholder for analytics)
        trackFormSubmission(formData.plan || 'general');
        
    }, 2000);
}

/**
 * Initialize pricing card interactions
 */
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('pricing-featured')) {
                this.style.transform = 'translateY(-10px) scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

/**
 * Initialize stat counters animation
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animate stat number counting
 */
function animateStatNumber(element) {
    const finalText = element.textContent;
    const hasPercent = finalText.includes('%');
    const hasKm = finalText.includes('km');
    const hasSlash = finalText.includes('/');
    
    if (hasPercent) {
        const finalNumber = parseInt(finalText);
        animateNumber(element, 0, finalNumber, 2000, (num) => num + '%');
    } else if (hasKm) {
        const finalNumber = parseInt(finalText);
        animateNumber(element, 0, finalNumber, 2000, (num) => num + 'km');
    } else if (hasSlash) {
        // For "24/7", just animate to final state
        element.textContent = '0/0';
        setTimeout(() => {
            element.textContent = finalText;
        }, 1000);
    }
}

/**
 * Animate number counting
 */
function animateNumber(element, start, end, duration, formatter) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = formatter(currentNumber);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Track form submission for analytics
 */
function trackFormSubmission(plan) {
    // Placeholder for analytics tracking
    console.log(`Form submission tracked: ${plan} plan inquiry`);
    
    // In a real application, you would integrate with Google Analytics, Mixpanel, etc.
    // Example:
    // gtag('event', 'form_submit', {
    //     event_category: 'engagement',
    //     event_label: plan,
    //     value: plan === 'intelligence' ? 2 : 1
    // });
}

/**
 * Handle scroll-triggered animations
 */
function handleScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

/**
 * Initialize lazy loading for images
 */
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

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Recalculate any layout-dependent features
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Reset any transform that might cause issues on resize
        navbar.style.transform = 'translateY(0)';
    }
});

/**
 * Handle keyboard navigation
 */
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse);
            bootstrapCollapse.hide();
        }
    }
});

/**
 * Performance optimization: Debounce scroll events
 */
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

/**
 * Initialize waste counter animations
 */
function initWasteCounters() {
    const wasteCounters = document.querySelectorAll('.counter-number[data-count]');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateWasteCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    wasteCounters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animate waste counter numbers
 */
function animateWasteCounter(element) {
    const finalValue = parseFloat(element.dataset.count);
    const duration = 3000; // 3 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for dramatic effect
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = finalValue * easeOutExpo;
        
        if (finalValue >= 100) {
            element.textContent = Math.round(currentValue);
        } else {
            element.textContent = currentValue.toFixed(1);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Add debounced scroll listener for performance
window.addEventListener('scroll', debounce(handleScrollAnimations, 10));
