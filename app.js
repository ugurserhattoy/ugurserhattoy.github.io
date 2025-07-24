// Add projects to the page (uses the PROJECTS array from project.js)
function renderProjectList() {
  const list = document.getElementById('projects-list');
  if (!list) return;
  list.innerHTML = PROJECTS.map(p => `
    <figure class="project-grid">
      <a href="#/${p.key}" class="project-tile">
        <img class="project-img" src="${p.img}" alt="${p.title} screenshot"/>
        <figcaption class="img-caption">${p.summary}</figcaption>
      </a>
    </figure>
  `).join('');
}

// Add projects when the page loads
window.addEventListener('DOMContentLoaded', () => {
  renderProjectList();
});

// Highlight the active navbar link
function highlightActiveSection() {
  const navLinks = document.querySelectorAll('.nav-link');
  // Keep the previous behavior if on the homepage
  if (!window.location.hash || !window.location.hash.startsWith('#/')) {
    let currentActive = null;
    for (const link of navLinks) {
      const targetId = (link.getAttribute('href') || '').replace(/^#/, '');
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
  let contactActive = null;

  for (const link of navLinks) {
    // link.href for example: "#/tsa" or "#/tsa/contact"
    link.classList.remove('active');
    if (link.getAttribute('href').endsWith('/contact')) {
      contactActive = link;
    } else {
      projectActive = link;
    }
  }
  const mainSection = document.getElementById('project-detail');
  const contactSection = document.getElementById('contact');

  if (mainSection && contactSection) {
    const mainRect = mainSection.getBoundingClientRect();
    const contactRect = contactSection.getBoundingClientRect();
    if (mainRect.top <= window.innerHeight / 3 && mainRect.bottom >= window.innerHeight / 3) {
      if (projectActive) projectActive.classList.add('active');
    } else if (contactRect.top <= window.innerHeight / 3 && contactRect.bottom >= window.innerHeight / 3) {
      if (contactActive) contactActive.classList.add('active');
    }
  }
}
// window.addEventListener('DOMContentLoaded', highlightActiveSection);
window.addEventListener('load', highlightActiveSection);
// // window.addEventListener('hashchange', highlightActiveSection);
window.addEventListener('scroll', highlightActiveSection);

function renderNavbar(mode, project, activeContact) {
  const navBrand = document.getElementById('navbar-brand');
  const navMenu = document.getElementById('nav-menu');
  if (mode === 'home') {
    navBrand.innerHTML = "UST Portfolio";
    navMenu.innerHTML = `
      <li><a class="nav-link" href="#welcome-section">About</a></li>
      <li><a class="nav-link" href="#projects">My Projects</a></li>
      <li><a class="nav-link" href="#contact">Contact</a></li>
    `;
  } else if (mode === 'project' && project) {
    navBrand.innerHTML = `
      <img src="${project.img}" style="height: 32px;vertical-align:middle;" alt="project logo">
    `;
    navMenu.innerHTML = `
      <li>
        <a class="nav-link${activeContact ? "" : " active"}" href="#/${project.key}">
          ${project.title}
        </a>
      </li>
      <li>
        <a class="nav-link${activeContact ? " active" : ""}" href="#/${project.key}/contact">Contact</a>
      </li>
    `;
    // Project link event: scroll to top if hash is already correct
    const projectNav = navMenu.querySelector('.nav-link[href="#/' + project.key + '"]');
    if (projectNav) {
      projectNav.addEventListener('click', function(e) {
        if (window.location.hash === '#/' + project.key) {
          e.preventDefault();
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
        // else let the hashchange reload the route
      });
    }
    // Contact link event: scroll to contact if hash is already correct, otherwise change hash
    const contactNav = navMenu.querySelector('.nav-link[href="#/' + project.key + '/contact"]');
    if (contactNav) {
      contactNav.addEventListener('click', function(e) {
        if (window.location.hash === '#/' + project.key + '/contact') {
          e.preventDefault();
          const c = document.getElementById('contact');
          if (c) c.scrollIntoView({behavior: 'smooth'});
        }
        // else let the hashchange reload the route
      });
    }
  }
}

// Show or hide the back to top button
const backToTop = document.getElementById('floating-butt');
window.addEventListener('scroll', () => {
  if(window.scrollY > 500){
    backToTop.style.visibility = 'visible';
  }else{
    backToTop.style.visibility = 'hidden';
  }
});

function rightsReservedYearUpdate() {
  const currentYear = new Date().getFullYear();
  // document.getElementById('current-year').textContent = currentYear;
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = currentYear;
  }
}
rightsReservedYearUpdate();

function getRoute() {
  const hash = window.location.hash.replace(/^#\//, "");
  if (hash.includes('/contact')) {
    return { key: hash.replace('/contact', ''), contact: true };
  }
  return { key: hash, contact: false };
}

function renderRoute() {
  const route = getRoute();
  if (!route || route === "" || route === "home") {
    renderNavbar("home");
    showMain();
    renderProjectList();
    document.getElementById('project-detail').innerHTML = "";
    // Show the thank you message:
    document.querySelector('#contact p:last-of-type').style.display = '';
    return;
  }
  // Find and display the project detail
  const project = PROJECTS.find(p => p.key === route.key);
  if (!project) {
    renderNavbar("home");
    showMain();
    renderProjectList();
    setPageTitle("Ugur Toy Portfolio Page");
    // Show the thank you message:
    document.querySelector('#contact p:last-of-type').style.display = '';
    return;
  }
  showProjectDetail();
  renderNavbar("project", project, route.contact);
  renderProjectDetail(project);
  setPageTitle(project.title);
  // Hide the thank you message:
  document.querySelector('#contact p:last-of-type').style.display = 'none';
  // If contact scroll is needed
  if (route.contact) {
    const c = document.getElementById('contact');
    if (c) c.scrollIntoView({behavior: 'smooth'});
  } else {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}

// Run on every route change
window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);

function showMain() {
  // showWelcome(true);
  document.getElementById('welcome-section').style.display = "";
  document.getElementById('projects').style.display = "";
  document.getElementById('project-detail').style.display = "none";
}

function showProjectDetail() {
  // showWelcome(false);
  document.getElementById('welcome-section').style.display = "none";
  document.getElementById('projects').style.display = "none";
  document.getElementById('project-detail').style.display = "";
}

function setPageTitle(title) {
  document.title = title;
  console.log(`Page title set to: ${title}`);
}
