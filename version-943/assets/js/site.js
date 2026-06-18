(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
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

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-search-input]');
            var root = panel.parentElement;
            var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
            var empty = root.querySelector('[data-empty-state]');
            var active = 'all';
            var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var shown = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var category = card.getAttribute('data-category') || '';
                    var passText = !query || text.indexOf(query) !== -1;
                    var passCategory = active === 'all' || category === active;
                    var visible = passText && passCategory;
                    card.classList.toggle('is-hidden', !visible);
                    if (visible) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', shown === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }

            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    active = chip.getAttribute('data-filter') || 'all';
                    chips.forEach(function (item) {
                        item.classList.toggle('active', item === chip);
                    });
                    apply();
                });
            });
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (box) {
            var video = box.querySelector('video');
            var button = box.querySelector('[data-play-button]');
            if (!video || !button) {
                return;
            }
            var source = video.getAttribute('data-video-src');
            var prepared = false;
            var hlsInstance = null;

            function prepare() {
                if (prepared || !source) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    prepared = true;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    prepared = true;
                    return;
                }
                video.src = source;
                prepared = true;
            }

            function play() {
                prepare();
                box.classList.add('is-playing');
                var playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(function () {
                        box.classList.remove('is-playing');
                    });
                }
            }

            button.addEventListener('click', play);
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (video.currentTime === 0 || video.ended) {
                    box.classList.remove('is-playing');
                }
            });
            window.addEventListener('pagehide', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
