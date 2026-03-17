import { ReservationStatus } from '@/types/reservation';

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmada',
    className:
      'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
  },
  pending: {
    label: 'Pendiente',
    className:
      'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  },
  cancelled: {
    label: 'Cancelada',
    className:
      'bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
  },
};

interface StatusBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'slate';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variantClass = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    slate: 'bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-300',
  }[variant];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantClass}`}>
      {children}
    </span>
  );
}
