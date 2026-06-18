import { H as Hls } from './hls-dru42stk.js';

const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
        return;
    }

    callback();
};

const initMobileNavigation = () => {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-main-nav]');

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });
};

const initHeroCarousel = () => {
    const carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
        return;
    }

    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const miniItems = Array.from(carousel.querySelectorAll('[data-hero-mini]'));
    let current = 0;
    let timer = null;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === current);
        });

        miniItems.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === current);
        });
    };

    const startAutoPlay = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(current + 1), 5200);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    miniItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    showSlide(0);
    startAutoPlay();
};

const initFiltering = () => {
    const input = document.querySelector('[data-filter-input]');
    const list = document.querySelector('[data-filter-list]');
    const count = document.querySelector('[data-filter-count]');

    if (!input || !list) {
        return;
    }

    const cards = Array.from(list.querySelectorAll('.movie-card'));

    const applyFilter = () => {
        const keyword = input.value.trim().toLowerCase();
        let visible = 0;

        cards.forEach((card) => {
            const haystack = [
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.tags
            ].join(' ').toLowerCase();
            const matched = !keyword || haystack.includes(keyword);
            card.classList.toggle('is-hidden', !matched);

            if (matched) {
                visible += 1;
            }
        });

        if (count) {
            count.textContent = `${visible} 部影片`;
        }
    };

    input.addEventListener('input', applyFilter);
    applyFilter();
};

const createPlayer = (video, source, button) => {
    if (!video || !source) {
        return;
    }

    button.disabled = true;
    button.querySelector('strong').textContent = '正在加载';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', () => video.play(), { once: true });
        button.remove();
        return;
    }

    if (Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
            button.remove();
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data && data.fatal) {
                button.disabled = false;
                button.querySelector('strong').textContent = '播放失败，点击重试';
                hls.destroy();
            }
        });
        return;
    }

    video.src = source;
    button.remove();
};

const initPlayers = () => {
    document.querySelectorAll('[data-play-button]').forEach((button) => {
        button.addEventListener('click', () => {
            const video = document.getElementById(button.dataset.videoId);
            const source = button.dataset.videoSrc;
            createPlayer(video, source, button);
        });
    });
};

ready(() => {
    initMobileNavigation();
    initHeroCarousel();
    initFiltering();
    initPlayers();
});
