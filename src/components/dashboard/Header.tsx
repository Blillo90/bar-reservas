'use client';

import { formatShortDate, formatFullDate, todayString } from '@/lib/utils/date';

interface HeaderProps {
  selectedDate: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onAddReservation: () => void;
}

export function Header({ selectedDate, isDark, onToggleTheme, onAddReservation }: HeaderProps) {
  const isToday = selectedDate === todayString();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30 text-base">
            🍸
          </div>
          <div className="min-w-0 hidden sm:block">
            <h1 className="text-slate-900 dark:text-white font-bold text-sm leading-none">Bar Reservas</h1>
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

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              /* Sun icon */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4.5 h-4.5 w-[18px] h-[18px]" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon icon */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px]" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
