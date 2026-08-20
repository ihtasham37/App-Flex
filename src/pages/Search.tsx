import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search as SearchIcon, Filter, X, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AdSlot } from '../components/ads/AdSlot';
import { useApps } from '../context/AppsContext';

interface AppData {
  id: string;
  name: string;
  shortDescription?: string;
  category: string;
  mainImage: string;
  appNumber?: string;
  rating?: number | string;
  version?: string;
  status?: string;
}

import { DesktopSidebar } from '../components/DesktopSidebar';
import { SEO } from '../components/SEO';

export default function Search() {
  const { apps } = useApps();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const allItems = (apps as any[]).filter(item => !item.status || item.status === 'published');

  // Derive unique categories for sidebar
  const allCategories = Array.from(new Set(allItems.map(i => i.category).filter(Boolean)));
  const trendingApps = allItems.slice(0, 5);

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim().toLowerCase();
    
    setSearchHistory(prev => {
      // Remove if exists, add to top, slice to 5
      const filtered = prev.filter(h => h !== cleanTerm);
      const updated = [cleanTerm, ...filtered].slice(0, 5);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(h => h !== term);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const term = searchTerm.toLowerCase().trim();
      const filtered = allItems.filter(app => 
        app.name.toLowerCase().includes(term) ||
        app.appNumber.includes(term) ||
        app.category.toLowerCase().includes(term) ||
        (app.shortDescription && app.shortDescription.toLowerCase().includes(term))
      );
      
      setResults(filtered);
      if (filtered.length > 0) {
        saveToHistory(term);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 max-w-7xl mx-auto">
      <SEO 
        title={searchTerm ? `Search Results for "${searchTerm}"` : "Search APKs, MOD Games, PC Softs & Bundles"}
        description="Search thousands of verified Android apps, MOD games, PC software, Lightroom presets, and video bundles on APPFLEX."
        keywords="search apps, find APKs, MOD games search, video bundles search, APPFLEX search"
      />
      {/* Main Content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-8">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight italic uppercase">Search Anything</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search by name, category or #"
              icon={<SearchIcon size={24} className="text-blue-600" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg py-7 rounded-[32px] bg-white shadow-2xl shadow-blue-500/5 border-slate-100 focus:border-blue-400 focus:ring-blue-400 font-bold"
            />
          </div>

          {/* Advertisement directly under the Search Bar */}
          <AdSlot page="search" slotIndex={0} className="my-2" />
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="grid gap-4">
                <div className="flex items-center gap-2 ml-1">
                  <div className="w-1 h-4 bg-blue-600 rounded-full" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Found {results.length} matched items
                  </p>
                </div>
                <AnimatePresence>
                  {results.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link to={`/apps/${app.id}`}>
                        <GlassCard className="p-4 flex items-center gap-5 sm:gap-6 rounded-3xl border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all group">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 shadow-sm">
                            <img src={app.mainImage} alt={app.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-tight border border-blue-100">
                                {app.category}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100">#{app.appNumber}</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors leading-tight">{app.name}</h3>
                            <p className="text-xs text-slate-400 font-bold tracking-tight mt-0.5">v{app.version || '1.0.0'}</p>
                          </div>
                          <div className="hidden sm:flex flex-col items-end gap-2 pr-2">
                             <div className="flex items-center gap-1 text-yellow-500">
                               <Star size={16} fill="currentColor" />
                               <span className="text-base font-black text-slate-900">{app.rating || '4.5'}</span>
                             </div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                               View Item
                             </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                            <ChevronRight size={20} />
                          </div>
                        </GlassCard>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-white rounded-[40px] border border-slate-200/80 p-8 shadow-sm">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <X size={48} />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Items Found</h3>
                   <p className="text-slate-500 font-medium">We couldn't find any results for "{searchTerm}".</p>
                 </div>
                 <Button variant="gradient" size="sm" onClick={() => setSearchTerm('')} className="rounded-2xl px-8">Clear Search</Button>
              </div>
            )
          ) : (
            <div className="space-y-12">
              {searchHistory.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between ml-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Searches</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchHistory([]);
                        localStorage.removeItem('search_history');
                      }}
                      className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {searchHistory.map(tag => (
                      <div 
                        key={tag}
                        className="group flex items-center gap-2 px-5 py-3 bg-white rounded-2xl text-xs font-black shadow-sm border border-slate-100 hover:border-blue-200 transition-all"
                      >
                        <button 
                          onClick={() => setSearchTerm(tag)}
                          className="text-slate-600 hover:text-blue-600"
                        >
                          {tag}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(tag);
                          }}
                          className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
                 <div className="relative z-10 space-y-5 max-w-md">
                   <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight uppercase italic">Discover the Best Catalog</h2>
                   <p className="text-blue-100 text-base font-medium leading-relaxed">Our library is updated daily with premium apps, games, and video bundles.</p>
                   <Link to="/explore" className="inline-block">
                     <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black px-8 h-12 rounded-2xl shadow-xl shadow-black/10 transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest">Explore Catalog</Button>
                   </Link>
                 </div>
                 <SearchIcon size={240} className="absolute -bottom-20 -right-20 text-white/10 rotate-12" />
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3">
        <DesktopSidebar 
          categories={allCategories} 
          trendingApps={trendingApps} 
        />
      </div>
    </div>
  );
}
