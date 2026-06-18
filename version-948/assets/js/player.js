(function () {
  function initPlayer(shell) {
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".video-overlay");
    var button = shell.querySelector(".video-play");
    if (!video || !overlay || !button) {
      return;
    }

    var hls = null;
    var loaded = false;
    var src = video.getAttribute("data-hls");

    function load() {
      if (loaded || !src) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return;
      }
      video.src = src;
    }

    function start() {
      load();
      video.controls = true;
      overlay.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      start();
    });

    overlay.addEventListener("click", function () {
      start();
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      overlay.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        overlay.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll("[data-player]").forEach(initPlayer);
})();
