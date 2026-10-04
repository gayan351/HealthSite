import React from 'react';
import { Lock, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Language, CloudSyncInfo } from '../types/health';
import { t } from '../utils/translations';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  syncInfo: CloudSyncInfo;
  onLockApp: () => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  syncInfo,
  onLockApp,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity font-display cursor-pointer"
        >
          ArogyaSync
        </button>

        {/* Zone 2: 4-6 clean text navigation links (Hidden on mobile, uses bottom bar) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'dashboard'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tab_dashboard', lang)}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('tasks')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'tasks'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tab_tasks', lang)}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('nutrition')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'nutrition'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tab_nutrition', lang)}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('statistics')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'statistics'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tab_statistics', lang)}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('reminders')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentTab === 'reminders'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('tab_reminders', lang)}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Indicator */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Cloud Sync State"
          >
            {syncInfo.status === 'synced' && <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            {syncInfo.status === 'syncing' && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
            {syncInfo.status === 'offline' && <CloudOff className="w-3.5 h-3.5 text-amber-500" />}
            {syncInfo.status === 'pending' && <Cloud className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden sm:inline text-[11px] font-medium">
              {syncInfo.status === 'offline'
                ? t('offline', lang)
                : syncInfo.status === 'syncing'
                ? t('syncing', lang)
                : t('synced', lang)}
            </span>
          </button>

          {/* Language Toggle (SI / EN) */}
          <button
            type="button"
            onClick={onToggleLang}
            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer whitespace-nowrap"
            title="Switch Language"
          >
            {lang === 'si' ? 'English' : 'සිංහල'}
          </button>

          {/* Biometric / Passcode Lock Trigger */}
          <button
            type="button"
            onClick={onLockApp}
            className="h-9 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-sm cursor-pointer whitespace-nowrap"
            title="Lock Health Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('lock_now', lang)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
