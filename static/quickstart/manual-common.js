(() => {
  const SmartManual = (window.SmartManual = window.SmartManual || {});

  SmartManual.registerSafeServiceWorker = (swPath) => {
    try {
      if (!('serviceWorker' in navigator)) return;
      navigator.serviceWorker.register(swPath).catch(() => {});
    } catch (_) {
      // ignore
    }
  };
})();

