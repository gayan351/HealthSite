import { Language } from '../types/health';

export const t = (key: string, lang: Language): string => {
  const dictionary: Record<string, { en: string; si: string }> = {
    // Header & Brand
    app_name: { en: 'ArogyaSync', si: 'ආරෝග්‍යාසින්ක්' },
    app_subtitle: { en: 'Health & Nutrition Hub', si: 'සුව සම්පත සහ පෝෂණ මධ්‍යස්ථානය' },
    locked: { en: 'Locked', si: 'අගුළුලා ඇත' },
    unlock_app: { en: 'Unlock App', si: 'අගුල හරින්න' },
    lock_now: { en: 'Lock', si: 'අගුළුලන්න' },
    synced: { en: 'Synced', si: 'සමමුහුර්තයි' },
    offline: { en: 'Offline Mode', si: 'නොබැඳි මාදිලිය' },
    syncing: { en: 'Syncing...', si: 'සමමුහුර්ත වෙමින්...' },
    pending_sync: { en: 'Pending Sync', si: 'යාවත්කාලීන වීමට ඇත' },

    // Tabs
    tab_dashboard: { en: 'Dashboard', si: 'මුල් පිටුව' },
    tab_tasks: { en: 'Daily Tasks', si: 'දෛනික කාර්යයන්' },
    tab_nutrition: { en: 'Nutrition & Diet', si: 'පෝෂණය හා කෑම' },
    tab_statistics: { en: 'Progress Charts', si: 'ප්‍රගති ප්‍රස්ථාර' },
    tab_reminders: { en: 'Reminders', si: 'සිහිකැඳවීම්' },
    tab_settings: { en: 'Settings & Security', si: 'ආරක්ෂාව සහ සැකසුම්' },

    // Dashboard metrics
    health_score: { en: 'Overall Health Score', si: 'සමස්ත සෞඛ්‍ය ලකුණු' },
    daily_completion: { en: 'Tasks Completed', si: 'සම්පූර්ණ කළ කාර්යයන්' },
    water_intake: { en: 'Hydration Target', si: 'ජල ප්‍රමාණය' },
    calories_consumed: { en: 'Calories Today', si: 'අද දින කැලරි' },
    sleep_tracked: { en: 'Sleep Duration', si: 'නින්ද ලැබූ කාලය' },
    streak_count: { en: 'Day Streak', si: 'දින දාමය' },
    quick_log_water: { en: 'Quick Add Water (+250ml)', si: 'වතුර එකතු කරන්න (+250ml)' },
    todays_reminders: { en: "Today's Active Reminders", si: 'අද දින ක්‍රියාකාරී සිහිකැඳවීම්' },
    no_reminders: { en: 'No pending reminders for today.', si: 'අද දිනට ඉතිරි වූ සිහිකැඳවීම් නැත.' },
    test_chime: { en: 'Test Sound', si: 'හඬ පරීක්ෂාව' },
    done: { en: 'Done', si: 'සම්පූර්ණයි' },

    // Tasks & Monitoring
    tasks_title: { en: 'Daily Health & Habit Tracker', si: 'දෛනික සෞඛ්‍ය පුරුදු සහ කාර්යයන්' },
    tasks_desc: { en: 'Monitor your critical wellness routines, hydration, medication, and movement.', si: 'ඔබගේ බෙහෙත්, ජලය පානය, ව්‍යායාම සහ සෞඛ්‍ය පුරුදු නිරීක්ෂණය කරන්න.' },
    add_new_task: { en: 'Add Health Task', si: 'නව කාර්යයක් එකතු කරන්න' },
    category_all: { en: 'All Tasks', si: 'සියල්ල' },
    category_hydration: { en: 'Hydration', si: 'ජලය පානය' },
    category_medication: { en: 'Medication', si: 'ඖෂධ/විටමින්' },
    category_exercise: { en: 'Exercise', si: 'ව්‍යායාම' },
    category_nutrition: { en: 'Nutrition', si: 'පෝෂණය' },
    category_mindfulness: { en: 'Mindfulness', si: 'භාවනා/මනස' },
    category_sleep: { en: 'Sleep', si: 'නින්ද' },
    category_custom: { en: 'Custom', si: 'වෙනත්' },
    target: { en: 'Target', si: 'ඉලක්කය' },
    streak: { en: 'streak', si: 'දින දාමය' },
    completed_today: { en: 'Completed today', si: 'අද දින අවසන් කළා' },
    tap_to_complete: { en: 'Tap to complete', si: 'සම්පූර්ණ කිරීමට ඔබන්න' },

    // Nutrition & Food Plan
    nutrition_title: { en: 'Personalized Nutrition & Diet Planner', si: 'පුද්ගලික පෝෂණ සැලැස්ම සහ ආහාර මාර්ගෝපදේශය' },
    nutrition_desc: { en: 'Calculates recommended daily calories and portion sizes for balanced, healthy living.', si: 'ඔබේ ශරීරයට අවශ්‍ය දෛනික කැලරි සහ පෝෂ්‍ය පදාර්ථ නිවැරදි ප්‍රමාණයෙන් ලබාගන්න.' },
    daily_budget: { en: 'Daily Calorie Budget', si: 'දෛනික කැලරි අවශ්‍යතාවය' },
    target_protein: { en: 'Protein Target', si: 'ප්‍රෝටීන ඉලක්කය' },
    target_carbs: { en: 'Carbs Target', si: 'කාබෝහයිඩ්‍රේට' },
    target_fat: { en: 'Healthy Fats', si: 'හිතකර මේදය' },
    target_fiber: { en: 'Fiber Target', si: 'තන්තු (ෆයිබර්)' },
    recommended_meals: { en: 'Healthy Food Guide & Portion Sizes', si: 'ගුණදායී ආහාර සහ නිවැරදි ප්‍රමාණයන්' },
    add_to_diary: { en: 'Add to Today', si: 'අද දින පොතට එක් කරන්න' },
    log_custom_meal: { en: 'Log What You Ate', si: 'අනුභව කළ කෑම සටහන් කරන්න' },
    meal_history: { en: 'Previous Food Intake & History', si: 'කලින් ආහාර ලබාගත් ඉතිහාසය සහ සංඛ්‍යාලේඛන' },
    no_food_logged: { en: 'No food items logged for this date yet.', si: 'මෙම දිනය සඳහා තවම ආහාර සටහන් කර නැත.' },
    food_name: { en: 'Food / Meal Name', si: 'ආහාරයේ නම' },
    portion: { en: 'Portion Size', si: 'ප්‍රමාණය' },
    calories: { en: 'Calories (kcal)', si: 'කැලරි (kcal)' },
    macro_breakdown: { en: 'Macro Ratio', si: 'පෝෂක සංයුතිය' },
    breakfast: { en: 'Breakfast', si: 'උදෑසන ආහාරය' },
    lunch: { en: 'Lunch', si: 'දවල් ආහාරය' },
    dinner: { en: 'Dinner', si: 'රාත්‍රී ආහාරය' },
    snack: { en: 'Snacks / Water', si: 'අමතර කෙටි කෑම' },

    // Statistics & Charts
    charts_title: { en: 'Daily Health Analytics & Progress', si: 'දෛනික ප්‍රගති ප්‍රස්ථාර සහ විශ්ලේෂණය' },
    charts_desc: { en: 'Visualize your daily habit consistency, calorie balance, and hydration history over time.', si: 'ඔබේ දෛනික පුරුදු, කැලරි සහ ජල පරිභෝජන ප්‍රගතිය ප්‍රස්ථාර මඟින් නරඹන්න.' },
    completion_rate_trend: { en: 'Task Completion Trend (Past 7 Days)', si: 'කාර්යයන් සාර්ථකව නිමකිරීමේ ප්‍රවණතාවය' },
    calorie_adherence_trend: { en: 'Calorie Intake vs Daily Target', si: 'කැලරි පරිභෝජනය සහ ඉලක්කය' },
    hydration_trend: { en: 'Hydration Tracking (ml)', si: 'දෛනික ජල ප්‍රමාණය (ml)' },

    // Biometric Security & Lock
    security_title: { en: 'Biometric Access & Health Data Privacy', si: 'බයෝමෙට්‍රික් ආරක්ෂාව සහ පෞද්ගලිකත්වය' },
    biometric_sensor: { en: 'Touch ID / Face ID / Fingerprint', si: 'ඇඟිලි සලකුණ හෝ මුහුණ හඳුනාගැනීම' },
    unlock_with_biometrics: { en: 'Unlock with Biometrics', si: 'ඇඟිලි සලකුණෙන් අගුල හරින්න' },
    enter_pin: { en: 'Enter 4-Digit Security PIN', si: 'අංක 4 රහස් අංකය (PIN) ඇතුළත් කරන්න' },
    pin_placeholder: { en: 'Enter PIN', si: 'PIN ඇතුළත් කරන්න' },
    unlock: { en: 'Unlock', si: 'අගුල හරින්න' },
    biometric_active: { en: 'Biometric Lock Active', si: 'බයෝමෙට්‍රික් අගුල සක්‍රීයයි' },
    biometric_disabled: { en: 'Biometric Lock Off', si: 'බයෝමෙට්‍රික් අගුල අක්‍රීයයි' },
    enable_biometrics: { en: 'Enable Biometric Lock', si: 'බයෝමෙට්‍රික් අගුල සක්‍රීය කරන්න' },
    data_protected: { en: 'Your medical habits, diet logs, and wellness data are securely encrypted locally.', si: 'ඔබගේ සෞඛ්‍ය දත්ත සහ ආහාර සටහන් ආරක්ෂිතව තබා ඇත.' },

    // Cloud Sync & Offline
    sync_settings: { en: 'Cloud Sync & Data Backup', si: 'ක්ලවුඩ් සමමුහුර්තකරණය සහ දත්ත පිටපත' },
    force_sync: { en: 'Sync with Cloud Now', si: 'දැන්ම සමමුහුර්ත කරන්න' },
    export_data: { en: 'Export Health Backup (JSON)', si: 'දත්ත ගොනුව බාගත කරන්න (Backup)' },
    import_data: { en: 'Restore / Import Backup', si: 'දත්ත නැවත ඇතුළත් කරන්න (Restore)' },
    clear_data: { en: 'Reset All Data', si: 'සියලු දත්ත මකන්න' },
  };

  const item = dictionary[key];
  if (!item) return key;
  return item[lang] || item.en;
};
