document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
            // Optional: Change icon from hamburger to X
            if(mobileNav.classList.contains('is-open')) {
                mobileNavToggle.textContent = '✕';
            } else {
                mobileNavToggle.textContent = '☰';
            }
        });
    }

    // 2. App Card Flip Effect (Download Page)
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-active');
        });
    });

    // 3. Mouse Move "Spotlight" Effect (Optional Visual Flair)
    const glassElements = document.querySelectorAll('.feature-card, .glass-panel, .app-card-inner');
    
    document.addEventListener('mousemove', (e) => {
        glassElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only update if mouse is near the card to save resources
            if (x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100) {
                 el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)`;
            } else {
                // Reset to default gradient if mouse moves away
                el.style.background = `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`;
            }
        });
    });
});