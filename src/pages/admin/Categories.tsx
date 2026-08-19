import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tag, Plus, Trash2, Smartphone, Gamepad2, Film, Layers, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { cacheService } from '../../lib/cacheService';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedMainType, setSelectedMainType] = useState<'app' | 'game' | 'bundle' | 'pc'>('app');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'app' | 'game' | 'bundle' | 'pc'>('all');

  useEffect(() => {
    // Real-time updates for categories
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory.trim(),
        mainType: selectedMainType,
        createdAt: serverTimestamp()
      });
      cacheService.clearAll();
      setNewCategory('');
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        cacheService.clearAll();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const filteredCategories = categories.filter(c => {
    if (filterType === 'all') return true;
    return (c.mainType || 'app') === filterType;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Create & Manage Categories</h1>
        <p className="text-xs text-slate-500 font-medium">Create categories for the 4 main types: Apps, Games, PC Soft and Video Bundles.</p>
      </div>

      <div className="grid md:grid-cols-[400px_1fr] gap-6 items-start">
        
        {/* Category Creation Form */}
        <GlassCard className="p-6 space-y-5 bg-white border border-slate-200" hover={false}>
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            Add New Sub-Category
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4">
            
            {/* Choose Main Category Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Choose Main Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMainType('app')}
                  className={cn(
                    "py-2 px-1 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1",
                    selectedMainType === 'app'
                      ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Smartphone size={16} />
                  <span>Apps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMainType('game')}
                  className={cn(
                    "py-2 px-1 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1",
                    selectedMainType === 'game'
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Gamepad2 size={16} />
                  <span>Games</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMainType('pc')}
                  className={cn(
                    "py-2 px-1 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1",
                    selectedMainType === 'pc'
                      ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Monitor size={16} />
                  <span>PC Soft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMainType('bundle')}
                  className={cn(
                    "py-2 px-1 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1",
                    selectedMainType === 'bundle'
                      ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Film size={16} />
                  <span>Bundles</span>
                </button>
              </div>
            </div>

            <Input 
              label="Category Title"
              placeholder={
                selectedMainType === 'app' ? "e.g. Tools, Photography, Social" :
                selectedMainType === 'game' ? "e.g. Action, Racing, Strategy" :
                selectedMainType === 'pc' ? "e.g. Editors, Anti-Virus, PC Tools" :
                "e.g. Cinematic LUTs, CapCut Presets"
              }
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              icon={<Tag size={16} />}
            />

            <Button type="submit" variant="gradient" className="w-full h-11 text-xs font-bold rounded-xl" loading={adding}>
              <Plus size={16} className="mr-1.5" /> Save Category
            </Button>
          </form>
        </GlassCard>

        {/* Existing Categories List */}
        <GlassCard className="p-6 bg-white border border-slate-200" hover={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-purple-600" />
              Existing Categories ({filteredCategories.length})
            </h2>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'app', 'game', 'pc', 'bundle'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all border",
                    filterType === t
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {t === 'all' ? 'All' : t === 'app' ? 'Apps' : t === 'game' ? 'Games' : t === 'pc' ? 'PC' : 'Bundles'}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-bold animate-pulse text-xs">Loading categories...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCategories.map((cat) => {
                const type = cat.mainType || 'app';
                return (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 group hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        type === 'game' ? "bg-emerald-500" : type === 'bundle' ? "bg-purple-500" : type === 'pc' ? "bg-slate-800" : "bg-blue-500"
                      )} />
                      <span className="font-bold text-xs text-slate-800 truncate">{cat.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              {filteredCategories.length === 0 && (
                <div className="col-span-full py-10 text-center text-xs text-slate-400 font-semibold">
                  No categories found. Use the form on the left to add one!
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
