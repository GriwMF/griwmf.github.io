(function() {
    var REST_OFFSET = -85;
    var TOGGLE_THRESHOLD = 20;
    var MAX_PULL = 60;
    var MOBILE_BP = 768;

    var container = document.getElementById('pull-cord-container');
    if (!container) return;

    var body = document.body;
    var startY = 0;
    var pulling = false;
    var moved = false;
    var toggled = false;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function isDark() {
        return body.getAttribute('data-theme') === 'dark';
    }

    function applyTheme(dark) {
        if (dark) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        container.setAttribute('aria-checked', String(dark));
    }

    function toggleTheme() {
        applyTheme(!isDark());
    }

    function setOffset(px) {
        container.style.setProperty('--pull-offset', px + 'px');
    }

    function retract() {
        container.classList.remove('is-pulling');
        container.classList.add('is-retracting');
        setOffset(REST_OFFSET);
        function onEnd() {
            container.classList.remove('is-retracting');
            container.removeEventListener('transitionend', onEnd);
        }
        container.addEventListener('transitionend', onEnd);
        setTimeout(function() {
            container.classList.remove('is-retracting');
        }, 500);
    }

    function rubberBand(delta) {
        var limit = MAX_PULL * 0.8;
        if (delta <= limit) return delta;
        var over = delta - limit;
        return limit + over * 0.3;
    }

    var saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved === 'dark');
    setOffset(REST_OFFSET);

    function getClientY(e) {
        if (e.touches && e.touches.length) return e.touches[0].clientY;
        return e.clientY;
    }

    function onStart(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        e.preventDefault();
        pulling = true;
        moved = false;
        toggled = false;
        startY = getClientY(e);
        container.classList.add('is-pulling');
        container.classList.remove('is-retracting');
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
        if (!pulling) return;
        e.preventDefault();
        var clientY = getClientY(e);
        var delta = clientY - startY;
        if (delta < 0) delta = 0;
        if (delta > MAX_PULL) delta = MAX_PULL;
        if (delta > 3) moved = true;

        if (!toggled && delta >= TOGGLE_THRESHOLD) {
            toggled = true;
            toggleTheme();
        }

        if (toggled && delta < (TOGGLE_THRESHOLD - 10)) {
            toggled = false;
        }

        var eased = rubberBand(delta);
        setOffset(REST_OFFSET + eased);
    }

    function onEnd(e) {
        if (!pulling) return;
        pulling = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);

        retract();
    }

    container.addEventListener('mousedown', onStart);
    container.addEventListener('touchstart', onStart, { passive: false });

    container.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            toggleTheme();

            if (!prefersReducedMotion.matches) {
                container.classList.add('is-pulling');
                setOffset(REST_OFFSET + 60);
                setTimeout(function() {
                    retract();
                }, 150);
            }
        }
    });

    var wasMobile = window.innerWidth <= MOBILE_BP;

    window.addEventListener('resize', function() {
        var isMobile = window.innerWidth <= MOBILE_BP;
        if (isMobile !== wasMobile) {
            wasMobile = isMobile;
            setOffset(REST_OFFSET);
        }
    });
})();
