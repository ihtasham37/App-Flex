import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cacheService, CACHE_KEYS, DEFAULT_CACHE_TTL } from '../lib/cacheService';

export interface AppItemData {
  id: string;
  name: string;
  category: string;
  icon: string;
  mainImage?: string;
  rating?: string;
  size?: string;
  downloads?: string | number;
  downloadUrl?: string;
  bannerImage?: string;
  isBanner?: boolean;
  itemType?: 'app' | 'game' | 'bundle' | 'pc';
  fullDescription?: string;
  screenshots?: string[];
  status?: string;
  updatedAt?: any;
  createdAt?: any;
}

export interface CategoryData {
  id: string;
  name: string;
  icon?: string;
  itemType?: string;
}

interface AppsContextType {
  apps: AppItemData[];
  categories: CategoryData[];
  loading: boolean;
  refreshApps: (force?: boolean) => Promise<void>;
  getAppById: (id: string) => Promise<AppItemData | null>;
}

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage cache first for 0ms instant startup & 0 Firestore reads
  const [apps, setApps] = useState<AppItemData[]>(() => {
    return cacheService.get<AppItemData[]>(CACHE_KEYS.APPS, DEFAULT_CACHE_TTL) || [];
  });

  const [categories, setCategories] = useState<CategoryData[]>(() => {
    return cacheService.get<CategoryData[]>(CACHE_KEYS.CATEGORIES, DEFAULT_CACHE_TTL) || [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = cacheService.get<AppItemData[]>(CACHE_KEYS.APPS, DEFAULT_CACHE_TTL);
    return !cached || cached.length === 0;
  });

  const fetchCatalog = useCallback(async (force = false) => {
    // If not forcing and cache exists, don't read from Firestore (Saves free quota!)
    if (!force) {
      const cachedApps = cacheService.get<AppItemData[]>(CACHE_KEYS.APPS, DEFAULT_CACHE_TTL);
      const cachedCats = cacheService.get<CategoryData[]>(CACHE_KEYS.CATEGORIES, DEFAULT_CACHE_TTL);
      if (cachedApps && cachedApps.length > 0) {
        setApps(cachedApps);
        if (cachedCats) setCategories(cachedCats);
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Fetch apps
      const appsSnap = await getDocs(collection(db, 'apps'));
      const fetchedApps: AppItemData[] = appsSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as AppItemData))
        .filter(item => !item.status || item.status === 'published');

      // 2. Fetch categories
      const catsSnap = await getDocs(collection(db, 'categories'));
      const fetchedCats: CategoryData[] = catsSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as CategoryData));

      setApps(fetchedApps);
      setCategories(fetchedCats);

      // Save to localStorage with 30-min TTL
      cacheService.set(CACHE_KEYS.APPS, fetchedApps);
      cacheService.set(CACHE_KEYS.CATEGORIES, fetchedCats);
    } catch (err) {
      console.warn('[AppsProvider] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog(false);
  }, [fetchCatalog]);

  const refreshApps = async (force = true) => {
    if (force) {
      cacheService.remove(CACHE_KEYS.APPS);
      cacheService.remove(CACHE_KEYS.CATEGORIES);
    }
    await fetchCatalog(force);
  };

  const getAppById = async (id: string): Promise<AppItemData | null> => {
    // 1. Check in-memory state / cached list first (0 reads!)
    const found = apps.find(a => a.id === id);
    if (found) return found;

    // 2. Check localStorage cache
    const cached = cacheService.get<AppItemData[]>(CACHE_KEYS.APPS, DEFAULT_CACHE_TTL);
    if (cached) {
      const cachedFound = cached.find(a => a.id === id);
      if (cachedFound) return cachedFound;
    }

    // 3. Fallback: single doc fetch only if not in cache (1 read only)
    try {
      const snap = await getDoc(doc(db, 'apps', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as AppItemData;
      }
    } catch (err) {
      console.warn(`[AppsProvider] Failed fetching single app ${id}:`, err);
    }
    return null;
  };

  return (
    <AppsContext.Provider value={{ apps, categories, loading, refreshApps, getAppById }}>
      {children}
    </AppsContext.Provider>
  );
};

export const useApps = () => {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error('useApps must be used within an AppsProvider');
  }
  return context;
};
