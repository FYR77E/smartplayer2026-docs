(() => {
  const SmartManual = (window.SmartManual = window.SmartManual || {});

  SmartManual.registerSafeServiceWorker = (swPath) => {
    try {
      if (!('serviceWorker' in navigator)) return;
      // Keep SW limited to the quickstart mini-site.
      const desiredScope = '/quickstart-site/';
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
          navigator.serviceWorker.register(swPath, {scope: desiredScope}).catch(() => {});
        });
    } catch (_) {
      // ignore
    }
  };
})();

