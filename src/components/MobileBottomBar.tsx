import React from 'react';
import { LayoutDashboard, CheckSquare, UtensilsCrossed, LineChart, BellRing } from 'lucide-react';
import { Language } from '../types/health';
import { t } from '../utils/translations';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
}

export const MobileBottomBar: React.FC<Props> = ({ currentTab, onSelectTab, lang }) => {
  const tabs = [
    { id: 'dashboard', labelKey: 'tab_dashboard', icon: LayoutDashboard },
    { id: 'tasks', labelKey: 'tab_tasks', icon: CheckSquare },
    { id: 'nutrition', labelKey: 'tab_nutrition', icon: UtensilsCrossed },
    { id: 'statistics', labelKey: 'tab_statistics', icon: LineChart },
    { id: 'reminders', labelKey: 'tab_reminders', icon: BellRing },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="min-h-[48px] flex flex-col items-center justify-center py-1 transition-colors cursor-pointer group"
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[64px] ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t(tab.labelKey, lang)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
