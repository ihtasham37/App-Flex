import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title,
  description,
  keywords = 'APKs, Android apps, MOD games, PC software, video bundles, Lightroom presets, LUTs, APPFLEX',
  image = '/pwa-512x512.png',
  url,
}: SEOProps) => {
  const { settings } = useSettings();
  const siteName = settings.appName || 'APPFLEX';

  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Premium Apps, Games, PC Softs & Bundles`;
    const fullDesc =
      description ||
      `Download 100% verified Android apps, MOD games, PC software, Premiere templates, Lightroom presets, and video editing bundles on ${siteName}.`;

    // Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', fullDesc);
    
    // Meta Keywords
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', fullDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
    if (url) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
    }

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', fullDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, keywords, image, url, siteName]);

  return null;
};
