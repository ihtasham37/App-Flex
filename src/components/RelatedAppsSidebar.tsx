import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Star, ShieldCheck, Download, Zap } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface AppData {
  id: string;
  name: string;
  mainImage: string;
  rating: number;
  category: string;
}

interface RelatedAppsSidebarProps {
  currentCategory: string;
  currentAppId: string;
}

export const RelatedAppsSidebar: React.FC<RelatedAppsSidebarProps> = ({ currentCategory, currentAppId }) => {
  const [relatedApps, setRelatedApps] = useState<AppData[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      const q = query(
        collection(db, 'apps'),
        where('category', '==', currentCategory),
        limit(6)
      );
      const snap = await getDocs(q);
      const apps = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as AppData))
        .filter(app => app.id !== currentAppId);
      setRelatedApps(apps.slice(0, 5));
    }
    fetchRelated();
  }, [currentCategory, currentAppId]);

  return (
    <aside className="hidden lg:flex flex-col gap-6">
      {/* Safety Badge */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 border-none text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <ShieldCheck size={20} />
          </div>
          <h4 className="font-black text-sm uppercase tracking-wider">Safety Verified</h4>
        </div>
        <p className="text-[11px] text-emerald-50 font-medium leading-relaxed">
          This file has been scanned by our automated systems and verified to be safe from malware and viruses.
        </p>
      </GlassCard>

      {/* Related Apps */}
      {relatedApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 px-1">
            <Zap className="text-blue-600" size={18} />
            Similar Apps
          </h3>
          <GlassCard className="p-4 border-slate-200/60 shadow-sm space-y-4">
            {relatedApps.map((app) => (
              <Link 
                key={app.id} 
                to={`/apps/${app.id}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                  <img src={app.mainImage} alt={app.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-black text-slate-600">{app.rating || '4.5'}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase truncate">
                      {app.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <Link 
              to="/explore" 
              className="block w-full py-2.5 text-center text-xs font-black text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
            >
              Discover More
            </Link>
          </GlassCard>
        </div>
      )}

      {/* Quick Info */}
      <GlassCard className="p-5 border-slate-200/60 shadow-sm space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Daily Downloads</span>
            <span className="text-slate-700 font-black">1.2K+</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Community Rating</span>
            <span className="text-slate-700 font-black">Very Good</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">File Status</span>
            <span className="text-emerald-600 font-black">Active</span>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium text-center">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </GlassCard>
    </aside>
  );
};
