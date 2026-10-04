import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame, 
  PieChart, 
  ChevronRight, 
  Info,
  Calendar,
  Check
} from 'lucide-react';
import { 
  FoodLogItem, 
  MealType, 
  UserHealthProfile, 
  Language, 
  HealthyFoodSuggestion 
} from '../types/health';
import { HEALTHY_FOODS_DATABASE } from '../data/healthyFoodDatabase';
import { t } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface Props {
  foodLogs: FoodLogItem[];
  onAddFoodLog: (item: Omit<FoodLogItem, 'id' | 'timestamp'>) => void;
  onDeleteFoodLog: (logId: string) => void;
  profile: UserHealthProfile;
  onUpdateProfile: (updated: Partial<UserHealthProfile>) => void;
  lang: Language;
}

export const NutritionPlannerView: React.FC<Props> = ({
  foodLogs,
  onAddFoodLog,
  onDeleteFoodLog,
  profile,
  onUpdateProfile,
  lang,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [filterMealType, setFilterMealType] = useState<string>('all');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Custom meal log form
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [portionSize, setPortionSize] = useState('1 serving (150g)');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState<number>(350);
  const [proteinG, setProteinG] = useState<number>(18);
  const [carbsG, setCarbsG] = useState<number>(45);
  const [fatG, setFatG] = useState<number>(8);
  const [fiberG, setFiberG] = useState<number>(4);

  // Foods logged for selected date
  const dateLogs = foodLogs.filter(f => f.date === selectedDate);
  const totalCaloriesDate = dateLogs.reduce((sum, f) => sum + f.calories, 0);
  const totalProteinDate = dateLogs.reduce((sum, f) => sum + f.proteinG, 0);
  const totalCarbsDate = dateLogs.reduce((sum, f) => sum + f.carbsG, 0);
  const totalFatDate = dateLogs.reduce((sum, f) => sum + f.fatG, 0);

  // Healthy food database filtering
  const filteredSuggestions = filterMealType === 'all'
    ? HEALTHY_FOODS_DATABASE
    : HEALTHY_FOODS_DATABASE.filter(f => f.mealTypes.includes(filterMealType as MealType));

  const handleAddSuggestionToLog = (suggestion: HealthyFoodSuggestion) => {
    onAddFoodLog({
      date: selectedDate,
      mealType: suggestion.mealTypes[0] || 'lunch',
      foodName: suggestion.name,
      foodNameSi: suggestion.nameSi,
      portionSize: suggestion.portionDescription,
      calories: suggestion.calories,
      proteinG: suggestion.proteinG,
      carbsG: suggestion.carbsG,
      fatG: suggestion.fatG,
      fiberG: suggestion.fiberG,
    });

    soundEffects.playSuccessChime();
    setAddedNotice(lang === 'si' ? `"${suggestion.nameSi}" ආහාර සටහනට එක් කළා!` : `Added "${suggestion.name}" to today's log!`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  const handleCustomLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    onAddFoodLog({
      date: selectedDate,
      mealType,
      foodName: foodName.trim(),
      foodNameSi: foodName.trim(),
      portionSize,
      calories: Number(calories) || 0,
      proteinG: Number(proteinG) || 0,
      carbsG: Number(carbsG) || 0,
      fatG: Number(fatG) || 0,
      fiberG: Number(fiberG) || 0,
    });

    soundEffects.playSuccessChime();
    setFoodName('');
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('nutrition_title', lang)}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t('nutrition_desc', lang)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogModalOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('log_custom_meal', lang)}</span>
        </button>
      </div>

      {addedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs transition-all">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Target Daily Requirements Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {lang === 'si' ? 'පුද්ගලීකරණය කළ පෝෂණ මාත්‍රාව' : 'Calculated Metabolic Needs'}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-display">
              {lang === 'si' ? 'දෛනික කැලරි සහ පෝෂණ ඉලක්කය' : 'Recommended Daily Calorie & Macronutrient Targets'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{profile.age} {lang === 'si' ? 'වයස' : 'yrs'}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.weightKg} kg</span>
              <span aria-hidden="true">·</span>
              <span>{profile.heightCm} cm</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{profile.activityLevel} activity</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {profile.dailyCalorieBudget}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-1">kcal / day</span>
          </div>
        </div>

        {/* Macro targets 4-grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">{t('target_protein', lang)}</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-display text-slate-900 dark:text-white tabular-nums">
                {profile.targetProteinG}g
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({Math.round((profile.targetProteinG * 4 / profile.dailyCalorieBudget) * 100)}%)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{lang === 'si' ? 'මාංශ පේශි වර්ධනයට' : 'Lean mass recovery'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">{t('target_carbs', lang)}</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-display text-slate-900 dark:text-white tabular-nums">
                {profile.targetCarbsG}g
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({Math.round((profile.targetCarbsG * 4 / profile.dailyCalorieBudget) * 100)}%)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{lang === 'si' ? 'දෛනික ශක්තියට' : 'Complex fuel'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">{t('target_fat', lang)}</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-display text-slate-900 dark:text-white tabular-nums">
                {profile.targetFatG}g
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({Math.round((profile.targetFatG * 9 / profile.dailyCalorieBudget) * 100)}%)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{lang === 'si' ? 'හෝමෝන සමතුලිතතාවට' : 'Hormonal support'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">{t('target_fiber', lang)}</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-display text-slate-900 dark:text-white tabular-nums">
                {profile.targetFiberG}g
              </span>
              <span className="text-[10px] text-slate-400 font-mono">min</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{lang === 'si' ? 'ආහාර ජීර්ණයට' : 'Gut microbiome'}</p>
          </div>
        </div>
      </div>

      {/* Date-Specific Food Intake History & Stats */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('meal_history', lang)}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{lang === 'si' ? 'දිනය තෝරන්න:' : 'Select Date:'}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Date Summary Metrics */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {lang === 'si' ? 'දිනයේ එකතුව:' : 'Day Total:'}
            </span>
            <span className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-300">
              {totalCaloriesDate} / {profile.dailyCalorieBudget} kcal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span>P: {Math.round(totalProteinDate)}g</span>
            <span aria-hidden="true">·</span>
            <span>C: {Math.round(totalCarbsDate)}g</span>
            <span aria-hidden="true">·</span>
            <span>F: {Math.round(totalFatDate)}g</span>
          </div>
        </div>

        {/* Logged Foods List for this Date */}
        {dateLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            {t('no_food_logged', lang)}
          </p>
        ) : (
          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            {dateLogs.map(item => (
              <div
                key={item.id}
                className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                      {item.mealType}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {lang === 'si' ? (item.foodNameSi || item.foodName) : item.foodName}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{item.portionSize}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{item.calories} kcal</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 font-mono">P: {item.proteinG}g · C: {item.carbsG}g · F: {item.fatG}g</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteFoodLog(item.id)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition cursor-pointer"
                  title="Delete log entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Curated Healthy Food Guide & Portion Sizes */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('recommended_meals', lang)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'si'
                ? 'ශ්‍රී ලාංකීය සහ ගෝලීය සෞඛ්‍ය සම්පන්න ආහාර, ඒවායේ නිවැරදි ප්‍රමාණයන් සහ ගුණාංග'
                : 'Accurately measured healthy foods with exact portion sizes and therapeutic health benefits'}
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar">
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMealType(m)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium capitalize transition cursor-pointer ${
                  filterMealType === m
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map(food => (
            <div
              key={food.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                    {food.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {food.calories} kcal
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {lang === 'si' ? food.nameSi : food.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>{lang === 'si' ? 'නියමිත ප්‍රමාණය:' : 'Portion:'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'si' ? food.portionDescriptionSi : food.portionDescription}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  {lang === 'si' ? food.healthBenefitsSi : food.healthBenefits}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  P: {food.proteinG}g · C: {food.carbsG}g · F: {food.fatG}g
                </span>

                <button
                  type="button"
                  onClick={() => handleAddSuggestionToLog(food)}
                  className="min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                  title="Add this meal to log"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('add_to_diary', lang)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Custom Food Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">
              {t('log_custom_meal', lang)}
            </h2>

            <form onSubmit={handleCustomLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('food_name', lang)}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Toast with Poached Egg"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වේලාව' : 'Meal Type'}
                  </label>
                  <select
                    value={mealType}
                    onChange={e => setMealType(e.target.value as MealType)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack / Refreshment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('portion', lang)}
                  </label>
                  <input
                    type="text"
                    value={portionSize}
                    onChange={e => setPortionSize(e.target.value)}
                    placeholder="e.g. 1 cup (150g)"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={e => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={proteinG}
                    onChange={e => setProteinG(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={carbsG}
                    onChange={e => setCarbsG(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fatG}
                    onChange={e => setFatG(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {lang === 'si' ? 'සුරකින්න' : 'Save Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
