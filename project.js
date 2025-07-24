// project.js
const PROJECTS = [
  {
    key: "tsa",
    title: "TSA",
    img: "assets/tsa.png",
    summary: "List UK visa sponsorship available companies and track applications...",
    description: "TSA helps you find UK visa sponsorship companies easily. It provides a comprehensive list of companies that sponsor visas, allowing you to track your applications and manage your job search effectively.",
    type: "github",
    repo: "ugurserhattoy/TSA"
  },
  {
    key: "qspace",
    title: "Q Space",
    img: "assets/qspace.png",
    summary: "A math-based abstract thinking puzzle game.",
    description: "Q Space is inspired from IQ tests and designed for brain training and fun.",
    type: "appstore",
    link: "https://play.google.com/store/apps/details?id=com.ust.qspace"
  },
  {
    key: "regular-calculations",
    title: "Regular Calculations",
    img: "assets/regular-calculations.png",
    summary: "Daily calculations assistant for various everyday needs.",
    description: "Regular Calculations (Kolay Hesap) is a daily calculation assistant app designed for simplicity and speed.",
    type: "appstore",
    link: "https://play.google.com/store/apps/details?id=com.ust.kolayhesap"
  },
//   {
//     key: "portfolio",
//     title: "Personal Portfolio",
//     img: "assets/portfolio.png",
//     summary: "My personal portfolio website.",
//     description: "This portfolio showcases my work, projects, and contact details, built using HTML, CSS, and JavaScript.",
//     type: "github",
//     repo: "ugurserhattoy/ugurserhattoy.github.io"
//   },
];

async function renderProjectDetail(project) {
  let detailHTML = `
    <h1>${project.title}</h1>
    <img src="${project.img}" style="max-width:200px;" />
    <p>${project.description}</p>
  `;

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
  } else if (project.type === "appstore" || project.type === "website") {
    // App store or web app link
    if (project.link) {
      detailHTML += `<a href="${project.link}" target="_blank" class="action-btn">Go to project</a>`;
    }
  }

  document.getElementById('project-detail').innerHTML = detailHTML;
}
