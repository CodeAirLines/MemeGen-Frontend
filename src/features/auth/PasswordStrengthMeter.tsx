import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import type { PasswordStrengthResult } from '../../types/auth';

interface PasswordStrengthMeterProps {
  password: string;
}

function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /\d/.test(password) || /[^A-Za-z0-9]/.test(password);
  const hasBothNumberAndSymbol = /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length > 0) score += 1;
  if (hasMinLength) score += 1;
  if (hasMixedCase) score += 1;
  if (hasNumberOrSymbol) score += 1;
  if (hasBothNumberAndSymbol && password.length >= 10) score = 4;

  let level: PasswordStrengthResult['level'] = 'weak';
  let label = 'Weak';

  if (score === 2) {
    level = 'fair';
    label = 'Fair';
  } else if (score === 3) {
    level = 'good';
    label = 'Good';
  } else if (score >= 4) {
    level = 'strong';
    label = 'Strong';
  }

  return {
    score,
    level,
    label,
    hasMinLength,
    hasMixedCase,
    hasNumberOrSymbol,
  };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const colorStyles = {
    weak: 'bg-rose-500',
    fair: 'bg-amber-500',
    good: 'bg-sky-500',
    strong: 'bg-emerald-500',
  };

  const textStyles = {
    weak: 'text-rose-600',
    fair: 'text-amber-600',
    good: 'text-sky-600',
    strong: 'text-emerald-600',
  };

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-200" aria-live="polite">
      {/* Top Header: Score Bar + Level Label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Password strength:</span>
        <span className={`font-semibold ${textStyles[strength.level]}`}>
          {strength.label}
        </span>
      </div>

      {/* 4-Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              step <= strength.score ? colorStyles[strength.level] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          {strength.hasMinLength ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={strength.hasMinLength ? 'text-slate-700' : 'text-slate-400'}>
            At least 8 characters
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {strength.hasMixedCase ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={strength.hasMixedCase ? 'text-slate-700' : 'text-slate-400'}>
            Uppercase & lowercase
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {strength.hasNumberOrSymbol ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={strength.hasNumberOrSymbol ? 'text-slate-700' : 'text-slate-400'}>
            Number or special character
          </span>
        </div>
      </div>
    </div>
  );
};
