import { 
  HealthTask, 
  FoodLogItem, 
  HealthReminder, 
  UserHealthProfile, 
  BiometricSecurityConfig, 
  CloudSyncInfo,
  Language 
} from '../types/health';

const STORAGE_KEYS = {
  TASKS: 'arogya_health_tasks_v2',
  FOOD_LOGS: 'arogya_food_logs_v2',
  REMINDERS: 'arogya_reminders_v2',
  PROFILE: 'arogya_user_profile_v2',
  SECURITY: 'arogya_security_config_v2',
  SYNC_INFO: 'arogya_sync_info_v2',
  LANG: 'arogya_language_pref_v2',
  WATER_LOGS: 'arogya_water_logs_v2',
};

// Default initial tasks
export const DEFAULT_TASKS: HealthTask[] = [
  {
    id: 'task_water',
    title: 'Drink 8 Glasses of Pure Water',
    titleSi: 'පිරිසිදු ජලය වීදුරු 8ක් පානය කිරීම',
    category: 'hydration',
    timeOfDay: 'anytime',
    targetCount: 8,
    currentCount: 5,
    unit: 'Glasses',
    unitSi: 'වීදුරු',
    streak: 6,
    completedDates: {},
    reminderTime: '09:00',
    notes: 'Hydrate every 2 hours to maintain electrolyte and kidney health',
  },
  {
    id: 'task_morning_walk',
    title: '30-Minute Brisk Walk or Yoga',
    titleSi: 'විනාඩි 30ක ක්‍රියාශීලී ඇවිදීම හෝ යෝගා',
    category: 'exercise',
    timeOfDay: 'morning',
    targetCount: 30,
    unit: 'Mins',
    unitSi: 'විනාඩි',
    streak: 4,
    completedDates: {},
    reminderTime: '06:30',
  },
  {
    id: 'task_meds',
    title: 'Daily Multivitamin & Prescribed Meds',
    titleSi: 'දෛනික විටමින් හෝ නියමිත ඖෂධ ලබාගැනීම',
    category: 'medication',
    timeOfDay: 'morning',
    targetCount: 1,
    unit: 'Dose',
    unitSi: 'මාත්‍රාව',
    streak: 12,
    completedDates: {},
    reminderTime: '08:30',
    notes: 'Take with food and a full glass of water',
  },
  {
    id: 'task_mindfulness',
    title: '10 Mins Mindful Breathing & Meditation',
    titleSi: 'විනාඩි 10ක සන්සුන් භාවනාව / මනස එකඟ කරගැනීම',
    category: 'mindfulness',
    timeOfDay: 'evening',
    targetCount: 10,
    unit: 'Mins',
    unitSi: 'විනාඩි',
    streak: 3,
    completedDates: {},
    reminderTime: '19:00',
  },
  {
    id: 'task_sleep',
    title: '7.5 Hours Restful Night Sleep',
    titleSi: 'පැය 7.5 ක සුවදායක රාත්‍රී නින්ද',
    category: 'sleep',
    timeOfDay: 'night',
    targetCount: 8,
    unit: 'Hours',
    unitSi: 'පැය',
    streak: 5,
    completedDates: {},
    reminderTime: '22:30',
  }
];

// Default reminders
export const DEFAULT_REMINDERS: HealthReminder[] = [
  {
    id: 'rem_1',
    title: 'Morning Medication & Vitamins',
    titleSi: 'උදෑසන ඖෂධ සහ විටමින් ලබාගැනීම',
    type: 'medication',
    time: '08:30',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: 'rem_2',
    title: 'Hydration Break (Glass 3)',
    titleSi: 'වතුර වීදුරුවක් පානය කරන්න',
    type: 'water',
    time: '11:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: 'rem_3',
    title: 'Balanced Lunch Time',
    titleSi: 'දිවා ආහාරය ලබාගැනීමේ වේලාව',
    type: 'meal',
    time: '13:00',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: 'rem_4',
    title: 'Evening Physical Movement / Walk',
    titleSi: 'සවස ව්‍යායාම හෝ ඇවිදීම',
    type: 'workout',
    time: '17:30',
    days: [1, 2, 3, 4, 5],
    enabled: true,
  },
  {
    id: 'rem_5',
    title: 'Wind-down for Quality Sleep',
    titleSi: 'නින්ද සඳහා සූදානම් වීම සහ දුරකථනය පසෙක තැබීම',
    type: 'sleep',
    time: '22:15',
    days: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  }
];

// Default user profile
export const DEFAULT_PROFILE: UserHealthProfile = {
  name: 'Gayan Aroshana',
  age: 28,
  gender: 'male',
  heightCm: 174,
  weightKg: 72,
  targetWeightKg: 68,
  activityLevel: 'moderate',
  healthGoal: 'balanced_health',
  waterTargetMl: 2500,
  sleepTargetHours: 8,
  dailyCalorieBudget: 2150,
  targetProteinG: 110,
  targetCarbsG: 240,
  targetFatG: 55,
  targetFiberG: 32,
};

// Default security configuration
export const DEFAULT_SECURITY: BiometricSecurityConfig = {
  isEnabled: false,
  isBiometricAvailable: true,
  hasEnrolledBiometrics: false,
  hasPinFallback: true,
  pinHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Default PIN "1234" fallback
  autoLockMinutes: 5,
  requireOnAppOpen: false,
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class HealthStorage {
  // Task storage
  getTasks(): HealthTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        // Seed with sample completion in past days for instant rich charts
        const today = getTodayKey();
        const d1 = getDateOffsetKey(1);
        const d2 = getDateOffsetKey(2);
        const d3 = getDateOffsetKey(3);
        const d4 = getDateOffsetKey(4);
        const d5 = getDateOffsetKey(5);
        const d6 = getDateOffsetKey(6);

        const seeded = DEFAULT_TASKS.map((t, idx) => ({
          ...t,
          completedDates: {
            [d6]: true,
            [d5]: idx % 2 === 0,
            [d4]: true,
            [d3]: true,
            [d2]: idx < 3,
            [d1]: true,
            [today]: idx < 2,
          }
        }));
        this.saveTasks(seeded);
        return seeded;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_TASKS;
    }
  }

  saveTasks(tasks: HealthTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      this.incrementPendingSync();
    } catch (e) {
      console.warn('Storage save tasks failed', e);
    }
  }

  // Food Logs
  getFoodLogs(): FoodLogItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
      if (!data) {
        // Seed initial history
        const today = getTodayKey();
        const yesterday = getDateOffsetKey(1);
        const initialFoods: FoodLogItem[] = [
          {
            id: 'fl_1',
            date: yesterday,
            mealType: 'breakfast',
            foodName: 'Kurakkan Roti with Dhal Curry',
            foodNameSi: 'කුරක්කන් රොටී සහ පරිප්පු හොද්ද',
            portionSize: '1 roti (75g) + 1 ladle dhal',
            calories: 250,
            proteinG: 9.7,
            carbsG: 40.0,
            fatG: 5.7,
            fiberG: 8.5,
            timestamp: '08:15',
          },
          {
            id: 'fl_2',
            date: yesterday,
            mealType: 'lunch',
            foodName: 'Red Raw Rice, Steamed Fish & Gotukola Sambol',
            foodNameSi: 'රතු කැකුළු බත්, තැම්බූ මාළු සහ ගොටුකොළ සම්බෝල',
            portionSize: '1 cup rice (150g), fish (120g), sambol (50g)',
            calories: 365,
            proteinG: 32.7,
            carbsG: 37.5,
            fatG: 8.2,
            fiberG: 4.9,
            timestamp: '13:10',
          },
          {
            id: 'fl_3',
            date: yesterday,
            mealType: 'dinner',
            foodName: 'Steamed Green Beans with Grilled Chicken',
            foodNameSi: 'තැම්බූ බෝංචි සහ ග්‍රිල් කළ කුකුළු මස්',
            portionSize: '1 bowl beans, 130g chicken breast',
            calories: 209,
            proteinG: 33.4,
            carbsG: 8.0,
            fatG: 4.4,
            fiberG: 3.5,
            timestamp: '19:40',
          },
          {
            id: 'fl_4',
            date: today,
            mealType: 'breakfast',
            foodName: 'Warm Rolled Oats with Chia & Banana Slices',
            foodNameSi: 'චියා සහ කෙසෙල් සහිත ඕට්ස් කැඳ',
            portionSize: '1 bowl (200g)',
            calories: 210,
            proteinG: 7.0,
            carbsG: 31.5,
            fatG: 6.0,
            fiberG: 8.0,
            timestamp: '08:30',
          },
          {
            id: 'fl_5',
            date: today,
            mealType: 'lunch',
            foodName: 'Red Raw Rice with Dhal & Gotukola Sambol',
            foodNameSi: 'රතු කැකුළු බත්, පරිප්පු සහ ගොටුකොළ සම්බෝලය',
            portionSize: '1 cup rice, 1 ladle dhal, 4 tbsp sambol',
            calories: 320,
            proteinG: 11.2,
            carbsG: 51.5,
            fatG: 7.2,
            fiberG: 8.9,
            timestamp: '13:00',
          }
        ];
        this.saveFoodLogs(initialFoods);
        return initialFoods;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  saveFoodLogs(logs: FoodLogItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(logs));
      this.incrementPendingSync();
    } catch (e) {
      console.warn('Storage save food logs failed', e);
    }
  }

  // Reminders
  getReminders(): HealthReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!data) {
        this.saveReminders(DEFAULT_REMINDERS);
        return DEFAULT_REMINDERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_REMINDERS;
    }
  }

  saveReminders(reminders: HealthReminder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
      this.incrementPendingSync();
    } catch (e) {
      console.warn('Storage save reminders failed', e);
    }
  }

  // Profile
  getProfile(): UserHealthProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  saveProfile(profile: UserHealthProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      this.incrementPendingSync();
    } catch (e) {
      console.warn('Storage save profile failed', e);
    }
  }

  // Security config
  getSecurity(): BiometricSecurityConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SECURITY);
      if (!data) {
        this.saveSecurity(DEFAULT_SECURITY);
        return DEFAULT_SECURITY;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SECURITY;
    }
  }

  saveSecurity(config: BiometricSecurityConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(config));
    } catch (e) {
      console.warn('Storage save security failed', e);
    }
  }

  // Language
  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANG);
      if (lang === 'si' || lang === 'en') return lang;
      return 'si'; // Default to Sinhala as requested by user prompt
    } catch {
      return 'si';
    }
  }

  saveLanguage(lang: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch (e) {
      console.warn('Save lang failed', e);
    }
  }

  // Sync info
  getSyncInfo(): CloudSyncInfo {
    try {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_INFO);
      if (!data) {
        const initial: CloudSyncInfo = {
          status: isOnline ? 'synced' : 'offline',
          lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pendingChangesCount: 0,
          cloudBackupId: 'cloud_usr_8f1ab0',
        };
        this.saveSyncInfo(initial);
        return initial;
      }
      const parsed = JSON.parse(data);
      if (!isOnline) {
        parsed.status = 'offline';
      }
      return parsed;
    } catch {
      return {
        status: 'synced',
        lastSyncedAt: 'Just now',
        pendingChangesCount: 0,
        cloudBackupId: 'cloud_usr_8f1ab0',
      };
    }
  }

  saveSyncInfo(info: CloudSyncInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_INFO, JSON.stringify(info));
    } catch (e) {
      console.warn('Save sync info failed', e);
    }
  }

  incrementPendingSync(): void {
    try {
      const info = this.getSyncInfo();
      info.pendingChangesCount += 1;
      info.status = (typeof navigator !== 'undefined' && !navigator.onLine) ? 'offline' : 'pending';
      this.saveSyncInfo(info);
    } catch {}
  }

  // Export full JSON database backup
  exportDatabaseBackup(): string {
    const backup = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      tasks: this.getTasks(),
      foodLogs: this.getFoodLogs(),
      reminders: this.getReminders(),
      profile: this.getProfile(),
      language: this.getLanguage(),
    };
    return JSON.stringify(backup, null, 2);
  }

  // Import full JSON database backup
  importDatabaseBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.foodLogs) this.saveFoodLogs(parsed.foodLogs);
      if (parsed.reminders) this.saveReminders(parsed.reminders);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.language) this.saveLanguage(parsed.language);
      
      const sync = this.getSyncInfo();
      sync.status = 'synced';
      sync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sync.pendingChangesCount = 0;
      this.saveSyncInfo(sync);
      return true;
    } catch {
      return false;
    }
  }

  // Clear / Reset All
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.FOOD_LOGS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SECURITY);
    localStorage.removeItem(STORAGE_KEYS.SYNC_INFO);
  }
}

export const healthStorage = new HealthStorage();
