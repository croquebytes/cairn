/* Cairn — motion.
   Enhancement only. With this file blocked, every arrow is already drawn and
   every section is already visible; the page is finished without it. */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var drawables = document.querySelectorAll('.draw');
  if (!drawables.length) return;

  /* Measure each path so the dash animation matches its real length. */
  Array.prototype.forEach.call(drawables, function (svg) {
    var len = 0;
    Array.prototype.forEach.call(svg.querySelectorAll('path'), function (p) {
      try { len = Math.max(len, Math.ceil(p.getTotalLength())); } catch (e) { len = 400; }
    });
    svg.style.setProperty('--len', (len || 400) + '');
  });

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(drawables, function (svg) { svg.classList.add('inked'); });
    return;
  }

  /* Failsafe. If the observer never fires — a throttled background tab, an
     embedded webview, anything that does not paint — the arrows must still
     end up drawn. The finished page is the one with everything inked. */
  var failsafe = window.setTimeout(function () {
    Array.prototype.forEach.call(drawables, function (svg) { svg.classList.add('inked'); });
  }, 4000);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      window.setTimeout(function () { el.classList.add('inked'); }, delay);
      io.unobserve(el);
    });
    if (!document.querySelector('.draw:not(.inked)')) {
      window.clearTimeout(failsafe);
      io.disconnect();
    }
  }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });

  Array.prototype.forEach.call(drawables, function (svg) { io.observe(svg); });
})();
