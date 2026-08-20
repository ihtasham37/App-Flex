import React, { useState, useEffect } from 'react';
import { Download, Smartphone, ShieldCheck, Gamepad2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useSettings } from '../context/SettingsContext';
import { AppLogo } from './ui/AppLogo';

interface PWALandingPageProps {
  onInstalled?: () => void;
}

export const PWALandingPage: React.FC<PWALandingPageProps> = ({ onInstalled }) => {
  const { settings } = useSettings();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Stop default browser mini-infobar
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      localStorage.setItem('pwa_installed', 'true');
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setInstalling(false);
      if (onInstalled) {
        setTimeout(() => {
          onInstalled();
        }, 1200);
      }
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [onInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        if (outcome === 'accepted') {
          localStorage.setItem('pwa_installed', 'true');
          setInstalledSuccess(true);
          setDeferredPrompt(null);
          if (onInstalled) {
            setTimeout(() => {
              onInstalled();
            }, 1200);
          }
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
      setInstalling(false);
    } else {
      // If no prompt event, mark installed & proceed
      localStorage.setItem('pwa_installed', 'true');
      setInstalledSuccess(true);
      if (onInstalled) {
        onInstalled();
      }
    }
  };

  const handleManualProceed = () => {
    localStorage.setItem('pwa_installed', 'true');
    if (onInstalled) {
      onInstalled();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        {/* App Icon / Logo */}
        <div className="relative mx-auto flex justify-center">
          <AppLogo size={96} showGlow className="animate-bounce" />
        </div>

        <div className="space-y-4 relative">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
            {settings.appName || 'APPFLEX'}
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">
              {installedSuccess ? 'App Installed!' : 'Install App for Best Experience'}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              {installedSuccess
                ? 'App has been installed successfully! Opening app now...'
                : 'To browse our full catalog of premium apps, games, and bundles, please download and install the official app on your device.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
            <ShieldCheck size={24} className="text-emerald-600" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">100% Secure</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
            <Gamepad2 size={24} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Fast Access</span>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          {installedSuccess ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-3 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={22} className="text-emerald-600" />
                <span>Installed Successfully! Opening app...</span>
              </div>
              <Button 
                onClick={handleManualProceed}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold uppercase tracking-wider text-white"
              >
                <span>Launch App Now</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          ) : (
            <>
              <Button 
                onClick={handleInstall}
                disabled={installing}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all active:scale-95"
              >
                <Download size={24} className="mr-3" />
                {installing ? 'Installing...' : 'Install App Now'}
              </Button>

              <button
                onClick={handleManualProceed}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 underline transition-colors pt-1"
              >
                Already Installed? Open App
              </button>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-left">
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  <span className="font-bold text-blue-600">Note:</span> If the app does not install automatically, tap your browser menu (<span className="font-bold text-slate-800">3 dots</span> at top right) and select <span className="font-bold text-blue-600">"Install app"</span> or <span className="font-bold text-blue-600">"Add to Home Screen"</span>.
                </p>
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-slate-400 pt-1">
            <Smartphone size={16} />
            <p className="text-xs font-bold uppercase tracking-tighter">Available for Android & Desktop</p>
          </div>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        Powered by {settings.appName || 'APPFLEX'} Studio
      </p>
    </div>
  );
};
