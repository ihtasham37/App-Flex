import React, { useState, useEffect, useRef } from 'react';
import { useAds } from '../../context/AdsContext';
import { Button } from '../ui/Button';
import { Play, X, CheckCircle2, ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appName?: string;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  appName = 'this item'
}) => {
  const { getRewardedAd } = useAds();
  const ad6 = getRewardedAd();

  const [phase, setPhase] = useState<'prompt' | 'watching' | 'completed'>('prompt');
  const [countdown, setCountdown] = useState(6);
  const [canSkip, setCanSkip] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Reset phase when opened
  useEffect(() => {
    if (isOpen) {
      setPhase('prompt');
      setCountdown(6);
      setCanSkip(false);
    }
  }, [isOpen]);

  // Handle countdown during 'watching' phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'watching' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (phase === 'watching' && countdown === 0) {
      setPhase('completed');
    }
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // Load Ad 6 content into iframe when watching phase starts
  useEffect(() => {
    if (phase === 'watching' && ad6 && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #0f172a;
                  color: #ffffff;
                  padding: 16px;
                  text-align: center;
                }
                img, video, iframe {
                  max-width: 100% !important;
                  height: auto !important;
                  border-radius: 12px;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <div id="reward-ad-wrap" style="width: 100%; max-width: 480px;">
                ${ad6.ad_code}
              </div>
            </body>
          </html>
        `;
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [phase, ad6?.ad_code]);

  if (!isOpen) return null;

  const handleStartWatch = () => {
    setCountdown(6);
    setPhase('watching');
  };

  const handleCancelOrCloseEarly = () => {
    // If closed during watching or prompt, do NOT unlock download
    onClose();
  };

  const handleClaimDownload = () => {
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden relative"
        >
          {/* Phase 1: Prompt before Ad */}
          {phase === 'prompt' && (
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-200 shadow-lg shadow-amber-500/10">
                <Sparkles size={32} />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                  Daily Free Download Limit
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  You have reached today's free download limit.
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Watch a quick sponsored advertisement to continue downloading <strong className="text-slate-900 font-bold">{appName}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-800">Support Free APK Downloads</p>
                  <p>Daily limit automatically refreshes every 24 hours.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleStartWatch}
                  variant="default"
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  <Play size={18} fill="currentColor" />
                  <span>WATCH AD</span>
                </Button>

                <Button
                  onClick={handleCancelOrCloseEarly}
                  variant="outline"
                  className="h-12 rounded-xl border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}

          {/* Phase 2: Watching Ad 6 */}
          {phase === 'watching' && (
            <div className="p-4 sm:p-6 space-y-4 flex flex-col items-center">
              {/* Header with Countdown */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-600 animate-spin" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {countdown > 0 ? `Unlocking in ${countdown}s...` : 'Almost Done...'}
                  </span>
                </div>
                
                <button
                  onClick={handleCancelOrCloseEarly}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Close (Download will remain locked)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${((6 - countdown) / 6) * 100}%` }}
                />
              </div>

              {/* Ad 6 Sandboxed Iframe Container */}
              <div className="w-full min-h-[260px] max-h-[360px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative">
                <iframe
                  title="Rewarded Download Advertisement"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                          * { box-sizing: border-box; margin: 0; padding: 0; }
                          body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            background: #0f172a;
                            color: #ffffff;
                            padding: 16px;
                            text-align: center;
                          }
                          img, video, iframe {
                            max-width: 100% !important;
                            height: auto !important;
                            border-radius: 12px;
                            margin: 0 auto;
                          }
                        </style>
                      </head>
                      <body>
                        <div id="reward-ad-wrap" style="width: 100%; max-width: 480px;">
                          ${ad6 ? ad6.ad_code : ''}
                        </div>
                      </body>
                    </html>
                  `}
                  className="w-full h-[320px] border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                />
              </div>

              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Please wait for the ad to complete to unlock your download
              </p>
            </div>
          )}

          {/* Phase 3: Ad Completed & Unlocked */}
          {phase === 'completed' && (
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                  ✓ Advertisement Completed
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Download Unlocked!
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  Your reward has been verified. You can now download your file.
                </p>
              </div>

              <Button
                onClick={handleClaimDownload}
                variant="default"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-xl shadow-emerald-500/25 uppercase tracking-wider"
              >
                DOWNLOAD NOW
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
