// /common/js/main.js

window.initNavSystems = function () {
  const pageTitleEl = document.getElementById("page-title");
  const unitTitleEl = document.getElementById("unit-title");
  if (!pageTitleEl) return;

  const courseKey = document.body.dataset.course || "math8";
  const unitKey = document.body.dataset.unit; // e.g., "unit1"
  const nav = window.NAV_DATA?.[courseKey];
  const units = nav?.units || {};

  const rawPath = window.location.pathname.split("?")[0].split("#")[0];

  // Normalize: treat "*_index", "*_index.html", and "*_index/" as the folder
  const norm = (p) => {
    if (!p) return "";
    p = p.split("?")[0].split("#")[0];
    p = p.replace(/\/[^\/]+_index(?:\.html)?$/i, "/");
    p = p.replace(/\/[^\/]+_index\/$/i, "/");
    if (!p.endsWith("/")) p += "/";
    return p;
  };

  const current = norm(rawPath);

  // Unit title (line under page title) — from body data-unit if available
  const unitLabel = unitKey && units[unitKey]?.label ? units[unitKey].label : "";
  if (unitTitleEl) {
    unitTitleEl.textContent = unitLabel;
    unitTitleEl.style.display = unitLabel ? "" : "none";
  }

  // Default page label
  let pageLabel = document.title || "Math 8";

  // Home page
  if (nav?.home?.href && (current === norm(nav.home.href) || current.startsWith(norm(nav.home.href)))) {
    pageLabel = nav.home.label || "Math 8 Home";
    if (unitTitleEl) unitTitleEl.style.display = "none";
  } else {
    // Best match lesson inside any unit
    for (const u of Object.values(units)) {
      const lessons = Array.isArray(u.lessons) ? u.lessons : [];
      const match = lessons.find(lsn => current === norm(lsn.href) || current.startsWith(norm(lsn.href)));
      if (match) {
        pageLabel = match.label || pageLabel;

        // If unit title wasn't set via data-unit for some reason, set it now
        if (unitTitleEl && (!unitLabel) && u.label) {
          unitTitleEl.textContent = u.label;
          unitTitleEl.style.display = "";
        }
        break;
      }
    }

    // If not a lesson match but inside a unit, fall back to unit label
    if (pageLabel === (document.title || "Math 8") && unitLabel) {
      pageLabel = unitLabel;
    }
  }

  pageTitleEl.textContent = pageLabel;
};