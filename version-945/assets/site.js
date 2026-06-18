function bindHeroSlider() {
  const sliders = document.querySelectorAll("[data-hero]");
  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll(".hero-dot"));
    if (slides.length < 2) {
      return;
    }
    let current = 0;
    let timer = null;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };
    const start = () => {
      stop();
      timer = window.setInterval(() => show(current + 1), 5200);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        show(i);
        start();
      });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  });
}

function bindFilters() {
  document.querySelectorAll(".filter-panel").forEach((panel) => {
    const gridId = panel.getAttribute("data-grid");
    const grid = document.getElementById(gridId);
    if (!grid) {
      return;
    }
    const cards = Array.from(grid.querySelectorAll(".movie-card"));
    const empty = document.querySelector(`[data-empty-for="${gridId}"]`);
    const controls = Array.from(panel.querySelectorAll("input, select"));
    const getValue = (name) => {
      const el = panel.querySelector(`[data-filter="${name}"]`);
      return el ? el.value.trim().toLowerCase() : "";
    };
    const run = () => {
      const keyword = getValue("keyword");
      const year = getValue("year");
      const region = getValue("region");
      const type = getValue("type");
      let visible = 0;
      cards.forEach((card) => {
        const title = (card.dataset.title || "").toLowerCase();
        const cardYear = (card.dataset.year || "").toLowerCase();
        const cardRegion = (card.dataset.region || "").toLowerCase();
        const cardType = (card.dataset.type || "").toLowerCase();
        const cardTags = (card.dataset.tags || "").toLowerCase();
        const haystack = `${title} ${cardRegion} ${cardType} ${cardTags}`;
        const matched = (!keyword || haystack.includes(keyword)) &&
          (!year || cardYear.includes(year)) &&
          (!region || cardRegion.includes(region)) &&
          (!type || cardType.includes(type));
        card.classList.toggle("hidden-by-filter", !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    };
    controls.forEach((control) => control.addEventListener("input", run));
    controls.forEach((control) => control.addEventListener("change", run));
    run();
  });
}

function initPlayer(videoId, sourceUrl, overlayId) {
  const video = document.getElementById(videoId);
  const overlay = document.getElementById(overlayId);
  if (!video || !sourceUrl) {
    return;
  }
  let hlsInstance = null;
  const attachSource = () => {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (!video.src) {
        video.src = sourceUrl;
      }
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      }
    }
  };
  const play = () => {
    attachSource();
    if (overlay) {
      overlay.classList.add("hide");
    }
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {});
    }
  };
  if (overlay) {
    overlay.addEventListener("click", play);
  }
  video.addEventListener("click", () => {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener("play", () => {
    if (overlay) {
      overlay.classList.add("hide");
    }
  });
  video.addEventListener("loadedmetadata", () => {
    video.controls = true;
  });
}

window.initPlayer = initPlayer;

document.addEventListener("DOMContentLoaded", () => {
  bindHeroSlider();
  bindFilters();
});
