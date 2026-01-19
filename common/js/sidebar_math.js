/* ============================================================================
  sidebar_math.js (Math v2 sidebar)
  - Mounts into: <div data-math-sidebar></div>
  - Reads: window.NAV_DATA = { math8:{...}, math9:{...}, fmpc10:{...} }
  - Works for deployments where Math lives at "/" and course folders are:
      /math8/..., /math9/..., /fmpc10/...
  - Also works if you later deploy with a /math/ prefix, because we don’t hardcode it.
============================================================================ */

(function () {
  "use strict";

  const MOUNT_SELECTOR = "[data-math-sidebar]";
  const COURSE_KEYS_IN_SELECTOR = ["math8", "math9", "fmpc10"];

  // ---------- helpers ----------
  function normalizePath(path) {
    try {
      const u = new URL(path, window.location.origin);
      return (u.pathname || "").replace(/\/+$/, "");
    } catch {
      return (path || "").split("#")[0].split("?")[0].replace(/\/+$/, "");
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
    if (!obj) return [];
    if (Array.isArray(order) && order.length) return order.filter((k) => k in obj);
    return Object.keys(obj);
  }

  function courseKeyFromBody(navData) {
    const key = document.body?.dataset?.course;
    if (!key) return "";
    const k = String(key).trim();
    return navData && navData[k] ? k : "";
  }

  function courseKeyFromPath(navData) {
    // If URL is /math8/unit1/... -> first segment is "math8"
    const parts = normalizePath(window.location.pathname).split("/").filter(Boolean);
    const maybe = parts[0] || "";
    return navData && navData[maybe] ? maybe : "";
  }

  function resolveCurrentCourseKey(navData) {
    const fromBody = courseKeyFromBody(navData);
    if (fromBody) return fromBody;

    const fromPath = courseKeyFromPath(navData);
    if (fromPath) return fromPath;

    // fallback: first available course with units
    const available = COURSE_KEYS_IN_SELECTOR
      .filter((k) => navData[k])
      .filter((k) => Object.keys(navData[k]?.units || {}).length > 0);

    if (available.length) return available[0];
    return "";
  }

  function unitContainsActive(unit) {
    if (!unit) return false;
    if (unit.href && isActiveLink(unit.href)) return true;

    const pages = unit.pages || {};
    return Object.keys(pages).some((k) => pages[k]?.href && isActiveLink(pages[k].href));
  }

  // ---------- builders ----------
  function buildCourseSelector(navData, currentKey) {
    // Only show courses that have real units (content)
    const available = COURSE_KEYS_IN_SELECTOR
      .filter((key) => navData[key])
      .filter((key) => Object.keys(navData[key]?.units || {}).length > 0);

    // If only one course exists, show a clean header (no selector links)
    if (available.length <= 1) {
      const course = navData[currentKey] || navData[available[0]];
      const header = el("div", { class: "m8-course-header" });
      header.appendChild(el("div", { class: "m8-course-title", text: course?.title || "Math" }));
      return header;
    }

    // Otherwise show selector links
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
    if (openByDefault) details.classList.add("active");

    details.addEventListener("toggle", () => {
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

    // unit title link (go to unit page)
    const titleLink = el("a", {
      href: unit.href || "#",
      class: "m8-sidebar-unit-titlelink",
    });
    titleLink.textContent = unit.title || "Untitled Unit";

    // Clicking the link should navigate, not toggle
    titleLink.addEventListener("click", (e) => e.stopPropagation());

    const chevron = el("span", { class: "m8-sidebar-unit-chevron" });

    summary.appendChild(titleLink);
    summary.appendChild(chevron);
    details.appendChild(summary);

    // pages list
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

    return details;
  }

  // ---------- init ----------
  function init() {
    const mount = document.querySelector(MOUNT_SELECTOR);
    if (!mount) return;

    const navData = window.NAV_DATA || {};
    const currentKey = resolveCurrentCourseKey(navData);

    mount.innerHTML = "";

    // If we can't resolve a course, don't render anything noisy.
    if (!currentKey || !navData[currentKey]) return;

    const outer = el("div", { class: "m8-sidebar" });

    // 1) Course header/selector
    outer.appendChild(buildCourseSelector(navData, currentKey));

    // 2) Units + pages
    const course = navData[currentKey];
    const units = course.units || {};
    const unitKeys = orderedKeys(course.unitOrder, units);

    outer.appendChild(el("div", { class: "m8-sidebar-section-label", text: "Units" }));

    const unitsContainer = el("div", { class: "m8-sidebar-units" });

    unitKeys.forEach((uk) => {
      const unit = units[uk];
      if (!unit) return;
      const open = unitContainsActive(unit);
      unitsContainer.appendChild(
        buildUnitAccordionCard({ unit, openByDefault: open, collapseGroupEl: unitsContainer })
      );
    });

    outer.appendChild(unitsContainer);
    mount.appendChild(outer);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
