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
        { label: "Math", href: "/" },
    { label: "Math 8", href: "/math8/m8_index.html" },
    { label: "Math 9", href: "/math9/m9_index.html" },       // create later
    { label: "FMPC 10", href: "/fmpc10/fmpc10_index.html" }, // create later
  ],
};

window.NAV_DATA = {
  // --------------------------------------------------------------------------
  // MATH 8
  // --------------------------------------------------------------------------
  math8: {
  title: "Math 8",
  href: " /math8/m8_index.html",

  unitOrder: ["unit1", "unit2", "unit3", "unit4", "unit5"],

  units: {
    unit1: {
      title: "Unit 1: Financial Foundations",
      href: "/math8/unit1/u1_index.html",
      pageOrder: ["lesson1", "lesson2", "lesson3"],
      pages: {
        lesson1: {
          title: "1.1 Introduction to Financial Literacy",
          href: "/math8/unit1/lesson1/1.1_index.html"
        },
        lesson2: {
          title: "1.2 Integers & Number Sense",
          href: "/math8/unit1/lesson2/1.2_index.html"
        },
        lesson3: {
          title: "1.3 Multi-Step Money Problems",
          href: "/math8/unit1/lesson3/1.3_index.html"
        }
      }
    },

    unit2: {
      title: "Unit 2: Ratios & Rates",
      href: "/math8/unit2/u2_index.html",
      pageOrder: ["lesson1", "lesson2"],
      pages: {
        lesson1: {
          title: "2.1 Ratios in Context",
          href: "/math8/unit2/lesson1/2.1_index.html"
        },
        lesson2: {
          title: "2.2 Unit Pricing & Best Deals",
          href: "/math8/unit2/lesson2/2.2_index.html"
        }
      }
    },

    unit3: {
      title: "Unit 3: Percent in Real Life",
      href: "/math8/unit3/u3_index.html",
      pages: {}
    },

    unit4: {
      title: "Unit 4: Algebra as a Tool",
      href: "/math8/unit4/u4_index.html",
      pages: {}
    },

    unit5: {
      title: "Unit 5: Measurement, Geometry & Data",
      href: "/math8/unit5/u5_index.html",
      pages: {}
    }
  }
},

  // --------------------------------------------------------------------------
  // MATH 9 (stub now; fill when you build it)
  // --------------------------------------------------------------------------
  math9: {
    title: "Math 9",
    href: "/math9/m9_index.html",
    units: {},
  },

  // --------------------------------------------------------------------------
  // FMPC 10 (stub now; fill when you build it)
  // --------------------------------------------------------------------------
  fmpc10: {
    title: "FMPC 10",
    href: "/fmpc10/fmpc10_index.html",
    units: {},
  },
};
