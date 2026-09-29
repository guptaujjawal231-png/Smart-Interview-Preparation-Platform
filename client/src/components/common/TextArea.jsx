import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function TextArea({
  label,
  error,
  helperText,
  rows = 4,
  maxLength,
  value = '',
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={inputId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={cn(
          'block w-full rounded-lg border text-sm transition-colors duration-150',
          'bg-white text-slate-900 placeholder:text-slate-400 p-3.5',
          'focus:outline-none focus:ring-2 focus:ring-offset-0 resize-y',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100',
          className
        )}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
