/**
 * PWA & Fullscreen Management Suite — Clash of Unxpadted
 * Handles Chrome App installation, Fullscreen toggling, Wake Lock, and SW registration.
 */

(function () {
  'use strict';

  let deferredPrompt = null;
  let wakeLock = null;

  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Determine relative SW path based on current page path
      const swPath = './sw.js';
      navigator.serviceWorker
        .register(swPath)
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Chrome PWA Install Prompt Capture
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt captured & ready');

    // Show any install button on the page
    const installBtns = document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn');
    installBtns.forEach((btn) => {
      btn.style.display = 'inline-flex';
      btn.classList.add('pwa-ready');
    });

    window.dispatchEvent(new CustomEvent('pwa-can-install'));
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed to Chrome / OS');
    deferredPrompt = null;
    const installBtns = document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn');
    installBtns.forEach((btn) => {
      btn.style.display = 'none';
    });
  });

  // Global install trigger
  window.promptPwaInstall = async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to install:', outcome);
      deferredPrompt = null;
      return outcome === 'accepted';
    } else {
      // Fallback instruction for browsers where prompt isn't directly invocable
      alert('Untuk memasang di Chrome:\n1. Klik ikon Install (📥) di bilah alamat browser Chrome Anda, atau\n2. Buka menu Chrome (titik tiga) ➔ "Pasang / Simpan & Bagikan" ➔ "Pasang Clash of Unxpadted".');
      return false;
    }
  };

  // 3. True Fullscreen Controller
  window.toggleFullscreen = function () {
    const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    const docEl = document.documentElement;

    if (!isFull) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch((err) => console.warn('Fullscreen error:', err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn('Exit fullscreen error:', err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  window.isFullscreen = function () {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  };

  // Update Fullscreen UI badges / icons on fullscreen changes
  const updateFullscreenUI = () => {
    const isFull = window.isFullscreen();
    const fsBtns = document.querySelectorAll('.fullscreen-toggle-btn');
    fsBtns.forEach((btn) => {
      if (isFull) {
        btn.classList.add('is-fullscreen');
        btn.setAttribute('title', 'Keluar Layar Penuh (F)');
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        `;
      } else {
        btn.classList.remove('is-fullscreen');
        btn.setAttribute('title', 'Layar Penuh / Fullscreen (F)');
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        `;
      }
    });
  };

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  // 4. Keyboard Shortcuts: Press 'F' to toggle fullscreen
  window.addEventListener('keydown', (e) => {
    // Only toggle if user is not actively typing in an input field or textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      window.toggleFullscreen();
    }
  });

  // 5. Keep Screen Awake (Wake Lock API) for tablet tournament gameplay
  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('[PWA] Screen Wake Lock active');
        wakeLock.addEventListener('release', () => {
          console.log('[PWA] Wake Lock released');
        });
      } catch (err) {
        console.warn('[PWA] Wake Lock request failed:', err);
      }
    }
  }

  document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });

  window.addEventListener('load', () => {
    requestWakeLock();
    updateFullscreenUI();
  });

  // 6. Socket Server Connection URL Resolver
  window.getSocketServerUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const custom = urlParams.get('server');
    if (custom) return custom;

    // If loaded from GitHub Pages, default to the official live cloud server
    if (window.location.hostname.includes('github.io')) {
      return 'https://event.unxpadted.web.id';
    }

    // Default to origin host
    return window.location.origin;
  };
})();
