import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Droplet, 
  Pill, 
  Dumbbell, 
  Apple, 
  Brain, 
  Moon, 
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HealthTask, TaskCategory, TimeOfDay, Language } from '../types/health';
import { t } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface Props {
  tasks: HealthTask[];
  onToggleTask: (taskId: string) => void;
  onUpdateTaskCount: (taskId: string, count: number) => void;
  onAddTask: (newTask: Omit<HealthTask, 'id' | 'completedDates' | 'streak'>) => void;
  onDeleteTask: (taskId: string) => void;
  lang: Language;
}

export const DailyTasksView: React.FC<Props> = ({
  tasks,
  onToggleTask,
  onUpdateTaskCount,
  onAddTask,
  onDeleteTask,
  lang,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleSi, setNewTitleSi] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('exercise');
  const [newTimeOfDay, setNewTimeOfDay] = useState<TimeOfDay>('morning');
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState('times');
  const [newReminderTime, setNewReminderTime] = useState('08:00');

  const categories: { id: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', labelKey: 'category_all', icon: Sparkles },
    { id: 'hydration', labelKey: 'category_hydration', icon: Droplet },
    { id: 'medication', labelKey: 'category_medication', icon: Pill },
    { id: 'exercise', labelKey: 'category_exercise', icon: Dumbbell },
    { id: 'nutrition', labelKey: 'category_nutrition', icon: Apple },
    { id: 'mindfulness', labelKey: 'category_mindfulness', icon: Brain },
    { id: 'sleep', labelKey: 'category_sleep', icon: Moon },
  ];

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === activeCategory);

  const completedCount = tasks.filter(t => t.completedDates && t.completedDates[todayKey]).length;
  const isAllComplete = tasks.length > 0 && completedCount === tasks.length;

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const wasDone = Boolean(task?.completedDates && task?.completedDates[todayKey]);

    onToggleTask(taskId);

    if (!wasDone) {
      soundEffects.playSuccessChime();
      // If this completes all tasks, celebrate with confetti!
      if (completedCount + 1 >= tasks.length) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#047857'],
        });
      }
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      titleSi: newTitleSi.trim() || newTitle.trim(),
      category: newCategory,
      timeOfDay: newTimeOfDay,
      targetCount: Number(newTarget) || 1,
      unit: newUnit.trim() || 'times',
      unitSi: newUnit.trim() || 'වතාවක්',
      reminderTime: newReminderTime,
    });

    setNewTitle('');
    setNewTitleSi('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'hydration': return <Droplet className="w-4 h-4 text-cyan-500" />;
      case 'medication': return <Pill className="w-4 h-4 text-rose-500" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-amber-500" />;
      case 'nutrition': return <Apple className="w-4 h-4 text-emerald-500" />;
      case 'mindfulness': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'sleep': return <Moon className="w-4 h-4 text-indigo-500" />;
      default: return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('tasks_title', lang)}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t('tasks_desc', lang)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_new_task', lang)}</span>
        </button>
      </div>

      {/* Progress completion bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'si' ? 'අද දින ප්‍රගතිය' : "Today's Task Progress"}
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {completedCount} / {tasks.length} {lang === 'si' ? 'අවසන්' : 'done'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAllComplete
                ? (lang === 'si' ? 'සුබ පැතුම්! ඔබ අද දින සියලු කාර්යයන් සාර්ථකව අවසන් කළා!' : 'Great job! You completed all health targets for today!')
                : (lang === 'si' ? 'ඔබගේ දෛනික පුරුදු සම්පූර්ණ කිරීමට ටැප් කරන්න.' : 'Tap each routine to check off as you complete it.')}
            </p>
          </div>
        </div>

        <div className="w-28 sm:w-44 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shrink-0">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Interactive Category Filter Pills (Functional button filter bar compliant with section 1.A) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto no-scrollbar">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(cat.labelKey, lang)}</span>
            </button>
          );
        })}
      </div>

      {/* Task Rows List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              {lang === 'si' ? 'මෙම අංශය සඳහා සටහන් කළ කාර්යයන් නොමැත.' : 'No tasks recorded for this category.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = Boolean(task.completedDates && task.completedDates[todayKey]);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left check affordance & text */}
                <div
                  onClick={() => handleTaskToggle(task.id)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <button
                    type="button"
                    aria-label="Toggle task completion"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/60" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-emerald-600 transition" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3 className={`text-sm font-semibold tracking-tight truncate ${
                      isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {lang === 'si' ? task.titleSi : task.title}
                    </h3>
                    
                    {/* Unboxed metadata with typographic dots */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(task.category)}
                        <span className="capitalize">{task.category}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{task.targetCount} {lang === 'si' ? task.unitSi : task.unit}</span>
                      {task.reminderTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{task.reminderTime}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="capitalize text-slate-400">{task.timeOfDay}</span>
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right actions: water counter if hydration, streak, delete */}
                <div className="flex items-center gap-2 shrink-0">
                  {task.category === 'hydration' && (
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateTaskCount(task.id, Math.max(0, (task.currentCount || 0) - 1))}
                        className="w-7 h-7 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold px-1 tabular-nums">
                        {task.currentCount || 0}/{task.targetCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateTaskCount(task.id, (task.currentCount || 0) + 1)}
                        className="w-7 h-7 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                      🔥 {task.streak} {lang === 'si' ? 'දින' : 'days'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {t('add_new_task', lang)}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'කාර්යයේ නම (English)' : 'Task Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20-Minute Core Workout"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'කාර්යයේ නම (සිංහල - විකල්ප)' : 'Task Title (Sinhala - Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="උදා: විනාඩි 20ක ශරීර ව්‍යායාමය"
                  value={newTitleSi}
                  onChange={e => setNewTitleSi(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වර්ගය' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="exercise">Exercise / Workout</option>
                    <option value="hydration">Hydration / Water</option>
                    <option value="medication">Medication / Vitamins</option>
                    <option value="nutrition">Nutrition / Meal</option>
                    <option value="mindfulness">Mindfulness / Meditation</option>
                    <option value="sleep">Sleep / Rest</option>
                    <option value="custom">Custom Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'දවසේ වේලාව' : 'Time of Day'}
                  </label>
                  <select
                    value={newTimeOfDay}
                    onChange={e => setNewTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'ඉලක්කය' : 'Target Count'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTarget}
                    onChange={e => setNewTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'ඒකකය' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    placeholder="Mins / Cups / Dose"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වේලාව' : 'Reminder Time'}
                  </label>
                  <input
                    type="time"
                    value={newReminderTime}
                    onChange={e => setNewReminderTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {lang === 'si' ? 'සුරකින්න' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
