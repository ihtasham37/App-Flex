import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdater = () => {
  const {
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      // When a new version is available, automatically update and reload
      console.log('New content available, refreshing...');
      updateServiceWorker(true);
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });

  useEffect(() => {
    // Check for updates periodically (every 1 hour)
    const interval = setInterval(() => {
      updateServiceWorker(false);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateServiceWorker]);

  return null; // This component doesn't render anything UI-wise
};
