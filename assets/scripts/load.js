/* ── Resolve the relative path to the site root ── */
function getRootPath() {
    // pathname e.g. "/html/projects.html" → depth 1 → "../"
    const parts = window.location.pathname.split('/').filter(Boolean);
    const depth = parts.length - 1; // -1 because the last segment is the .html file
    return depth > 0 ? '../'.repeat(depth) : './';
}

/* ── Component definitions: target element id + HTML fragment to fetch ── */
function getComponents(root) {
    return [
        { id: 'section-hero',      file: `${root}sections/index_hero.html` },
        { id: 'section-about',     file: `${root}sections/index_about.html` },
        { id: 'section-stack',     file: `${root}sections/index_skills.html` },
        { id: 'section-education', file: `${root}sections/index_exp_ed.html` },
        { id: 'section-projects-hero',  file: `${root}sections/projects_hero.html` },
        { id: 'section-projects-list',  file: `${root}sections/projects_list.html` },
        { id: 'section-contact',   file: `${root}sections/contact.html` },
    ];
}

/* ── Fetches and injects each component, then signals completion ── */
async function loadComponents() {
    const root = getRootPath();

    for (const component of getComponents(root)) {
        const element = document.getElementById(component.id);
        if (!element) continue; // skip if this page doesn't have that section

        try {
            const response = await fetch(component.file);
            if (!response.ok) throw new Error(`Could not fetch ${component.file}`);
            element.innerHTML = await response.text();
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    // Lets other scripts (e.g. main.js) know the DOM is ready to be wired up
    document.dispatchEvent(new Event('componentsLoaded'));
}

loadComponents();