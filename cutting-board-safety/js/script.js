window.addEventListener("load", function () {
  "use strict";

  var PRODUCT_URL = "https://www.plateful.co/products/ti-cutting-board";

  var FLOW = [
    "intro",
    "frequency",
    "food",
    "cut-type",
    "knife",
    "lifespan",
    "board",
    "board-info",
    "analysis-transition",
    "assessment",
    "why-fails",
    "recommendation",
    "product",
    "feat-titanium",
    "feat-knives",
    "feat-clean",
    "feat-lifetime",
    "trusted",
    "submit",
  ];

  var INTERSTITIALS = [
    "Would you switch your cutting board to stop toxic exposure from your food forever?",
    "Would a cutting board that lasts a lifetime justify a higher upfront cost?",
    "Do you want to claim your personalized solution and discount?",
  ];

  var answers = {};
  let selectedBoard = "";

  const BOARD_DATA = {
    plastic: {
      title: "Plastic Boards Shed Microplastics Into Food",
      subtitle:
        "Every cut creates microscopic plastic fragments that break off into your food.",
      subtitle2:
        "These microplastics can accumulate in the body and have been linked to <strong>inflammation, hormone disruption, and long-term health concerns.</strong>",
      type: "video",
      media:
        "https://cdn.shopify.com/videos/c/o/v/9ca6fac0eb484eef86d3cb24110cd00d.mp4",

      assessment: {
        image: "./images/plastic.avif",

        materials: [
          {
            icon: "./images/prod-list-icn1.webp",
            text: "Microplastics",
          },
          {
            icon: "./images/prod-list-icn2.webp",
            text: "Chemical residues",
          },
          {
            icon: "./images/prod-list-icn3.webp",
            text: "Bacterial biofilm",
          },
          {
            icon: "./images/prod-list-icn4.webp",
            text: "Degraded polymer particles",
          },
        ],
      },
    },

    wood: {
      title: "Wood and Bamboo Boards Trap Harmful Bacteria",
      subtitle:
        "Wood and bamboo are porous. Knife grooves absorb moisture, raw meat juices, and bacteria below the surface.",
      subtitle2:
        "This bacteria can transfer into food and may contribute to <strong>foodborne illness, digestive irritation, and repeated exposure</strong>  — especially concerning for children and older adults.",
      type: "video",
      media:
        "https://cdn.shopify.com/videos/c/o/v/19e520ed6f4d4fea9e1cd4de8009926c.mp4",
      assessment: {
        image: "./images/wood-bamboo.avif",

        materials: [
          {
            icon: "./images/prod-list-icn1.webp",
            text: "Bacterial buildup",
          },
          {
            icon: "./images/prod-list-icn2.webp",
            text: "Mold spores",
          },
          {
            icon: "./images/prod-list-icn3.webp",
            text: "Food residue absorption",
          },
          {
            icon: "./images/prod-list-icn4.webp",
            text: "Cross-contamination bacteria",
          },
        ],
      },
    },

    glass: {
      title: "Glass Boards Chip and Transfer Glass Into Food",
      subtitle:
        "Cutting on glass causes microscopic glass chipping with repeated use.",
      subtitle2:
        "These fragments can enter food and irritate the digestive tract or cause <strong>internal micro-injuries over time.</strong>. Glass also severely dulls knives.",
      type: "image",
      media: "images/glass-board.avif",
      assessment: {
        image: "./images/glass.avif",

        materials: [
          {
            icon: "./images/prod-list-icn1.webp",
            text: "Microscopic glass fragments",
          },
          {
            icon: "./images/prod-list-icn2.webp",
            text: "Blade debris",
          },
          {
            icon: "./images/prod-list-icn3.webp",
            text: "Surface chipping particles",
          },
          {
            icon: "./images/prod-list-icn4.webp",
            text: "Cross-contamination residue",
          },
        ],
      },
    },

    steel: {
      title: "Steel Isn’t Antibacterial — and It’s Harsh on Knives",
      subtitle:
        "Steel boards are not naturally antibacterial. <strong>Scratches allow bacteria to survive and spread between foods.</strong>",
      subtitle2:
        "Steel is also similar in strength to knife blades, meaning they grind against each other — accelerating dulling and blade damage. ",
      type: "image",
      media: "images/steel-board.avif",
      assessment: {
        image: "./images/steel.avif",

        materials: [
          {
            icon: "./images/prod-list-icn1.webp",
            text: "Oxidized steel fragments",
          },
          {
            icon: "./images/prod-list-icn2.webp",
            text: "Bacterial residue",
          },
          {
            icon: "./images/prod-list-icn3.webp",
            text: "Surface biofilm",
          },
          {
            icon: "./images/prod-list-icn4.webp",
            text: "Iron trace transfer",
          },
        ],
      },
    },
  };

  var current = 0;
  var submitStarted = false;

  var backBtn = document.getElementById("backBtn");
  var screens = {};
  FLOW.forEach(function (step) {
    screens[step] = document.querySelector('[data-step="' + step + '"]');
  });

  function show(index) {
    current = Math.max(0, Math.min(index, FLOW.length - 1));
    var currentStep = FLOW[current];

    if (currentStep === "assessment") {
        renderAssessment();
    }

    FLOW.forEach(function (step, i) {
      if (screens[step])
        screens[step].classList.toggle("active", i === current);
    });

    if (backBtn) backBtn.classList.toggle("visible", current > 0);

    // Auto-advance if on the loader/transition screen
    if (currentStep === "analysis-transition") {
      setTimeout(function () {
        const loader = document.querySelector(".circle-loader");
        if (loader) {
          loader.classList.add("load-complete"); // Trigger animation

          // Wait for the checkmark animation to finish before proceeding
          setTimeout(next, 1200);
        } else {
          next();
        }
      }, 2000); // Original delay before showing the checkmark
    }

    if (currentStep === "submit") {
      startSubmit();
    } else {
      stopSubmit();
    }

    window.scrollTo(0, 0);
    if (location.hash !== "#" + currentStep) {
      history.pushState(null, "", "#" + currentStep);
    }
  }

  function next() {
    // 1. Define steps that require validation (must select an option)
    const stepsToValidate = ["intro", "cut-type"]; // cut-type is multi-select
    const currentStepKey = FLOW[current];

    if (stepsToValidate.includes(currentStepKey)) {
      const optionsGroup = screens[currentStepKey].querySelector(".options");
      const isSelected =
        optionsGroup && optionsGroup.querySelector("input:checked");

      if (!isSelected && optionsGroup) {
        // 2. Apply shake animation if nothing is selected
        optionsGroup.classList.add("shake-animation");

        // 3. Remove class once animation ends so it can be re-triggered
        optionsGroup.addEventListener(
          "animationend",
          () => {
            optionsGroup.classList.remove("shake-animation");
          },
          { once: true },
        );

        return; // Stop execution: do not proceed to next screen
      }
    }

    show(current + 1);
  }

  function renderBoardInfo(board) {
    const data = BOARD_DATA[board];

    if (!data) return;

    document.querySelector("#boardTitle").innerHTML = data.title;

    document.querySelector("#boardSubtitle").innerHTML = data.subtitle;
    document.querySelector("#boardSubtitle2").innerHTML = data.subtitle2;

    const media = document.querySelector("#boardMedia");

    if (data.type === "video") {
      media.innerHTML = `
              <video autoplay muted playsinline controls>
                  <source src="${data.media}" type="video/mp4">
              </video>
          `;
    } else {
      media.innerHTML = `
              <img src="${data.media}" class="screen-img" alt="">
          `;
    }
  }

  function renderAssessment() {
    const data = BOARD_DATA[selectedBoard];
    if (!data) return;

    const container = document.getElementById("assessmentMaterials");
    let html = `
          <div class="list-col">
              <h4>Materials You're Exposed To:</h4>
              <ul>
      `;

    data.assessment.materials.forEach((item) => {
      html += `
              <li>
                  <img src="${item.icon}" width="33">
                  <p>${item.text}</p>
              </li>
          `;
    });

    html += `
              </ul>
          </div>

          <div class="prod_det_imgbx">
              <img id="assessmentBoardImage" src="${data.assessment.image}" alt="">
          </div>
      `;
    console.log(html);
    container.innerHTML = html;
  }

  document.querySelectorAll("[data-question]").forEach(function (group) {
    var auto = group.dataset.auto === "true";
    var key = group.dataset.question;

    group.addEventListener("click", function (e) {
      var input = e.target;

      if (input.type === "radio") {
        group.querySelectorAll(".option, .card").forEach(function (el) {
          el.classList.toggle("selected", el.contains(input) && input.checked);
        });

        answers[key] = input.value;

        // if (auto) {
        //   setTimeout(function () {
        //     next();
        //   }, 180);
        // }

        if (auto) {
          setTimeout(function () {
            if (key === "board") {
              const board = input.value.toLowerCase();

              answers.board = board;

              selectedBoard = board;

              if (board === "other") {
                show(FLOW.indexOf("analysis-transition"));

                return;
              }

              renderBoardInfo(board);
              
              show(FLOW.indexOf("board-info"));

              return;
            }

            next();
          }, 180);
        }
      } else if (input.type === "checkbox") {
        input.closest(".option").classList.toggle("selected", input.checked);

        answers[key] = Array.prototype.map.call(
          group.querySelectorAll("input:checked"),
          function (i) {
            return i.value;
          },
        );
      }
    });
  });

  // Simplified Next Button handling
  document.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", next);
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      history.back();
    });
  }

  window.addEventListener("popstate", function () {
    var step = location.hash.slice(1);
    var idx = FLOW.indexOf(step);

    if (idx >= 0 && idx !== current) show(idx);
  });

  var overlay = document.getElementById("modalOverlay");
  var modalQuestion = document.getElementById("modalQuestion");
  var ctaBtn = document.getElementById("ctaBtn");
  var interstitialIdx = 0;
  var modalCallback = null;
  var activeProgressTimer = null;
  var submitRunId = 0;

  function isSubmitActive(runId) {
    return runId === submitRunId && FLOW[current] === "submit" && submitStarted;
  }

  function clearProgressTimer() {
    if (!activeProgressTimer) return;

    clearInterval(activeProgressTimer);
    activeProgressTimer = null;
  }

  function askInterstitial(callback, runId) {
    if (!isSubmitActive(runId)) return;

    if (interstitialIdx >= INTERSTITIALS.length) {
      callback();
      return;
    }

    modalCallback = callback;
    modalQuestion.textContent = INTERSTITIALS[interstitialIdx];
    overlay.classList.add("open");
  }

  overlay.querySelectorAll("[data-answer]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!submitStarted || FLOW[current] !== "submit") {
        overlay.classList.remove("open");
        return;
      }

      answers["interstitial" + (interstitialIdx + 1)] = btn.dataset.answer;
      interstitialIdx++;
      overlay.classList.remove("open");

      if (modalCallback) {
        var callback = modalCallback;
        modalCallback = null;
        callback();
      }
    });
  });

  function animateBar(row, done, runId) {
    var fill = row.querySelector(".fill");
    var pct = row.querySelector(".pct");
    var value = 0;
    var modalShown = false;

    function startTimer() {
      if (!isSubmitActive(runId)) return;

      activeProgressTimer = setInterval(function () {
        if (!isSubmitActive(runId)) {
          clearProgressTimer();
          return;
        }

        value = Math.min(modalShown ? 100 : 50, value + 4);

        fill.style.width = value + "%";
        pct.textContent = value + "%";

        if (value === 50 && !modalShown) {
          modalShown = true;
          clearProgressTimer();

          askInterstitial(startTimer, runId);
          return;
        }

        if (value >= 100) {
          clearProgressTimer();
          done();
        }
      }, 120);
    }

    startTimer();
  }

  function resetSubmit() {
    var rows = document.querySelectorAll("#screen-submit .progress-row");

    rows.forEach(function (row) {
      row.querySelector(".fill").style.width = "0%";
      row.querySelector(".pct").textContent = "0%";
    });

    interstitialIdx = 0;
    modalCallback = null;

    INTERSTITIALS.forEach(function (_, index) {
      delete answers["interstitial" + (index + 1)];
    });

    overlay.classList.remove("open");

    document.getElementById("submitTitle").textContent =
      "Applying Your $250 Discount…";
    if (ctaBtn) ctaBtn.classList.add("d-none");
  }

  function stopSubmit() {
    clearProgressTimer();

    submitRunId++;
    submitStarted = false;
    modalCallback = null;

    overlay.classList.remove("open");
  }

  function finishSubmit(runId) {
    if (!isSubmitActive(runId)) return;

    overlay.classList.remove("open");

    document.getElementById("submitTitle").textContent =
      "Your $250 Discount Is Ready";

    if (ctaBtn) {
      ctaBtn.classList.remove("d-none");
      ctaBtn.focus();
    }
  }

  function runProgressBar(rows, index, runId) {
    if (!isSubmitActive(runId)) return;

    if (index >= rows.length) {
      finishSubmit(runId);
      return;
    }

    animateBar(
      rows[index],
      function () {
        runProgressBar(rows, index + 1, runId);
      },
      runId,
    );
  }

  function startSubmit() {
    stopSubmit();
    resetSubmit();

    submitStarted = true;
    submitRunId++;

    var runId = submitRunId;
    var rows = document.querySelectorAll("#screen-submit .progress-row");

    runProgressBar(rows, 0, runId);
  }

  if (ctaBtn) {
    ctaBtn.addEventListener("click", function () {
      const statusIndicator = document.querySelector(".status-indicator");
      const spinner = statusIndicator.querySelector(".icon-spinner");
      const check = statusIndicator.querySelector(".icon-check-mark");
      const cross = statusIndicator.querySelector(".icon-x-mark");

      // reset: hide all, then show spinner
      if (check) check.style.display = "none";
      if (cross) cross.style.display = "none";
      if (spinner) spinner.style.display = "block";
      ctaBtn.disabled = true;

      setTimeout(function () {
        if (spinner) spinner.style.display = "none";
        if (check) check.style.display = "block";
        window.location.href = PRODUCT_URL;
      }, 2000);
    });
  }

  function getCookie(name) {
    const key = name + "=";

    const cookies = document.cookie.split(";");

    for (let c of cookies) {
      c = c.trim();

      if (c.indexOf(key) === 0) {
        return decodeURIComponent(c.substring(key.length));
      }
    }

    return "";
  }

  function setCookie(name, value, days = 30) {
    const d = new Date();

    d.setTime(d.getTime() + days * 86400000);

    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      ";expires=" +
      d.toUTCString() +
      ";path=/";
  }

  var initial = FLOW.indexOf(location.hash.slice(1));
  show(initial >= 0 ? initial : 0);
});
