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
  });
})();
