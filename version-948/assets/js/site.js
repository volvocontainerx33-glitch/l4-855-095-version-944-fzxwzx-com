(function () {
  var toggle = document.querySelector(".mobile-menu-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isHidden = menu.hasAttribute("hidden");
      if (isHidden) {
        menu.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "×";
      } else {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      }
    });
  }

  document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        play();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", play);
    show(0);
    play();
  });

  document.querySelectorAll(".catalog-tools").forEach(function (tools) {
    var target = document.querySelector(tools.getAttribute("data-target"));
    if (!target) {
      return;
    }
    var input = tools.querySelector("[data-search-input]");
    var category = tools.querySelector("[data-category-select]");
    var sort = tools.querySelector("[data-sort-select]");
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q && input) {
      input.value = q;
    }

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function apply() {
      var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
      var keyword = normalize(input ? input.value : "");
      var selected = category ? category.value : "";
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-tags")
        ].join(" "));
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = !selected || card.getAttribute("data-category") === selected;
        card.hidden = !(matchKeyword && matchCategory);
      });

      if (sort) {
        var sorted = cards.slice();
        if (sort.value === "year-desc") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          });
        }
        if (sort.value === "year-asc") {
          sorted.sort(function (a, b) {
            return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
          });
        }
        if (sort.value === "title") {
          sorted.sort(function (a, b) {
            return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-CN");
          });
        }
        sorted.forEach(function (card) {
          target.appendChild(card);
        });
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (category) {
      category.addEventListener("change", apply);
    }
    if (sort) {
      sort.addEventListener("change", apply);
    }
    apply();
  });
})();
