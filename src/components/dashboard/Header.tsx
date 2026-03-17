'use client';

import { formatFullDate, formatShortDate, todayString } from '@/lib/utils/date';

interface HeaderProps {
  selectedDate: string;
}

export function Header({ selectedDate }: HeaderProps) {
  const isToday = selectedDate === todayString();

  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-700/60">
      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <span className="text-slate-900 font-black text-lg">🍸</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-white font-bold text-base sm:text-lg leading-none">Bar Reservas</h1>
          <p className="text-slate-400 text-xs mt-0.5">Panel de Gestión</p>
        </div>
      </div>

      {/* Date info — stacks cleanly on all screen sizes */}
      <div className="text-right shrink-0">
        {/* Short date always visible */}
        <p className="text-amber-400 font-semibold text-sm leading-none">
          {isToday ? 'Hoy' : formatShortDate(selectedDate)}
        </p>
        {/* Full date only on sm+ */}
        <p className="hidden sm:block text-slate-400 text-xs mt-0.5 capitalize">
          {formatFullDate(selectedDate)}
        </p>
        <p className="sm:hidden text-slate-400 text-xs mt-0.5">Vista activa</p>
      </div>
    </header>
  );
}
