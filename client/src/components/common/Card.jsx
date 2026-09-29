import React from 'react';
import { cn } from '../../utils/cn';

export default function Card({ children, className = '', hoverEffect = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm p-6',
        hoverEffect && 'hover:shadow-md hover:border-slate-300 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
