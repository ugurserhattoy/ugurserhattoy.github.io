let sliderInterval = null;
// project.js
const PROJECTS = [
  {
    key: "tsa",
    title: "TSA",
    img: "assets/tsa/icon.png",
    summary: "List UK visa sponsorship available companies and track applications...",
    description: "TSA helps you find UK visa sponsorship companies easily. It provides a comprehensive list of companies that sponsor visas, allowing you to track your applications and manage your job search effectively.",
    type: "github",
    repo: "ugurserhattoy/TSA",
    download: true
  },
  {
    key: "qspace",
    title: "Q Space",
    img: "assets/qspace/icon.png",
    summary: "A math-based abstract thinking puzzle game.",
    description: "Q Space is inspired from IQ tests and designed for brain training and fun.",
    type: "appstore",
    link: "https://play.google.com/store/apps/details?id=com.ust.qspace",
    repo: "ugurserhattoy/Q-Space"
  },
  {
    key: "regular",
    title: "Regular Calculations",
    img: "assets/regular/icon.png",
    summary: "Daily calculations assistant for various everyday needs.",
    description: "Regular Calculations (Kolay Hesap) is a daily calculation assistant app designed for simplicity and speed.",
    type: "appstore",
    link: "https://play.google.com/store/apps/details?id=com.ust.kolayhesap"
  },
  {
    key: "portfolio",
    title: "Portfolio",
    img: "assets/portfolio/icon.svg",
    summary: "My personal portfolio website.",
    description: "This portfolio showcases my work, projects, and contact details, built using HTML, CSS, and JavaScript.",
    type: "redirect",
    link: "https://github.com/ugurserhattoy/ugurserhattoy.github.io"
  },
];

async function renderProjectDetail(project) {
  const assetsBase = `assets/${project.key}/`;
  
	// header image
  let headerImg = null;
  // const headerImg = assetsBase + 'header.jpg';

  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const path = assetsBase + `header.${ext}`;
    if (await imageExists(path)) {
      headerImg = path;
      break;
    }
  }
  document.getElementById('project-detail').innerHTML = `
    <div class="project-detail-header">
      <div class="project-header-wrapper">
        <img src="${headerImg}" class="project-header-img" alt="Header" />
      </div>
      <div class="project-detail-title">
        <h1>${project.title}</h1>
        <p>${project.description}</p>
      </div>
    </div>
    <div id="project-detail-lazy"><div class="loading-spinner"></div></div>
  `;

  setTimeout(async () => {
    // Slider images
    let slideImgs = [];
    for (let i = 0; i <= 4; i++) {
      for (const ext of ["png", "jpg", "jpeg", "webp"]) {
        const path = assetsBase + `ss${i}.${ext}`;
        if (await imageExists(path)) {
          slideImgs.push(path);
          break;
        }
      }
    }

    let lazyHTML = '';

    if (slideImgs.length) {
      lazyHTML += `
        <div class="project-slider">
          <img id="project-slider-img" src="${slideImgs[0]}" alt="Screenshot" />
        </div>
      `;
    }

    // GitHub details or App Store link
    if (project.type === "github") {
      try {
        // // Latest release
        // const releaseInfo = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`).then(r => r.json());
        // if (releaseInfo && releaseInfo.html_url) {
        //   lazyHTML += `
        //     <h3>Latest Release:</h3>
        //     <p><a href="${releaseInfo.html_url}" target="_blank" class="btn-red">${releaseInfo.name || releaseInfo.tag_name}</a></p>
        //     <ul>
        //       ${(releaseInfo.assets || []).map(a => `<li><a href="${a.browser_download_url}" target="_blank">${a.name}</a></li>`).join('')}
        //     </ul>
        //   `;
        // }
        const releaseInfo = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`).then(r => r.json());
        if (releaseInfo && releaseInfo.assets && releaseInfo.assets.length) {
          // 1. Split assets into platform-specific objects
          const downloads = {
            windows: { file: null, sha: null },
            linux:   { file: null, sha: null },
            macos:   { file: null, sha: null },
          };
          // 2. Match assets to platforms
          releaseInfo.assets.forEach(a => {
            if (a.name.endsWith('.exe')) downloads.windows.file = a;
            if ((a.name.endsWith('.exe.sha256') || (a.name.endsWith('.sha256') && a.name.toLowerCase().includes('win')))) downloads.windows.sha = a;
            if (a.name.endsWith('.AppImage')) downloads.linux.file = a;
            if ((a.name.endsWith('.AppImage.sha256') || (a.name.endsWith('.sha256') && a.name.toLowerCase().includes('appimage')))) downloads.linux.sha = a;
            if (a.name.endsWith('.dmg')) downloads.macos.file = a;
            if ((a.name.endsWith('.dmg.sha256') || (a.name.endsWith('.sha256') && a.name.toLowerCase().includes('dmg')))) downloads.macos.sha = a;
          });
          let downloadLink = null;
          const system = detectOS();

          if (system === "Windows") {
            downloadLink = downloads.windows.file ? downloads.windows.file.browser_download_url : null;
          } else if (system === "Linux") {
            downloadLink = downloads.linux.file ? downloads.linux.file.browser_download_url : null;
          } else if (system === "MacOS") {
            downloadLink = downloads.macos.file ? downloads.macos.file.browser_download_url : null;
          } else {
            downloadLink = null; // Unsupported OS
          }

          // 3. Download button and release info
          lazyHTML += `
          <div class="project-detail">
          <p>
            Latest Release: ${releaseInfo.name || releaseInfo.tag_name}
          </p>
          <p>
            <a href="${downloadLink || releaseInfo.html_url}" target="_blank" class="btn-red">
            Download
            <span>for ${system || 'your OS'}</span>
            </a>
          </p>
          <div id="ghub-button">
            <a href="https://github.com/${project.repo}" target="_blank" class="btn-grey">View on GitHub</a>
          </div>
          `;
            // <a href="${releaseInfo.html_url}" target="_blank" class="btn-grey">${releaseInfo.name || releaseInfo.tag_name}</a>
            // <ul>
            //   ${(releaseInfo.assets || []).map(a => `<li><a href="${a.browser_download_url}" target="_blank">${a.name}</a></li>`).join('')}
            // </ul>

                  // const repoInfo = await fetch(`https://api.github.com/repos/${project.repo}`).then(r => r.json());
          // <h3>${repoInfo.description}</h3>
          
          // Readme
          try {
            const readmeData = await fetch(`https://api.github.com/repos/${project.repo}/readme`).then(r => r.json());
            if (readmeData && readmeData.content) {
              const decodedReadme = atob(readmeData.content.replace(/\n/g, ''));
              lazyHTML += `
              <div class="github-readme">
                <div class="md-body">${marked.parse(decodedReadme)}</div>
              </div>
              </div>
              `; // last div close for <div class="project-detail">
            }
          } catch {}

          // 4. Create download links
          lazyHTML += `
            <section id="downloads">
            <h1>Downloads</h1>
            <div class="download-table">
              <div class="download-row">
                <span>Windows amd64</span>
                <a class="btn-blue" href="${downloads.windows.file ? downloads.windows.file.browser_download_url : '#'}" target="_blank" ${downloads.windows.file ? "" : "style='pointer-events:none;opacity:.5;'"}>Installer.exe</a>
                <a class="btn-grey" href="${downloads.windows.sha ? downloads.windows.sha.browser_download_url : '#'}" target="_blank" ${downloads.windows.sha ? "" : "style='pointer-events:none;opacity:.5;'"}>sha256</a>
              </div>
              <div class="download-row">
                <span>Linux amd64</span>
                <a class="btn-blue" href="${downloads.linux.file ? downloads.linux.file.browser_download_url : '#'}" target="_blank" ${downloads.linux.file ? "" : "style='pointer-events:none;opacity:.5;'"}>TSA.AppImage</a>
                <a class="btn-grey" href="${downloads.linux.sha ? downloads.linux.sha.browser_download_url : '#'}" target="_blank" ${downloads.linux.sha ? "" : "style='pointer-events:none;opacity:.5;'"}>sha256</a>
              </div>
              <div class="download-row">
                <span>MacOS arm64</span>
                <a class="btn-blue" href="${downloads.macos.file ? downloads.macos.file.browser_download_url : '#'}" target="_blank" ${downloads.macos.file ? "" : "style='pointer-events:none;opacity:.5;'"}>TSA.dmg</a>
                <a class="btn-grey" href="${downloads.macos.sha ? downloads.macos.sha.browser_download_url : '#'}" target="_blank" ${downloads.macos.sha ? "" : "style='pointer-events:none;opacity:.5;'"}>sha256</a>
              </div>
            </div>
            </section>
          `;
        }
      } catch (e) {
        lazyHTML += `<p style="color:red;">Could not retrieve GitHub data.</p>`;
      }
    } else if (project.type === "appstore") {
      if (project.link) {
        lazyHTML += `
        <br>
        <div class="project-links">
          <a href="${project.link}" target="_blank" class="btn-blue">
          App Store
          </a>
          <br>
        `;
      }
      if (project.repo) {
        lazyHTML += `
          <br>
          <a 
            href=https://github.com/${project.repo}
            target="_blank"
            class="btn-blue"
          >
            View on GitHub
          </a>
          <br>
        `;
      }
    }else if (project.type === "website") {
      if (project.link) {
        lazyHTML += `
        <br>
        <div class="project-links">
        <a href="${project.link}" target="_blank" class="btn-blue">
        ${project.title} Page
        </a>
        <br>
        `;
      }
      if (project.repo) {
        lazyHTML += `
          <br>
          <a 
            href=https://github.com/${project.repo}
            target="_blank"
            class="btn-grey"
          >
            View on GitHub
          </a>
          <br>
        `;
      }
    }
    lazyHTML += `</div>`;

    // Lazy loaded content
    document.getElementById('project-detail-lazy').innerHTML = lazyHTML;
    // const lazyDiv = document.getElementById('project-detail-lazy');
    // if (lazyDiv) lazyDiv.innerHTML = lazyHTML || 'No extra details available.';

    // Slider start
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
    if (slideImgs.length > 1) {
      let slideIdx = 0;
      sliderInterval = setInterval(() => {
        slideIdx = (slideIdx + 1) % slideImgs.length;
        const img = document.getElementById('project-slider-img');
        if (img) img.src = slideImgs[slideIdx];
      }, 4800);
    }

    setupHeaderFadeOnScroll();
  }, 10);

  function imageExists(url) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.src = url;
    });
  }
}

function setupHeaderFadeOnScroll() {
  const wrapper = document.querySelector('.project-header-wrapper');
  if (!wrapper) return;
	
  window.addEventListener('scroll', () => {
		const rect = wrapper.getBoundingClientRect();
    // Sticky headers top edge distance from navbar
    const fadeStart = window.innerHeight / 2; // central
    const fadeEnd = 70; // vanish under navbar (60px + 10px margin)
    // let opacity = 1;

    // if (rect.top < fadeStart && rect.top > fadeEnd) {
    //   opacity = (rect.top - fadeEnd) / (fadeStart - fadeEnd);
    // } else if (rect.top <= fadeEnd) {
    //   opacity = 0;
    // } else if (rect.top >= fadeStart) {
		// 	opacity = 1;
		// }

    const scrollY = window.scrollY;
    // 0'da opak, 400px ve üstünde şeffaf
    let opacity = 1 - Math.min(scrollY / 400, 1);
    wrapper.style.opacity = opacity;
  });
}
