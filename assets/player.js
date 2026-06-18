var MoviePlayer = (function () {
  var hlsSrc = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
  var pending = null;

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    if (pending) {
      pending.push(callback);
      return;
    }

    pending = [callback];
    var script = document.createElement('script');
    script.src = hlsSrc;
    script.async = true;
    script.onload = function () {
      var callbacks = pending || [];
      pending = null;
      callbacks.forEach(function (item) {
        item();
      });
    };
    script.onerror = function () {
      pending = null;
      callback();
    };
    document.head.appendChild(script);
  }

  function init(options) {
    var video = document.querySelector('[data-player-video]');
    var shell = document.querySelector('[data-player-shell]');
    var button = document.querySelector('[data-player-button]');

    if (!video || !button || !options || !options.source) {
      return;
    }

    var started = false;
    var hls = null;

    if (options.poster) {
      video.setAttribute('poster', options.poster);
    }

    function attachSource(done) {
      if (started) {
        done();
        return;
      }

      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.source;
        done();
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(options.source);
          hls.attachMedia(video);
          done();
          return;
        }

        video.src = options.source;
        done();
      });
    }

    function playVideo() {
      attachSource(function () {
        button.classList.add('is-hidden');
        var request = video.play();

        if (request && request.catch) {
          request.catch(function () {
            button.classList.remove('is-hidden');
          });
        }
      });
    }

    button.addEventListener('click', playVideo);

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
      if (shell) {
        shell.classList.add('is-playing');
      }
    });

    video.addEventListener('pause', function () {
      if (shell) {
        shell.classList.remove('is-playing');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  return {
    init: init
  };
})();
