import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Droplet, 
  Flame, 
  Moon, 
  Bell, 
  Volume2, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { HealthTask, FoodLogItem, HealthReminder, UserHealthProfile, Language } from '../types/health';
import { t } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface Props {
  tasks: HealthTask[];
  onToggleTask: (taskId: string) => void;
  foodLogs: FoodLogItem[];
  reminders: HealthReminder[];
  onToggleReminder: (reminderId: string) => void;
  profile: UserHealthProfile;
  lang: Language;
  onNavigateTab: (tab: string) => void;
  onQuickLogWater: () => void;
}

export const DashboardView: React.FC<Props> = ({
  tasks,
  onToggleTask,
  foodLogs,
  reminders,
  onToggleReminder,
  profile,
  lang,
  onNavigateTab,
  onQuickLogWater,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];

  // Calculate today's metrics
  const completedTasksToday = tasks.filter(t => t.completedDates && t.completedDates[todayKey]);
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksToday.length / tasks.length) * 100) : 0;

  const todayCalories = foodLogs
    .filter(f => f.date === todayKey)
    .reduce((sum, item) => sum + item.calories, 0);

  const caloriePercentage = Math.min(100, Math.round((todayCalories / profile.dailyCalorieBudget) * 100));

  // Water task
  const waterTask = tasks.find(t => t.category === 'hydration');
  const waterCurrent = waterTask?.currentCount || (waterTask?.completedDates[todayKey] ? 8 : 4);
  const waterTarget = waterTask?.targetCount || 8;
  const waterMl = waterCurrent * 250;
  const waterPercentage = Math.min(100, Math.round((waterMl / profile.waterTargetMl) * 100));

  // Dynamic Overall Health Score (0 - 100)
  const healthScore = Math.min(100, Math.round(
    (taskCompletionRate * 0.45) +
    (waterPercentage * 0.25) +
    (caloriePercentage > 0 && caloriePercentage <= 110 ? 25 : 10) +
    5 // Base vitality
  ));

  // Active reminders
  const activeReminders = reminders.filter(r => r.enabled);

  const handleTestChime = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playReminderChime();
  };

  return (
    <div className="space-y-6">
      {/* Editorial Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-2">
            <span>{new Date().toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.healthGoal.replace('_', ' ').toUpperCase()}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            {lang === 'si' ? 'සුවදායක දවසක් වේවා!' : 'Good day for holistic health'}
          </h1>
          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            {lang === 'si'
              ? 'ඔබගේ දෛනික සෞඛ්‍ය ඉලක්ක, නිවැරදි ආහාර ප්‍රමාණයන් සහ ඖෂධ කාලසටහන එකම තැනකින් කළමනාකරණය කරන්න.'
              : 'Keep track of daily habits, recommended nutrient portions, and health reminders in one unified hub.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onQuickLogWater}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-semibold text-xs flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition shadow-sm cursor-pointer"
            >
              <Droplet className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>{t('quick_log_water', lang)}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('tasks')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 border border-emerald-700/50 transition cursor-pointer"
            >
              <span>{t('tasks_title', lang)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient subtle background aesthetic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/arogya_wellness_hero_1791110216240.jpg"
            alt="Wellness"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Primary Vitals Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Health Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{t('health_score', lang)}</span>
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white tabular-nums">
              {healthScore}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {healthScore >= 75 ? (lang === 'si' ? 'විශිෂ්ටයි' : 'Optimal') : (lang === 'si' ? 'සාමාන්‍යයි' : 'On Track')}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Tasks Done */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{t('daily_completion', lang)}</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white tabular-nums">
              {completedTasksToday.length}/{tasks.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">({taskCompletionRate}%)</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Hydration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{t('water_intake', lang)}</span>
            <Droplet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white tabular-nums">
              {waterMl}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {profile.waterTargetMl} ml</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Calorie Budget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">{t('calories_consumed', lang)}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white tabular-nums">
              {todayCalories}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {profile.dailyCalorieBudget} kcal</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${caloriePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Tasks & Active Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Habits / Tasks (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('tasks_title', lang)}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{completedTasksToday.length} of {tasks.length} {lang === 'si' ? 'අවසන්' : 'done'}</span>
                <span aria-hidden="true">·</span>
                <span>{lang === 'si' ? 'දෛනික දාමය' : 'Active Streak'}: 12 {lang === 'si' ? 'දින' : 'days'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'si' ? 'සියල්ල බලන්න' : 'View all'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.slice(0, 5).map(task => {
              const isDone = Boolean(task.completedDates && task.completedDates[todayKey]);
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Toggle task"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/60" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <div>
                      <p className={`text-sm font-medium transition ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        {lang === 'si' ? task.titleSi : task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="capitalize">{task.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{task.targetCount} {lang === 'si' ? task.unitSi : task.unit}</span>
                        {task.reminderTime && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{task.reminderTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                    🔥 {task.streak}d
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Reminders & Alerts (1 col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('todays_reminders', lang)}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleTestChime}
              className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              title="Test audio chime"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('test_chime', lang)}</span>
            </button>
          </div>

          {activeReminders.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">{t('no_reminders', lang)}</p>
          ) : (
            <div className="space-y-3">
              {activeReminders.slice(0, 4).map(reminder => (
                <div
                  key={reminder.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {lang === 'si' ? reminder.titleSi : reminder.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">{reminder.time}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{reminder.type}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleReminder(reminder.id)}
                    className="min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 active:scale-95 transition cursor-pointer"
                  >
                    {t('done', lang)}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onNavigateTab('reminders')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'si' ? 'නව සිහිකැඳවීමක් සකසන්න' : 'Manage All Reminders'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Healthy Meal Recommendation Spotlight */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('recommended_meals', lang)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'si'
                ? 'ඔබේ ඉලක්කයට ගැලපෙන සමබල, පෝෂ්‍යදායී දේශීය සහ සෞඛ්‍ය සම්පන්න ආහාර වට්ටෝරු'
                : 'Balanced nutrition plan with accurate portion measurements and macro breakdowns'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('nutrition')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'si' ? 'පෝෂණ සැලැස්මට යන්න' : 'Open Nutrition Planner'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="h-32 bg-slate-100 relative overflow-hidden">
              <img
                src="/src/assets/images/arogya_nutrition_plate_1791110199868.jpg"
                alt="Balanced Healthy Plate"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/70 text-white text-[10px] font-medium backdrop-blur-sm">
                {lang === 'si' ? 'දිවා ආහාරය' : 'Lunch'}
              </span>
            </div>
            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'si' ? 'රතු කැකුළු බත්, මාළු සහ ගොටුකොළ' : 'Red Rice, Steamed Fish & Gotukola'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {lang === 'si'
                    ? 'ප්‍රෝටීන ග්‍රෑම් 32ක් සහ ඔමේගා-3 සමග පරිපූර්ණ සමබල දිවා ආහාරය.'
                    : 'Provides 32g clean lean protein and low GI sustained slow-release energy.'}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400">
                <span>365 kcal</span>
                <span>P: 32g · C: 37g · F: 8g</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {lang === 'si' ? 'උදෑසන ආහාරය' : 'Power Breakfast'}
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'කුරක්කන් රොටී සහ පරිප්පු හොද්ද' : 'Kurakkan Roti with Dhal & Scraped Coconut'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {lang === 'si'
                  ? 'අස්ථි ශක්තිමත් කරන කැල්සියම් සහ ආමාශයට හිතකර ස්වාභාවික තන්තු.'
                  : 'High calcium for bone strength, beta-glucan and zero refined flour.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400">
              <span>250 kcal</span>
              <span>P: 9.7g · C: 40g · F: 5.7g</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {lang === 'si' ? 'රාත්‍රී ආහාරය' : 'Light Dinner'}
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'තැම්බූ බෝංචි සමග ග්‍රිල් කළ කුකුළු මස්' : 'Steamed Green Beans with Herb Chicken'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {lang === 'si'
                  ? 'රාත්‍රී කාලයේ පහසුවෙන් ජීර්ණය වන, කාබෝහයිඩ්‍රේට අවම පෝෂණීය ආහාරයක්.'
                  : 'Low carbohydrate, gentle night digestion and muscle recovery support.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400">
              <span>209 kcal</span>
              <span>P: 33.4g · C: 8g · F: 4.4g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
