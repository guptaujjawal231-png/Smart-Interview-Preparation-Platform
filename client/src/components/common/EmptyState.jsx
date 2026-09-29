import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There is no data to display here right now.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl border border-dashed border-slate-300',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
