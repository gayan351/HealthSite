import React, { useState } from 'react';
import { Fingerprint, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { verifyBiometrics, hashPin } from '../utils/biometrics';
import { soundEffects } from '../utils/audio';
import { Language, BiometricSecurityConfig } from '../types/health';
import { t } from '../utils/translations';

interface Props {
  isOpen: boolean;
  securityConfig: BiometricSecurityConfig;
  lang: Language;
  onUnlockSuccess: () => void;
}

export const BiometricLockModal: React.FC<Props> = ({
  isOpen,
  securityConfig,
  lang,
  onUnlockSuccess,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const [biometricFeedback, setBiometricFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBiometricAuth = async () => {
    setIsVerifyingBiometric(true);
    setBiometricFeedback(null);
    setPinError('');

    try {
      const res = await verifyBiometrics(securityConfig.credentialId);
      if (res.success) {
        soundEffects.playUnlockTone();
        onUnlockSuccess();
      } else {
        setBiometricFeedback(lang === 'si' ? 'හඳුනාගැනීම අසාර්ථකයි. කරුණාකර PIN අංකය භාවිතා කරන්න.' : 'Biometric verification failed. Please enter your PIN.');
      }
    } catch {
      setBiometricFeedback(lang === 'si' ? 'PIN අංකය මඟින් අගුල හරින්න.' : 'Please use your 4-digit PIN.');
    } finally {
      setIsVerifyingBiometric(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (pinInput.length < 4) {
      setPinError(lang === 'si' ? 'කරුණාකර අංක 4ක PIN ඇතුළත් කරන්න' : 'Please enter 4 digits');
      return;
    }

    const hashed = await hashPin(pinInput);
    // Allow default "1234" (hash: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918) or stored hash or instant match
    if (
      !securityConfig.pinHash ||
      securityConfig.pinHash === hashed ||
      pinInput === '1234'
    ) {
      soundEffects.playUnlockTone();
      setPinInput('');
      onUnlockSuccess();
    } else {
      setPinError(lang === 'si' ? 'වැරදි PIN අංකයකි. නැවත උත්සාහ කරන්න.' : 'Incorrect PIN. Try again (Default: 1234)');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 4) {
      setPinInput(prev => prev + digit);
      setPinError('');
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
        {/* Shield Icon Header */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('app_name', lang)}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          {t('data_protected', lang)}
        </p>

        {/* Biometric Trigger Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isVerifyingBiometric}
            className="w-full min-h-[52px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium text-sm flex items-center justify-center gap-3 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Fingerprint className={`w-5 h-5 ${isVerifyingBiometric ? 'animate-pulse' : ''}`} />
            <span>
              {isVerifyingBiometric
                ? (lang === 'si' ? 'තහවුරු කරමින්...' : 'Verifying Touch/Face ID...')
                : t('unlock_with_biometrics', lang)}
            </span>
          </button>
        </div>

        {biometricFeedback && (
          <div className="flex items-center gap-2 p-2.5 mb-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{biometricFeedback}</span>
          </div>
        )}

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
          <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400">
            {lang === 'si' ? 'හෝ PIN අංකය' : 'or Enter PIN'}
          </span>
        </div>

        {/* PIN Dots Display */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                idx < pinInput.length
                  ? 'bg-slate-900 dark:bg-emerald-400 scale-110'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {pinError && (
          <p className="text-xs text-rose-500 font-medium mb-3">{pinError}</p>
        )}

        {/* Numerical Touch Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num)}
              className="min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBiometricAuth}
            className="min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            title="Biometrics"
          >
            <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {pinInput.length === 4 && (
          <button
            type="button"
            onClick={handlePinSubmit}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm transition-all"
          >
            {t('unlock', lang)}
          </button>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-3">
          <KeyRound className="w-3.5 h-3.5" />
          <span>{lang === 'si' ? 'පෙරනිමි PIN අංකය: 1234' : 'Default Passcode: 1234'}</span>
        </div>
      </div>
    </div>
  );
};
