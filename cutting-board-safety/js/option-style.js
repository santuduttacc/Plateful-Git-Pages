// option-styles.js
// Standalone script — handles hover + selected coloring for .option elements
// without touching the existing script.js logic.
// Load this file AFTER script.js in your HTML:
// <script src="script.js"></script>
// <script src="option-styles.js"></script>

(function () {
  "use strict";

  function applyDeselectedStyle(option) {
    option.style.backgroundColor = "var(--white)";
    option.style.color = "var(--ink)";
    option.style.borderColor = "var(--ink)";
  }

  function applySelectedStyle(option) {
    option.style.backgroundColor = "var(--primary)";
    option.style.color = "var(--white)";
    option.style.borderColor = "var(--primary)";
  }

  function applyHoverStyle(option) {
    option.style.backgroundColor = "var(--primary)";
    option.style.color = "var(--white)";
    option.style.borderColor = "var(--primary)";
  }

  function refreshOption(option) {
    if (option.classList.contains("selected")) {
      applySelectedStyle(option);
    } else {
      applyDeselectedStyle(option);
    }
  }

  function init() {
    var options = document.querySelectorAll(".option");

    options.forEach(function (option) {
      // Set correct initial state on load
      refreshOption(option);

      // Hover handling (JS-driven, not native :hover)
      option.addEventListener("mouseenter", function () {
        if (!option.classList.contains("selected")) {
          applyHoverStyle(option);
        }
      });

      option.addEventListener("mouseleave", function () {
        refreshOption(option);
      });

      // Watch for class changes made by the main script.js
      // (handles the case where .selected is toggled while mouse
      // is still resting on the element, e.g. click to deselect)
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.attributeName === "class") {
            refreshOption(option);
          }
        });
      });

      observer.observe(option, { attributes: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
