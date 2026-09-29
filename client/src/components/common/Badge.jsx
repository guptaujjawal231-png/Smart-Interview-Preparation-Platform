import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    // Role specific styles
    sde: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    data: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ece: 'bg-amber-50 text-amber-700 border-amber-200',
    // Difficulty specific styles
    beginner: 'bg-green-50 text-green-700 border-green-200',
    intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant] || variants.default, sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
