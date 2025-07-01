document.addEventListener('DOMContentLoaded', () => {
    // --- App Card Reveal Effect ---
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-active');
        });
    });

    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            // Toggle the 'is-active' class on the button to change the hamburger icon
            mobileNavToggle.classList.toggle('is-active');
            // Toggle the 'is-open' class on the mobile navigation menu
            mobileNav.classList.toggle('is-open');
        });

        // Optional: Close the mobile menu if a link is clicked
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('is-active');
                mobileNav.classList.remove('is-open');
            });
        });
    }
});