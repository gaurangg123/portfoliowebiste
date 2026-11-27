/* ---------- sections settle in; loops run only while on screen ----------
   Only elements that start below the first screen are held back, and only once.
   Elements that arrive together follow one another (their --i sets the delay). */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;

  if ('IntersectionObserver' in window && DF.motionOn()) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = /** @type {HTMLElement} */ (e.target);
        io.unobserve(el);
        el.classList.add('is-in');
        var done = function (/** @type {TransitionEvent} */ ev) {
          if (ev.target !== el || ev.propertyName !== 'transform') return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('reveal', 'is-in');
        };
        el.addEventListener('transitionend', done);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    DF.each(document.querySelectorAll('[data-reveal]'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight || (el.parentElement && el.parentElement.closest('.reveal'))) return;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // continuous, decorative loops (architecture packets, contact rings) only while visible
  DF.each(document.querySelectorAll('.arch__wrap, .contact'), function (el) {
    DF.watch(el, function (on) { el.classList.toggle('is-visible', on); });
  });
})();
