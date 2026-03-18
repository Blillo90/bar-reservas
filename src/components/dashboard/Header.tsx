'use client';

import { formatShortDate, formatFullDate, todayString } from '@/lib/utils/date';

interface HeaderProps {
  selectedDate: string;
  businessName?: string;
  onAddReservation: () => void;
  onOpenSettings: () => void;
}

export function Header({ selectedDate, businessName, onAddReservation, onOpenSettings }: HeaderProps) {
  const isToday = selectedDate === todayString();
  const displayName = businessName?.trim() || 'Bar Reservas';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30 text-base">
            🍸
          </div>
          <div className="min-w-0 hidden sm:block">
            <h1 className="text-slate-900 dark:text-white font-bold text-sm leading-none">{displayName}</h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 capitalize truncate">
              {isToday ? 'Hoy — ' : ''}{formatFullDate(selectedDate)}
            </p>
          </div>
          {/* Mobile: only short date */}
          <div className="sm:hidden min-w-0">
            <p className="text-amber-500 font-semibold text-sm leading-none">
              {isToday ? 'Hoy' : formatShortDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop: "+ Nueva Reserva" text button */}
          <button
            onClick={onAddReservation}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Reserva
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Configuración"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Abrir configuración"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px]" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
