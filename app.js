// File: app.js
// FUNCTION DEFINITIONS
// Add projects to the page (uses the PROJECTS array from project.js)
function renderProjectList() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  list.innerHTML = PROJECTS.map(p => `
    <figure class="project-grid">
      <a 
        href="${p.type === 'redirect' ? p.link  : '#/' + p.key}" 
        class="project-tile"
        ${p.type === 'redirect' ? 'target="_blank" rel="noopener noreferrer"' : ''}
      >
        <img class="project-img" src="${p.img}" alt="${p.title} screenshot"/>
        <figcaption class="img-caption">${p.summary}</figcaption>
      </a>
    </figure>
  `).join('');
}

// Highlight the active navbar link
function highlightActiveSection() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hash = window.location.hash;
  // Keep the previous behavior if on the homepage
  if (!hash || !hash.startsWith('#/')) {
    let currentActive = null;
    for (const link of navLinks) {
      const targetId = (link.getAttribute('href') || '').replace(/^#/, '');
      // console.log(`Checking link: ${link.getAttribute('href')}, targetId: ${targetId}`);
      if (!targetId) continue;
      const section = document.getElementById(targetId);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
        currentActive = link;
      }
      link.classList.remove('active');
    }
    if (!currentActive && navLinks[0]) currentActive = navLinks[0];
    if (currentActive) currentActive.classList.add('active');
    return;
  }
  
  // For the project detail page
  // link.href: #/tsa  -> id="project-detail"
  // link.href: #/tsa/contact -> id="contact"
  let projectActive = null;
  let downloadActive = null;
  let contactActive = null;
  for (const link of navLinks) {
    // link.href for example: "#/tsa" or "#/tsa/contact"
    link.classList.remove('active');
    if (link.getAttribute('href').endsWith('/download')) {
      downloadActive = link;
    } else if (link.getAttribute('href').endsWith('/contact')) {
      contactActive = link;
    } else {
      projectActive = link;
    }
  }
  const mainSection = document.getElementById('project-detail');
  const downloadsSection = document.getElementById('downloads');
  const contactSection = document.getElementById('contact');

  if (!mainSection) return;

  const mainRect = mainSection.getBoundingClientRect();
  const downloadsRect = downloadsSection ? downloadsSection.getBoundingClientRect() : null;
  const contactRect = contactSection ? contactSection.getBoundingClientRect() : null;
  // if (mainSection && contactSection) {
  if (window.scrollY < 20) { // If at the top of the page
    if (projectActive) projectActive.classList.add('active');
    return;
  }
  // Scroll position based active link
  if (downloadsRect && downloadsRect.top <= window.innerHeight / 3 && downloadsRect.bottom >= window.innerHeight / 3) {
    if (downloadActive) downloadActive.classList.add('active');
  } else if (contactRect && contactRect.top <= window.innerHeight / 3 && contactRect.bottom >= window.innerHeight / 3) {
    if (contactActive) contactActive.classList.add('active');
  } else if (mainRect.top <= window.innerHeight / 3 && mainRect.bottom >= window.innerHeight / 3) {
    if (projectActive) projectActive.classList.add('active');
  }
  // }
}

function renderNavbar(mode, project, activeContact, activeDownload) {
  const navBrand = document.getElementById('navbar-brand');
  const navMenu = document.getElementById('nav-menu');
  if (mode === 'home') {
    const project = PROJECTS.find(p => p.key === "portfolio");
    navBrand.innerHTML = `
    <a class="navbar-brand" href="#welcome-section">
      <img src="${project.img}" style="height: 42px;vertical-align:middle;" alt="project logo">
    </a>
    `;
    navMenu.innerHTML = `
      <li><a class="nav-link" href="#welcome-section">About</a></li>
      <li><a class="nav-link" href="#projects">My Projects</a></li>
      <li><a class="nav-link" href="#contact">Contact</a></li>
    `;
  } else if (mode === 'project' && project) {
    navBrand.innerHTML = `
    <a class="navbar-brand" href="#/${project.key}">
      <img src="${project.img}" style="height: 32px;vertical-align:middle;" alt="project logo">
    </a>
    `;
    const navBrandA = navBrand.querySelector('a.navbar-brand');
    if (navBrandA) {
      navBrandA.addEventListener('click', function(e) {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
    }

    // navbar menu
    let menuHtml = `
      <li>
        <a class="nav-link${activeContact ? "" : " active"}" href="#/${project.key}">
          ${project.title}
        </a>
      </li>
    `;
    if (project.download) {
      menuHtml += `
        <li>
          <a class="nav-link${activeDownload ? " active" : ""}" href="#/${project.key}/download">
          Download
          </a>
        </li>
      `;
    }
    menuHtml += `
      <li>
        <a class="nav-link${activeContact ? " active" : ""}" href="#/${project.key}/contact">
        Contact
        </a>
      </li>
    `;
    navMenu.innerHTML = menuHtml;
    // Project link event: scroll to top if hash is already correct
    const projectNav = navMenu.querySelector('.nav-link[href="#/' + project.key + '"]');
    if (projectNav) {
      projectNav.addEventListener('click', function(e) {
        const projectRoute = '#/' + project.key;
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (window.location.hash !== projectRoute) {
          // If route is different, change the hash (Trıgger renderRoute)
          window.location.hash = projectRoute;
        } 
      });
    }
    // Download Nav Event
    if (project.download) {
      const downloadNav = navMenu.querySelector('.nav-link[href="#/' + project.key + '/download"]');
      if (downloadNav) {
        downloadNav.addEventListener('click', function(e) {
          e.preventDefault();
          const d = document.getElementById('downloads');
          if (d) d.scrollIntoView({behavior: 'smooth'});
          // if (window.location.hash !== '#/' + project.key + '/download') {
          //   window.location.hash = '#/' + project.key + '/download';
          // }
        });
      }
    }
    // Contact link event: scroll to contact if hash is already correct, otherwise change hash
    const contactNav = navMenu.querySelector('.nav-link[href="#/' + project.key + '/contact"]');
    if (contactNav) {
      contactNav.addEventListener('click', function(e) {
        e.preventDefault();
        const c = document.getElementById('contact');
        if (c) c.scrollIntoView({behavior: 'smooth'});
        if (window.location.hash !== '#/' + project.key + '/contact') {
          window.location.hash = '#/' + project.key + '/contact'
        } // else renderRoute will handle the hash change
      });
    }
  }
}

function rightsReservedYearUpdate() {
  const currentYear = new Date().getFullYear();
  // document.getElementById('current-year').textContent = currentYear;
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = currentYear;
  }
}
// Add projects when the page loads
window.addEventListener('DOMContentLoaded', () => {
  renderProjectList();
  // renderNavbar("home");
});

function getRoute() {
  const hash = window.location.hash.replace(/^#\//, "");
  if (hash.includes('/download')) {
    return { key: hash.replace('/download', ''), download: true, contact: false };
  }
  if (hash.includes('/contact')) {
    return { key: hash.replace('/contact', ''), contact: true };
  }
  // if (hash === "") {
  //   return { key: "portfolio", contact: false };
  // }
  return { key: hash, contact: false };
}

let lastProjectKey = null;
// let skipNextScroll = false;
// let lastHash = "";

function renderRoute() {
  const route = getRoute();
  if (!route || route === "" || route === "home") {
    renderNavbar("home");
    showMain();
    renderProjectList();
    document.getElementById('project-detail').innerHTML = "";
    // Show the thank you message:
    document.querySelector('#contact p:last-of-type').style.display = '';
    setFavicon('assets/portfolio/icon.svg', "image/svg+xml");
    lastProjectKey = null;
    return;
  }
  // Find and display the project detail
  const project = PROJECTS.find(p => p.key === route.key);
  if (!project) {
    renderNavbar("home");
    showMain();
    renderProjectList();
    setPageTitle("Ugur Toy Portfolio");
    // Show the thank you message:
    document.querySelector('#contact p:last-of-type').style.display = '';
    setFavicon('assets/portfolio/icon.svg', "image/svg+xml");
    lastProjectKey = null;
    return;
  }
  // Manage route for redirect projects
  if (project.type === "redirect" && project.link) {
    window.open(project.link, "_blank");
    // Route hash reset
    window.location.hash = '';
    return;
  }
  renderNavbar("project", project, route.contact, route.download);
  if (lastProjectKey !== project.key) {
    renderProjectDetail(project);
    showProjectDetail();
    setPageTitle(project.title);
    setFavicon(`assets/${project.key}/icon.png`, "image/png");
    lastProjectKey = project.key;
  }
  // Hide the thank you message:
  document.querySelector('#contact p:last-of-type').style.display = 'none';
  // Highlight the active section after rendering
  setTimeout(highlightActiveSection, 0);
}

function renderFooterLinks() {
  const linksContainer = document.getElementById('footer-links');
  if (!linksContainer) return;
  // Home (Portfolio) linki
  let html = `<a href="#" class="footer-link">Home</a><br>`;

  // Project links except portfolio and redirects
  PROJECTS
    .filter(p => p.key !== 'portfolio' && p.type !== 'redirect')
    .forEach(p => {
      html += `<a href="#/${p.key}" class="footer-link">${p.title}</a><br>`;
    });

  linksContainer.innerHTML = html;
}

function showMain() {
  // showWelcome(true);
  document.getElementById('welcome-section').style.display = "";
  document.getElementById('projects').style.display = "";
  document.getElementById('project-detail').style.display = "none";
}

function showProjectDetail(showLoading=false) {
  // showWelcome(false);
  document.getElementById('welcome-section').style.display = "none";
  document.getElementById('projects').style.display = "none";
  // if (showLoading) {
  //   document.getElementById('project-detail').innerHTML = '<div class="loading-spinner"></div>';
  // }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('project-detail').style.display = "";
  // highlightActiveSection();
}

function setFavicon(src, type="image/png") {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = type;
  link.href = src;
}

function setPageTitle(title) {
  document.title = title;
  console.log(`Page title set to: ${title}`);
}
// FUNCTION DEFINITONS END
// -----------------------
// RUN
// window.addEventListener('DOMContentLoaded', highlightActiveSection);
// window.addEventListener('hashchange', highlightActiveSection);

// Show or hide the back to top button
const backToTop = document.getElementById('floating-butt');
window.addEventListener('scroll', () => {
  if(window.scrollY > 500){
    backToTop.style.visibility = 'visible';
  }else{
    backToTop.style.visibility = 'hidden';
  }
});
backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  // Reset the hash to avoid reloading the page
  // if (window.location.hash) {
  //   history.replaceState(null, null, window.location.pathname + window.location.search);
  // }
  // // Scroll to top smoothly
  const hash = window.location.hash;
  if (hash.startsWith('#/') && hash.indexOf('/', 2) > -1) {
    const firstSlash = 2; // find the first slash after the hash
    const secondSlash = hash.indexOf('/', firstSlash);
    // Reset the hash to the first part (e.g., from #/tsa/contact to #/tsa)
    const newHash = hash.substring(0, secondSlash);
    window.location.hash = newHash;
  } else if (hash && !hash.startsWith('#/')) {
    // If the hash is not a project route, just reset it
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

rightsReservedYearUpdate();

// Run on every route change
window.addEventListener("DOMContentLoaded", () => {
  renderFooterLinks();
  renderRoute();
});
window.addEventListener('load', highlightActiveSection);
window.addEventListener("hashchange", () => {
  renderRoute();
  highlightActiveSection();
});
window.addEventListener('scroll', highlightActiveSection);
