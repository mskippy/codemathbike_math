// /common/js/sidebar_math.js
(function () {
  function normalizePath(p) {
    if (!p) return "";
    p = p.split("?")[0].split("#")[0];

    // normalize trailing slash vs file paths
    // Treat ".../unit1/" and ".../unit1/u1_index.html" as equivalent by removing *_index.html
    p = p.replace(/\/(u\d+_index|m\d+_index)\.html$/i, "/");

    // Always ensure trailing slash for consistent comparisons
    if (!p.endsWith("/")) p += "/";
    return p;
  }

  function isActiveLink(currentNorm, href) {
    const hrefNorm = normalizePath(href);

    // exact match after normalization OR current starts with href (useful for unit sections)
    return currentNorm === hrefNorm || currentNorm.startsWith(hrefNorm);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildSidebar(container, courseKey) {
    const nav = window.NAV_DATA?.[courseKey];
    if (!nav) {
      container.innerHTML = `<div class="m8-sidebar"><p>Nav data missing for "${escapeHtml(courseKey)}".</p></div>`;
      return;
    }

    const current = normalizePath(window.location.pathname);

    const units = nav.units || {};
    const unitEntries = Object.entries(units);

    // Find the "current unit" to auto-expand
    let currentUnitKey = null;
    for (const [uKey, unit] of unitEntries) {
      if (!unit?.href) continue;
      if (isActiveLink(current, unit.href)) {
        currentUnitKey = uKey;
        break;
      }
      // also match any lesson inside the unit
      const lessons = unit.lessons || [];
      if (lessons.some(lsn => isActiveLink(current, lsn.href))) {
        currentUnitKey = uKey;
        break;
      }
    }

    const homeHref = nav.home?.href || "#";
    const homeLabel = nav.home?.label || "Home";

    const unitsHtml = unitEntries.map(([uKey, unit]) => {
      const openAttr = (uKey === currentUnitKey) ? " open" : "";
      const unitActive = unit?.href && isActiveLink(current, unit.href);
      const unitLabel = unit?.label || uKey;
      const unitHref = unit?.href || "#";

      const lessons = Array.isArray(unit.lessons) ? unit.lessons : [];
      const lessonsHtml = lessons.map(lsn => {
        const active = isActiveLink(current, lsn.href) ? " active" : "";
        return `
          <li class="m8-sidebar-item">
            <a class="m8-sidebar-link${active}" href="${lsn.href}">${escapeHtml(lsn.label)}</a>
          </li>
        `;
      }).join("");

      return `
        <details class="m8-unit-card"${openAttr}>
          <summary class="m8-unit-summary">
            <a class="m8-unit-link${unitActive ? " active" : ""}" href="${unitHref}">
              ${escapeHtml(unitLabel)}
            </a>
          </summary>
          <ul class="m8-lesson-list">
            ${lessonsHtml || `<li class="m8-sidebar-item muted">No lessons listed yet.</li>`}
          </ul>
        </details>
      `;
    }).join("");

    container.innerHTML = `
      <nav class="m8-sidebar">
        <div class="m8-sidebar-home">
          <a class="m8-home-link${isActiveLink(current, homeHref) ? " active" : ""}" href="${homeHref}">
            ${escapeHtml(homeLabel)}
          </a>
        </div>

        <div class="m8-sidebar-section-label">Units</div>

        <div class="m8-units">
          ${unitsHtml}
        </div>
      </nav>
    `;

    // Add active class to the matching unit link when a lesson is active
    // (nice UX; optional)
    container.querySelectorAll(".m8-lesson-list a.active").forEach(a => {
      const details = a.closest("details");
      if (details) details.setAttribute("open", "open");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mount = document.querySelector("[data-math-sidebar]");
    if (!mount) return;

    const courseKey = document.body.dataset.course || "math8"; // default
    buildSidebar(mount, courseKey);
  });
})();
