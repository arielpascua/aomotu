/* ==========================================================================
   AOMOTU — site behaviour
   Progressive enhancement only: every page works with JS disabled.
   ========================================================================== */

(function () {
  'use strict';

  var on = function (el, ev, fn) { if (el) el.addEventListener(ev, fn); };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------- year - */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------ mobile nav */

  var toggle = $('#nav-toggle');
  var nav = $('#site-nav');

  on(toggle, 'click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  /* Close the mobile menu after following an in-page link. */
  $$('.site-nav a').forEach(function (a) {
    on(a, 'click', function () {
      if (nav) nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -------------------------------------------------- services hub filter - */

  var chips = $$('.filter-chip');
  var hubCards = $$('.hub-card');
  var emptyMsg = $('#filter-empty');

  if (chips.length && hubCards.length) {
    chips.forEach(function (chip) {
      on(chip, 'click', function () {
        var want = chip.getAttribute('data-filter');

        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');

        var shown = 0;
        hubCards.forEach(function (card) {
          var match = want === 'all' || card.getAttribute('data-family') === want;
          card.hidden = !match;
          if (match) shown++;
        });

        if (emptyMsg) emptyMsg.hidden = shown !== 0;
      });
    });
  }

  /* ------------------------------------------- service page TOC scrollspy - */

  var tocLinks = $$('.svc-toc-list a');

  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) {
      byId[a.getAttribute('href').slice(1)] = a;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-104px 0px -70% 0px', threshold: 0 }
    );

    $$('.svc-group').forEach(function (g) { spy.observe(g); });
  }

  /* ------------------------------------------------------- contact form --- */

  var form = $('#contact-form');

  if (form) {
    /* ------------------------------------------------------------------
     * Delivery. Default is a mailto: compose, which works with no backend.
     * To post to Formspree / Web3Forms instead, set ENDPOINT to your URL —
     * that is the only line you need to change.
     * ------------------------------------------------------------------ */
    var ENDPOINT = '';
    var TO = 'acquireinfodesk@aomotu.com';

    var sent = $('#form-sent');
    var resetBtn = $('#form-reset');

    var setError = function (input, msg) {
      var slot = $('.field-error[data-for="' + input.id + '"]', form);
      if (slot) slot.textContent = msg || '';
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    };

    var validate = function () {
      var ok = true;
      var first = null;

      $$('#contact-form [required]').forEach(function (input) {
        var value = input.value.trim();
        var msg = '';

        if (!value) {
          msg = 'This field is required.';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          msg = 'Enter a valid email address.';
        }

        setError(input, msg);
        if (msg) {
          ok = false;
          if (!first) first = input;
        }
      });

      if (first) first.focus();
      return ok;
    };

    /* Clear an error as soon as the user starts fixing it. */
    $$('#contact-form [required]').forEach(function (input) {
      on(input, 'input', function () {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, '');
      });
    });

    var showSent = function () {
      form.hidden = true;
      if (sent) sent.hidden = false;
    };

    on(form, 'submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var get = function (id) {
        var el = $('#' + id, form);
        return el ? el.value.trim() : '';
      };

      var name = get('f-name');
      var company = get('f-company');
      var email = get('f-email');
      var service = get('f-service');
      var message = get('f-message');

      if (ENDPOINT) {
        var payload = new FormData(form);
        fetch(ENDPOINT, { method: 'POST', body: payload, headers: { Accept: 'application/json' } })
          .then(showSent)
          .catch(showSent);
        return;
      }

      var subject = 'Enquiry — ' + service + ' — ' + (company || name);
      var body = [
        'Name: ' + name,
        'Company: ' + (company || '—'),
        'Email: ' + email,
        'Division: ' + service,
        '',
        message
      ].join('\n');

      window.location.href =
        'mailto:' + TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showSent();
    });

    on(resetBtn, 'click', function () {
      form.reset();
      form.hidden = false;
      if (sent) sent.hidden = true;
      $$('.field-error', form).forEach(function (s) { s.textContent = ''; });
      $$('#contact-form [required]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      var n = $('#f-name', form);
      if (n) n.focus();
    });
  }
})();
