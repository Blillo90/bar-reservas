'use client';

import { useState } from 'react';
import { Reservation } from '@/types/reservation';
import {
  getMonthGrid,
  getDayNumber,
  isToday,
  isSameDate,
  todayString,
  MONTHS_ES,
} from '@/lib/utils/date';

interface ReservationCalendarProps {
  reservations: Reservation[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function ReservationCalendar({
  reservations,
  selectedDate,
  onSelectDate,
}: ReservationCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Full month grid (Monday-first, padded with null)
  const grid = getMonthGrid(viewYear, viewMonth);

  // Per-date counts split by status (exclude cancelled)
  const countByDate = reservations.reduce<Record<string, { confirmed: number; pending: number }>>(
    (acc, r) => {
      if (r.status === 'cancelled') return acc;
      if (!acc[r.date]) acc[r.date] = { confirmed: 0, pending: 0 };
      if (r.status === 'confirmed') acc[r.date].confirmed++;
      if (r.status === 'pending') acc[r.date].pending++;
      return acc;
    },
    {}
  );

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onSelectDate(todayString());
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <h2 className="text-slate-900 dark:text-white font-semibold text-sm">Calendario</h2>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          <NavBtn onClick={prevMonth} title="Mes anterior">‹</NavBtn>

          {/* Month selector */}
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white text-xs rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {MONTHS_ES.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          {/* Year controls */}
          <div className="flex items-center">
            <NavBtn onClick={() => setViewYear((y) => y - 1)} title="Año anterior">−</NavBtn>
            <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold w-10 text-center select-none">
              {viewYear}
            </span>
            <NavBtn onClick={() => setViewYear((y) => y + 1)} title="Año siguiente">+</NavBtn>
          </div>

          <NavBtn onClick={nextMonth} title="Mes siguiente">›</NavBtn>

          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Hoy
            </button>
          )}
        </div>
      </div>

      {/* ── Day-of-week headers ── */}
      <div className="grid grid-cols-7 mb-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
          <div key={d} className="text-center text-slate-400 dark:text-slate-500 text-xs py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* ── Month grid (always full: 4/5/6 weeks) ── */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {grid.map((dateStr, idx) =>
          dateStr === null ? (
            <div key={`pad-${idx}`} />
          ) : (
            <DayCell
              key={dateStr}
              date={dateStr}
              counts={countByDate[dateStr] ?? { confirmed: 0, pending: 0 }}
              isSelected={isSameDate(dateStr, selectedDate)}
              isToday={isToday(dateStr)}
              isCurrentMonth={new Date(dateStr + 'T00:00:00').getMonth() === viewMonth}
              onClick={() => onSelectDate(dateStr)}
            />
          )
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Confirmadas
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Pendientes
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Sin reservas
        </span>
      </div>
    </div>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────

function NavBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-base font-bold transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

// ── Day cell ──────────────────────────────────────────────────────────────────

interface DayCellProps {
  date: string;
  counts: { confirmed: number; pending: number };
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

function DayCell({ date, counts, isSelected, isToday, isCurrentMonth, onClick }: DayCellProps) {
  const dayNum = getDayNumber(date);
  const total = counts.confirmed + counts.pending;
  const hasPending = counts.pending > 0;
  const hasConfirmed = counts.confirmed > 0;

  let cellClass =
    'relative flex flex-col items-center justify-center rounded-lg py-1.5 sm:py-2 cursor-pointer transition-all duration-150 ';

  if (isSelected) {
    cellClass += 'bg-amber-500 text-slate-900';
  } else if (isToday) {
    cellClass += 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white ring-1 ring-amber-500/60';
  } else if (!isCurrentMonth) {
    cellClass += 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50';
  } else {
    cellClass += 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300';
  }

  const indicatorColor = isSelected
    ? 'bg-slate-900/30 text-white'
    : hasPending
    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';

  return (
    <button onClick={onClick} className={cellClass}>
      <span className="text-xs sm:text-sm font-semibold leading-none">{dayNum}</span>
      <div className="h-3.5 flex items-center justify-center mt-0.5 gap-0.5">
        {total > 0 ? (
          <span
            className={`text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none ${indicatorColor}`}
          >
            {total}
          </span>
        ) : (
          <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-600 block" />
        )}
        {hasConfirmed && hasPending && !isSelected && (
          <span className="w-1 h-1 rounded-full bg-emerald-500 block" />
        )}
      </div>
    </button>
  );
}
