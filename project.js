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
    repo: "ugurserhattoy/TSA"
  },
  {
    key: "qspace",
    title: "Q Space",
    img: "assets/qspace/icon.png",
    summary: "A math-based abstract thinking puzzle game.",
    description: "Q Space is inspired from IQ tests and designed for brain training and fun.",
    type: "appstore",
    link: "https://play.google.com/store/apps/details?id=com.ust.qspace"
  },
  {
    key: "regular-calculations",
    title: "Regular Calculations",
    img: "assets/regular-calculations/icon.png",
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
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const path = assetsBase + `header.${ext}`;
    if (await imageExists(path)) {
      headerImg = path;
      break;
    }
  }

	async function imageExists(url) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.src = url;
    });
  }

	// slider
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
	
	let detailHTML = `<div class="project-detail-header">`;

	// Add Header Image if exists
	if (headerImg) {
    detailHTML += `
		<div class="project-header-wrapper">
			<img src="${headerImg}" class="project-header-img" alt="Header" />
		</div>
		`;
  }

	detailHTML += `
			<h1>${project.title}</h1>
			<p>${project.description}</p>
		</div>`;
    // <img src="${project.img}" style="max-width:200px;" />

	if (slideImgs.length) {
    detailHTML += `
      <div class="project-slider">
        <img id="project-slider-img" src="${slideImgs[0]}" alt="Screenshot" />
      </div>
			`;
  }
      // <script>
      //   let slideImgs = ${JSON.stringify(slideImgs)};
      //   let slideIdx = 0;
      //   setInterval(() => {
      //     slideIdx = (slideIdx + 1) % slideImgs.length;
      //     document.getElementById('project-slider-img').src = slideImgs[slideIdx];
      //   }, 2500);
      // </script>

  if (project.type === "github") {
    // Fetch GitHub description and release info
    try {
      const repoInfo = await fetch(`https://api.github.com/repos/${project.repo}`).then(r => r.json());
      detailHTML += `
        <h4>GitHub Description:</h4>
        <p>${repoInfo.description}</p>
        <a href="https://github.com/${project.repo}" target="_blank" class="action-btn">View on GitHub</a>
      `;

      // Fetch latest release info
      const releaseInfo = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`).then(r => r.json());
      if (releaseInfo && releaseInfo.html_url) {
        detailHTML += `
          <h4>Latest Release:</h4>
          <p><a href="${releaseInfo.html_url}" target="_blank">${releaseInfo.name || releaseInfo.tag_name}</a></p>
          <ul>
            ${(releaseInfo.assets || []).map(a => `<li><a href="${a.browser_download_url}" target="_blank">${a.name}</a></li>`).join('')}
          </ul>
        `;
      }
    } catch (e) {
      detailHTML += `<p style="color:red;">Could not retrieve GitHub data.</p>`;
    }
		// Fetch README.md content
		try {
      const readmeData = await fetch(`https://api.github.com/repos/${project.repo}/readme`).then(r => r.json());
      if (readmeData && readmeData.content) {
        const decodedReadme = atob(readmeData.content.replace(/\n/g, ''));
        // Eğer Markdown'ı HTML'e çevirmek istersen:
        // Basit markdown render için showdown.js gibi bir lib kullanabilirsin (veya sadece <pre> ile gösterebilirsin)
        // detailHTML += `<div class="github-readme"><h4>README.md</h4><pre style="white-space:pre-wrap;">${decodedReadme}</pre></div>`;
				detailHTML += `<div class="github-readme"><h4>README.md</h4><div class="md-body">${marked.parse(decodedReadme)}</div></div>`;
      }
    } catch {}

  } else if (project.type === "appstore" || project.type === "website") {
    // App store or web app link
    if (project.link) {
      detailHTML += `<a href="${project.link}" target="_blank" class="action-btn">Go to project</a>`;
    }
  }

  document.getElementById('project-detail').innerHTML = detailHTML;
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
