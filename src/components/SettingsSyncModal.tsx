import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  ShieldCheck, 
  Fingerprint, 
  KeyRound, 
  Download, 
  Upload, 
  RefreshCw, 
  Check, 
  User, 
  Sliders
} from 'lucide-react';
import { 
  BiometricSecurityConfig, 
  CloudSyncInfo, 
  UserHealthProfile, 
  HealthGoal, 
  Language 
} from '../types/health';
import { t } from '../utils/translations';
import { enrollBiometrics, hashPin } from '../utils/biometrics';
import { soundEffects } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  securityConfig: BiometricSecurityConfig;
  onUpdateSecurity: (updated: Partial<BiometricSecurityConfig>) => void;
  syncInfo: CloudSyncInfo;
  onTriggerSync: () => void;
  profile: UserHealthProfile;
  onUpdateProfile: (updated: Partial<UserHealthProfile>) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  lang: Language;
}

export const SettingsSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  securityConfig,
  onUpdateSecurity,
  syncInfo,
  onTriggerSync,
  profile,
  onUpdateProfile,
  onExportBackup,
  onImportBackup,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'sync' | 'profile'>('security');
  const [pinInput, setPinInput] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [biometricFeedback, setBiometricFeedback] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Editable profile state
  const [editAge, setEditAge] = useState(profile.age);
  const [editWeight, setEditWeight] = useState(profile.weightKg);
  const [editHeight, setEditHeight] = useState(profile.heightCm);
  const [editGoal, setEditGoal] = useState<HealthGoal>(profile.healthGoal);
  const [editActivity, setEditActivity] = useState(profile.activityLevel);

  if (!isOpen) return null;

  const handleEnrollBiometrics = async () => {
    setBiometricFeedback(null);
    const res = await enrollBiometrics(profile.name);
    if (res.success) {
      onUpdateSecurity({
        isEnabled: true,
        hasEnrolledBiometrics: true,
        credentialId: res.credentialId,
      });
      soundEffects.playUnlockTone();
      setBiometricFeedback(lang === 'si' ? 'බයෝමෙට්‍රික් හඳුනාගැනීම සාර්ථකව සම්බන්ධ කෙරිණි!' : 'Biometrics successfully enrolled!');
    } else {
      setBiometricFeedback(res.error || (lang === 'si' ? 'බයෝමෙට්‍රික් ලියාපදිංචිය අසාර්ථකයි' : 'Biometric enrollment failed'));
    }
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4) return;
    const hashed = await hashPin(pinInput);
    onUpdateSecurity({
      pinHash: hashed,
      hasPinFallback: true,
      isEnabled: true,
    });
    soundEffects.playSuccessChime();
    setPinSuccess(true);
    setPinInput('');
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Mifflin-St Jeor Formula
    const bmr = 10 * editWeight + 6.25 * editHeight - 5 * editAge + 5;
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
    };
    const tdee = Math.round(bmr * activityMultipliers[editActivity]);
    
    // Adjust by goal
    let dailyBudget = tdee;
    if (editGoal === 'weight_loss') dailyBudget -= 400;
    if (editGoal === 'muscle_gain') dailyBudget += 350;

    const protein = Math.round((dailyBudget * 0.25) / 4);
    const carbs = Math.round((dailyBudget * 0.50) / 4);
    const fat = Math.round((dailyBudget * 0.25) / 9);

    onUpdateProfile({
      age: Number(editAge),
      weightKg: Number(editWeight),
      heightCm: Number(editHeight),
      healthGoal: editGoal,
      activityLevel: editActivity,
      dailyCalorieBudget: dailyBudget,
      targetProteinG: protein,
      targetCarbsG: carbs,
      targetFatG: fat,
    });

    soundEffects.playSuccessChime();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = onImportBackup(content);
      if (success) {
        setImportStatus(lang === 'si' ? 'දත්ත සාර්ථකව නැවත පිහිටුවන ලදී!' : 'Database successfully restored!');
        soundEffects.playSuccessChime();
      } else {
        setImportStatus(lang === 'si' ? 'ගොනුව කියවීමේ දෝෂයකි' : 'Invalid backup JSON file');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {lang === 'si' ? 'පද්ධති සැකසුම් සහ ආරක්ෂාව' : 'System Settings & Security'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tab Bar */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'බයෝමෙට්‍රික් ආරක්ෂාව' : 'Biometric Security'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'ක්ලවුඩ් සමමුහුර්ත' : 'Cloud Sync'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'සෞඛ්‍ය පැතිකඩ' : 'Health Profile'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* TAB 1: Biometric Security */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {lang === 'si' ? 'බයෝමෙට්‍රික් අගුල සක්‍රීය කිරීම' : 'Biometric App Lock'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lang === 'si' ? 'Face ID, Touch ID හෝ ඇඟිලි සලකුණ භාවිතයෙන් දත්ත ආරක්ෂා කරන්න.' : 'Protects your health metrics with hardware authenticator.'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityConfig.isEnabled}
                    onChange={e => onUpdateSecurity({ isEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Enroll Biometric Hardware Trigger */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleEnrollBiometrics}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'si' ? 'උපාංගයේ ඇඟිලි සලකුණ ලියාපදිංචි කරන්න' : 'Enroll Device Biometric Authenticator'}</span>
                </button>
                {biometricFeedback && (
                  <p className="text-xs text-emerald-600 text-center font-medium">{biometricFeedback}</p>
                )}
              </div>

              {/* 4-digit PIN setup */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-600" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {lang === 'si' ? 'අංක 4 රහස් අංකය (PIN) වෙනස් කිරීම' : 'Change 4-Digit Security PIN'}
                  </h4>
                </div>

                <form onSubmit={handleSavePin} className="flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="New PIN (4 digits)"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono tracking-widest text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={pinInput.length !== 4}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    {lang === 'si' ? 'යාවත්කාලීන කරන්න' : 'Save PIN'}
                  </button>
                </form>

                {pinSuccess && (
                  <p className="text-xs text-emerald-600 font-medium">
                    {lang === 'si' ? 'PIN අංකය සාර්ථකව සුරකින ලදී!' : 'Security PIN updated successfully!'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Cloud Sync & Backup */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{lang === 'si' ? 'වත්මන් තත්ත්වය:' : 'Sync Status:'}</span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 capitalize">
                    {syncInfo.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{lang === 'si' ? 'අවසන් සමමුහුර්ත වේලාව:' : 'Last Synced:'}</span>
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    {syncInfo.lastSyncedAt || 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{lang === 'si' ? 'නොබැඳි දත්ත ක්‍රියාකාරීත්වය:' : 'Offline Persistence:'}</span>
                  <span className="text-xs font-medium text-emerald-600">Active (Local Cache)</span>
                </div>

                <button
                  type="button"
                  onClick={onTriggerSync}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('force_sync', lang)}</span>
                </button>
              </div>

              {/* Export / Import Database Backups */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {lang === 'si' ? 'දත්ත පිටපත බාගත කරන්න' : 'Export JSON Backup'}
                    </span>
                    <span className="text-[10px] text-slate-400">Download complete health history</span>
                  </div>
                </button>

                <label className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer">
                  <Upload className="w-5 h-5 text-teal-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {lang === 'si' ? 'දත්ත නැවත ඇතුළත් කරන්න' : 'Restore from JSON'}
                    </span>
                    <span className="text-[10px] text-slate-400">Upload JSON backup file</span>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus && (
                <p className="text-xs text-emerald-600 text-center font-medium">{importStatus}</p>
              )}
            </div>
          )}

          {/* TAB 3: User Health Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'වයස' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={editAge}
                    onChange={e => setEditAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'බර (kg)' : 'Weight (kg)'}
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={editWeight}
                    onChange={e => setEditWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'si' ? 'උස (cm)' : 'Height (cm)'}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={editHeight}
                    onChange={e => setEditHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'ප්‍රධාන සෞඛ්‍ය ඉලක්කය' : 'Primary Health Goal'}
                </label>
                <select
                  value={editGoal}
                  onChange={e => setEditGoal(e.target.value as HealthGoal)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="balanced_health">Balanced Holistic Health (සමබල සුවතාවය)</option>
                  <option value="weight_loss">Healthy Weight Loss (බර අඩුකර ගැනීම)</option>
                  <option value="muscle_gain">Lean Muscle & Strength (මාංශ පේශි වර්ධනය)</option>
                  <option value="blood_sugar_control">Blood Sugar & Diabetes Support (සීනි පාලනය)</option>
                  <option value="heart_wellness">Cardiovascular Heart Health (හෘද සෞඛ්‍යය)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'si' ? 'ක්‍රියාශීලීතා මට්ටම' : 'Daily Physical Activity Level'}
                </label>
                <select
                  value={editActivity}
                  onChange={e => setEditActivity(e.target.value as UserHealthProfile['activityLevel'])}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="sedentary">Sedentary (Desk work / Little movement)</option>
                  <option value="light">Lightly Active (1-3 days exercise / week)</option>
                  <option value="moderate">Moderately Active (3-5 days workout / week)</option>
                  <option value="very_active">Very Active (Daily intense training)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition cursor-pointer"
                >
                  {lang === 'si' ? 'කැලරි සහ ඉලක්ක නැවත ගණනය කරන්න' : 'Recalculate Calorie & Macro Goals'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
