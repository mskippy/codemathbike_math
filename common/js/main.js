// /common/js/main.js

window.initNavSystems = function () {
  const pageTitleEl = document.getElementById("page-title");
  const unitTitleEl = document.getElementById("unit-title");
  if (!pageTitleEl) return;

  const courseKey = document.body.dataset.course || "math8";
  const unitKey = document.body.dataset.unit; // e.g., "unit1"
  const nav = window.NAV_DATA?.[courseKey];
  const units = nav?.units || {};

  const normalize = (p) => {
    if (!p) return "";
    p = p.split("?")[0].split("#")[0];

    // Treat .../1.3_index, .../1.3_index.html as the folder
    p = p.replace(/\/[^\/]+_index(?:\.html)?$/i, "/");

    if (!p.endsWith("/")) p += "/";
    return p;
  };

  const current = normalize(window.location.pathname);

  // Unit title (subtitle under H1)
  const unitLabel = unitKey && units[unitKey]?.label ? units[unitKey].label : "";
  if (unitTitleEl) {
    unitTitleEl.textContent = unitLabel;
    unitTitleEl.style.display = unitLabel ? "" : "none";
  }

  // Default
  let pageLabel = document.title || "Math 8";

  // Home page match (EXACT only)
  if (nav?.home?.href && normalize(nav.home.href) === current) {
    pageLabel = nav.home.label || "Math 8 Home";
    if (unitTitleEl) unitTitleEl.style.display = "none";
  } else {
    // Lesson match (normalized)
    for (const u of Object.values(units)) {
      const lessons = Array.isArray(u.lessons) ? u.lessons : [];
      const match = lessons.find(lsn => normalize(lsn.href) === current);
      if (match) {
        pageLabel = match.label;
        break;
      }
    }

    // fallback: if not lesson but inside a unit
    if (pageLabel === (document.title || "Math 8") && unitLabel) {
      pageLabel = unitLabel;
    }
  }

  pageTitleEl.textContent = pageLabel;
};