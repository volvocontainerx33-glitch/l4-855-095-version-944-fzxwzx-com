import { H as Hls } from "./hls.js";

function bindPlayer(box) {
    var video = box.querySelector("video");
    var button = box.querySelector(".player-cover");
    if (!video) {
        return;
    }
    var url = video.getAttribute("data-hls");
    var initialized = false;
    function init() {
        if (initialized || !url) {
            return;
        }
        initialized = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
        } else if (Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = url;
        }
    }
    function play() {
        init();
        if (button) {
            button.classList.add("hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }
    if (button) {
        button.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        if (button) {
            button.classList.add("hidden");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll(".player-box")).forEach(bindPlayer);
});
