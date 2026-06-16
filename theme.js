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

  // ── System theme change listener ───────────
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  });

  // ── Init ───────────────────────────────────
  var initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  // Bind toggle after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      var toggle = document.getElementById('themeToggle');
      if (toggle) toggle.addEventListener('click', handleToggle);
    });
  } else {
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', handleToggle);
  }
})();
