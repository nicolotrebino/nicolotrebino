document.addEventListener("DOMContentLoaded", () => {
  // Determine which page we're on
  const currentPage = document.body.getAttribute('data-page') || 'index';

  // In-page section links (with #anchors), per page
  const pageSections = {
    'index': [
      { label: 'About', href: '#about' },
      { label: 'Skills', href: '#skills' },
      { label: 'Experience', href: '#experiences' },
      { label: 'Education', href: '#education' },
      { label: 'Contact', href: '#contact' }
    ],
    'projects': [
      { label: 'Projects', href: '#projects-hero' },
      { label: 'Contact', href: '#contact' }
    ],
    'wip': [] // no in-page sections on this page
  };

  // Top-level pages of the site
  const allPages = [
    { id: 'index', label: 'Home', href: '/index.html' },
    { id: 'projects', label: 'Projects', href: '/projects.html' },
    { id: 'wip', label: 'Blog', href: '/wip.html' }
  ];

  // Section links for the current page (desktop <li>, mobile <a>)
  const currentSections = pageSections[currentPage] || [];

  const desktopSectionLinks = currentSections
    .map(sec => `<li><a href="${sec.href}">${sec.label}</a></li>`)
    .join('');

  const mobileSectionLinks = currentSections
    .map(sec => `<a href="${sec.href}" class="mobile-anchor">${sec.label}</a>`)
    .join('');

  // Links to other pages, excluding the one currently active
  const otherPages = allPages.filter(page => page.id !== currentPage);

  const desktopPageLinks = otherPages
    .map(page => `<li><a href="${page.href}" class="btn-page">${page.label}</a></li>`)
    .join('');

  const mobilePageLinks = otherPages
    .map(page => `<a href="${page.href}" class="mobile-page-link">${page.label}</a>`)
    .join('');

  // CV download button — always visible in every page
  const cvButtonDesktop = `<li><a href="/assets/cv/Nicolo_Trebino_CV.pdf" target="_blank" rel="noopener" class="btn-cv-nav" aria-label="Download CV"><i class="fa-solid fa-file-arrow-down"></i><span>CV</span></a></li>`;
  const cvButtonMobile  = `<a href="/assets/cv/Nicolo_Trebino_CV.pdf" target="_blank" rel="noopener" class="btn-cv-mobile"><i class="fa-solid fa-file-arrow-down"></i> Download CV</a>`;

  // Assemble the final navbar markup
  const navbarHTML = `
    <nav class="nt-nav" id="nt-nav">
      <div class="inner">
        <a href="${currentPage === 'index' ? '#hero' : '/index.html'}" class="nt-logo"><span>root@NT:~#</span></a>

        <ul class="nt-links">
          ${desktopSectionLinks}
          ${desktopSectionLinks && desktopPageLinks ? '<li class="nt-sep" aria-hidden="true"></li>' : ''}
          ${desktopPageLinks}
          <li class="nt-sep" aria-hidden="true"></li>
          ${cvButtonDesktop}
        </ul>

        <button class="nt-hamburger" id="nt-ham" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div class="nt-mobile-menu" id="nt-mobile">
      ${mobileSectionLinks}
      ${mobileSectionLinks && mobilePageLinks ? '<div class="nt-mobile-sep" aria-hidden="true"></div>' : ''}
      ${mobilePageLinks}
      <div class="nt-mobile-sep" aria-hidden="true"></div>
      ${cvButtonMobile}
    </div>
  `;

  // Inject the navbar into its container
  document.getElementById('nav').innerHTML = navbarHTML;
});