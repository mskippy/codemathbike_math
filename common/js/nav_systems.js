function setActiveLinks(root = document) {
  const path = window.location.pathname + window.location.hash;
  const links = root.querySelectorAll('a[href]');
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    // Mark active for exact match OR same page section jump
    if (href === path || (href.startsWith(window.location.pathname) && href === window.location.pathname)) {
      a.classList.add("active");
    }

    // Also handle when you're on the same page and click a hash link
    if (href.startsWith(window.location.pathname + "#") && window.location.pathname === window.location.pathname) {
      if (href === window.location.pathname + window.location.hash) a.classList.add("active");
    }
  });
}

function buildLinks(list, cls = "") {
  return (list || []).map(l => `<a class="${cls}" href="${l.href}">${l.label}</a>`).join("");
}

window.initNavSystems = function initNavSystems() {
  const data = window.NAV_DATA;
  if (!data) return;

  // Top nav
  const top = document.querySelector("#math-top-nav");
  if (top) {
    top.innerHTML = `
      <div class="nav-brand"><a href="${data.brand.href}">${data.brand.label}</a></div>
      <nav class="nav-links">${buildLinks(data.topLinks)}</nav>
    `;
  }

  // Sidebar: Math 8 nested links
  const math8 = document.querySelector("#math8-nav");
  if (math8) {
    math8.innerHTML = buildLinks(data.math8Links, "side-link");
  }

  // Sidebar: Units list (separate)
  const units = document.querySelector("#units-nav");
  if (units) {
    units.innerHTML = `
      <div class="units-title">Units</div>
      ${buildLinks(data.unitLinks, "unit-link")}
    `;
  }

  setActiveLinks(document);
};
