import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdater = () => {
  useRegisterSW({
    onOfflineReady() {
      console.log('APPFLEX PWA is ready for offline use.');
    },
    onNeedRefresh() {
      console.log('App update available.');
    }
  });

  return null;
};
