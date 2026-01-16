/* ============================================================================
  sidebar_math.js (CODE-style for MATH)
  - Top: course selector (Math 8 / Math 9 / FMPC 10)
  - Middle: units list
  - Inside the active/selected unit: show lesson pages
  - Auto-opens current unit/page, collapses others
  - Renders ONLY inside /math/...
  - Uses data-course on <body> when available, otherwise infers from URL

  Requires mount point:
    <div data-math-sidebar></div>

  Expects NAV_DATA like:
    window.NAV_DATA = {
      math8: { title, href, unitOrder, units:{ unit1:{title,href,pageOrder,pages:{page1:{title,href}}}} },
      math9: {...},
      fmpc10: {...}
    }
============================================================================ */

(function () {
  const MOUNT_SELECTOR = "[data-math-sidebar]";
  const MATH_ROOT_PREFIX = "/math/";
  const COURSE_KEYS_IN_SELECTOR = ["math8", "math9", "fmpc10"]; // order in the top selector

  // ---------------- helpers ----------------
  function normalizePath(url) {
    try {
      const u = new URL(url, window.location.origin);
      return (u.pathname || "").replace(/\/+$/, "");
    } catch {
      const base = (url || "").split("#")[0].split("?")[0];
      return base.replace(/\/+$/, "");
    }
  }

  function getHrefPathAndHash(href) {
    const parts = (href || "").split("#");
    return {
      path: normalizePath(parts[0] || ""),
      hash: parts[1] ? `#${parts[1]}` : "",
    };
  }

  function isActiveLink(href) {
    const { path: hrefPath, hash: hrefHash } = getHrefPathAndHash(href);
    const locPath = normalizePath(window.location.pathname);
    const locHash = window.location.hash || "";

    if (!hrefPath) return false;
    if (hrefPath !== locPath) return false;
    if (hrefHash) return hrefHash === locHash;
    return true;
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  function orderedKeys(order, obj) {
    if (Array.isArray(order) && order.length) return order.filter((k) => k in obj);
    return Object.keys(obj);
  }

  function courseKeyFromBody() {
    const key = document.body?.dataset?.course;
    return key && typeof key === "string" ? key.trim() : "";
  }

  function courseKeyFromPath() {
    // /math/math8/... OR /math/math9/... OR /math/fmpc10/...
    const path = normalizePath(window.location.pathname);
    const parts = path.split("/").filter(Boolean); // ["math","math8",...]
    if (parts[0] !== "math") return "";
    return parts[1] || "";
  }

  function resolveCurrentCourseKey(navData) {
    const fromBody = courseKeyFromBody();
    if (fromBody && navData[fromBody]) return fromBody;

    const fromPath = courseKeyFromPath();
    if (fromPath && navData[fromPath]) return fromPath;

    // Fallback: if we are in /math/ but not in a known course folder, pick math8 if present
    if (navData.math8) return "math8";
    return "";
  }

  function unitContainsActive(unit) {
    if (!unit) return false;
    if (unit.href && isActiveLink(unit.href)) return true;

    const pages = unit.pages || {};
    return Object.keys(pages).some((k) => pages[k]?.href && isActiveLink(pages[k].href));
  }

  // ---------------- builders ----------------
  function buildCourseSelector(navData, currentKey) {
    // Only show courses that actually have units (real content)
    const available = COURSE_KEYS_IN_SELECTOR
      .filter((key) => navData[key])
      .filter((key) => {
        const c = navData[key];
        const units = c?.units || {};
        return Object.keys(units).length > 0; // treat as "real course"
      });
  
    // If only one course exists, show a clean header (no selector links)
    if (available.length <= 1) {
      const course = navData[currentKey] || navData[available[0]];
      const header = el("div", { class: "m8-course-header" });
  
      const title = el("div", { class: "m8-course-title", text: course?.title || "Math" });
      header.appendChild(title);
  
      return header;
    }
  
    // Otherwise show CODE-style course selector links
    const wrap = el("div", { class: "m8-course-selector" });
  
    available.forEach((key) => {
      const course = navData[key];
  
      const a = el("a", {
        href: course.href || "#",
        class: "m8-course-link" + (key === currentKey ? " active" : ""),
      });
      a.textContent = course.title || key;
      wrap.appendChild(a);
    });
  
    return wrap;
  }
  

  function buildUnitAccordionCard({ unit, openByDefault, collapseGroupEl }) {
    const pages = unit.pages || {};
    const hasPages = Object.keys(pages).length > 0;

    const details = el("details", { class: "m8-sidebar-unit m8-unit-card" });
    if (openByDefault) details.open = true;

    // Close other units when one opens
    details.addEventListener("toggle", () => {
      // highlight this unit when open
      details.classList.toggle("active", details.open);

      // close other units when one opens
      if (!details.open || !collapseGroupEl) return;
      collapseGroupEl.querySelectorAll("details.m8-sidebar-unit").forEach((d) => {
        if (d !== details) {
          d.open = false;
          d.classList.remove("active");
        }
      });
    });



    const summary = el("summary", { class: "m8-sidebar-unit-summary" });

      // Make the entire unit header feel like the “unit card”
      const titleLink = el("a", {
        href: unit.href || "#",
        class: "m8-sidebar-unit-titlelink",
      });
      titleLink.textContent = unit.title || "Untitled Unit";

      // If you click the title link, GO to the unit page (don’t toggle accordion)
      titleLink.addEventListener("click", (e) => {
        e.stopPropagation();
      });


      // Optional chevron (purely visual)
      const chevron = el("span", { class: "m8-sidebar-unit-chevron", });

      summary.appendChild(titleLink);
      summary.appendChild(chevron);
      details.appendChild(summary);


    // Lesson pages list
    if (hasPages) {
      const keys = orderedKeys(unit.pageOrder, pages);
      const ul = el("ul", { class: "m8-sidebar-sublist" });

      keys.forEach((pk) => {
        const p = pages[pk];
        if (!p?.href) return;

        const a = el("a", {
          href: p.href,
          class: "m8-sidebar-link" + (isActiveLink(p.href) ? " active" : ""),
        });
        a.textContent = p.title || p.href;

        ul.appendChild(el("li", { class: "m8-sidebar-item" }, [a]));
      });

      details.appendChild(ul);
    }

    if (openByDefault) details.classList.add("active");
    return details;
  }

  // ---------------- init ----------------
  function init() {
    const mount = document.querySelector(MOUNT_SELECTOR);
    if (!mount) return;

    // Only render in /math/ section
    if (!normalizePath(window.location.pathname).startsWith(normalizePath(MATH_ROOT_PREFIX))) {
      mount.innerHTML = "";
      return;
    }

    const navData = window.NAV_DATA || {};
    const currentKey = resolveCurrentCourseKey(navData);

    mount.innerHTML = "";

    const outer = el("div", { class: "m8-sidebar" });

    // 1) Course selector (top)
    outer.appendChild(buildCourseSelector(navData, currentKey));

    // If we can’t resolve a course, stop after showing the selector
    const course = currentKey ? navData[currentKey] : null;
    if (!course) {
      mount.appendChild(outer);
      return;
    }

    // 2) Units + lesson pages (like CODE)
    const units = course.units || {};
    const unitKeys = orderedKeys(course.unitOrder, units);

    outer.appendChild(el("div", { class: "m8-sidebar-section-label", text: "Units" }));

    const unitsContainer = el("div", { class: "m8-sidebar-units" });

    unitKeys.forEach((uk) => {
      const unit = units[uk];
      if (!unit) return;

      const open = unitContainsActive(unit);
      unitsContainer.appendChild(buildUnitAccordionCard({ unit, openByDefault: open, collapseGroupEl: unitsContainer }));
    });

    outer.appendChild(unitsContainer);
    mount.appendChild(outer);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
