import React, { useEffect, useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, ArrowUpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function InstallApp() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200">
            <Smartphone className="text-white" size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            Install Mobilio App
          </h1>
          <p className="text-slate-500 font-medium px-4">
            To continue using our services and handle high traffic safely, please install the app on your home screen.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center justify-center gap-2">
              <Download size={22} className="text-blue-600" />
              How to Install
            </h2>
            
            {platform === 'ios' ? (
              <div className="text-left space-y-4">
                <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 font-black text-blue-600">1</div>
                  <p className="text-sm text-slate-600 font-medium">
                    Tap the <span className="inline-flex items-center bg-white px-2 py-1 rounded-lg shadow-sm mx-1 font-black text-blue-600 underline"><Share size={14} className="mr-1" /> Share</span> button in the bottom menu.
                  </p>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 font-black text-blue-600">2</div>
                  <p className="text-sm text-slate-600 font-medium">
                    Scroll down and tap <span className="inline-flex items-center bg-white px-2 py-1 rounded-lg shadow-sm mx-1 font-black text-blue-600 underline"><PlusSquare size={14} className="mr-1" /> Add to Home Screen</span>.
                  </p>
                </div>
              </div>
            ) : platform === 'android' ? (
              <div className="text-left space-y-4">
                <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 font-black text-blue-600">1</div>
                  <p className="text-sm text-slate-600 font-medium">
                    Tap the <span className="font-black text-slate-800">three dots</span> menu (⋮) in the top right corner.
                  </p>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 font-black text-blue-600">2</div>
                  <p className="text-sm text-slate-600 font-medium">
                    Select <span className="font-black text-blue-600">Install app</span> or <span className="font-black text-blue-600">Add to Home Screen</span>.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 font-medium">
                Please open your browser menu and select "Install" or "Add to Home Screen" to continue.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
              Benefits of App
            </p>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase text-slate-500">
              <div className="bg-slate-50 py-2 rounded-xl border border-slate-100">Faster Loading</div>
              <div className="bg-slate-50 py-2 rounded-xl border border-slate-100">Less Data Usage</div>
              <div className="bg-slate-50 py-2 rounded-xl border border-slate-100">Native Experience</div>
              <div className="bg-slate-50 py-2 rounded-xl border border-slate-100">Secure Access</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-blue-600 font-black animate-bounce mt-4">
          <ArrowUpCircle size={20} />
          <span className="text-sm uppercase tracking-tight">Installation Required</span>
        </div>
      </div>
    </div>
  );
}
