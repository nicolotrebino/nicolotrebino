/* ─────────────────────────────────────────
   1. NAV — add shadow/background on scroll
───────────────────────────────────────── */
function initNavScroll() {
    const nav = document.getElementById('nt-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}
/* ─────────────────────────────────────────
   2. HAMBURGER — mobile menu toggle
───────────────────────────────────────── */
function initHamburger() {
    const ham        = document.getElementById('nt-ham');
    const mobileMenu = document.getElementById('nt-mobile');
    if (!ham || !mobileMenu) return;
    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close the menu whenever any in-page or mobile-only link is clicked
    document.querySelectorAll('.mobile-anchor, .nt-mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
            ham.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    // Also close it if the user scrolls while it's open
    window.addEventListener('scroll', () => {
        if (mobileMenu.classList.contains('open')) {
            ham.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    }, { passive: true });
}
/* ─────────────────────────────────────────
   3. SMOOTH SCROLL — anchor links
───────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // offset to clear the fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}
/* ─────────────────────────────────────────
   4. SCROLL REVEAL — fade/slide in elements
      as they enter the viewport
───────────────────────────────────────── */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.02,
        rootMargin: '0px 0px 0px 0px'
    });
    reveals.forEach(el => observer.observe(el));

    // Safety net: if some elements are still hidden after the page has
    // settled (e.g. due to images loading late and shifting layout),
    // force-reveal anything already in or above the viewport.
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                const inOrAboveViewport = rect.top < window.innerHeight;
                if (inOrAboveViewport) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            });
        }, 300);
    });
}
/* ─────────────────────────────────────────
   5. TIMELINE — expand / collapse cards
───────────────────────────────────────── */
function initTimelineExpand() {
    document.querySelectorAll('[data-expandable]').forEach(card => {
        const btn   = card.querySelector('.tl-toggle');
        const panel = card.querySelector('.tl-expand');
        if (!btn || !panel) return;
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = panel.classList.contains('open');
            panel.classList.toggle('open', !isOpen);
            btn.classList.toggle('open', !isOpen);
        });
    });
}
/* ─────────────────────────────────────────
   6. ACTIVE NAV LINK — highlight current page
───────────────────────────────────────── */
function initActiveNavLink() {
    const currentPath = window.location.pathname; // e.g. "/html/projects.html"
    document.querySelectorAll('.nt-links a, .nt-mobile-menu a').forEach(a => {
        const href = a.getAttribute('href') || '';
        // Match against the link's absolute href
        if (href && href === currentPath) {
            a.classList.add('nav-active');
        }
    });
}
/* ─────────────────────────────────────────
   7. PROJECT FILTER — tag-based filtering
───────────────────────────────────────── */
function initProjectFilter() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return; // no project cards on this page, nothing to do

    const filterBtns   = document.querySelectorAll('.filter-btn');
    const noResults    = document.getElementById('no-results');
    const filterCount  = document.getElementById('filter-count');   // badge in filter bar
    const filterAnchor = document.getElementById('projects-top');
    const total        = cards.length;

    if (noResults) noResults.style.display = 'none';
    // Hide the filter-count badge initially (showing "All" = no need for extra count)
    if (filterCount) filterCount.style.display = 'none';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle the active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visible = 0;

            // Show/hide cards based on whether they match the selected tag
            cards.forEach(card => {
                const tags    = card.dataset.tags || '';
                const matches = filter === 'all' || tags.split(' ').includes(filter);
                card.classList.toggle('hidden', !matches);
                if (matches) visible++;
            });

            if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

            // Update the filter-count badge (hide it when "All" is selected)
            if (filterCount) {
                if (filter === 'all') {
                    filterCount.style.display = 'none';
                } else {
                    filterCount.textContent = visible + ' of ' + total;
                    filterCount.style.display = 'inline-flex';
                }
            }

            // Scroll back to the top of the project list after filtering
            if (filterAnchor) {
                filterAnchor.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
/* ─────────────────────────────────────────
   8. SKILLS COUNTER — auto-calculate totals
───────────────────────────────────────── */
function initSkillCounts() {
    // 1. Select all skill macro-categories
    const categories = document.querySelectorAll('.skills-category');

    // 2. Loop through each category
    categories.forEach(category => {
        // Find how many skill cards belong to this specific category
        const skillCards = category.querySelectorAll('.skill-card');
        const count = skillCards.length;

        // Find the <span> element that holds the count badge
        const countElement = category.querySelector('.skills-category-count');

        // If the element exists, update its text with the calculated count
        if (countElement) {
            countElement.textContent = count;
        }
    });
}
/* ─────────────────────────────────────────
   8. FAVICON
───────────────────────────────────────── */
function initFavicon() {
    const favicon = document.createElement('link');
    favicon.rel   = 'icon';
    favicon.href  = '../assets/favicon_nt.png';
    document.head.appendChild(favicon);
}
/* ─────────────────────────────────────────
   BOOT — favicon runs immediately; everything
   else waits for the components to be loaded
   (see componentsLoaded event in load.js)
───────────────────────────────────────── */
initFavicon();
document.addEventListener('componentsLoaded', () => {
    initNavScroll();
    initHamburger();
    initSmoothScroll();
    initScrollReveal();
    initTimelineExpand();
    initActiveNavLink();
    initProjectFilter();
    initSkillCounts();
});