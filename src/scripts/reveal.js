/* ---------- sections settle in; loops run only while on screen ----------
   Only elements that start below the first screen are held back, and only once.
   Elements that arrive together follow one another (their --i sets the delay). */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;

  if ('IntersectionObserver' in window && DF.motionOn()) {
    /** @type {HTMLElement[]} */ var pending = [];
    /** @param {HTMLElement} el */
    var show = function (el) {
      io.unobserve(el);
      pending.splice(pending.indexOf(el), 1);
      el.classList.add('is-in');
      var done = function (/** @type {TransitionEvent} */ ev) {
        if (ev.target !== el || ev.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', done);
        el.classList.remove('reveal', 'is-in');
      };
      el.addEventListener('transitionend', done);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(/** @type {HTMLElement} */ (e.target)); });
    }, { rootMargin: '0px 0px -4% 0px' });
    DF.each(document.querySelectorAll('[data-reveal]'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.96 || (el.parentElement && el.parentElement.closest('.reveal'))) return;
      el.classList.add('reveal');
      pending.push(el);
      io.observe(el);
    });
    // a fast scroll or a jump to a section can carry an element past the screen between two
    // frames, so the observer never sees it; anything the reader has already reached is shown
    var queued = false;
    var sweep = function () {
      queued = false;
      var reached = pending.filter(function (el) { return el.getBoundingClientRect().top < window.innerHeight; });
      reached.forEach(show);
      if (!pending.length) window.removeEventListener('scroll', onScroll);
    };
    var onScroll = function () { if (!queued) { queued = true; setTimeout(function () { requestAnimationFrame(sweep); }, 120); } };
    if (pending.length) window.addEventListener('scroll', onScroll, { passive: true });
  }

  // continuous, decorative loops (the contact rings) only while visible
  DF.each(document.querySelectorAll('.contact'), function (el) {
    DF.watch(el, function (on) { el.classList.toggle('is-visible', on); });
  });
})();
