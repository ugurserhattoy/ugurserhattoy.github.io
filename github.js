function detectOS() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("like Mac") !== -1) return "iOS";
    return "Unknown OS";
}
console.log("Detected OS:", detectOS());

async function fetchLatestRelease(repo) {
    const GITHUB_REL = `https://api.github.com/repos/${repo}/releases/latest`;
    const response = await fetch(GITHUB_REL);
    if (!response.ok) throw new Error("Release fetch error");
    return await response.json();
}

function findAssetUrl(assets, system, html_url) {
    if (!assets) return null;
    if (system === "Windows") {
        const exe = assets.find(a => a.name.toLowerCase().endsWith(".exe"));
        if (exe) return exe.browser_download_url;
    }
    if (system === "Darwin") {
        const dmg = assets.find(a => a.name.toLowerCase().endsWith(".dmg"));
        if (dmg) return dmg.browser_download_url;
    }
    if (system === "Linux") {
        const appimg = assets.find(a => a.name.toLowerCase().endsWith(".appimage"));
        if (appimg) return appimg.browser_download_url;
    }
    // Fallback
    if (assets.length > 0) return assets[0].browser_download_url;
    return html_url;
}

async function fetchRepoDescription(repo) {
    const url = `https://api.github.com/repos/${repo}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Repo info fetch error");
    const data = await response.json();
    return data.description || "";
}

async function addTSAReleaseCard() {
    const repo = "ugurserhattoy/TSA";
    const system = detectOS();
    let release, description;
    try {
        release = await fetchLatestRelease(repo);
        description = await fetchRepoDescription(repo);
    } catch (e) {
        // Hatayı yönet
        return;
    }
    const assetUrl = findAssetUrl(release.assets, system, release.html_url);
    const cardHTML = `
      <figure class="project-grid">
        <a href="${release.html_url}" target="_blank" class="project-tile">
          <img class="project-img" src="assets/tsa_icon.png" alt="TSA logo"/>
          <figcaption class="img-caption">
            ${description}<br>
            Latest Release: ${release.tag_name}<br>
            <a href="${assetUrl}" class="action-btn" download>Download for ${system}</a>
          </figcaption>
        </a>
      </figure>
    `;
    const container = document.getElementById('projects-list');
    container.innerHTML = cardHTML + container.innerHTML;
}