/* ═══════════════════════════════════════════════
   zixuan's blog — Theme Toggle + SVG Swap
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const STORAGE_KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  // ── Detect initial theme ───────────────────
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  // ── Apply theme ────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
    swapExternalSvgs(theme);
  }

  // ── Toggle icon ────────────────────────────
  function updateToggleIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');
    if (!sunIcon || !moonIcon) return;

    if (theme === DARK) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // ── External SVG swap (Article 1) ──────────
  function swapExternalSvgs(theme) {
    document.querySelectorAll('img[src$=".svg"]').forEach(function (img) {
      if (theme === DARK) {
        if (!img.dataset.lightSrc) {
          img.dataset.lightSrc = img.getAttribute('src');
        }
        var darkSrc = img.dataset.lightSrc.replace('.svg', '-dark.svg');
        img.setAttribute('src', darkSrc);
      } else {
        if (img.dataset.lightSrc) {
          img.setAttribute('src', img.dataset.lightSrc);
        }
      }
    });
  }

  // ── Toggle handler ─────────────────────────
  function handleToggle() {
    var current = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  // ── Code block copy buttons ────────────────
  function legacyCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  // ── Reading progress ───────────────────────
  function ensureScrollProgress() {
    var progress = document.querySelector('.scroll-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
    }
    return progress;
  }

  function updateScrollProgress() {
    var progress = document.querySelector('.scroll-progress');
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, value)) + ')';
  }

  // ── Reveal choreography ────────────────────
  function enhanceReveals() {
    var items = document.querySelectorAll('.post, .sidebar-section, .article-content section, .figure, .svg-panel, .note');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      items.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    items.forEach(function (item) {
      item.classList.add('reveal-ready');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  // ── Home mascot pointer tracking ───────────
  function enhanceMascotFollow() {
    var mascot = document.querySelector('.blog-mascot');
    if (!mascot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function setLook(clientX, clientY) {
      var rect = mascot.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var dx = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
      var dy = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

      mascot.style.setProperty('--look-x', (dx * 5).toFixed(2) + 'px');
      mascot.style.setProperty('--look-y', (dy * 4).toFixed(2) + 'px');
      mascot.style.setProperty('--pet-rotate', (dx * 2.5).toFixed(2) + 'deg');
    }

    window.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      setLook(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('pointerleave', function () {
      mascot.style.setProperty('--look-x', '0px');
      mascot.style.setProperty('--look-y', '0px');
      mascot.style.setProperty('--pet-rotate', '0deg');
    });
  }

  // ── Home page-turn navigation ──────────────
  function enhanceHomePaging() {
    var pages = document.querySelectorAll('.home-page');
    var enter = document.querySelector('[data-scroll-target]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (enter) {
      enter.addEventListener('click', function () {
        var target = document.getElementById(enter.getAttribute('data-scroll-target'));
        if (!target) return;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    }

    if (!pages.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      pages.forEach(function (page) {
        page.classList.add('page-visible');
      });
      return;
    }

    pages.forEach(function (page) {
      page.classList.add('page-turn-ready');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('page-visible', entry.isIntersecting);
      });
    }, { threshold: 0.08 });

    pages.forEach(function (page) {
      observer.observe(page);
    });
  }

  function enhanceCodeBlocks() {
    document.querySelectorAll('.article-content pre').forEach(function (pre) {
      if (pre.dataset.copyReady) return;
      var code = pre.querySelector('code');
      if (!code) return;
      pre.dataset.copyReady = '1';

      // Wrap so the copy button stays pinned during horizontal scroll.
      var wrap = document.createElement('div');
      wrap.className = 'pre-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', '复制命令');
      btn.innerHTML =
        '<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
        '<svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.addEventListener('click', function () {
        var text = code.innerText;
        var finish = function () {
          btn.classList.add('copied');
          btn.setAttribute('aria-label', '已复制');
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.setAttribute('aria-label', '复制命令');
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(finish).catch(function () {
            legacyCopy(text, finish);
          });
        } else {
          legacyCopy(text, finish);
        }
      });
      wrap.appendChild(btn);
    });
  }

  // ── System theme change listener ───────────
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  });

  // ── Init ───────────────────────────────────
  // This script runs in <head>, before <body> is parsed. We apply the theme
  // immediately so data-theme is set before <body> paints (prevents a
  // light-mode flash). The DOM-dependent parts of applyTheme — updateToggleIcon
  // and swapExternalSvgs — no-op here because #themeToggle and the <img> tags
  // don't exist yet. We re-apply once the DOM is ready (below) so the toggle
  // icon and the light/dark SVG variants match the initial theme on first paint.
  var initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var theme = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(theme);
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', handleToggle);
    ensureScrollProgress();
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    enhanceCodeBlocks();
    enhanceReveals();
    enhanceMascotFollow();
    enhanceHomePaging();
  });
})();
