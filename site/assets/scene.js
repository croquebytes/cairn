/* Cairn — the board as a scene.
   Enhancement only. With this file blocked the stage stays hidden and the
   panels read as a plain document; the pill nav is plain anchor links.

   Camera model
   ------------
   The plane is authored in fixed board units. One `view` object {s, x, y} is
   the camera: transform = translate(x, y) scale(s). Three things move it —
   fit() (the resting shot), zoomTo() (a panel opening), and the user (wheel,
   pinch, drag). They all write to the same state so they can never disagree.

   fit() frames the CONTENT box, not the plane. Authored padding around the
   objects would otherwise be scaled up into dead gutters, which is exactly
   the thing that made the board look small. */
(function () {
  'use strict';

  var stage = document.getElementById('stage');
  var plane = document.getElementById('plane');
  var scrim = document.getElementById('scrim');
  if (!stage || !plane) return;

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MARGIN   = 30;   /* px of breathing room around the content box —
                          tight margins read as clipping, not as fit */
  var ZOOM_MIN = 0.85; /* × fit — a little looser than the resting shot */
  var ZOOM_MAX = 7;    /* × fit */
  var DRAG_SLOP = 5;   /* px before a press becomes a pan instead of a click */

  var content = null;              /* {x, y, w, h} in board units */
  var base = { s: 1, x: 0, y: 0 }; /* the fitted camera */
  var view = { s: 1, x: 0, y: 0 }; /* the live camera */
  var openId = null;
  var opener = null;

  stage.hidden = false;
  if (scrim) scrim.hidden = true;

  /* ---------------------------------------------------------------- util */

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* Below 900px the stage is display:none and the panels are the document.
     Every camera path checks this first — a hidden stage measures zero, and
     fitting to zero produces nonsense. */
  function sceneActive() {
    return stage.offsetParent !== null && stage.clientWidth > 0;
  }

  function chromeHeight() {
    var h = 0;
    ['.nav', '.map', '.footer--flat'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) h += el.offsetHeight;
    });
    return h;
  }

  /* Measure the union of the real objects, in board units, while the plane
     sits at identity. Runs once — the board is authored, not fluid. */
  function measureContent() {
    var prev = plane.style.transform;
    plane.style.transition = 'none';
    plane.style.transform = 'none';
    var p = plane.getBoundingClientRect();
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Array.prototype.forEach.call(plane.children, function (el) {
      if (el.classList.contains('ghost')) return;      /* smudges don't count */
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      minX = Math.min(minX, r.left - p.left);
      minY = Math.min(minY, r.top - p.top);
      maxX = Math.max(maxX, r.right - p.left);
      maxY = Math.max(maxY, r.bottom - p.top);
    });
    plane.style.transform = prev;
    plane.style.transition = '';
    if (!isFinite(minX)) {
      return { x: 0, y: 0, w: plane.offsetWidth, h: plane.offsetHeight };
    }
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }

  function apply(t, live) {
    plane.classList.toggle('plane--live', !!live);
    plane.style.transform =
      'translate(' + t.x + 'px,' + t.y + 'px) scale(' + t.s + ')';
  }

  /* Keep the content overlapping the stage. When it fits a given axis it is
     centred on that axis; when it overflows you may pan, but not into
     nothing. */
  function clampView() {
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var cw = content.w * view.s, ch = content.h * view.s;
    var ox = content.x * view.s, oy = content.y * view.s;
    if (cw <= sw - MARGIN * 2) {
      view.x = (sw - cw) / 2 - ox;
    } else {
      view.x = clamp(view.x, sw - MARGIN - ox - cw, MARGIN - ox);
    }
    if (ch <= sh - MARGIN * 2) {
      view.y = (sh - ch) / 2 - oy;
    } else {
      view.y = clamp(view.y, sh - MARGIN - oy - ch, MARGIN - oy);
    }
  }

  function fit() {
    if (!sceneActive()) return;
    var avail = Math.max(window.innerHeight - chromeHeight(), 380);
    stage.style.height = avail + 'px';

    var sw = stage.clientWidth, sh = stage.clientHeight;
    if (!content) content = measureContent();

    /* Narrow viewports: let the stage take the height the board needs rather
       than squashing the board into a letterbox. */
    if ((sw - MARGIN * 2) / content.w < (sh - MARGIN * 2) / content.h) {
      sh = Math.round(content.h * (sw - MARGIN * 2) / content.w) + MARGIN * 2;
      sh = Math.max(sh, 300);
      stage.style.height = sh + 'px';
      sh = stage.clientHeight;
    }

    var s = Math.min((sw - MARGIN * 2) / content.w,
                     (sh - MARGIN * 2) / content.h);
    base = {
      s: s,
      x: (sw - content.w * s) / 2 - content.x * s,
      y: (sh - content.h * s) / 2 - content.y * s
    };
    if (openId) { zoomTo(openId); }
    else { view = { s: base.s, x: base.x, y: base.y }; apply(view, false); }
    syncZoomUI();
  }

  /* ---------------------------------------------------------------- zoom */

  function zoomAt(cx, cy, factor, live) {
    if (!sceneActive()) return false;
    var s0 = view.s;
    var s1 = clamp(s0 * factor, base.s * ZOOM_MIN, base.s * ZOOM_MAX);
    if (Math.abs(s1 - s0) < 1e-6) return false;
    /* hold the board point under the cursor still */
    view.x = cx - (cx - view.x) * (s1 / s0);
    view.y = cy - (cy - view.y) * (s1 / s0);
    view.s = s1;
    clampView();
    apply(view, live !== false);
    syncZoomUI();
    return true;
  }

  function resetView() {
    view = { s: base.s, x: base.x, y: base.y };
    apply(view, false);
    syncZoomUI();
  }

  function stagePoint(e) {
    var r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /* wheel + trackpad pinch. A trackpad pinch arrives as a wheel event with
     ctrlKey set; two-finger scroll arrives as a plain wheel. Both zoom, per
     the brief — but once the board is back at its resting size, a further
     scroll down is handed to the page instead of being swallowed. */
  stage.addEventListener('wheel', function (e) {
    if (e.target.closest && e.target.closest('.panel')) return;
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 16;        /* lines  */
    else if (e.deltaMode === 2) dy *= 400;  /* pages  */

    if (dy > 0 && view.s <= base.s * ZOOM_MIN + 1e-4) return; /* let it scroll */

    e.preventDefault();
    var p = stagePoint(e);
    var k = e.ctrlKey ? 0.012 : 0.0026;     /* pinch bites harder than scroll */
    zoomAt(p.x, p.y, Math.exp(-dy * k), true);
    idle();
  }, { passive: false });

  /* -------------------------------------------------- drag pan and pinch */

  var pointers = new Map();
  var dragging = false, moved = 0, last = null, pinchDist = 0;

  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('.panel')) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      dragging = true; moved = 0;
      last = { x: e.clientX, y: e.clientY };
    } else if (pointers.size === 2) {
      dragging = false;
      var pts = Array.from(pointers.values());
      pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  });

  window.addEventListener('pointermove', function (e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      var pts = Array.from(pointers.values());
      var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchDist > 0 && d > 0) {
        var r = stage.getBoundingClientRect();
        zoomAt((pts[0].x + pts[1].x) / 2 - r.left,
               (pts[0].y + pts[1].y) / 2 - r.top,
               d / pinchDist, true);
      }
      pinchDist = d;
      moved = DRAG_SLOP + 1;
      return;
    }

    if (!dragging || !last) return;
    var dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved <= DRAG_SLOP) return;
    last = { x: e.clientX, y: e.clientY };
    view.x += dx; view.y += dy;
    clampView();
    apply(view, true);
    stage.classList.add('stage--panning');
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 0) {
      dragging = false; last = null;
      stage.classList.remove('stage--panning');
      idle();
    }
  }
  window.addEventListener('pointerup', endPointer);
  window.addEventListener('pointercancel', endPointer);

  /* a pan must not also register as "open this note" */
  stage.addEventListener('click', function (e) {
    if (moved > DRAG_SLOP) { e.stopPropagation(); e.preventDefault(); moved = 0; }
  }, true);

  /* re-enable the eased transition once the gesture stops */
  var idleT;
  function idle() {
    window.clearTimeout(idleT);
    idleT = window.setTimeout(function () {
      plane.classList.remove('plane--live');
    }, 140);
  }

  stage.addEventListener('dblclick', function (e) {
    if (e.target.closest && e.target.closest('.spot')) return;
    resetView();
  });

  /* ------------------------------------------------------------- zoom UI */

  /* ----------------------------------------------------------- sticker notes
     Hover a sticker, get a line about it. The tooltip lives in the stage, not
     the plane, so it stays a constant readable size no matter how far the
     board is zoomed out — a tooltip inside .plane would render at 0.8x and be
     unreadable at fit.

     Mouse affordance only, by design: the stickers stay aria-hidden, and every
     line here is also written out in the "Ask me how" panel, which is keyboard
     reachable. Nothing is hover-only. */
  var tip = document.createElement('div');
  tip.className = 'sticker-tip';
  tip.hidden = true;
  stage.appendChild(tip);

  var tipFor = null;

  function hideTip() {
    if (!tipFor) return;
    tipFor = null;
    tip.hidden = true;
    tip.classList.remove('is-on');
  }

  function showTip(el) {
    var title = el.getAttribute('data-note-title') || '';
    var body = el.getAttribute('data-note') || '';
    if (!body) return;
    tipFor = el;
    tip.innerHTML = '';
    if (title) {
      var h = document.createElement('span');
      h.className = 'sticker-tip-title mono';
      h.textContent = title;
      tip.appendChild(h);
    }
    var b = document.createElement('span');
    b.className = 'sticker-tip-body';
    b.textContent = body;
    tip.appendChild(b);

    tip.hidden = false;
    /* measure, then place: above the sticker, clamped inside the stage */
    var sr = stage.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    var tr = tip.getBoundingClientRect();
    var x = (er.left - sr.left) + er.width / 2 - tr.width / 2;
    var y = (er.top - sr.top) - tr.height - 12;
    if (y < 8) y = (er.bottom - sr.top) + 12;          /* flip below if no room */
    x = Math.max(8, Math.min(x, stage.clientWidth - tr.width - 8));
    y = Math.max(8, Math.min(y, stage.clientHeight - tr.height - 8));
    tip.style.left = Math.round(x) + 'px';
    tip.style.top = Math.round(y) + 'px';
    tip.classList.add('is-on');
  }

  plane.addEventListener('mouseover', function (e) {
    var el = e.target.closest && e.target.closest('.sticker-hot');
    if (el && el !== tipFor && !openId) showTip(el);
  });
  plane.addEventListener('mouseout', function (e) {
    var el = e.target.closest && e.target.closest('.sticker-hot');
    if (el && el === tipFor) hideTip();
  });
  /* any camera move or panel change invalidates the position */
  stage.addEventListener('pointerdown', hideTip);
  stage.addEventListener('wheel', hideTip, { passive: true });
  window.addEventListener('resize', hideTip);

  var zoomUI = document.querySelector('.zoomui');
  function syncZoomUI() {
    /* Once zoomed in, the stage takes over touch so pan and pinch work. Until
       then it leaves vertical drag to the page, so a phone is never trapped. */
    stage.classList.toggle('stage--zoomed', view.s > base.s * 1.02);
    if (!zoomUI) return;
    var z = base.s ? view.s / base.s : 1;
    zoomUI.classList.toggle('zoomui--active', z > 1.02 || z < 0.98);
    var out = zoomUI.querySelector('[data-zoom="out"]');
    var inn = zoomUI.querySelector('[data-zoom="in"]');
    if (out) out.disabled = view.s <= base.s * ZOOM_MIN + 1e-4;
    if (inn) inn.disabled = view.s >= base.s * ZOOM_MAX - 1e-4;
    var lvl = zoomUI.querySelector('[data-zoom="level"]');
    if (lvl) lvl.textContent = Math.round(z * 100) + '%';
  }
  if (zoomUI) {
    zoomUI.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-zoom]');
      if (!btn) return;
      var act = btn.getAttribute('data-zoom');
      if (act === 'reset') { resetView(); return; }
      if (act === 'in' || act === 'out') {
        zoomAt(stage.clientWidth / 2, stage.clientHeight / 2,
               act === 'in' ? 1.35 : 1 / 1.35, false);
      }
    });
  }

  /* keyboard: + / - zoom about the centre, 0 refits */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === '+' || e.key === '=') {
      zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1.35, false); e.preventDefault();
    } else if (e.key === '-' || e.key === '_') {
      zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1 / 1.35, false); e.preventDefault();
    } else if (e.key === '0') {
      resetView(); e.preventDefault();
    }
  });

  /* --------------------------------------------------------- panel zooms */

  function spotFor(id) {
    return plane.querySelector('.spot[data-panel="' + id + '"]');
  }

  function zoomTo(id) {
    var spot = spotFor(id);
    if (!spot) { resetView(); return; }
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var mobile = window.matchMedia('(max-width: 899px)').matches;
    /* leave room for the sheet: right side on desktop, bottom on mobile */
    var availW = mobile ? sw : Math.max(sw - Math.min(600, sw * 0.46), sw * 0.4);
    var availH = mobile ? Math.max(sh * 0.42, 200) : sh;
    var x = spot.offsetLeft, y = spot.offsetTop,
        w = spot.offsetWidth || 1, h = spot.offsetHeight || 1;
    var pad = 60;
    var z = Math.min(availW / (w + pad * 2), availH / (h + pad * 2));
    z = clamp(z, base.s * 1.15, base.s * 2.7);
    view = { s: z, x: (availW - w * z) / 2 - x * z, y: (availH - h * z) / 2 - y * z };
    apply(view, false);
    syncZoomUI();
  }

  function setCurrent(id) {
    document.querySelectorAll('.map .pill').forEach(function (p) {
      if (p.getAttribute('data-panel') === id) p.setAttribute('aria-current', 'true');
      else p.removeAttribute('aria-current');
    });
    document.querySelectorAll('.spot').forEach(function (s) {
      s.classList.toggle('spot--active', s.getAttribute('data-panel') === id);
    });
  }

  function open(id, from) {
    if (!sceneActive()) return;   /* document mode: the anchor does the work */
    var panel = document.getElementById('panel-' + id);
    if (!panel) return;
    if (openId && openId !== id) {
      var prev = document.getElementById('panel-' + openId);
      if (prev) prev.classList.remove('open');
    }
    openId = id;
    opener = from || spotFor(id);
    panel.classList.add('open');
    document.body.classList.add('panel-open');
    if (scrim) scrim.hidden = false;
    setCurrent(id);
    zoomTo(id);
    var closeBtn = panel.querySelector('.panel-close');
    window.setTimeout(function () { (closeBtn || panel).focus(); }, reduced ? 0 : 180);
    if (history.replaceState) history.replaceState(null, '', '#panel-' + id);
  }

  function close() {
    if (!openId) return;
    var panel = document.getElementById('panel-' + openId);
    if (panel) panel.classList.remove('open');
    document.body.classList.remove('panel-open');
    if (scrim) scrim.hidden = true;
    setCurrent(null);
    openId = null;
    resetView();
    if (opener && opener.focus) opener.focus();
    opener = null;
    if (history.replaceState) history.replaceState(null, '', location.pathname);
  }

  /* ------------------------------------------------------------- wiring */

  plane.addEventListener('click', function (e) {
    var spot = e.target.closest ? e.target.closest('.spot') : null;
    if (!spot) return;
    var id = spot.getAttribute('data-panel');
    if (openId === id) { close(); return; }
    open(id, spot);
  });

  document.querySelectorAll('.map .pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      if (!sceneActive()) return;  /* let the href scroll to the section */
      e.preventDefault();
      var id = pill.getAttribute('data-panel');
      if (openId === id) { close(); return; }
      open(id, pill);
    });
  });

  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', close);
  });
  if (scrim) scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  var rT;
  window.addEventListener('resize', function () {
    window.clearTimeout(rT);
    rT = window.setTimeout(function () { content = measureContent(); fit(); }, 120);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (sceneActive()) { content = measureContent(); fit(); }
    });
  }

  fit();

  /* deep link: #panel-x opens that section's zoom on load */
  if (location.hash && location.hash.indexOf('#panel-') === 0) {
    var id = location.hash.slice(7);
    if (document.getElementById('panel-' + id) && sceneActive()) {
      window.setTimeout(function () { open(id, null); }, reduced ? 0 : 350);
    }
  }
})();
