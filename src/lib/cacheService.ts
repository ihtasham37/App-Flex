/**
 * APPFLEX Smart LocalStorage Cache Manager
 * Drastically reduces Firestore read queries by caching static/catalog data locally.
 * Enables 3,300+ Daily Active Users within Firebase Spark Free Tier (50,000 daily reads).
 */

export const CACHE_KEYS = {
  APPS: 'appflex_cache_apps_v1',
  CATEGORIES: 'appflex_cache_categories_v1',
  SETTINGS: 'appflex_cache_settings_v1',
  ADS: 'appflex_cache_ads_v1',
};

// Default Cache Expiration: 24 Hours (1 Day)
export const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

interface CacheEnvelope<T> {
  timestamp: number;
  dateStr?: string;
  data: T;
}

export const cacheService = {
  /**
   * Retrieves data from localStorage if still within valid TTL (24 Hours)
   * and auto-expires on next calendar day.
   */
  get<T>(key: string, ttl: number = DEFAULT_CACHE_TTL): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      
      const envelope: CacheEnvelope<T> = JSON.parse(raw);
      const now = Date.now();
      
      // Expire if older than 24 hours OR if it belongs to a previous calendar day
      const isPastTTL = now - envelope.timestamp > ttl;
      const isDifferentDay = envelope.dateStr && envelope.dateStr !== new Date(now).toDateString();

      if (isPastTTL || isDifferentDay) {
        return null;
      }
      
      return envelope.data;
    } catch (e) {
      console.warn(`[CacheService] Failed reading key "${key}":`, e);
      return null;
    }
  },

  /**
   * Stores data in localStorage with current timestamp and day string.
   */
  set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      const now = new Date();
      const envelope: CacheEnvelope<T> = {
        timestamp: now.getTime(),
        dateStr: now.toDateString(),
        data,
      };
      localStorage.setItem(key, JSON.stringify(envelope));
    } catch (e) {
      console.warn(`[CacheService] Failed writing key "${key}":`, e);
    }
  },

  /**
   * Invalidates a specific cache key.
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[CacheService] Failed removing key "${key}":`, e);
    }
  },

  /**
   * Purges all APPFLEX cache. Used when admin updates apps/settings.
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(CACHE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[CacheService] Failed clearing all cache:', e);
    }
  }
};
