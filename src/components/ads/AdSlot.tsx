import React, { useEffect, useRef, useState } from 'react';
import { useAds, AdPageType, AdItem } from '../../context/AdsContext';
import { cn } from '../../lib/utils';

interface AdSlotProps {
  page?: AdPageType;
  slotIndex?: number;
  type?: 'normal' | 'rewarded';
  customAd?: AdItem | null;
  className?: string;
  label?: string;
  pageVisitId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  page = 'home',
  slotIndex = 0,
  type = 'normal',
  customAd,
  className,
  label = 'Advertisement',
  pageVisitId
}) => {
  const { getNormalAdForIndex, getRewardedAd } = useAds();
  const [iframeHeight, setIframeHeight] = useState<number>(100);
  const frameId = useRef(`ad-frame-${Math.random().toString(36).substring(2, 9)}`);
  const [localVisitSeed] = useState(() => Math.random().toString(36).substring(2, 9));

  // Retrieve ad depending on type or customAd
  const ad: AdItem | null = customAd !== undefined 
    ? customAd 
    : type === 'rewarded' 
    ? getRewardedAd() 
    : getNormalAdForIndex(page, slotIndex, pageVisitId || localVisitSeed);

  useEffect(() => {
    // Listen for resize messages from the frame
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data && 
        event.data.type === 'AD_FRAME_RESIZE' && 
        event.data.frameId === frameId.current &&
        typeof event.data.height === 'number'
      ) {
        const h = Math.min(Math.max(event.data.height + 8, 50), 500);
        setIframeHeight(h);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // If no ad exists or ad code is empty, render nothing
  if (!ad || !ad.ad_code || ad.ad_code.trim().length === 0) {
    return null;
  }

  // Clean HTML Document with Ad Code for srcDoc
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: transparent;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          img, video, iframe {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 0 auto;
            border-radius: 8px;
          }
          a { text-decoration: none; color: inherit; }
        </style>
      </head>
      <body>
        <div id="ad-container" style="width: 100%; text-align: center;">
          ${ad.ad_code}
        </div>
        <script>
          function updateHeight() {
            try {
              var container = document.getElementById('ad-container') || document.body;
              var h = Math.max(container.scrollHeight, document.body.offsetHeight, 60);
              window.parent.postMessage({ type: 'AD_FRAME_RESIZE', frameId: '${frameId.current}', height: h }, '*');
            } catch(e) {}
          }
          window.addEventListener('load', updateHeight);
          setTimeout(updateHeight, 200);
          setTimeout(updateHeight, 600);
          setTimeout(updateHeight, 1500);
          setTimeout(updateHeight, 3000);
        </script>
      </body>
    </html>
  `;

  return (
    <div className={cn("w-full my-3 sm:my-4 select-none", className)}>
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-sm transition-all overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle Label */}
        <div className="w-full flex items-center justify-between px-1 mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>{label}</span>
          <span className="text-[8px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded font-bold">AD</span>
        </div>

        {/* Sandboxed Ad Render Frame */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          <iframe
            title={ad.name || 'Advertisement'}
            srcDoc={htmlContent}
            className="w-full border-0 transition-all duration-300 overflow-hidden"
            style={{ minHeight: `${iframeHeight}px`, height: `${iframeHeight}px` }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
};
