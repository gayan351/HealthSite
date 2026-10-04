/**
 * ArogyaSync - Health & Nutrition Hub
 * Comprehensive health management web application with daily task monitoring,
 * interactive progress charts, unified dashboard with statistics & reminders,
 * mobile-friendly touch interface, offline-first cloud sync, biometric authentication,
 * and personalized healthy nutrition planner with portion guidance and historical statistics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  HealthTask, 
  FoodLogItem, 
  HealthReminder, 
  UserHealthProfile, 
  BiometricSecurityConfig, 
  CloudSyncInfo, 
  Language 
} from './types/health';
import { healthStorage, getTodayKey } from './utils/storage';
import { TopNav } from './components/TopNav';
import { MobileBottomBar } from './components/MobileBottomBar';
import { DashboardView } from './components/DashboardView';
import { DailyTasksView } from './components/DailyTasksView';
import { NutritionPlannerView } from './components/NutritionPlannerView';
import { ProgressChartsView } from './components/ProgressChartsView';
import { RemindersManager } from './components/RemindersManager';
import { SettingsSyncModal } from './components/SettingsSyncModal';
import { BiometricLockModal } from './components/BiometricLockModal';
import { OfflineAndInstallBanner } from './components/OfflineAndInstallBanner';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<Language>(() => healthStorage.getLanguage());

  // Core App State
  const [tasks, setTasks] = useState<HealthTask[]>(() => healthStorage.getTasks());
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>(() => healthStorage.getFoodLogs());
  const [reminders, setReminders] = useState<HealthReminder[]>(() => healthStorage.getReminders());
  const [profile, setProfile] = useState<UserHealthProfile>(() => healthStorage.getProfile());
  const [securityConfig, setSecurityConfig] = useState<BiometricSecurityConfig>(() => healthStorage.getSecurity());
  const [syncInfo, setSyncInfo] = useState<CloudSyncInfo>(() => healthStorage.getSyncInfo());

  // Security Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const sec = healthStorage.getSecurity();
    return sec.isEnabled && sec.requireOnAppOpen;
  });

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize language change
  const handleToggleLang = () => {
    const nextLang: Language = lang === 'si' ? 'en' : 'si';
    setLang(nextLang);
    healthStorage.saveLanguage(nextLang);
  };

  // Task Handlers
  const handleToggleTask = useCallback((taskId: string) => {
    const today = getTodayKey();
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const wasCompleted = Boolean(t.completedDates && t.completedDates[today]);
          const newDates = { ...t.completedDates, [today]: !wasCompleted };
          const newStreak = !wasCompleted ? t.streak + 1 : Math.max(0, t.streak - 1);
          
          let currentCount = t.currentCount;
          if (t.category === 'hydration') {
            currentCount = !wasCompleted ? t.targetCount : 0;
          }
          return {
            ...t,
            completedDates: newDates,
            streak: newStreak,
            currentCount,
          };
        }
        return t;
      });
      healthStorage.saveTasks(updated);
      return updated;
    });
  }, []);

  const handleUpdateTaskCount = useCallback((taskId: string, count: number) => {
    const today = getTodayKey();
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const isDone = count >= t.targetCount;
          return {
            ...t,
            currentCount: count,
            completedDates: {
              ...t.completedDates,
              [today]: isDone,
            },
          };
        }
        return t;
      });
      healthStorage.saveTasks(updated);
      return updated;
    });
  }, []);

  const handleAddTask = (newTaskData: Omit<HealthTask, 'id' | 'completedDates' | 'streak'>) => {
    const newTask: HealthTask = {
      ...newTaskData,
      id: `task_${Date.now()}`,
      completedDates: {},
      streak: 0,
    };
    setTasks(prev => {
      const updated = [newTask, ...prev];
      healthStorage.saveTasks(updated);
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      healthStorage.saveTasks(updated);
      return updated;
    });
  };

  // Quick Log Water (+250ml)
  const handleQuickLogWater = () => {
    const waterTask = tasks.find(t => t.category === 'hydration');
    if (waterTask) {
      const current = (waterTask.currentCount || 0) + 1;
      handleUpdateTaskCount(waterTask.id, current);
      soundEffects.playSuccessChime();
    }
  };

  // Food Log Handlers
  const handleAddFoodLog = (item: Omit<FoodLogItem, 'id' | 'timestamp'>) => {
    const newLog: FoodLogItem = {
      ...item,
      id: `fl_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setFoodLogs(prev => {
      const updated = [newLog, ...prev];
      healthStorage.saveFoodLogs(updated);
      return updated;
    });
  };

  const handleDeleteFoodLog = (logId: string) => {
    setFoodLogs(prev => {
      const updated = prev.filter(f => f.id !== logId);
      healthStorage.saveFoodLogs(updated);
      return updated;
    });
  };

  // Reminders Handlers
  const handleToggleReminder = (reminderId: string) => {
    setReminders(prev => {
      const updated = prev.map(r => r.id === reminderId ? { ...r, enabled: !r.enabled } : r);
      healthStorage.saveReminders(updated);
      return updated;
    });
  };

  const handleAddReminder = (newRemData: Omit<HealthReminder, 'id'>) => {
    const newReminder: HealthReminder = {
      ...newRemData,
      id: `rem_${Date.now()}`,
    };
    setReminders(prev => {
      const updated = [...prev, newReminder];
      healthStorage.saveReminders(updated);
      return updated;
    });
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => {
      const updated = prev.filter(r => r.id !== reminderId);
      healthStorage.saveReminders(updated);
      return updated;
    });
  };

  // Profile Update
  const handleUpdateProfile = (updatedProfile: Partial<UserHealthProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updatedProfile };
      healthStorage.saveProfile(next);
      return next;
    });
  };

  // Security Update
  const handleUpdateSecurity = (updatedSecurity: Partial<BiometricSecurityConfig>) => {
    setSecurityConfig(prev => {
      const next = { ...prev, ...updatedSecurity };
      healthStorage.saveSecurity(next);
      return next;
    });
  };

  // Cloud Sync Handler
  const handleTriggerSync = () => {
    setSyncInfo(prev => ({ ...prev, status: 'syncing' }));

    setTimeout(() => {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const updated: CloudSyncInfo = {
        status: isOnline ? 'synced' : 'offline',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pendingChangesCount: 0,
        cloudBackupId: syncInfo.cloudBackupId,
      };
      setSyncInfo(updated);
      healthStorage.saveSyncInfo(updated);
      if (isOnline) {
        soundEffects.playSuccessChime();
      }
    }, 1200);
  };

  // Export / Import Handlers
  const handleExportBackup = () => {
    const jsonStr = healthStorage.exportDatabaseBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ArogyaSync_Health_Backup_${getTodayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    soundEffects.playSuccessChime();
  };

  const handleImportBackup = (jsonStr: string): boolean => {
    const success = healthStorage.importDatabaseBackup(jsonStr);
    if (success) {
      setTasks(healthStorage.getTasks());
      setFoodLogs(healthStorage.getFoodLogs());
      setReminders(healthStorage.getReminders());
      setProfile(healthStorage.getProfile());
      setSyncInfo(healthStorage.getSyncInfo());
      return true;
    }
    return false;
  };

  // Auto-Lock Inactivity Timer
  useEffect(() => {
    if (!securityConfig.isEnabled || securityConfig.autoLockMinutes <= 0) return;

    let timeoutId: number;
    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsLocked(true);
      }, securityConfig.autoLockMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [securityConfig.isEnabled, securityConfig.autoLockMinutes]);

  // Periodic Reminder Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const currentDay = now.getDay();

      const matched = reminders.find(
        r => r.enabled && r.time === currentTimeStr && r.days.includes(currentDay)
      );

      if (matched && now.getSeconds() < 10) {
        soundEffects.playReminderChime();
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('ArogyaSync Reminder', {
              body: lang === 'si' ? matched.titleSi : matched.title,
              icon: '/favicon.ico',
            });
          } catch {}
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [reminders, lang]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Biometric Security Lock Screen Overlay */}
      <BiometricLockModal
        isOpen={isLocked}
        securityConfig={securityConfig}
        lang={lang}
        onUnlockSuccess={() => setIsLocked(false)}
      />

      {/* Top 3-Zone Navigation Header */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        syncInfo={syncInfo}
        onLockApp={() => setIsLocked(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area (Max width 1200px baseline compliant with design rules) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            foodLogs={foodLogs}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            profile={profile}
            lang={lang}
            onNavigateTab={setCurrentTab}
            onQuickLogWater={handleQuickLogWater}
          />
        )}

        {currentTab === 'tasks' && (
          <DailyTasksView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onUpdateTaskCount={handleUpdateTaskCount}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            lang={lang}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionPlannerView
            foodLogs={foodLogs}
            onAddFoodLog={handleAddFoodLog}
            onDeleteFoodLog={handleDeleteFoodLog}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            lang={lang}
          />
        )}

        {currentTab === 'statistics' && (
          <ProgressChartsView
            tasks={tasks}
            foodLogs={foodLogs}
            profile={profile}
            lang={lang}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersManager
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
            lang={lang}
          />
        )}
      </main>

      {/* Mobile Bottom Thumb Tab Bar */}
      <MobileBottomBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
      />

      {/* Settings, Cloud Sync, & Biometrics Management Modal */}
      <SettingsSyncModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        securityConfig={securityConfig}
        onUpdateSecurity={handleUpdateSecurity}
        syncInfo={syncInfo}
        onTriggerSync={handleTriggerSync}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        lang={lang}
      />

      {/* Offline Connectivity & PWA Install Alerts */}
      <OfflineAndInstallBanner lang={lang} />
    </div>
  );
}
