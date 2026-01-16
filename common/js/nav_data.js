/* ============================================================================
  nav_data.js (MATH) — CODE-style structure (course → units → pages)

  window.NAV_META:
    - Used for the top header nav (like CODE)
  window.NAV_DATA:
    - Used for sidebar + breadcrumbs
============================================================================ */

window.NAV_META = {
  brand: { label: "CodeMathBike", href: "/" },

  // Top nav (header) — match the CODE approach; styling handled in CSS
  topLinks: [
    { label: "Home", href: "/" },
    { label: "Math", href: "/math/" },
    { label: "Math 8", href: "/math/math8/m8_index.html" },
    { label: "Math 9", href: "/math/math9/m9_index.html" },       // create later
    { label: "FMPC 10", href: "/math/fmpc10/fmpc10_index.html" }, // create later
  ],
};

window.NAV_DATA = {
  // --------------------------------------------------------------------------
  // MATH 8
  // --------------------------------------------------------------------------
  math8: {
    title: "Math 8",
    href: "/math/math8/m8_index.html",

    // Optional but recommended for consistent ordering
    unitOrder: ["unit1", "unit2", "unit3", "unit4", "unit5"],

    units: {
      unit1: {
        title: "U1",
        href: "/math/math8/unit1/u1_index.html",
        pageOrder: ["page1", "page2", "page3"],
        pages: {
          page1: { title: "1.1 Lesson Title", href: "/math/math8/unit1/1.1_index.html" },
          page2: { title: "1.2 Lesson Title", href: "/math/math8/unit1/1.2_index.html" },
          page3: { title: "1.3 Lesson Title", href: "/math/math8/unit1/1.3_index.html" },
        },
      },

      unit2: {
        title: "U2",
        href: "/math/math8/unit2/u2_index.html",
        pageOrder: ["page1", "page2"],
        pages: {
          page1: { title: "2.1 Lesson Title", href: "/math/math8/unit2/2.1_index.html" },
          page2: { title: "2.2 Lesson Title", href: "/math/math8/unit2/2.2_index.html" },
        },
      },

      unit3: {
        title: "U3",
        href: "/math/math8/unit3/u3_index.html",
        pageOrder: ["page1", "page2", "page3"],
        pages: {
          page1: { title: "3.1 Lesson Title", href: "/math/math8/unit3/3.1_index.html" },
          page2: { title: "3.2 Lesson Title", href: "/math/math8/unit3/3.2_index.html" },
          page3: { title: "3.3 Lesson Title", href: "/math/math8/unit3/3.3_index.html" },
        },
      },

      unit4: {
        title: "U4",
        href: "/math/math8/unit4/u4_index.html",
        pages: {}, // fill later
      },

      unit5: {
        title: "U5",
        href: "/math/math8/unit5/u5_index.html",
        pages: {}, // fill later
      },
    },
  },

  // --------------------------------------------------------------------------
  // MATH 9 (stub now; fill when you build it)
  // --------------------------------------------------------------------------
  math9: {
    title: "Math 9",
    href: "/math/math9/m9_index.html",
    units: {},
  },

  // --------------------------------------------------------------------------
  // FMPC 10 (stub now; fill when you build it)
  // --------------------------------------------------------------------------
  fmpc10: {
    title: "FMPC 10",
    href: "/math/fmpc10/fmpc10_index.html",
    units: {},
  },
};
