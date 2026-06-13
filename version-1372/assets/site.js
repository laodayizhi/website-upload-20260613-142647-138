
(function () {
    function $(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('.menu-toggle');
        var links = document.querySelector('.nav-links');
        if (!button || !links) {
            return;
        }
        button.addEventListener('click', function () {
            links.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = $('[data-hero-slide]', hero);
        var dots = $('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function setActive(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
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
                setActive(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setActive(parseInt(dot.getAttribute('data-hero-dot'), 10));
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                setActive(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setActive(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initFilters() {
        $('[data-card-scope]').forEach(function (scope) {
            var panel = scope.querySelector('[data-filter-panel]') || document.querySelector('[data-filter-panel]');
            var cards = $('.movie-card', scope);
            var count = scope.querySelector('[data-result-count]');
            if (!panel || !cards.length) {
                return;
            }
            var search = panel.querySelector('[data-movie-search]');
            var selects = $('[data-filter-select]', panel);

            function valueOf(name) {
                var item = panel.querySelector('[data-filter-select="' + name + '"]');
                return item ? item.value.trim() : '';
            }

            function apply() {
                var query = search ? search.value.trim().toLowerCase() : '';
                var type = valueOf('type');
                var year = valueOf('year');
                var region = valueOf('region');
                var shown = 0;

                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    var ok = true;
                    if (query && text.indexOf(query) === -1) {
                        ok = false;
                    }
                    if (type && card.getAttribute('data-type') !== type) {
                        ok = false;
                    }
                    if (year && card.getAttribute('data-year') !== year) {
                        ok = false;
                    }
                    if (region && card.getAttribute('data-region') !== region) {
                        ok = false;
                    }
                    card.hidden = !ok;
                    if (ok) {
                        shown += 1;
                    }
                });

                if (count) {
                    count.textContent = '当前显示 ' + shown + ' 部影片';
                }
            }

            if (search) {
                search.addEventListener('input', apply);
            }
            selects.forEach(function (select) {
                select.addEventListener('change', apply);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
