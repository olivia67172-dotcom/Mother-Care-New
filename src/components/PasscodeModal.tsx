import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PIN = '6550';

export const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setIsSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (entered: string) => {
    if (entered === CORRECT_PIN) {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 650);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Lock className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">এডমিন প্যানেল ভেরিফিকেশন</h3>
              <p className="text-xs text-teal-100">সিক্রেট ৪ ডিজিট পাসকোড লিখুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-700 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>

          <p className="text-sm text-slate-600 mb-5">
            Mother Care এডমিন হিসেবে প্রবেশ করতে <strong className="text-slate-800">৪ ডিজিটের পাসকোড</strong> প্রবেশ করান:
          </p>

          {/* Hidden input for physical keyboard entry */}
          <input
            ref={inputRef}
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 4) {
                setPin(val);
                if (val.length === 4) verifyPin(val);
              }
            }}
            className="sr-only"
            autoFocus
          />

          {/* 4 Pin Indicator Dots */}
          <div className={`flex justify-center items-center gap-4 mb-6 ${error ? 'animate-bounce text-red-500' : ''}`}>
            {[0, 1, 2, 3].map((idx) => {
              const filled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                    filled
                      ? isSuccess
                        ? 'bg-emerald-500 border-emerald-500 scale-110'
                        : error
                        ? 'bg-rose-500 border-rose-500 scale-110'
                        : 'bg-teal-700 border-teal-700 scale-110'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                />
              );
            })}
          </div>

          {/* Feedback message */}
          <div className="min-h-[22px] mb-4">
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>ভুল পাসকোড! অনুগ্রহ করে সঠিক কোড দিন (6550)।</span>
              </div>
            )}
            {isSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>সফল হয়েছে! এডমিন প্যানেল লোড হচ্ছে...</span>
              </div>
            )}
            {!error && !isSuccess && (
              <span className="text-xs text-slate-600">পাসকোড: 6550</span>
            )}
          </div>

          {/* Numeric Keypad for Touch / Mouse */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-12 text-lg font-semibold rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-800 border border-slate-200 active:scale-95 transition-all shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="h-12 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 active:scale-95 transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 text-lg font-semibold rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-800 border border-slate-200 active:scale-95 transition-all shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 active:scale-95 transition-all flex items-center justify-center"
            >
              মুছুন
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>লগোতে ৬ বার ক্লিক করার মাধ্যমে সিক্রেট উইন্ডো</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            বাতিল
          </button>
        </div>
      </div>
    </div>
  );
};
