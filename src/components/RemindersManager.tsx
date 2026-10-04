import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  Clock, 
  Pill, 
  Droplet, 
  UtensilsCrossed, 
  Dumbbell, 
  Moon,
  X,
  Check
} from 'lucide-react';
import { HealthReminder, Language } from '../types/health';
import { t } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface Props {
  reminders: HealthReminder[];
  onToggleReminder: (reminderId: string) => void;
  onAddReminder: (reminder: Omit<HealthReminder, 'id'>) => void;
  onDeleteReminder: (reminderId: string) => void;
  lang: Language;
}

export const RemindersManager: React.FC<Props> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  lang,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleSi, setTitleSi] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<HealthReminder['type']>('medication');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const dayLabelsEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabelsSi = ['ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්‍රහස්', 'සිකු', 'සෙන'];

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playReminderChime();
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setNotificationStatus(lang === 'si' ? 'සිහිකැඳවීම් දැනුම්දීම් සක්‍රීය කෙරිණි!' : 'Browser alerts enabled!');
          soundEffects.playSuccessChime();
        } else {
          setNotificationStatus(lang === 'si' ? 'දැනුම්දීම් අවසරය ප්‍රතික්ෂේප විය' : 'Notification permission not granted');
        }
      } catch {
        setNotificationStatus(lang === 'si' ? 'හඬ සංඥා භාවිත වේ' : 'Audio chime active');
      }
      setTimeout(() => setNotificationStatus(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      titleSi: titleSi.trim() || title.trim(),
      time,
      type,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
    });

    soundEffects.playSuccessChime();
    setTitle('');
    setTitleSi('');
    setIsModalOpen(false);
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const getTypeIcon = (rType: HealthReminder['type']) => {
    switch (rType) {
      case 'medication': return <Pill className="w-4 h-4 text-rose-500" />;
      case 'water': return <Droplet className="w-4 h-4 text-cyan-500" />;
      case 'meal': return <UtensilsCrossed className="w-4 h-4 text-emerald-500" />;
      case 'workout': return <Dumbbell className="w-4 h-4 text-amber-500" />;
      case 'sleep': return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('tab_reminders', lang)}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {lang === 'si'
              ? 'ඖෂධ වේලාවන්, ජලය පානය කිරීම සහ ආහාර ගැනීමේ කාලසටහනට අනුව නිවැරදිව සිහිකැඳවීම් ලබාගන්න.'
              : 'Keep track of scheduled medication doses, hydration intervals, and wellness routines with gentle sound alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRequestNotificationPermission}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'si' ? 'දැනුම්දීම් සක්‍රීය කරන්න' : 'Enable Alerts'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'si' ? 'නව සිහිකැඳවීමක්' : 'New Reminder'}</span>
          </button>
        </div>
      </div>

      {notificationStatus && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map(reminder => (
          <div
            key={reminder.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              reminder.enabled
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {getTypeIcon(reminder.type)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {lang === 'si' ? reminder.titleSi : reminder.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {reminder.time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="capitalize">{reminder.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {reminder.days.length === 7
                      ? (lang === 'si' ? 'සෑම දිනකම' : 'Everyday')
                      : reminder.days.map(d => (lang === 'si' ? dayLabelsSi[d] : dayLabelsEn[d])).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestSound}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                title="Preview sound chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onToggleReminder(reminder.id)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  reminder.enabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                {reminder.enabled ? (lang === 'si' ? 'සක්‍රීයයි' : 'Active') : (lang === 'si' ? 'අක්‍රීයයි' : 'Off')}
              </button>

              <button
                type="button"
                onClick={() => onDeleteReminder(reminder.id)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition cursor-pointer"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {lang === 'si' ? 'නව සිහිකැඳවීමක් සකසන්න' : 'Create Health Reminder'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'සිහිකැඳවීමේ නම (English)' : 'Reminder Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Medication / Water break"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'සිහිකැඳවීමේ නම (සිංහල - විකල්ප)' : 'Reminder Title (Sinhala - Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="උදා: සවස ඖෂධ ගැනීම"
                  value={titleSi}
                  onChange={e => setTitleSi(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වේලාව' : 'Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වර්ගය' : 'Type'}
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as HealthReminder['type'])}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="medication">Medication / Vitamins</option>
                    <option value="water">Hydration / Water</option>
                    <option value="meal">Meal / Nutrition</option>
                    <option value="workout">Physical Movement</option>
                    <option value="sleep">Sleep Rest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'si' ? 'පුනරාවර්තනය වන දින' : 'Repeat on Days'}
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {dayLabelsEn.map((lbl, idx) => {
                    const isSelected = selectedDays.includes(idx);
                    return (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`min-h-[40px] py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {lang === 'si' ? dayLabelsSi[idx] : lbl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {lang === 'si' ? 'සුරකින්න' : 'Create Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
