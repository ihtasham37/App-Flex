import React from 'react';
import { cn } from '../../lib/utils';

interface AppLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 48, 
  className,
  showGlow = false 
}) => {
  return (
    <div 
      className={cn("relative inline-flex items-center justify-center select-none flex-shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div 
          className="absolute -inset-2 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-3xl opacity-40 blur-xl animate-pulse -z-10"
        />
      )}
      
      <svg 
        viewBox="0 0 512 512" 
        width={size} 
        height={size}
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="45%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          
          <linearGradient id="logoWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="logoGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1E3A8A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Squircle App Icon Base */}
        <rect 
          x="32" 
          y="32" 
          width="448" 
          height="448" 
          rx="112" 
          fill="url(#logoBgGrad)" 
          filter="url(#logoShadow)" 
        />
        
        {/* Glass Sheen Top Layer */}
        <rect 
          x="32" 
          y="32" 
          width="448" 
          height="224" 
          rx="112" 
          fill="url(#logoGlassGrad)" 
        />

        {/* Inner Border Ring */}
        <rect 
          x="44" 
          y="44" 
          width="424" 
          height="424" 
          rx="100" 
          fill="none" 
          stroke="rgba(255,255,255,0.25)" 
          strokeWidth="3" 
        />

        {/* Dynamic Stylized "Play/Flex" Polygon */}
        {/* White Solid Foundation */}
        <path 
          d="M190 142 L342 246 C354 254 354 258 342 266 L190 370 C176 380 162 372 162 354 L162 158 C162 140 176 132 190 142 Z" 
          fill="#FFFFFF" 
        />
        
        {/* Cyan-Indigo Speed Wing */}
        <path 
          d="M236 174 L346 248 C356 254 356 258 346 264 L236 338 C224 346 214 340 214 324 L214 188 C214 172 224 166 236 174 Z" 
          fill="url(#logoWingGrad)" 
        />

        {/* Core Jewel Spark */}
        <circle cx="282" cy="256" r="26" fill="#FFFFFF" />
        <circle cx="282" cy="256" r="14" fill="#2563EB" />
        
        {/* Premium Ambient Micro Dots */}
        <circle cx="376" cy="165" r="9" fill="#93C5FD" opacity="0.9" />
        <circle cx="145" cy="340" r="7" fill="#60A5FA" opacity="0.75" />
      </svg>
    </div>
  );
};
