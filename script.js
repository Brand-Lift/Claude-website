/* ================================================================
   PRIDE INTERNATIONAL SCHOOL — JAVASCRIPT
================================================================ */

'use strict';

const WHATSAPP_NUMBER = '911234567890';
const HEADER_OFFSET   = 76;

/* ----------------------------------------------------------------
   1. initHeader
---------------------------------------------------------------- */
function initHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------------------
   2. initMobileMenu
---------------------------------------------------------------- */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('mobileMenu');
  var closeBtn  = document.getElementById('menuClose');
  var links     = document.querySelectorAll('.mobile-nav-link');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    links.forEach(function(link, i) {
      link.style.transitionDelay = (0.06 + i * 0.055) + 's';
    });
  }

  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    links.forEach(function(link) { link.style.transitionDelay = '0s'; });
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = (link.getAttribute('href') || '').replace('#', '');
      closeMenu();
      if (targetId) setTimeout(function() { smoothScrollTo(targetId); }, 300);
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  menu.addEventListener('click', function(e) {
    if (e.target === menu) closeMenu();
  });
}

/* ----------------------------------------------------------------
   3. initHeroSlider
---------------------------------------------------------------- */
function initHeroSlider() {
  var slides    = document.querySelectorAll('.slide');
  var dots      = document.querySelectorAll('.dot');
  var prevBtn   = document.getElementById('sliderPrev');
  var nextBtn   = document.getElementById('sliderNext');
  var sliderEl  = document.querySelector('.hero-slider');
  if (!slides.length) return;

  var current    = 0;
  var total      = slides.length;
  var autoTimer  = null;
  var isPaused   = false;
  var touchStartX = 0;
  var touchEndX   = 0;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = ((index % total) + total) % total;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    animateSlideContent(slides[current]);
  }

  function animateSlideContent(slide) {
    var els = slide.querySelectorAll('.slide-badge, .slide-heading, .slide-sub, .slide-btns');
    els.forEach(function(el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'none';
      setTimeout(function() {
        el.style.transition = 'opacity 0.6s ease ' + (i * 0.13) + 's, transform 0.6s ease ' + (i * 0.13) + 's';
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 60);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function() {
      if (!isPaused) goToSlide(current + 1);
    }, 4500);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(current + 1); startAuto(); });

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goToSlide(parseInt(dot.getAttribute('data-slide'), 10));
      startAuto();
    });
  });

  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', function() { isPaused = true; });
    sliderEl.addEventListener('mouseleave', function() { isPaused = false; });
    sliderEl.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    sliderEl.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { goToSlide(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });
  }

  // Animate first slide content immediately
  animateSlideContent(slides[0]);
  startAuto();
}

/* ----------------------------------------------------------------
   4. initScrollReveal
---------------------------------------------------------------- */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  els.forEach(function(el) { observer.observe(el); });
}

/* ----------------------------------------------------------------
   5. initActiveNav
---------------------------------------------------------------- */
function initActiveNav() {
  var sections = ['home','about','principal','academics','facilities','staff','gallery','fees','admission','faqs','contact'];
  var navLinks = document.querySelectorAll('.nav-link');

  function updateNav() {
    var scrollY  = window.scrollY + HEADER_OFFSET + 10;
    var activeId = 'home';
    sections.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) activeId = id;
    });
    navLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('data-section') === activeId);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}/* ----------------------------------------------------------------
   6. smoothScrollTo
---------------------------------------------------------------- */
function smoothScrollTo(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

/* ----------------------------------------------------------------
   7. initSmoothScroll
---------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var targetId = href.replace('#', '');
      var targetEl = document.getElementById(targetId);
      if (targetEl) { e.preventDefault(); smoothScrollTo(targetId); }
    });
  });
}

/* ----------------------------------------------------------------
   8. initBackToTop
---------------------------------------------------------------- */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------------
   9. initCountUp
---------------------------------------------------------------- */
function initCountUp() {
  var statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  var started = false;

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1800;
    var start    = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !started) {
        started = true;
        statsBar.querySelectorAll('.stat-number').forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);
}

/* ----------------------------------------------------------------
   10. initFAQAccordion
---------------------------------------------------------------- */
function initFAQAccordion() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function(item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      items.forEach(function(other) {
        other.classList.remove('open');
        var ob = other.querySelector('.faq-question');
        if (ob) ob.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

/* ----------------------------------------------------------------
   11. submitAdmission
---------------------------------------------------------------- */
function submitAdmission() {
  var sName   = document.getElementById('fStudentName');
  var pName   = document.getElementById('fParentName');
  var mobile  = document.getElementById('fMobile');
  var cls     = document.getElementById('fClass');
  var msg     = document.getElementById('fMsg');

  var errSName = document.getElementById('errStudentName');
  var errPName = document.getElementById('errParentName');
  var errMob   = document.getElementById('errMobile');
  var errCls   = document.getElementById('errClass');

  clearError(sName, errSName);
  clearError(pName, errPName);
  clearError(mobile, errMob);
  clearError(cls, errCls);

  var valid = true;

  if (!sName || sName.value.trim().length < 2) {
    showError(sName, errSName, "Please enter the student's full name.");
    valid = false;
  }
  if (!pName || pName.value.trim().length < 2) {
    showError(pName, errPName, "Please enter the parent or guardian's name.");
    valid = false;
  }
  var mob = mobile ? mobile.value.trim() : '';
  if (!mob || !/^[6-9]\d{9}$/.test(mob)) {
    showError(mobile, errMob, 'Please enter a valid 10-digit Indian mobile number.');
    valid = false;
  }
  if (!cls || !cls.value) {
    showError(cls, errCls, 'Please select the class applying for.');
    valid = false;
  }

  if (!valid) { showToast('Please fix the highlighted errors.', 'error'); return; }

  var msgVal = (msg && msg.value.trim()) ? msg.value.trim() : 'No additional message.';
  var text =
    'Hello, I want to enquire about admission at Pride International School.' +
    '\n\n*Student Name:* '    + sName.value.trim() +
    '\n*Parent / Guardian:* ' + pName.value.trim() +
    '\n*Mobile:* '            + mob +
    '\n*Class Applying For:* '+ cls.value +
    '\n*Message:* '           + msgVal +
    '\n\nKindly guide me through the admission process. Thank you!';

  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  document.getElementById('admissionForm').reset();
  clearError(sName, errSName);
  clearError(pName, errPName);
  clearError(mobile, errMob);
  clearError(cls, errCls);
  showToast('Enquiry sent! We will respond within 24 hours.', 'success');
}

/* ----------------------------------------------------------------
   12. showError
---------------------------------------------------------------- */
function showError(field, span, message) {
  if (field) field.classList.add('error');
  if (span)  { span.textContent = message || 'This field is required.'; span.style.display = 'block'; }
}

/* ----------------------------------------------------------------
   13. clearError
---------------------------------------------------------------- */
function clearError(field, span) {
  if (field) field.classList.remove('error');
  if (span)  { span.textContent = ''; span.style.display = 'none'; }
}

/* ----------------------------------------------------------------
   14. showToast
---------------------------------------------------------------- */
function showToast(message, type) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('success', 'error', 'show');
  toast.textContent = message;
  if (type) toast.classList.add(type);
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.classList.remove('success', 'error'); }, 400);
  }, 3500);
  }/* ----------------------------------------------------------------
   15. initLiveValidation
---------------------------------------------------------------- */
function initLiveValidation() {
  var pairs = [
    { fieldId: 'fStudentName', spanId: 'errStudentName' },
    { fieldId: 'fParentName',  spanId: 'errParentName'  },
    { fieldId: 'fMobile',      spanId: 'errMobile'       },
    { fieldId: 'fClass',       spanId: 'errClass'        }
  ];

  pairs.forEach(function(pair) {
    var field = document.getElementById(pair.fieldId);
    var span  = document.getElementById(pair.spanId);
    if (!field || !span) return;
    var evType = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evType, function() {
      if (field.classList.contains('error')) clearError(field, span);
    });
    field.addEventListener('focus', function() {
      if (field.classList.contains('error')) clearError(field, span);
    });
  });

  var mobileField = document.getElementById('fMobile');
  if (mobileField) {
    mobileField.addEventListener('keypress', function(e) {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    mobileField.addEventListener('paste', function(e) {
      e.preventDefault();
      var pasted = (e.clipboardData || window.clipboardData).getData('text');
      mobileField.value = pasted.replace(/\D/g, '').substring(0, 10);
    });
  }
}

/* ----------------------------------------------------------------
   16. initDesktopNavScroll
---------------------------------------------------------------- */
function initDesktopNavScroll() {
  // Logo
  var logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Footer links
  document.querySelectorAll('.footer-links a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var id = href.replace('#', '');
      if (document.getElementById(id)) { e.preventDefault(); smoothScrollTo(id); }
    });
  });

  // Header CTA
  var cta = document.querySelector('.header-cta');
  if (cta) {
    cta.addEventListener('click', function(e) { e.preventDefault(); smoothScrollTo('admission'); });
  }

  // Fee CTA
  var feeCta = document.querySelector('.fee-cta .btn');
  if (feeCta) {
    feeCta.addEventListener('click', function(e) { e.preventDefault(); smoothScrollTo('admission'); });
  }

  // About CTA
  var aboutCta = document.querySelector('.about-content .btn-primary');
  if (aboutCta) {
    aboutCta.addEventListener('click', function(e) { e.preventDefault(); smoothScrollTo('admission'); });
  }

  // Slide CTAs
  document.querySelectorAll('.slide-btns .btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var href = btn.getAttribute('href');
      if (!href || href === '#') return;
      var id = href.replace('#', '');
      if (document.getElementById(id)) { e.preventDefault(); smoothScrollTo(id); }
    });
  });
}

/* ----------------------------------------------------------------
   17. initResizeHandler
---------------------------------------------------------------- */
function initResizeHandler() {
  var timer;
  window.addEventListener('resize', function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if (window.innerWidth > 768) {
        var menu = document.getElementById('mobileMenu');
        if (menu && menu.classList.contains('open')) {
          menu.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    }, 200);
  });
}

/* ----------------------------------------------------------------
   18. initGalleryAccessibility
---------------------------------------------------------------- */
function initGalleryAccessibility() {
  document.querySelectorAll('.gallery-card').forEach(function(card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'img');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

/* ----------------------------------------------------------------
   19. initImageFallbacks
---------------------------------------------------------------- */
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() {
      img.style.display = 'none';
      var parent = img.parentElement;
      if (parent && !parent.dataset.fallback) {
        parent.style.background = 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 60%,#60a5fa 100%)';
        parent.dataset.fallback = 'true';
      }
    });
  });
      }/* ----------------------------------------------------------------
   20. initStatHovers
---------------------------------------------------------------- */
function initStatHovers() {
  document.querySelectorAll('.stat-item').forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      item.style.transition = 'transform 0.25s ease';
      item.style.transform  = 'translateY(-3px)';
    });
    item.addEventListener('mouseleave', function() {
      item.style.transform = 'translateY(0)';
    });
  });
}

/* ----------------------------------------------------------------
   21. initFacilityCardHover — extra polish for icon colour swap
---------------------------------------------------------------- */
function initFacilityCardHover() {
  document.querySelectorAll('.facility-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      var icon = card.querySelector('.facility-icon');
      if (icon) { icon.style.background = '#1e40af'; icon.style.color = '#fff'; }
    });
    card.addEventListener('mouseleave', function() {
      var icon = card.querySelector('.facility-icon');
      if (icon) { icon.style.background = ''; icon.style.color = ''; }
    });
  });
}

/* ----------------------------------------------------------------
   22. initContactCardHover — extra polish
---------------------------------------------------------------- */
function initContactCardHover() {
  document.querySelectorAll('.contact-card:not(.no-hover)').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      var icon = card.querySelector('.contact-card-icon');
      if (icon) {
        icon.style.background = '#1e40af';
        icon.style.color      = '#fff';
      }
    });
    card.addEventListener('mouseleave', function() {
      var icon = card.querySelector('.contact-card-icon');
      if (icon) { icon.style.background = ''; icon.style.color = ''; }
    });
  });
}

/* ================================================================
   DOMContentLoaded — initialise everything in order
================================================================ */
document.addEventListener('DOMContentLoaded', function() {

  // Core
  initHeader();
  initMobileMenu();
  initHeroSlider();

  // Navigation & Scroll
  initSmoothScroll();
  initDesktopNavScroll();
  initActiveNav();
  initBackToTop();

  // Animations
  initScrollReveal();
  initCountUp();
  initFAQAccordion();
  initStatHovers();

  // UI polish
  initFacilityCardHover();
  initContactCardHover();
  initGalleryAccessibility();

  // Form
  initLiveValidation();

  // Images
  initImageFallbacks();

  // Resize
  initResizeHandler();

  console.log('%cPride International School — Loaded ✓', 'color:#1e40af;font-weight:bold;font-size:14px;');
});

/* ================================================================
   GLOBALS — exposed for inline onclick
================================================================ */
window.submitAdmission = submitAdmission;
window.smoothScrollTo  = smoothScrollTo;
window.showToast       = showToast;
