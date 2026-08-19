import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GlassCard } from '../../components/ui/GlassCard';
import { 
  Package, Users, DownloadCloud, Film, 
  Gamepad2, TrendingUp, Smartphone, ShieldCheck, Activity,
  Monitor, ArrowUpRight, Clock, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentDownload {
  id: string;
  appName: string;
  category?: string;
  userId?: string;
  downloadedAt?: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApps: 0,
    totalGames: 0,
    totalPC: 0,
    totalBundles: 0,
    totalUsers: 0,
    totalDownloads: 0,
    todayDownloads: 0,
    publishedItems: 0,
    bannerItems: 0,
  });
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Real-time listener on apps catalog
    const unsubApps = onSnapshot(collection(db, 'apps'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const apps = items.filter((i: any) => 
        i.itemType === 'app' || 
        (!i.itemType && !i.category?.toLowerCase().includes('game') && !i.category?.toLowerCase().includes('bundle') && !i.category?.toLowerCase().includes('pc'))
      );
      const games = items.filter((i: any) => 
        i.itemType === 'game' || 
        (!i.itemType && i.category?.toLowerCase().includes('game'))
      );
      const pc = items.filter((i: any) => 
        i.itemType === 'pc' || 
        (!i.itemType && (i.category?.toLowerCase().includes('pc') || i.category?.toLowerCase().includes('software') || i.category?.toLowerCase().includes('windows')))
      );
      const bundles = items.filter((i: any) => 
        i.itemType === 'bundle' || 
        (!i.itemType && (i.category?.toLowerCase().includes('bundle') || i.category?.toLowerCase().includes('template') || i.category?.toLowerCase().includes('video')))
      );
      const published = items.filter((i: any) => !i.status || i.status === 'published');
      const banners = items.filter((i: any) => i.showOnBanner);

      // Top rated or featured items for quick glance
      const sortedByRating = [...items]
        .filter((i: any) => !i.status || i.status === 'published')
        .sort((a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        .slice(0, 5);

      setTopItems(sortedByRating);
      setStats(prev => ({
        ...prev,
        totalApps: apps.length,
        totalGames: games.length,
        totalPC: pc.length,
        totalBundles: bundles.length,
        publishedItems: published.length,
        bannerItems: banners.length,
      }));
      setLoading(false);
    });

    // 2. Real-time listener on users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
    });

    // 3. Real-time listener on downloads
    const unsubDownloads = onSnapshot(collection(db, 'downloads'), (snap) => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      let todayCount = 0;
      const downloadsList: RecentDownload[] = [];

      snap.docs.forEach(d => {
        const data = d.data();
        const dlDate = data.downloadedAt?.toDate ? data.downloadedAt.toDate().getTime() : 0;
        if (dlDate >= startOfToday) {
          todayCount++;
        }
        downloadsList.push({
          id: d.id,
          appName: data.appName || 'Unknown App',
          category: data.category || 'General',
          userId: data.userId || 'Guest',
          downloadedAt: data.downloadedAt
        });
      });

      // Sort recent downloads by date descending
      downloadsList.sort((a, b) => {
        const timeA = a.downloadedAt?.toDate ? a.downloadedAt.toDate().getTime() : 0;
        const timeB = b.downloadedAt?.toDate ? b.downloadedAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

      setRecentDownloads(downloadsList.slice(0, 6));
      setStats(prev => ({ 
        ...prev, 
        totalDownloads: snap.size,
        todayDownloads: todayCount
      }));
    });

    return () => {
      unsubApps();
      unsubUsers();
      unsubDownloads();
    };
  }, []);

  const totalContent = stats.totalApps + stats.totalGames + stats.totalPC + stats.totalBundles;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time marketplace ecosystem metrics & analytics overview.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shadow-xs">
          <Activity size={14} className="animate-pulse text-emerald-500" />
          <span>Real-time Live Sync Active</span>
        </div>
      </div>

      {/* Primary Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* 1. Apps Count */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Apps</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalApps}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Android Apps</p>
          </div>
        </div>

        {/* 2. Games Count */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Games</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Gamepad2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalGames}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Mobile Games</p>
          </div>
        </div>

        {/* 3. PC Softwares Count */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PC Softwares</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Monitor size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalPC}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Windows/PC</p>
          </div>
        </div>

        {/* 4. Video Bundles Count */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bundles</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Film size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalBundles}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Asset Packs</p>
          </div>
        </div>

        {/* 5. Registered Users */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Users</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalUsers}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Registered Users</p>
          </div>
        </div>

        {/* 6. Total Downloads */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Downloads</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DownloadCloud size={16} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 leading-none">{loading ? '...' : stats.totalDownloads}</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">+{stats.todayDownloads} Today</p>
          </div>
        </div>

      </div>

      {/* Analytics Breakdown & Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Catalog Distribution Breakdown */}
        <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hover={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Content Distribution Breakdown
            </h3>
            <span className="text-xs font-bold text-slate-400">{totalContent} Total Items</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Apps bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Smartphone size={13} className="text-blue-600" /> Android Apps
                </span>
                <span>{stats.totalApps} ({totalContent > 0 ? Math.round((stats.totalApps / totalContent) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${totalContent > 0 ? (stats.totalApps / totalContent) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Games bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Gamepad2 size={13} className="text-emerald-600" /> Mobile Games
                </span>
                <span>{stats.totalGames} ({totalContent > 0 ? Math.round((stats.totalGames / totalContent) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${totalContent > 0 ? (stats.totalGames / totalContent) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* PC Softwares bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Monitor size={13} className="text-cyan-600" /> PC Softwares
                </span>
                <span>{stats.totalPC} ({totalContent > 0 ? Math.round((stats.totalPC / totalContent) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                  style={{ width: `${totalContent > 0 ? (stats.totalPC / totalContent) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Bundles bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Film size={13} className="text-purple-600" /> Video Bundles & Packs
                </span>
                <span>{stats.totalBundles} ({totalContent > 0 ? Math.round((stats.totalBundles / totalContent) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                  style={{ width: `${totalContent > 0 ? (stats.totalBundles / totalContent) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* System & Publishing Status */}
        <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hover={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Ecosystem & Service Health
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded">
              Optimal
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-600">Published (Active Live) Items</span>
              <span className="font-black text-slate-900">{stats.publishedItems} Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-600">Banner Featured Items</span>
              <span className="font-black text-purple-600">{stats.bannerItems} (Auto-rotating 2s)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-600">Smart Storage Cache System</span>
              <span className="font-black text-emerald-600">24H Next-Day Sync</span>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Recent Downloads & Top Content Section */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Recent Downloads Stream */}
        <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hover={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" />
              Recent Download Events
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Real-time Stream</span>
          </div>

          <div className="space-y-2.5">
            {recentDownloads.length > 0 ? (
              recentDownloads.map((dl) => (
                <div key={dl.id} className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <DownloadCloud size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{dl.appName}</p>
                      <p className="text-[10px] text-slate-400">{dl.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 flex-shrink-0 ml-2">
                    {dl.downloadedAt?.toDate ? dl.downloadedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No download records yet.</p>
            )}
          </div>
        </GlassCard>

        {/* Top Rated Marketplace Items */}
        <GlassCard className="p-6 space-y-4 bg-white border border-slate-200" hover={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              Top Rated Items
            </h3>
            <Link to="/admin/apps" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              Manage All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {topItems.length > 0 ? (
              topItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.mainImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} 
                      alt={item.name} 
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-slate-200" 
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.category} • {item.itemType || 'app'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-black text-[11px] flex-shrink-0">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{item.rating || '4.5'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No apps published yet.</p>
            )}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
