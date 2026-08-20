import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdater = () => {
  const {
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      // Automatically activate new service worker and refresh seamlessly for users
      console.log('New app update detected! Updating automatically...');
      updateServiceWorker(true);
    },
    onOfflineReady() {
      console.log('APPFLEX PWA is ready for offline use.');
    }
  });

  useEffect(() => {
    // Check for updates every 15 minutes when app is running
    const interval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update().catch(() => {});
        });
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};
