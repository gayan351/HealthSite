export type Language = 'en' | 'si';

export type TaskCategory = 'hydration' | 'medication' | 'exercise' | 'nutrition' | 'mindfulness' | 'sleep' | 'custom';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';

export interface HealthTask {
  id: string;
  title: string;
  titleSi: string;
  category: TaskCategory;
  timeOfDay: TimeOfDay;
  targetCount: number; // e.g. 1 (pill), 8 (glasses), 30 (mins)
  currentCount?: number;
  unit: string;
  unitSi: string;
  iconName?: string;
  streak: number;
  completedDates: Record<string, boolean>; // 'YYYY-MM-DD' -> true
  reminderTime?: string; // '08:30'
  notes?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodLogItem {
  id: string;
  date: string; // 'YYYY-MM-DD'
  mealType: MealType;
  foodName: string;
  foodNameSi: string;
  portionSize: string; // e.g., '1 cup (150g)', '2 slices'
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  timestamp: string;
}

export interface HealthyFoodSuggestion {
  id: string;
  name: string;
  nameSi: string;
  category: 'grain' | 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'healthy_fat';
  mealTypes: MealType[];
  portionDescription: string;
  portionDescriptionSi: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  healthBenefits: string;
  healthBenefitsSi: string;
  isSriLankanStaple?: boolean;
}

export interface HealthReminder {
  id: string;
  title: string;
  titleSi: string;
  type: 'medication' | 'water' | 'meal' | 'workout' | 'sleep';
  time: string; // '08:00'
  days: number[]; // 0 (Sun) to 6 (Sat)
  enabled: boolean;
  notes?: string;
}

export type HealthGoal = 
  | 'weight_loss' 
  | 'muscle_gain' 
  | 'balanced_health' 
  | 'blood_sugar_control' 
  | 'heart_wellness'
  | 'stress_reduction';

export interface UserHealthProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  healthGoal: HealthGoal;
  waterTargetMl: number; // e.g. 2500
  sleepTargetHours: number; // e.g. 8
  dailyCalorieBudget: number; // Calculated or custom
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetFiberG: number;
}

export interface BiometricSecurityConfig {
  isEnabled: boolean;
  isBiometricAvailable: boolean;
  hasEnrolledBiometrics: boolean;
  hasPinFallback: boolean;
  pinHash?: string; // 4-digit PIN hash
  credentialId?: string;
  autoLockMinutes: number; // 0 for off, or 2, 5, 15
  requireOnAppOpen: boolean;
}

export type SyncState = 'synced' | 'syncing' | 'offline' | 'pending' | 'error';

export interface CloudSyncInfo {
  status: SyncState;
  lastSyncedAt: string | null;
  pendingChangesCount: number;
  cloudBackupId: string;
}
