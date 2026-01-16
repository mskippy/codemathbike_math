async function loadPartials() {
    const nodes = document.querySelectorAll("[data-partial]");
    const jobs = Array.from(nodes).map(async (el) => {
      const url = el.getAttribute("data-partial");
      if (!url) return;
  
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
        const html = await res.text();
        el.innerHTML = html;
      } catch (err) {
        console.error(err);
        el.innerHTML = `<div style="padding:12px;border:1px solid #ccc;border-radius:12px;">
          <strong>Partial failed to load:</strong> ${url}
        </div>`;
      }
    });
  
    await Promise.all(jobs);
  
    // After partials load, initialize nav + breadcrumbs (if available)
    if (typeof window.initNavSystems === "function") window.initNavSystems();
    if (typeof window.initBreadcrumbs === "function") window.initBreadcrumbs();
  }
  
  document.addEventListener("DOMContentLoaded", loadPartials);
  