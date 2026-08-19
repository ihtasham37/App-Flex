import React, { useState, useEffect } from 'react';
import { useAds, AdSettingsData, AdItem } from '../../context/AdsContext';
import { Button } from '../../components/ui/Button';
import { 
  Megaphone, ShieldCheck, Eye, Trash2, Save, Power, CheckCircle, 
  Sparkles, Layers, Monitor, Smartphone, Film, User, DownloadCloud,
  X, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminAdsCenter() {
  const { adSettings, updateAdSettings, updateSingleAd, loading } = useAds();

  // Local draft state for quick editing & saving
  const [formData, setFormData] = useState<AdSettingsData>(adSettings);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Preview modal state
  const [previewAd, setPreviewAd] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    if (!loading) {
      setFormData(adSettings);
    }
  }, [adSettings, loading]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleGlobalToggle = async (checked: boolean) => {
    const updated = { ...formData, global_ads_enabled: checked };
    setFormData(updated);
    await updateAdSettings({ global_ads_enabled: checked });
    showSuccess(`Global ads ${checked ? 'enabled' : 'disabled'} successfully.`);
  };

  const handlePageToggle = async (key: keyof AdSettingsData, checked: boolean) => {
    const updated = { ...formData, [key]: checked };
    setFormData(updated);
    await updateAdSettings({ [key]: checked });
    showSuccess(`Updated page ads toggle.`);
  };

  const handleAdFieldChange = (adKey: keyof AdSettingsData['ads'], field: keyof AdItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      ads: {
        ...prev.ads,
        [adKey]: {
          ...prev.ads[adKey],
          [field]: value
        }
      }
    }));
  };

  const handleSaveAd = async (adKey: keyof AdSettingsData['ads']) => {
    setSavingKey(adKey);
    try {
      const adToSave = formData.ads[adKey];
      await updateSingleAd(adKey, adToSave);
      showSuccess(`${adToSave.name || adKey} saved successfully!`);
    } catch (err) {
      console.error("Save ad error:", err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleClearAd = async (adKey: keyof AdSettingsData['ads']) => {
    if (window.confirm(`Are you sure you want to clear/delete the ad code for ${formData.ads[adKey].name}?`)) {
      handleAdFieldChange(adKey, 'ad_code', '');
      await updateSingleAd(adKey, { ad_code: '' });
      showSuccess(`Ad code for ${formData.ads[adKey].name} cleared.`);
    }
  };

  const handleToggleAdStatus = async (adKey: keyof AdSettingsData['ads']) => {
    const currentStatus = formData.ads[adKey]?.enabled ?? true;
    const newStatus = !currentStatus;
    handleAdFieldChange(adKey, 'enabled', newStatus);
    await updateSingleAd(adKey, { enabled: newStatus });
    showSuccess(`${formData.ads[adKey].name} turned ${newStatus ? 'ON' : 'OFF'}.`);
  };

  const normalAdKeys: (keyof AdSettingsData['ads'])[] = ['ad_1', 'ad_2', 'ad_3', 'ad_4', 'ad_5'];

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
          <CheckCircle size={20} />
          <span className="text-xs sm:text-sm font-black tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Megaphone size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Ads Center
              </h1>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-md">
                6 Ad Slots
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Manage 5 rotating public ad codes and Ad 6 download reward system.
            </p>
          </div>
        </div>

        {/* Global Master Switch */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-slate-800 uppercase">Global All Ads</span>
            <span className="text-[10px] font-bold text-slate-400">
              {formData.global_ads_enabled ? 'Active everywhere' : 'Disabled globally'}
            </span>
          </div>
          <button
            onClick={() => handleGlobalToggle(!formData.global_ads_enabled)}
            className={cn(
              "w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300",
              formData.global_ads_enabled ? "bg-emerald-500" : "bg-slate-300"
            )}
          >
            <div
              className={cn(
                "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300",
                formData.global_ads_enabled ? "translate-x-6" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Page Switches Control Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Layers size={18} className="text-blue-600" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Page-Level Ad Switches
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Home */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Home Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.home_ads_enabled}
              onChange={(e) => handlePageToggle('home_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* Apps */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Apps Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.apps_ads_enabled}
              onChange={(e) => handlePageToggle('apps_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* PC Software */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Monitor size={16} className="text-slate-800" />
              <span className="text-xs font-bold text-slate-800">PC Software Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.pc_ads_enabled}
              onChange={(e) => handlePageToggle('pc_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* Bundles */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Film size={16} className="text-purple-600" />
              <span className="text-xs font-bold text-slate-800">Bundle Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.bundle_ads_enabled}
              onChange={(e) => handlePageToggle('bundle_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* Download Detail */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <DownloadCloud size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Download Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.detail_ads_enabled}
              onChange={(e) => handlePageToggle('detail_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* Search Page */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-amber-600" />
              <span className="text-xs font-bold text-slate-800">Search Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.search_ads_enabled ?? true}
              onChange={(e) => handlePageToggle('search_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>

          {/* Profile */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <User size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Profile Page Ads</span>
            </div>
            <input
              type="checkbox"
              checked={formData.profile_ads_enabled}
              onChange={(e) => handlePageToggle('profile_ads_enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: ROTATING ADS 1 TO 5 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span>Ads 1–5: Normal Rotating Advertisements</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              These 5 ads rotate randomly throughout public pages without immediate repetition.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {normalAdKeys.map((key, index) => {
            const ad = formData.ads[key] || { id: key, name: `Advertisement ${index + 1}`, ad_code: '', enabled: true, ad_type: 'normal' };
            const isSaving = savingKey === key;
            const hasCode = Boolean(ad.ad_code && ad.ad_code.trim().length > 0);

            return (
              <div
                key={key}
                className={cn(
                  "bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-xs space-y-4",
                  ad.enabled ? "border-slate-200" : "border-slate-200 bg-slate-50/60 opacity-80"
                )}
              >
                {/* Ad Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center",
                      ad.enabled ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-200 text-slate-500"
                    )}>
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={ad.name}
                      onChange={(e) => handleAdFieldChange(key, 'name', e.target.value)}
                      placeholder={`Advertisement ${index + 1}`}
                      className="font-black text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 rounded transition-colors uppercase"
                    />
                  </div>

                  {/* Status Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Status: <strong className={ad.enabled ? "text-emerald-600 font-black" : "text-slate-400 font-bold"}>{ad.enabled ? "ON" : "OFF"}</strong>
                    </span>
                    <button
                      onClick={() => handleToggleAdStatus(key)}
                      className={cn(
                        "w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200",
                        ad.enabled ? "bg-emerald-500" : "bg-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                          ad.enabled ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Ad Code Input Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Paste Ad Code (HTML / JS / Script / Iframe / Ad Tag):</span>
                    {hasCode ? (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle size={12} /> Code Active ({ad.ad_code.length} chars)
                      </span>
                    ) : (
                      <span className="text-amber-500 font-bold text-[10px]">No code pasted</span>
                    )}
                  </label>
                  <textarea
                    rows={4}
                    value={ad.ad_code}
                    onChange={(e) => handleAdFieldChange(key, 'ad_code', e.target.value)}
                    placeholder={`<!-- Paste your Advertisement ${index + 1} script or embed tag here -->\n<script async src="//..."></script>`}
                    className="w-full font-mono text-xs p-3.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y"
                  />
                </div>

                {/* Actions: Save, Edit, Preview, Clear */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSaveAd(key)}
                      variant="default"
                      size="sm"
                      loading={isSaving}
                      className="rounded-xl px-4 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                    >
                      <Save size={14} />
                      <span>Save Ad {index + 1}</span>
                    </Button>

                    <Button
                      onClick={() => setPreviewAd({ name: ad.name, code: ad.ad_code })}
                      variant="outline"
                      size="sm"
                      disabled={!hasCode}
                      className="rounded-xl px-3.5 h-9 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </Button>
                  </div>

                  <button
                    onClick={() => handleClearAd(key)}
                    disabled={!hasCode}
                    className="text-xs font-bold text-red-500 hover:text-red-700 disabled:text-slate-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete / Clear</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: AD 6 - REWARDED DOWNLOAD AD */}
      <div className="space-y-4 pt-4">
        <div className="space-y-0.5 px-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-widest rounded-full">
            <Sparkles size={12} />
            <span>Ad 6 — Dedicated Monetization</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
            🎁 Rewarded Download Ad (Ad 6)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            This ad is used strictly for user download rewards after exceeding the daily free limit (5 free downloads/day).
          </p>
        </div>

        {(() => {
          const key = 'ad_6' as keyof AdSettingsData['ads'];
          const ad = formData.ads[key] || { id: 'ad_6', name: '🎁 Rewarded Download Ad 6', ad_code: '', enabled: true, ad_type: 'rewarded' };
          const isSaving = savingKey === key;
          const hasCode = Boolean(ad.ad_code && ad.ad_code.trim().length > 0);

          return (
            <div className="bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 rounded-3xl border-2 border-purple-200 p-6 sm:p-7 shadow-lg shadow-purple-500/5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-purple-500/25">
                    6
                  </div>
                  <div>
                    <input
                      type="text"
                      value={ad.name}
                      onChange={(e) => handleAdFieldChange(key, 'name', e.target.value)}
                      placeholder="🎁 Rewarded Download Ad 6"
                      className="font-black text-base text-slate-900 bg-transparent border-b border-transparent hover:border-purple-300 focus:border-purple-600 outline-none px-1 py-0.5 rounded uppercase"
                    />
                    <p className="text-[11px] text-purple-700 font-bold px-1">
                      Targeted Rewarded Download Unit
                    </p>
                  </div>
                </div>

                {/* Rewarded Ad Status Switch */}
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-purple-200">
                  <span className="text-xs font-bold uppercase text-slate-600">
                    Status: <strong className={ad.enabled ? "text-purple-600 font-black" : "text-slate-400 font-bold"}>{ad.enabled ? "ON" : "OFF"}</strong>
                  </span>
                  <button
                    onClick={() => handleToggleAdStatus(key)}
                    className={cn(
                      "w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200",
                      ad.enabled ? "bg-purple-600" : "bg-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                        ad.enabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Rewarded Ad Code */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-purple-900 flex items-center justify-between">
                  <span>Paste Rewarded Ad Code:</span>
                  {hasCode ? (
                    <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle size={12} /> Active Rewarded Code ({ad.ad_code.length} chars)
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-[10px]">No rewarded code pasted</span>
                  )}
                </label>
                <textarea
                  rows={5}
                  value={ad.ad_code}
                  onChange={(e) => handleAdFieldChange(key, 'ad_code', e.target.value)}
                  placeholder={`<!-- Paste your Rewarded Download Ad code here -->\n<div class="reward-unit">...</div>\n<script>...</script>`}
                  className="w-full font-mono text-xs p-3.5 bg-slate-900 text-purple-100 rounded-2xl border border-purple-900/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-y"
                />
              </div>

              {/* Actions for Ad 6 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleSaveAd(key)}
                    variant="default"
                    loading={isSaving}
                    className="rounded-xl px-5 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 uppercase tracking-wider"
                  >
                    <Save size={15} />
                    <span>SAVE REWARDED AD 6</span>
                  </Button>

                  <Button
                    onClick={() => setPreviewAd({ name: ad.name, code: ad.ad_code })}
                    variant="outline"
                    disabled={!hasCode}
                    className="rounded-xl px-4 h-10 border-purple-200 text-purple-800 hover:bg-purple-50 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Eye size={15} />
                    <span>Preview</span>
                  </Button>
                </div>

                <button
                  onClick={() => handleClearAd(key)}
                  disabled={!hasCode}
                  className="text-xs font-bold text-red-500 hover:text-red-700 disabled:text-slate-300 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Delete / Clear</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ISOLATED SANDBOXED PREVIEW MODAL */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-blue-600" />
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">
                  Preview: {previewAd.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAd(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-auto bg-slate-100/70 flex flex-col items-center justify-center min-h-[250px]">
              <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Isolated Ad Container
                </span>
                <iframe
                  title="Ad Preview Frame"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                          body { margin: 0; padding: 12px; display: flex; justify-content: center; align-items: center; min-height: 100px; font-family: system-ui; text-align: center; }
                          img, video, iframe { max-width: 100% !important; height: auto !important; margin: 0 auto; }
                        </style>
                      </head>
                      <body>
                        ${previewAd.code}
                      </body>
                    </html>
                  `}
                  className="w-full min-h-[200px] border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <Button
                onClick={() => setPreviewAd(null)}
                variant="outline"
                size="sm"
                className="rounded-xl px-5 font-bold"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
