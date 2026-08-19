import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Smartphone, Monitor, Film } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type');

  const isHome = location.pathname === '/';
  const isApps = location.pathname === '/explore';
  const isSearch = location.pathname === '/search';
  const isPC = location.pathname === '/pc';
  const isBundles = location.pathname === '/bundles';

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden w-[95%] max-w-md">
      <nav className="relative bg-white/95 backdrop-blur-2xl border border-slate-200/90 px-2 py-1.5 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-between">
        
        {/* 1. Home */}
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center gap-0.5 transition-all py-1 flex-1",
            isHome ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={cn(
            "p-1 rounded-xl transition-colors",
            isHome ? "bg-blue-50" : ""
          )}>
            <Home size={19} strokeWidth={isHome ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[9px] tracking-tight",
            isHome ? "font-black text-blue-600" : "font-bold"
          )}>
            Home
          </span>
        </Link>

        {/* 2. Apps */}
        <Link 
          to="/explore" 
          className={cn(
            "flex flex-col items-center gap-0.5 transition-all py-1 flex-1",
            isApps ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={cn(
            "p-1 rounded-xl transition-colors",
            isApps ? "bg-blue-50" : ""
          )}>
            <Smartphone size={19} strokeWidth={isApps ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[9px] tracking-tight",
            isApps ? "font-black text-blue-600" : "font-bold"
          )}>
            Apps
          </span>
        </Link>

        {/* 3. Center Raised Floating Circular Search Button */}
        <div className="relative -top-4 flex flex-col items-center flex-1">
          <Link 
            to="/search" 
            className="group"
          >
            <div className={cn(
              "w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 border-[3px] border-white group-hover:scale-105 active:scale-95 transition-all",
              isSearch ? "ring-2 ring-blue-500 ring-offset-1" : ""
            )}>
              <Search size={19} strokeWidth={2.5} />
            </div>
          </Link>
          <span className={cn(
            "text-[8px] tracking-tight mt-0.5",
            isSearch ? "text-blue-600 font-black" : "text-slate-400 font-bold"
          )}>
            Search
          </span>
        </div>

        {/* 4. PC Apps */}
        <Link 
          to="/pc" 
          className={cn(
            "flex flex-col items-center gap-0.5 transition-all py-1 flex-1",
            isPC ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={cn(
            "p-1 rounded-xl transition-colors",
            isPC ? "bg-slate-100" : ""
          )}>
            <Monitor size={19} strokeWidth={isPC ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[9px] tracking-tight",
            isPC ? "font-black text-slate-800" : "font-bold"
          )}>
            PC
          </span>
        </Link>

        {/* 5. Video Bundles */}
        <Link 
          to="/bundles" 
          className={cn(
            "flex flex-col items-center gap-0.5 transition-all py-1 flex-1",
            isBundles ? "text-purple-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div className={cn(
            "p-1 rounded-xl transition-colors",
            isBundles ? "bg-purple-50" : ""
          )}>
            <Film size={19} strokeWidth={isBundles ? 2.5 : 2} />
          </div>
          <span className={cn(
            "text-[9px] tracking-tight",
            isBundles ? "font-black text-purple-600" : "font-bold"
          )}>
            Bundles
          </span>
        </Link>

      </nav>
    </div>
  );
};
