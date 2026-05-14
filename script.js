/* ============================================================
   SAUJANTECH PORTFOLIO — script.js
   ============================================================ */

/* ─── NAV: scroll-triggered glass effect ──────────────────── */
(function () {
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── NAV: mobile hamburger toggle ───────────────────────── */
(function () {
  var btn   = document.getElementById('nav-hamburger');
  var links = document.getElementById('nav-links');

  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.textContent = open ? '✕' : '☰';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Close menu when any nav link is clicked */
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      btn.textContent = '☰';
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ─── HERO DASHBOARD: cycling activity feed ──────────────── */
(function () {
  var messages = [
    { icon: '✅', title: 'New booking received',    sub: 'Himalayan Kitchen · Table for 4 at 7:30pm',      tone: 'green'  },
    { icon: '💬', title: 'Customer replied',         sub: '"Yes, Saturday works perfectly. Thanks!"',        tone: 'cyan'   },
    { icon: '⭐', title: 'Review request sent',      sub: '3 Google review invites delivered via SMS',       tone: 'amber'  },
    { icon: '🤖', title: 'Voice agent answered call',sub: '02:14 · routed to booking flow',                 tone: 'blue'   },
    { icon: '📧', title: 'Campaign delivered',        sub: 'Diwali special — 412 recipients · 38% open',    tone: 'purple' }
  ];

  var toneDot = {
    green:  '#10B981',
    cyan:   '#22D3EE',
    amber:  '#F59E0B',
    blue:   '#60A5FA',
    purple: '#C084FC'
  };

  var feed    = document.getElementById('activity-feed');
  var queue   = messages.slice(0, 3);
  var nextIdx = 3;

  function renderFeed() {
    feed.innerHTML = '';
    queue.forEach(function (m) {
      var item = document.createElement('div');
      item.className = 'feed-item tone-' + m.tone;
      item.innerHTML =
        '<div class="feed-item-icon">' + m.icon + '</div>' +
        '<div class="feed-item-body">' +
          '<div class="feed-item-title">' +
            '<span class="feed-item-dot" style="background:' + toneDot[m.tone] + '"></span>' +
            escapeHtml(m.title) +
          '</div>' +
          '<div class="feed-item-sub">' + escapeHtml(m.sub) + '</div>' +
        '</div>';
      feed.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderFeed();

  setInterval(function () {
    var next = messages[nextIdx % messages.length];
    nextIdx++;
    queue = [next].concat(queue).slice(0, 3);
    renderFeed();
  }, 3200);
})();

/* ─── STATS: count-up on scroll into view ────────────────── */
(function () {
  var statNums = document.querySelectorAll('.stat-num[data-target]');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el, target, suffix, duration) {
    var start     = null;
    var startVal  = 0;

    function step(ts) {
      if (!start) start = ts;
      var elapsed  = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutCubic(progress);
      var current  = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        animateCount(el, target, suffix, 1400);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ─── CONTACT FORM: validation + success state ───────────── */
(function () {
  var form      = document.getElementById('contact-form');
  var submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Basic required-field check */
    var invalid = false;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow   = '0 0 0 4px rgba(239,68,68,0.12)';
        invalid = true;
        field.addEventListener('input', function () {
          field.style.borderColor = '';
          field.style.boxShadow   = '';
        }, { once: true });
      }
    });
    if (invalid) return;

    /* Success state */
    submitBtn.textContent = '✅ Got it — I\'ll be in touch within 24h';
    submitBtn.disabled    = true;
    submitBtn.style.opacity = '0.85';

    /* Reset after 4.5 s */
    setTimeout(function () {
      form.reset();
      submitBtn.innerHTML  = 'Send &amp; Book My Free Call →';
      submitBtn.disabled   = false;
      submitBtn.style.opacity = '';
    }, 4500);
  });
})();

/* ─── SMOOTH ANCHOR SCROLL (fallback for older browsers) ─── */
(function () {
  /* Modern browsers already handle scroll-behavior: smooth in CSS.
     This is a safety-net for iOS Safari < 15.4.               */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
