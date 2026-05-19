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
  var phoneRx = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

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
    var digitsOnly = v.replace(/\D/g, '');
    var ok = phoneRx.test(v) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
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

    /* Send emails via Resend API — form success is not blocked if this fails */
    try {
      var emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:               payload.name,
          email:              payload.email,
          phone:              payload.phone || '',
          business_type:      payload.business_type,
          service_interested: payload.service_interested,
          message:            payload.message || ''
        })
      });
      var emailResult = await emailRes.json();
      if (!emailRes.ok) {
        console.error('[SaujanTech] Email error:', emailResult);
      } else {
        console.log('[SaujanTech] Emails sent:', emailResult);
      }
    } catch (emailError) {
      console.error('[SaujanTech] Email fetch error:', emailError);
    }

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

// ================================
// CONSULTATION MODAL
// ================================

const modal = document.getElementById('consultation-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalForm = document.getElementById('modal-contact-form');
const modalSubmitBtn = document.getElementById('modal-submit-btn');
const modalBtnText = document.getElementById('modal-btn-text');
const modalSuccess = document.getElementById('modal-success');
const modalError = document.getElementById('modal-error');

// Open modal function
function openModal() {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.getElementById('modal-name').focus();
  }, 300);
}

// Close modal function
function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalForm.reset();
  modalSuccess.style.display = 'none';
  modalError.style.display = 'none';
  modalBtnText.textContent = 'Book My Free Consultation →';
  modalSubmitBtn.disabled = false;
  document.querySelectorAll('.modal-field input, .modal-field select').forEach(el => {
    el.classList.remove('valid', 'invalid');
  });
  document.querySelectorAll('.modal-field-error').forEach(el => {
    el.textContent = '';
  });
}

// Find ALL buttons that say Get Free Consultation or Book Free Call
// and attach the open modal function to them
document.querySelectorAll('a[href="#contact"], .cta-btn, .nav-cta, .consultation-btn').forEach(btn => {
  const text = btn.textContent.toLowerCase();
  if (text.includes('consultation') || text.includes('free call') || text.includes('book')) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
});

// Also find the button by text content anywhere on the page
document.querySelectorAll('button, a').forEach(btn => {
  if (btn.textContent.trim().toLowerCase().includes('get free consultation')) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
});

// Close on X button
modalCloseBtn.addEventListener('click', closeModal);

// Close on clicking dark overlay outside modal
modal.addEventListener('click', function(e) {
  if (e.target === modal) closeModal();
});

// Close on pressing Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Modal form validation
function validateModalField(input, errorId, rules) {
  const error = document.getElementById(errorId);
  const value = input.value.trim();
  let message = '';

  if (rules.required && !value) {
    message = rules.requiredMsg || 'This field is required';
  } else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = 'Please enter a valid email — e.g. hello@gmail.com';
  } else if (rules.phone && value && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(value)) {
    message = 'Please enter a valid phone number — numbers only';
  }

  if (error) error.textContent = message;
  input.classList.toggle('invalid', !!message);
  input.classList.toggle('valid', !message && !!value);
  return !message;
}

// Validate on blur
document.getElementById('modal-name').addEventListener('blur', function() {
  validateModalField(this, 'modal-name-error', { required: true, requiredMsg: 'Please enter your name' });
});
document.getElementById('modal-email').addEventListener('blur', function() {
  validateModalField(this, 'modal-email-error', { required: true, email: true });
});
document.getElementById('modal-phone').addEventListener('blur', function() {
  validateModalField(this, 'modal-phone-error', { phone: true });
});
document.getElementById('modal-business').addEventListener('blur', function() {
  validateModalField(this, 'modal-business-error', { required: true, requiredMsg: 'Please select your business type' });
});
document.getElementById('modal-service').addEventListener('blur', function() {
  validateModalField(this, 'modal-service-error', { required: true, requiredMsg: 'Please select a service' });
});

// Real time email validation
document.getElementById('modal-email').addEventListener('input', function() {
  if (this.value.length > 5) {
    validateModalField(this, 'modal-email-error', { email: true });
  }
});

// Modal form submit
modalForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Validate all required fields
  const nameValid = validateModalField(document.getElementById('modal-name'), 'modal-name-error', { required: true, requiredMsg: 'Please enter your name' });
  const emailValid = validateModalField(document.getElementById('modal-email'), 'modal-email-error', { required: true, email: true });
  const businessValid = validateModalField(document.getElementById('modal-business'), 'modal-business-error', { required: true, requiredMsg: 'Please select your business type' });
  const serviceValid = validateModalField(document.getElementById('modal-service'), 'modal-service-error', { required: true, requiredMsg: 'Please select a service' });

  if (!nameValid || !emailValid || !businessValid || !serviceValid) {
    const firstInvalid = modalForm.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Show loading state
  modalSubmitBtn.disabled = true;
  modalBtnText.textContent = 'Sending...';
  modalSuccess.style.display = 'none';
  modalError.style.display = 'none';

  const formData = {
    name: document.getElementById('modal-name').value.trim(),
    email: document.getElementById('modal-email').value.trim(),
    phone: document.getElementById('modal-phone').value.trim(),
    business_type: document.getElementById('modal-business').value,
    service_interested: document.getElementById('modal-service').value,
    message: document.getElementById('modal-message').value.trim()
  };

  try {
    // Save to Supabase
    const { error: dbError } = await supabaseClient
      .from('inquiries')
      .insert([formData]);

    if (dbError) throw dbError;

    // Send emails via Resend
    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const emailResult = await emailRes.json();
      if (!emailRes.ok) {
        console.error('Email error:', emailResult);
      } else {
        console.log('Emails sent:', emailResult);
      }
    } catch (emailError) {
      console.error('Email fetch error:', emailError);
    }

    // Show success
    modalBtnText.textContent = '✅ Sent!';
    modalSuccess.style.display = 'block';
    modalForm.reset();

    // Auto close after 4 seconds
    setTimeout(() => {
      closeModal();
    }, 4000);

  } catch (err) {
    console.error('Form error:', err);
    modalBtnText.textContent = '❌ Try Again';
    modalSubmitBtn.disabled = false;
    modalError.style.display = 'block';
  }
});

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

// ================================
// GALLERY PREVIEW — Load from Supabase
// ================================

async function loadGalleryPreview() {
  const grid = document.getElementById('gallery-preview-grid');
  if (!grid) return;

  try {
    const { data: photos, error } = await supabaseClient
      .from('photos')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(6);

    if (error) throw error;

    grid.innerHTML = '';

    if (!photos || photos.length === 0) {
      const placeholders = [
        { icon: '📸', label: 'Client Meeting' },
        { icon: '🤝', label: 'Business Visit' },
        { icon: '🎤', label: 'Conference' },
        { icon: '💻', label: 'Working Session' },
        { icon: '🏆', label: 'Achievement' },
        { icon: '🌏', label: 'Community Event' }
      ];
      placeholders.forEach(p => {
        const item = document.createElement('div');
        item.className = 'gallery-preview-item';
        item.innerHTML = `
          <div class="gallery-placeholder-box">
            ${p.icon}
            <span>${p.label}</span>
          </div>
        `;
        grid.appendChild(item);
      });
      return;
    }

    photos.forEach((photo, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-preview-item';
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
      item.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption || 'SaujanTech Gallery'}" loading="lazy" />
        <div class="gallery-preview-overlay">
          <span class="gallery-preview-caption">${photo.caption || ''}</span>
        </div>
      `;
      item.addEventListener('click', () => {
        window.location.href = 'gallery/index.html';
      });
      grid.appendChild(item);
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 + index * 100);
    });

  } catch (err) {
    console.error('Gallery preview error:', err);
    grid.innerHTML = '<p style="color:#64748B;text-align:center;padding:40px;">Photos coming soon.</p>';
  }
}

// ================================
// BLOG PREVIEW — Load from Supabase
// ================================

async function loadBlogPreview() {
  const grid = document.getElementById('blog-preview-grid');
  if (!grid) return;

  try {
    const { data: posts, error } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    grid.innerHTML = '';

    if (!posts || posts.length === 0) {
      const placeholders = [
        { icon: '🤖', title: 'How AI Automation is Changing Business in Sydney', excerpt: 'Discover how smart automation is helping local businesses save time and grow faster.', badge: 'AI AUTOMATION' },
        { icon: '🌐', title: 'Why Every Nepalese Business Needs a Website in 2026', excerpt: 'If your business is not online in 2026 you are invisible to most of your potential customers.', badge: 'WEB DESIGN' },
        { icon: '⏰', title: '5 Automations That Save Business Owners 10 Hours a Week', excerpt: 'These five simple automations are not complicated but together they save serious time.', badge: 'PRODUCTIVITY' }
      ];
      const variants = ['variant-1', 'variant-2', 'variant-3'];
      placeholders.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'blog-preview-card';
        card.innerHTML = `
          <div class="blog-card-cover-placeholder ${variants[i]}">${p.icon}</div>
          <div class="blog-card-body">
            <span class="blog-card-badge">${p.badge}</span>
            <h3 class="blog-card-title">${p.title}</h3>
            <p class="blog-card-excerpt">${p.excerpt}</p>
            <div class="blog-card-meta">
              <span class="blog-card-date">Coming soon</span>
              <span class="blog-card-readmore">Read More →</span>
            </div>
          </div>
        `;
        grid.appendChild(card);
        setTimeout(() => card.classList.add('visible'), 200 + i * 150);
      });
      return;
    }

    const variants = ['variant-1', 'variant-2', 'variant-3'];
    const icons = ['🤖', '🌐', '⏰'];

    posts.forEach((post, i) => {
      const card = document.createElement('a');
      card.className = 'blog-preview-card';
      card.href = `/blog/post?slug=${post.slug}`;

      const date = new Date(post.created_at).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      const wordCount = post.body ? post.body.replace(/<[^>]*>/g, '').split(' ').length : 0;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const coverHtml = post.cover_image
        ? `<img class="blog-card-cover" src="${post.cover_image}" alt="${post.title}" loading="lazy" />`
        : `<div class="blog-card-cover-placeholder ${variants[i % 3]}">${icons[i % 3]}</div>`;

      card.innerHTML = `
        ${coverHtml}
        <div class="blog-card-body">
          <span class="blog-card-badge">AI AUTOMATION</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt || ''}</p>
          <div class="blog-card-meta">
            <span class="blog-card-date">${date} · ${readTime} min read</span>
            <span class="blog-card-readmore">Read More →</span>
          </div>
        </div>
      `;

      grid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 200 + i * 150);
    });

  } catch (err) {
    console.error('Blog preview error:', err);
    grid.innerHTML = '<p style="color:#64748B;text-align:center;padding:40px;">Posts coming soon.</p>';
  }
}

// ================================
// INTERSECTION OBSERVER FOR BLOG CARDS
// ================================

function initBlogPreviewAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.blog-preview-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const blogGrid = document.getElementById('blog-preview-grid');
  if (blogGrid) observer.observe(blogGrid);
}

// ================================
// RUN ON PAGE LOAD
// ================================

document.addEventListener('DOMContentLoaded', function() {
  loadGalleryPreview();
  loadBlogPreview();
  initBlogPreviewAnimation();
});
