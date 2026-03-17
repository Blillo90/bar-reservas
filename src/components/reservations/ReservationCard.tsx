'use client';

import { Reservation, ReservationStatus } from '@/types/reservation';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCardDate } from '@/lib/utils/date';

interface ReservationCardProps {
  reservation: Reservation;
  showDate?: boolean;
  onUpdateStatus?: (id: string, status: ReservationStatus) => void;
  onCancel?: (id: string) => void;
}

export function ReservationCard({
  reservation,
  showDate = false,
  onUpdateStatus,
  onCancel,
}: ReservationCardProps) {
  const { id, name, guests, time, date, status, notes, phone } = reservation;
  const isCancelled = status === 'cancelled';

  return (
    <div
      className={`
        relative bg-slate-800 border rounded-xl p-4 transition-all duration-200
        ${isCancelled
          ? 'border-slate-700 opacity-60'
          : 'border-slate-700 hover:border-slate-500 hover:shadow-lg hover:shadow-black/20'
        }
      `}
    >
      {/* Status accent stripe */}
      <div
        className={`
          absolute left-0 top-4 bottom-4 w-1 rounded-r-full
          ${status === 'confirmed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-slate-600'}
        `}
      />

      <div className="pl-3">
        {/* Top row: name + badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-white font-semibold leading-tight truncate">{name}</h3>
            {phone && <p className="text-slate-500 text-xs mt-0.5">{phone}</p>}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Stats row: time + guests + optional date */}
        {/* flex-wrap prevents overlap on narrow mobile screens */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <ClockIcon />
            <span className="text-amber-400 font-bold text-base leading-none">{time}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <PeopleIcon />
            <span className="text-slate-300 text-sm font-medium">{guests} pax</span>
          </div>

          {showDate && (
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <span className="text-slate-400 text-xs">{formatCardDate(date)}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {notes && (
          <p className="text-slate-500 text-xs bg-slate-900/50 rounded-lg px-3 py-2 mb-3">
            {notes}
          </p>
        )}

        {/* Actions */}
        {!isCancelled && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick status toggle */}
            {status === 'pending' && onUpdateStatus && (
              <button
                onClick={() => onUpdateStatus(id, 'confirmed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
              >
                <CheckIcon />
                Confirmar
              </button>
            )}
            {status === 'confirmed' && onUpdateStatus && (
              <button
                onClick={() => onUpdateStatus(id, 'pending')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer"
              >
                <ClockSmallIcon />
                Pendiente
              </button>
            )}

            {/* Cancel — pushed to end */}
            {onCancel && (
              <button
                onClick={() => onCancel(id)}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockSmallIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" strokeWidth="2" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
