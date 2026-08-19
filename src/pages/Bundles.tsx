import React, { useEffect, useState } from 'react';
import { Star, Film, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, isBundleItem } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { AdSlot } from '../components/ads/AdSlot';
import { useApps } from '../context/AppsContext';

export default function Bundles() {
  const { apps, categories: dbCategories, loading: appsLoading } = useApps();
  const [bundles, setBundles] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [pageVisitId] = useState(() => Math.random().toString(36).substring(2, 9));

  // Derive unique categories for sidebar
  const allCategories = Array.from(new Set(allItems.map(i => i.category).filter(Boolean)));
  const trendingApps = allItems.filter(i => !i.itemType || i.itemType === 'app').slice(0, 5);

  const shuffle = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    if (!apps) return;
    const items = (apps as any[]).filter(i => !i.status || i.status === 'published');
    setAllItems(shuffle(items));
    
    // STRICT filter: ONLY items that are bundles
    const bundleItems = items.filter(isBundleItem);
    setBundles(bundleItems);
  }, [apps]);

  useEffect(() => {
    if (!dbCategories) return;
    const catList = dbCategories
      .filter(c => c.itemType === 'bundle' || (c as any).mainType === 'bundle')
      .map(c => c.name);
    
    setCategories(['All', ...Array.from(new Set(catList))]);
  }, [dbCategories]);

  const loading = appsLoading && bundles.length === 0;

  // Group bundles by category
  const groupedBundles: { [key: string]: any[] } = {};
  bundles.forEach(bundle => {
    const cat = bundle.category || 'General';
    if (!groupedBundles[cat]) groupedBundles[cat] = [];
    groupedBundles[cat].push(bundle);
  });

  // Randomize category order on the page
  const allCatNames = shuffle(Object.keys(groupedBundles));

  // Helper to split array into chunks of 4 items
  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  // Render a block/row of bundle cards (1 per line on mobile, up to 4 on desktop)
  const renderBundleCards = (items: any[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {items.map((bundle) => (
        <Link 
          key={bundle.id} 
          to={`/apps/${bundle.id}`} 
          className="group block"
        >
          {/* Wide Landscape Card Box: 1 per line (full width) on mobile, grid on desktop */}
          <div className="p-2.5 sm:p-2.5 bg-white rounded-2xl border border-slate-200/90 hover:border-purple-400 shadow-xs hover:shadow-lg transition-all flex items-center gap-3 sm:gap-3 h-[76px] sm:h-[82px] text-left">
            
            {/* Left Image Thumbnail */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 shadow-xs">
              <img 
                src={bundle.mainImage} 
                alt={bundle.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            
            {/* Right Info - Clear Title & Metadata */}
            <div className="flex-1 min-w-0 flex flex-col justify-center space-y-0.5 sm:space-y-1">
              <h3 className="font-black text-slate-900 text-xs sm:text-xs line-clamp-2 group-hover:text-purple-600 transition-colors uppercase leading-tight sm:leading-snug">
                {bundle.name}
              </h3>
              
              <div className="flex items-center gap-2 text-[10px] sm:text-[10px] font-bold text-slate-400">
                <span className="text-yellow-500 flex items-center gap-0.5 font-black">
                  <Star size={10} fill="currentColor" /> {bundle.rating || '4.8'}
                </span>
                <span>•</span>
                <span className="uppercase text-slate-500 font-semibold truncate">{bundle.size || '120MB'}</span>
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );

  let globalChunkCount = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-4">
        
        {/* Header Banner - Strictly for Video Bundles */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
              <Film size={14} className="fill-white" />
              <span>Video & Creator Bundles</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase italic">
              Premium Video Bundles
            </h1>
            <p className="text-purple-100 text-sm font-medium leading-relaxed italic">
              Verified LUTs, Presets and Creator Packs.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap border shadow-sm",
                  activeCategory.toLowerCase() === cat.toLowerCase() 
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-purple-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-xs font-black text-slate-400 animate-pulse uppercase tracking-widest">Loading...</div>
        ) : activeCategory !== 'All' ? (
          /* Single Category View with responsive Ad placement (every 4 items on mobile, every 8 items/2 lines on desktop) */
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-l-4 border-purple-600 pl-3">
              <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-800 uppercase italic">
                {activeCategory}
              </h2>
            </div>
            {groupedBundles[activeCategory] && groupedBundles[activeCategory].length > 0 ? (
              <div className="space-y-3.5">
                {chunkArray(groupedBundles[activeCategory], 4).map((chunkItems, chunkIdx) => {
                  const isEvenChunk = chunkIdx % 2 === 1; // 2nd, 4th, 6th chunk (8, 16, 24 items)
                  return (
                    <React.Fragment key={`bundle-single-chunk-${chunkIdx}`}>
                      {renderBundleCards(chunkItems)}
                      {/* Show ad after every 4 items on mobile, and after every 8 items (2 lines) on desktop */}
                      <div className={cn("pt-2", isEvenChunk ? "block" : "block sm:hidden")}>
                        <AdSlot page="bundle" slotIndex={chunkIdx} pageVisitId={pageVisitId} />
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                No items found in this category.
              </div>
            )}
          </div>
        ) : allCatNames.length > 0 ? (
          /* All Categories View: All items of a category together, with ads after every 4 items on mobile & every 2 lines on desktop */
          <div className="space-y-7 pt-2">
            {allCatNames.map((catName) => {
              const catItems = groupedBundles[catName] || [];
              if (catItems.length === 0) return null;

              const chunks = chunkArray(catItems, 4);

              return (
                <section key={catName} className="space-y-2.5">
                  {/* Category Title Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 border-l-4 border-purple-600 pl-3">
                      <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-800 uppercase italic">
                        {catName}
                      </h2>
                    </div>
                  </div>

                  {/* Chunks of 4 items */}
                  <div className="space-y-3.5">
                    {chunks.map((chunkItems, chunkIdx) => {
                      globalChunkCount++;
                      const currentGlobalCount = globalChunkCount;
                      const isEvenChunk = currentGlobalCount % 2 === 0; // 2 lines on desktop (8 items)

                      return (
                        <React.Fragment key={`${catName}-chunk-${chunkIdx}`}>
                          {renderBundleCards(chunkItems)}

                          {/* Show Ad after every 4 lines on mobile, and every 2 lines (8 items) on desktop */}
                          <div className={cn("pt-2", isEvenChunk ? "block" : "block sm:hidden")}>
                            <AdSlot page="bundle" slotIndex={currentGlobalCount} pageVisitId={pageVisitId} />
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-400">
              <Film size={40} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-800 tracking-tight">No Bundles Yet</p>
              <p className="text-sm text-slate-500 font-medium">We're working on adding premium video bundles soon.</p>
            </div>
            <Link to="/explore">
              <Button variant="gradient" className="rounded-xl px-8">Explore Apps</Button>
            </Link>
          </div>
        )}
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
