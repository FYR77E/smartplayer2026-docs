(() => {
  const SmartManual = (window.SmartManual = window.SmartManual || {});
  const noop = () => {};

  const resolveAssetPath = (assetPath) => {
    try {
      return new URL(assetPath, window.location.href).pathname;
    } catch (_) {
      return assetPath;
    }
  };

  SmartManual.registerSafeServiceWorker = (swPath) => {
    try {
      if (!('serviceWorker' in navigator)) return;
      // Keep SW limited to the quickstart mini-site.
      const desiredScope = '/quickstart-site/';
      const resolvedSwPath = resolveAssetPath(swPath || './sw.js');
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => {
          // If there is an old SW controlling '/', remove it to prevent stale caching.
          return Promise.all(
            regs.map((r) => {
              const scope = String(r.scope || '');
              if (scope.endsWith('/') && new URL(scope).pathname === '/') {
                return r.unregister().catch(() => {});
              }
              return Promise.resolve();
            })
          );
        })
        .catch(() => {})
        .finally(() => {
          navigator.serviceWorker.register(resolvedSwPath, {scope: desiredScope}).catch(() => {});
        });
    } catch (_) {
      // ignore
    }
  };

  SmartManual.secureExternalLinks = (root = document) => {
    try {
      root.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;

        let url;
        try {
          url = new URL(href, window.location.href);
        } catch (_) {
          return;
        }

        if (url.origin !== window.location.origin) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    } catch (_) {
      // ignore
    }
  };

  SmartManual.optimizeImages = (root = document, options = {}) => {
    try {
      const eagerCount = Number.isFinite(options.eagerCount) ? options.eagerCount : 0;
      root.querySelectorAll('img').forEach((img, index) => {
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', index < eagerCount ? 'eager' : 'lazy');
        }
        if (!img.getAttribute('fetchpriority') && index < eagerCount) {
          img.setAttribute('fetchpriority', 'high');
        }
      });
    } catch (_) {
      // ignore
    }
  };

  SmartManual.enhanceDetails = (root = document) => {
    try {
      root.querySelectorAll('details > summary').forEach((summary) => {
        if (!summary.getAttribute('role')) {
          summary.setAttribute('role', 'button');
        }
      });
    } catch (_) {
      // ignore
    }
  };

  SmartManual.enhanceTabs = noop;

  SmartManual.enhanceZoomableKeyboard = (root = document) => {
    try {
      root.querySelectorAll('.zoomable').forEach((img) => {
        if (!img.hasAttribute('tabindex')) {
          img.setAttribute('tabindex', '0');
        }
        if (!img.getAttribute('role')) {
          img.setAttribute('role', 'button');
        }
      });
    } catch (_) {
      // ignore
    }
  };

  SmartManual.upgradePngToWebp = noop;
})();
