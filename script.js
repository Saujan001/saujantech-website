/* ============================================================
   SAUJANTECH PORTFOLIO — script.js
   ============================================================ */

const supabaseClient = window.supabase.createClient(
  'https://dmovrefukamczvgnrdcn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtb3ZyZWZ1a2FtY3p2Z25yZGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjE3MzUsImV4cCI6MjA5NDI5NzczNX0.loUkLkws_DRSPcC09rwJc7PJAdx8XXbEWi_51jsYF-U'
);

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

/* ─── AUTOMATION CARDS: fade-in on scroll ────────────────── */
(function () {
  var cards = document.querySelectorAll('.automate-card');
  if (!cards.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      var idx  = parseInt(card.getAttribute('data-group'), 10) || 0;

      setTimeout(function () {
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        card.classList.add('visible');

        /* Slide service items in from left after card appears */
        card.querySelectorAll('.automate-service').forEach(function (svc, i) {
          svc.style.opacity   = '0';
          svc.style.transform = 'translateX(-16px)';
          setTimeout(function () {
            svc.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            svc.style.opacity    = '1';
            svc.style.transform  = 'translateX(0)';
          }, i * 80);
        });
      }, idx * 150);

      observer.unobserve(card);
    });
  }, { threshold: 0.15 });

  cards.forEach(function (card) { observer.observe(card); });
})();

/* ─── CONTACT FORM: enhanced validation + Supabase save ─── */
(function () {
  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('form-submit-btn');
  var successBox = document.getElementById('form-success-box');

  if (!form) return;

  var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRx = /^(\+61|0)[0-9\s\-]{8,13}$/;

  /* ── Helpers ── */
  function showError(id, show) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('show', show);
  }

  function markField(el, valid) {
    el.classList.toggle('valid',   valid);
    el.classList.toggle('invalid', !valid);
  }

  function clearField(el, errorId) {
    el.classList.remove('valid', 'invalid');
    showError(errorId, false);
  }

  function shakeField(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    el.addEventListener('animationend', function () {
      el.classList.remove('shake');
    }, { once: true });
  }

  /* ── Validators ── */
  function validateName(el) {
    var v  = el.value.trim();
    var ok = v.length >= 2 && /^[A-Za-z\s]+$/.test(v);
    markField(el, ok);
    showError('error-name', !ok);
    return ok;
  }

  function validateEmail(el) {
    var ok = emailRx.test(el.value.trim());
    markField(el, ok);
    showError('error-email', !ok);
    return ok;
  }

  function validatePhone(el) {
    var v = el.value.trim();
    if (!v) { clearField(el, 'error-phone'); return true; }
    var ok = phoneRx.test(v);
    markField(el, ok);
    showError('error-phone', !ok);
    return ok;
  }

  function validateSelect(el, errorId) {
    var ok = el.value !== '';
    markField(el, ok);
    showError(errorId, !ok);
    return ok;
  }

  /* ── Field references ── */
  var nameEl    = document.getElementById('f-name');
  var emailEl   = document.getElementById('f-email');
  var phoneEl   = document.getElementById('f-phone');
  var bizEl     = document.getElementById('f-biz');
  var serviceEl = document.getElementById('f-service');

  /* ── Real-time listeners ── */
  nameEl.addEventListener('blur',  function () { validateName(nameEl); });
  nameEl.addEventListener('input', function () {
    if (nameEl.classList.contains('invalid')) validateName(nameEl);
  });

  emailEl.addEventListener('blur',  function () { validateEmail(emailEl); });
  emailEl.addEventListener('input', function () {
    if (emailEl.value.length >= 5) validateEmail(emailEl);
  });

  phoneEl.addEventListener('blur',  function () { validatePhone(phoneEl); });
  phoneEl.addEventListener('input', function () {
    if (phoneEl.value.length >= 5) validatePhone(phoneEl);
  });

  bizEl.addEventListener('change',     function () { validateSelect(bizEl,     'error-biz');     });
  serviceEl.addEventListener('change', function () { validateSelect(serviceEl, 'error-service'); });

  /* ── Submit ── */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var ok1 = validateName(nameEl);
    var ok2 = validateEmail(emailEl);
    var ok3 = validatePhone(phoneEl);
    var ok4 = validateSelect(bizEl,     'error-biz');
    var ok5 = validateSelect(serviceEl, 'error-service');

    if (!ok1 || !ok2 || !ok3 || !ok4 || !ok5) {
      var firstInvalid = form.querySelector('.field-input.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        shakeField(firstInvalid);
      }
      return;
    }

    submitBtn.textContent   = 'Sending…';
    submitBtn.disabled      = true;
    submitBtn.style.opacity = '0.75';

    var payload = {
      name:               nameEl.value.trim(),
      email:              emailEl.value.trim(),
      phone:              phoneEl.value.trim() || null,
      business_type:      bizEl.value,
      service_interested: serviceEl.value,
      message:            document.getElementById('f-message').value.trim()
    };

    console.log('[SaujanTech] Submitting inquiry to Supabase…', payload);

    var result = await supabaseClient
      .from('inquiries')
      .insert([payload]);

    console.log('[SaujanTech] Supabase response:', result);

    if (result.error) {
      console.error('[SaujanTech] Save failed:', result.error);
      submitBtn.textContent      = '❌ Try Again';
      submitBtn.style.opacity    = '1';
      submitBtn.style.background = '#EF4444';
      submitBtn.disabled         = false;
      setTimeout(function () {
        submitBtn.innerHTML        = 'Send &amp; Book My Free Call →';
        submitBtn.style.background = '';
      }, 5000);
      return;
    }

    console.log('[SaujanTech] Inquiry saved successfully ✅');

    submitBtn.textContent      = '✅ Sent!';
    submitBtn.style.background = '#10B981';
    submitBtn.style.opacity    = '1';

    if (successBox) {
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(function () {
      form.reset();
      form.querySelectorAll('.field-input').forEach(function (f) {
        f.classList.remove('valid', 'invalid');
      });
      form.querySelectorAll('.field-error').forEach(function (errEl) {
        errEl.classList.remove('show');
      });
      submitBtn.innerHTML        = 'Send &amp; Book My Free Call →';
      submitBtn.disabled         = false;
      submitBtn.style.opacity    = '';
      submitBtn.style.background = '';
      if (successBox) successBox.classList.remove('show');
    }, 5000);
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
