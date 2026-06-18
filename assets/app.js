(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var links = document.querySelector('[data-nav-links]');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));
  var activeCategory = 'all';

  function findScope(input) {
    var section = input.closest('section');
    var next = section ? section.nextElementSibling : null;
    var localScope = section ? section.querySelector('[data-search-scope]') : null;

    if (localScope) {
      return localScope;
    }

    if (next) {
      return next.querySelector('[data-search-scope]') || document;
    }

    return document;
  }

  function currentQuery() {
    var focused = document.activeElement;

    if (focused && focused.matches && focused.matches('[data-search-input]')) {
      return focused.value.trim().toLowerCase();
    }

    return searchInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).filter(Boolean)[0] || '';
  }

  function updateCards(scope) {
    var query = currentQuery();
    var scopedCards = scope ? Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]')) : cards;
    var shown = 0;

    scopedCards.forEach(function (card) {
      var haystack = card.getAttribute('data-search') || '';
      var category = card.getAttribute('data-category') || '';
      var categoryMatch = activeCategory === 'all' || category === activeCategory;
      var queryMatch = !query || haystack.indexOf(query) !== -1;
      var visible = categoryMatch && queryMatch;

      card.classList.toggle('is-hidden', !visible);

      if (visible) {
        shown += 1;
      }
    });

    var empty = scope ? scope.querySelector('[data-empty-state]') : null;

    if (!empty && scope) {
      empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.setAttribute('data-empty-state', '');
      empty.textContent = '没有匹配的影片';
      scope.appendChild(empty);
    }

    if (empty) {
      empty.style.display = shown ? 'none' : 'block';
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      updateCards(findScope(input));
    });
  });

  var resetButtons = Array.prototype.slice.call(document.querySelectorAll('[data-search-reset]'));

  resetButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeCategory = 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-filter-category') === 'all');
      });
      window.setTimeout(function () {
        updateCards(document);
      }, 0);
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeCategory = button.getAttribute('data-filter-category') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      updateCards(document);
    });
  });
})();
