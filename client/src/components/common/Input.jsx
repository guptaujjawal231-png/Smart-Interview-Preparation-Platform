import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-lg border text-sm transition-colors duration-150',
            'bg-white text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            Icon ? 'pl-9 pr-3 py-2.5' : 'px-3.5 py-2.5',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100',
            className
          )}
          {...props}
        />
      </div>
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
