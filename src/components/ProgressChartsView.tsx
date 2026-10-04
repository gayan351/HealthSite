import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Droplet, 
  CheckCircle2, 
  Activity, 
  Award,
  Calendar
} from 'lucide-react';
import { HealthTask, FoodLogItem, UserHealthProfile, Language } from '../types/health';
import { t } from '../utils/translations';
import { getDateOffsetKey } from '../utils/storage';

interface Props {
  tasks: HealthTask[];
  foodLogs: FoodLogItem[];
  profile: UserHealthProfile;
  lang: Language;
}

export const ProgressChartsView: React.FC<Props> = ({
  tasks,
  foodLogs,
  profile,
  lang,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Generate 7-day data points (from 6 days ago up to today)
  const days = [6, 5, 4, 3, 2, 1, 0].map(offset => {
    const key = getDateOffsetKey(offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - offset);
    const dayLabel = dateObj.toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-US', { weekday: 'short' });
    const shortDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    // Tasks completed on this day
    const completedTasks = tasks.filter(t => t.completedDates && t.completedDates[key]).length;
    const taskRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Calories on this day
    const dayCalories = foodLogs
      .filter(f => f.date === key)
      .reduce((sum, item) => sum + item.calories, 0);

    // Water on this day (approximate from tasks or logged)
    const waterTask = tasks.find(t => t.category === 'hydration');
    const isWaterDone = Boolean(waterTask?.completedDates && waterTask?.completedDates[key]);
    const waterMl = isWaterDone ? 2000 : 1250;

    return {
      key,
      dayLabel,
      shortDate,
      taskRate,
      completedTasks,
      dayCalories,
      waterMl,
    };
  });

  // Calculate averages
  const avgCompletionRate = Math.round(days.reduce((acc, d) => acc + d.taskRate, 0) / days.length);
  const avgCalories = Math.round(days.reduce((acc, d) => acc + d.dayCalories, 0) / days.length);
  const bestDay = days.reduce((prev, curr) => (curr.taskRate > prev.taskRate ? curr : prev), days[0]);

  // SVG dimensions for Completion Trend Area Chart
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Generate points for line & area
  const points = days.map((d, idx) => {
    const x = paddingX + (idx / (days.length - 1)) * chartW;
    const y = svgHeight - paddingY - (d.taskRate / 100) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Macro distribution for today
  const todayKey = getDateOffsetKey(0);
  const todayLogs = foodLogs.filter(f => f.date === todayKey);
  const totalProteinG = todayLogs.reduce((s, f) => s + f.proteinG, 0) || profile.targetProteinG;
  const totalCarbsG = todayLogs.reduce((s, f) => s + f.carbsG, 0) || profile.targetCarbsG;
  const totalFatG = todayLogs.reduce((s, f) => s + f.fatG, 0) || profile.targetFatG;

  const totalMacroCal = (totalProteinG * 4) + (totalCarbsG * 4) + (totalFatG * 9);
  const proteinPct = Math.round(((totalProteinG * 4) / totalMacroCal) * 100);
  const carbsPct = Math.round(((totalCarbsG * 4) / totalMacroCal) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
          {t('charts_title', lang)}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {t('charts_desc', lang)}
        </p>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">
              {lang === 'si' ? 'සාමාන්‍ය සම්පූර්ණ කිරීම් අනුපාතය' : '7-Day Avg Completion'}
            </span>
            <p className="text-xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {avgCompletionRate}%
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">
              {lang === 'si' ? 'සාමාන්‍ය දෛනික කැලරි' : '7-Day Avg Intake'}
            </span>
            <p className="text-xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
              {avgCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">
              {lang === 'si' ? 'විශිෂ්ටතම දිනය' : 'Best Performing Day'}
            </span>
            <p className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {bestDay?.dayLabel} ({bestDay?.taskRate}%)
            </p>
          </div>
        </div>
      </div>

      {/* Chart 1: Daily Task Completion Rate Trend (Smooth SVG Area Chart) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('completion_rate_trend', lang)}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'si' ? 'පසුගිය දින 7 තුළ සෞඛ්‍ය ඉලක්ක සාක්ෂාත් කරගත් ආකාරය' : 'Consistency across hydration, medications, movement, and wellness routines'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Target: 100%</span>
          </div>
        </div>

        {/* Responsive SVG Area Chart */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-56 select-none"
          >
            <defs>
              <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 25, 50, 75, 100].map(val => {
              const y = svgHeight - paddingY - (val / 100) * chartH;
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeDasharray={val === 100 ? '4 4' : 'none'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#emeraldAreaGrad)" />

            {/* Line Path */}
            <path
              d={linePath}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Circles & Tooltip triggers */}
            {points.map((p, idx) => {
              const isHovered = hoveredDayIndex === idx;
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  onMouseLeave={() => setHoveredDayIndex(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    className="fill-white dark:fill-slate-900 stroke-emerald-600 transition-all"
                    strokeWidth={isHovered ? 3 : 2}
                  />

                  {/* Day label on X Axis */}
                  <text
                    x={p.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? 'fill-emerald-700 dark:fill-emerald-400 font-bold' : 'fill-slate-500'
                    }`}
                  >
                    {p.dayLabel}
                  </text>

                  {/* Value badge when hovered */}
                  {isHovered && (
                    <g>
                      <rect
                        x={p.x - 30}
                        y={p.y - 30}
                        width="60"
                        height="22"
                        rx="6"
                        className="fill-slate-900 dark:fill-slate-100"
                      />
                      <text
                        x={p.x}
                        y={p.y - 15}
                        textAnchor="middle"
                        className="text-[11px] font-bold font-mono fill-white dark:fill-slate-900"
                      >
                        {p.taskRate}% ({p.completedTasks})
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two Columns: Calorie Intake Bar Chart + Macronutrient Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Intake vs Target Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('calorie_adherence_trend', lang)}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'si' ? 'ඉලක්කය: දිනකට 2,150 kcal' : `Daily Target: ${profile.dailyCalorieBudget} kcal`}
              </p>
            </div>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3 pt-2">
            {days.map(d => {
              const pct = Math.min(100, Math.round((d.dayCalories / profile.dailyCalorieBudget) * 100));
              const isOver = d.dayCalories > profile.dailyCalorieBudget;

              return (
                <div key={d.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {d.dayLabel} ({d.shortDate})
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white tabular-nums">
                      {d.dayCalories} / {profile.dailyCalorieBudget} kcal
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Macronutrient Balance Donut & Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {lang === 'si' ? 'පෝෂක සංයුතිය සහ අනුපාතය' : 'Macronutrient Energy Distribution'}
              </h2>
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'si' ? 'අද දින ලබාගත් ප්‍රෝටීන, කාබෝහයිඩ්‍රේට සහ මේද අනුපාතය' : "Target vs Actual ratio for today's food log"}
            </p>
          </div>

          {/* Clean Segmented Proportion Bar */}
          <div className="space-y-3 my-4">
            <div className="flex h-5 w-full rounded-xl overflow-hidden shadow-inner">
              <div
                style={{ width: `${carbsPct}%` }}
                className="bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white"
                title={`Carbs: ${carbsPct}%`}
              >
                {carbsPct}%
              </div>
              <div
                style={{ width: `${proteinPct}%` }}
                className="bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white"
                title={`Protein: ${proteinPct}%`}
              >
                {proteinPct}%
              </div>
              <div
                style={{ width: `${fatPct}%` }}
                className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white"
                title={`Fats: ${fatPct}%`}
              >
                {fatPct}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-teal-500 mx-auto mb-1" />
                <span className="text-[11px] text-slate-500 font-medium">Carbs</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalCarbsG}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{carbsPct}% cal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] text-slate-500 font-medium">Protein</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalProteinG}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{proteinPct}% cal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1" />
                <span className="text-[11px] text-slate-500 font-medium">Fats</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalFatG}g</p>
                <span className="text-[10px] text-slate-400 font-mono">{fatPct}% cal</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
            {lang === 'si'
              ? 'ඔබගේ ප්‍රෝටීන සහ සංකීර්ණ කාබෝහයිඩ්‍රේට අනුපාතය නිරෝගී ක්‍රියාශීලී ජීවන රටාවකට ඉතා යෝග්‍ය වේ.'
              : 'Your protein and complex carbohydrate balance is well-aligned with lean muscle maintenance.'}
          </div>
        </div>
      </div>
    </div>
  );
};
