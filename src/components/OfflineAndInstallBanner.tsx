import React, { useEffect, useState } from 'react';
import { WifiOff, Download, X } from 'lucide-react';
import { Language } from '../types/health';

interface Props {
  lang: Language;
}

export const OfflineAndInstallBanner: React.FC<Props> = ({ lang }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Toast */}
      {!isOnline && (
        <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 text-white px-3.5 py-2 text-xs font-medium shadow-xl border border-slate-700 animate-fade-in">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {lang === 'si'
              ? 'නොබැඳි මාදිලිය (Offline) — ඔබගේ දත්ත ඔබගේ උපාංගයේ සුරක්ෂිතව තැන්පත් වේ.'
              : 'Offline Mode Active — Changes cached locally and will sync when reconnected.'}
          </span>
        </div>
      )}

      {/* PWA Install Prompt (if available) */}
      {showInstall && (
        <div className="fixed top-16 right-4 z-40 max-w-xs p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700">
              <Download className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {lang === 'si' ? 'යෙදුම ස්ථාපනය කරන්න' : 'Install ArogyaSync'}
              </p>
              <p className="text-[10px] text-slate-500">
                {lang === 'si' ? 'දුරකථනයට හෝ පරිගණකයට' : 'One-tap offline home screen access'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition cursor-pointer"
            >
              {lang === 'si' ? 'Install' : 'Install'}
            </button>
            <button
              type="button"
              onClick={() => setShowInstall(false)}
              className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
