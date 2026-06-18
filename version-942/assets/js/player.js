(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.watch-player'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.player-start');
    var stream = player.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function attach() {
      if (!video || !stream || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      video.src = stream;
      ready = true;
    }

    function start() {
      attach();
      player.classList.add('is-playing');
      video.setAttribute('controls', 'controls');
      var action = video.play();

      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    if (button && video) {
      button.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
          player.classList.remove('is-playing');
        }
      });
    }
  });
})();
