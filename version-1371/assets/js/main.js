(function () {
  var body = document.body;
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var opened = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-pressed', i === current ? 'true' : 'false');
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      window.clearInterval(timer);
      showSlide(index);
      startSlider();
    });
  });

  showSlide(0);
  startSlider();

  var filterRoots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));

  function valueOf(element) {
    return (element && element.value ? element.value : '').trim().toLowerCase();
  }

  function matchCard(card, query, type, year, region) {
    var title = (card.getAttribute('data-title') || '').toLowerCase();
    var genre = (card.getAttribute('data-genre') || '').toLowerCase();
    var tags = (card.getAttribute('data-tags') || '').toLowerCase();
    var cardType = (card.getAttribute('data-type') || '').toLowerCase();
    var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
    var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
    var text = [title, genre, tags, cardType, cardYear, cardRegion].join(' ');

    if (query && text.indexOf(query) === -1) {
      return false;
    }
    if (type && cardType.indexOf(type) === -1) {
      return false;
    }
    if (year && cardYear.indexOf(year) === -1) {
      return false;
    }
    if (region && cardRegion.indexOf(region) === -1) {
      return false;
    }
    return true;
  }

  filterRoots.forEach(function (root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
    var queryInput = root.querySelector('[data-filter-query]');
    var typeInput = root.querySelector('[data-filter-type]');
    var yearInput = root.querySelector('[data-filter-year]');
    var regionInput = root.querySelector('[data-filter-region]');
    var empty = root.querySelector('.empty-state');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && queryInput) {
      queryInput.value = initialQuery;
    }

    function applyFilters() {
      var query = valueOf(queryInput);
      var type = valueOf(typeInput);
      var year = valueOf(yearInput);
      var region = valueOf(regionInput);
      var visible = 0;

      cards.forEach(function (card) {
        var keep = matchCard(card, query, type, year, region);
        card.hidden = !keep;
        if (keep) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [queryInput, typeInput, yearInput, regionInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilters);
        input.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
