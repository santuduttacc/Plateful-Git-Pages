window.addEventListener('heyflow-screen-view', (event) => {
  // console.log('heyflow screen view:', event.detail.screenName);

  const loaderOverlay = document.querySelector(".visible .loader-container-overlay");

  document.querySelector('div[data-blocktype="generic-button"]:has(.generic-button.submit)').style.display = "none"

  document.querySelector('[data-blockid="id-e3bdfb8c"]').style.display = "none"

  if (loaderOverlay) {
    const popup = document.querySelector(".visible .loader-popup");
    const yes = document.querySelector(".visible .yes-btn1");
    const no = document.querySelector(".visible .no-btn1");

    var bars = document.querySelectorAll('.visible .progress-fill')
    var percentTexts = document.querySelectorAll('.visible .progresstext')
    var popupTexts = document.querySelectorAll('.visible .popuptext')

    let i = 0,
      percent = 0,
      timer, pause = false;

    const togglePopup = show => {
      if (!popup) return;
      loaderOverlay.style.display = popup.style.display = show ? "block" : "none";
      pause = show;
    };

    const start = () => {
      percent = 0;
      const bar = bars[i]
      const text = percentTexts[i]
      const popupText = popupTexts[i]

      document.querySelector('.visible .loader-popup-inner .active')?.classList.remove('active')
      if (popupText) popupText.classList.add('active')

      timer = setInterval(() => {
        if (!bar) return;
        if (pause) return;

        bar.style.width = ++percent + "%";
        text.innerText = percent + "%";

        if (percent === 50) togglePopup(true);
        if (percent === 100) {
          clearInterval(timer);
          if (++i < bars.length) {
            start();
          } else {
            document.querySelector('div[data-blocktype="generic-button"]:has(.generic-button.submit)').style.display = "flex"
            document.querySelector('[data-blockid="id-5a7ab849"]').style.display = "none"
            document.querySelector('[data-blockid="id-e3bdfb8c"]').style.display = "block"
          }
        }
      }, 50);
    };

    yes.onclick = () => togglePopup(false);
    no.onclick = () => togglePopup(false);

    start();
  }

  const progressWrap = document.querySelector('.visible .material_type-progress');
  if (progressWrap) {
    const thumb = progressWrap.querySelector('.visible .progress-thumb');
    const pop = thumb.querySelector('.visible .material_type-pop');

    // get percentage from data attribute
    const percent = progressWrap.getAttribute('data-wdth');

    // reset position (optional)
    thumb.style.left = '0%';

    // allow CSS transition to apply
    setTimeout(() => {
      thumb.style.left = percent + '%';

      // add class after animation
      setTimeout(() => {
        pop.classList.add('active'); // your new class
      }, 600); // match transition duration
    }, 100);
  }

  // Assesment section
  var screenName = event.detail.screenName;
  var validScreens = ["6-plastic", "6-wood", "6-glass", "6-steel"];

  if (validScreens.includes(screenName)) {
    document.querySelectorAll('.quiz_prod_det_innr')
      .forEach(item => {
        item.style.display = 'none';
      });

    var activeItem = document.querySelector(`.screen-${screenName}`);

    if (activeItem) {
      activeItem.style.display = 'block';
    }
  }

});

// review slide js code
document.addEventListener("DOMContentLoaded", (event) => {
  var app_review_slider = new Swiper(".app_review_slider", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 15,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: ".swiper-button-next.app_review_arrow",
      prevEl: ".swiper-button-prev.app_review_arrow"
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1141: {
        slidesPerView: 4,
      }
    }
  });
});

window.addEventListener('heyflow-submit', (event) => {
  // console.log('heyflow submit:', event.detail);
});