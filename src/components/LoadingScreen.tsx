import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { AppLogo } from './ui/AppLogo';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { settings } = useSettings();
  const appName = settings?.appName || 'APPFLEX';

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-between z-[9999] px-6 py-12 select-none overflow-hidden">
      {/* Ambient background soft light circles */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-gradient-to-tr from-cyan-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Placeholder for balance */}
      <div className="w-full flex justify-center items-center opacity-0">
        <span className="text-xs">Top</span>
      </div>

      {/* Center Brand Identity & Animated Core */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-sm w-full my-auto">
        
        {/* Animated App Icon Wrapper */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative p-2 rounded-[32px] bg-gradient-to-b from-white to-slate-100/80 shadow-[0_20px_50px_rgba(37,99,235,0.18)] border border-slate-100">
            <AppLogo size={96} showGlow />
          </div>

          {/* Floating Sparkle Icon Badge */}
          <motion.div 
            animate={{ y: [-3, 3, -3], rotate: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white"
          >
            <Sparkles size={14} className="fill-white" />
          </motion.div>
        </motion.div>

        {/* App Title & Tagline */}
        <div className="space-y-1.5">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm uppercase"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              {appName}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide uppercase"
          >
            Apps • Games • Bundles • PC
          </motion.p>
        </div>

        {/* Sleek Gradient Loading Indicator */}
        <div className="w-44 sm:w-52 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/60 shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full w-2/3 animate-[shimmer_1.4s_infinite_linear] bg-[length:200%_100%]" 
                 style={{
                   backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #2563eb 100%)',
                   animation: 'indeterminate 1.4s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395)'
                 }}
            />
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-wider">
            {message || 'Opening Experience...'}
          </p>
        </div>
      </div>

      {/* Bottom Trust & Security Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex flex-col items-center gap-1.5 text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-slate-600 shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500 stroke-[2.5]" />
          <span className="text-[10px] font-bold tracking-wide uppercase">100% Safe & Virus-Free</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">Fast Direct Download Engine</p>
      </motion.div>

      {/* Inline animation keyframe for the progress bar */}
      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.7); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
      `}</style>
    </div>
  );
};
