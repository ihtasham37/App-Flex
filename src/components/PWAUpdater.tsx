import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWAUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 24 hours
      if (r) {
        setInterval(() => {
          r.update();
        }, 24 * 60 * 60 * 1000);
      }
    },
    onNeedRefresh() {
      // Automatically update and reload
      console.log('[PWA] New version detected, updating...');
      updateServiceWorker(true);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      // If the service worker is ready to update, do it
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
