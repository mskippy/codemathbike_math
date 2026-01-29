// /common/js/main.js

window.initNavSystems = function () {
    const pageTitleEl = document.getElementById("page-title");
    const unitTitleEl = document.getElementById("unit-title");
       if (!pageTitleEl) return;
  
    const courseKey = document.body.dataset.course || "math8";
    const unitKey = document.body.dataset.unit; // e.g., "unit1"
    const nav = window.NAV_DATA?.[courseKey];
    const units = nav?.units || {};
  
    const pathname = window.location.pathname.split("?")[0].split("#")[0];
  
    // Unit title (line under page title)
    const unitLabel = unitKey && units[unitKey]?.label ? units[unitKey].label : "";
    if (unitTitleEl) {
      unitTitleEl.textContent = unitLabel;
      unitTitleEl.style.display = unitLabel ? "" : "none";
    }
  
    // Page title (lesson label if exact match, otherwise fallbacks)
    let pageLabel = document.title || "Math 8";
  
    // Home page match
    if (nav?.home?.href && pathname === nav.home.href) {
      pageLabel = nav.home.label || "Math 8 Home";
      if (unitTitleEl) unitTitleEl.style.display = "none";
    } else {
      // Exact lesson match
      for (const u of Object.values(units)) {
        const lessons = Array.isArray(u.lessons) ? u.lessons : [];
        const match = lessons.find(lsn => lsn.href === pathname);
        if (match) {
          pageLabel = match.label;
          break;
        }
      }
  
      // If not a lesson page, but inside a unit, use unit label
      if (pageLabel === (document.title || "Math 8") && unitLabel) {
        pageLabel = unitLabel;
      }
    }
  
    pageTitleEl.textContent = pageLabel;
  
    
  };
  