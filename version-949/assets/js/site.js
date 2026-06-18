(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var mobilePanel = document.querySelector(".mobile-panel");
        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
        var current = 0;
        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".site-search"));
        var yearFilters = Array.prototype.slice.call(document.querySelectorAll(".year-filter"));
        function applySearch() {
            var query = searchInputs.length ? searchInputs[0].value.trim().toLowerCase() : "";
            var year = yearFilters.length ? yearFilters[0].value : "";
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .compact-card"));
            var visible = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-keywords") || "",
                    card.textContent || ""
                ].join(" ").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var matched = (!query || text.indexOf(query) !== -1) && (!year || cardYear === year);
                card.classList.toggle("hidden-by-search", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            var noResults = document.querySelector(".no-results");
            if (noResults) {
                noResults.style.display = visible ? "none" : "block";
            }
        }
        searchInputs.forEach(function (input) {
            input.addEventListener("input", applySearch);
        });
        yearFilters.forEach(function (select) {
            select.addEventListener("change", applySearch);
        });
    });
})();
