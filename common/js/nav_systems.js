function setActiveLinks(root = document) {
  const path = window.location.pathname + window.location.hash;
  const links = root.querySelectorAll('a[href]');
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    if (href === path || href === window.location.pathname) {
      a.classList.add("active");
    }
    if (href === window.location.pathname + window.location.hash) {
      a.classList.add("active");
    }
  });
}

function buildLinks(list, cls = "") {
  return (list || []).map(l => `<a class="${cls}" href="${l.href}">${l.label}</a>`).join("");
}

window.initNavSystems = function initNavSystems() {
  const meta = window.NAV_META || {};
  const data = window.NAV_DATA || {};
  if (!data) return;

  // Top nav (header)
  const top = document.querySelector("#math-top-nav");
  if (top && meta?.brand && meta?.topLinks) {
    top.innerHTML = `
      <div class="nav-brand"><a href="${meta.brand.href}">${meta.brand.label}</a></div>
      <nav class="nav-links">${buildLinks(meta.topLinks)}</nav>
    `;
  }

  // Header title + unit subtitle (uses NAV_DATA)
  const { course, unit, page } = document.body.dataset;
  renderHeaderTitleAndUnit(course, unit, page);

  setActiveLinks(document);
};

function renderHeaderTitleAndUnit(courseKey, unitKey, pageKey) {
  const course = window.NAV_DATA?.[courseKey];
  if (!course) return;

  const titleEl = document.getElementById("page-title");
  const unitEl = document.querySelector(".breadcrumbs"); // subtitle line

  let pageTitle = course.title;

  if (unitKey && course.units?.[unitKey]) {
    pageTitle = course.units[unitKey].title;
  }
  if (unitKey && pageKey && course.units?.[unitKey]?.pages?.[pageKey]) {
    pageTitle = course.units[unitKey].pages[pageKey].title;
  }

  if (titleEl) titleEl.textContent = pageTitle;

  if (unitEl) {
    unitEl.textContent = (unitKey && course.units?.[unitKey]) ? course.units[unitKey].title : "";
  }
}
