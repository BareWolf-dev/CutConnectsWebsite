document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
            if(mobileNav.classList.contains('is-open')) {
                mobileNavToggle.textContent = '✕';
            } else {
                mobileNavToggle.textContent = '☰';
            }
        });
    }

    // 2. Mouse Move "Spotlight" Effect
    const glassElements = document.querySelectorAll('.feature-card, .glass-panel, .app-card');
    
    document.addEventListener('mousemove', (e) => {
        glassElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only update if mouse is near the card
            if (x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100) {
                 el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, rgba(20, 20, 20, 0.6) 100%)`;
            } else {
                el.style.background = `linear-gradient(145deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)`;
            }
        });
    });
});