'use client';

import { useState } from 'react';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCardDate } from '@/lib/utils/date';

interface ReservationCardProps {
  reservation: Reservation;
  showDate?: boolean;
  onUpdateStatus?: (id: string, status: ReservationStatus) => void;
  onCancel?: (id: string) => void;
}

/**
 * Compact agenda row — single line when collapsed, expands to show
 * secondary info (phone, notes, actions) only when there's something to show.
 *
 * Design targets:
 * - Mobile: one line, no overflow, fast to scan
 * - Desktop: same row, slightly more breathing room
 */
export function ReservationCard({
  reservation,
  showDate = false,
  onUpdateStatus,
  onCancel,
}: ReservationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { id, name, guests, time, date, status, notes, phone } = reservation;
  const isCancelled = status === 'cancelled';

  // Only show the expand affordance when there's secondary content or actions
  const hasSecondary = !!(notes || phone || (!isCancelled && (onUpdateStatus || onCancel)));

  function handleRowClick() {
    if (hasSecondary) setExpanded((v) => !v);
  }

  return (
    <div
      className={`
        group relative border-b border-slate-100 dark:border-slate-700/60
        last:border-b-0 transition-colors
        ${isCancelled ? 'opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}
      `}
    >
      {/* ── Collapsed row (always visible, ONE LINE) ── */}
      {/*
        items-start so that when showDate adds a second sub-line (date),
        the time/dot/guests/badge all stay aligned to the FIRST text line
        (the name) instead of being centred to the combined two-line height.
        For single-line rows the result is visually identical to items-center.
      */}
      <button
        onClick={handleRowClick}
        disabled={!hasSecondary}
        className={`w-full flex items-start gap-2 sm:gap-3 px-4 py-3 text-left ${hasSecondary ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {/* Status accent dot — mt-1 keeps it optically centred on the first text line */}
        <span
          className={`shrink-0 w-2 h-2 rounded-full mt-1 ${
            status === 'confirmed'
              ? 'bg-emerald-500'
              : status === 'pending'
              ? 'bg-amber-500'
              : 'bg-slate-400 dark:bg-slate-500'
          }`}
        />

        {/* Time — fixed width, never truncated */}
        <span className="shrink-0 text-amber-500 dark:text-amber-400 font-bold text-sm w-[42px] tabular-nums">
          {time}
        </span>

        {/* Name — grows and truncates */}
        <span className="flex-1 min-w-0">
          <span className="block text-slate-900 dark:text-white text-sm font-medium truncate leading-none">
            {name}
          </span>
          {/* Optional date — only in "show all" mode, secondary line */}
          {showDate && (
            <span className="block text-slate-400 dark:text-slate-500 text-xs mt-0.5">
              {formatCardDate(date)}
            </span>
          )}
        </span>

        {/* Guest count */}
        <span className="shrink-0 text-slate-400 dark:text-slate-500 text-xs tabular-nums">
          {guests} pax
        </span>

        {/* Status — tiny dot only on mobile to save space, full badge on sm+ */}
        <span className="shrink-0 hidden xs:block sm:block">
          <StatusBadge status={status} size="sm" />
        </span>

        {/* Expand chevron — only when there's secondary content */}
        {hasSecondary && (
          <span
            className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </span>
        )}
      </button>

      {/* ── Expanded section (notes, phone, actions) ── */}
      {expanded && hasSecondary && (
        <div className="px-4 pb-4 pt-0">
          {/* Phone */}
          {phone && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400 dark:text-slate-500">
                <PhoneIcon />
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-sm">{phone}</span>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <p className="text-slate-600 dark:text-slate-400 text-xs bg-slate-100 dark:bg-slate-900/50 rounded-lg px-3 py-2 mb-3">
              {notes}
            </p>
          )}

          {/* Actions */}
          {!isCancelled && (
            <div className="flex items-center gap-2 flex-wrap">
              {status === 'pending' && onUpdateStatus && (
                <ActionBtn
                  onClick={() => { onUpdateStatus(id, 'confirmed'); setExpanded(false); }}
                  colorClass="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                >
                  <CheckIcon /> Confirmar
                </ActionBtn>
              )}
              {status === 'confirmed' && onUpdateStatus && (
                <ActionBtn
                  onClick={() => { onUpdateStatus(id, 'pending'); setExpanded(false); }}
                  colorClass="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                >
                  <ClockIcon /> Pendiente
                </ActionBtn>
              )}
              {onCancel && (
                <ActionBtn
                  onClick={() => onCancel(id)}
                  colorClass="ml-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/30"
                >
                  Cancelar
                </ActionBtn>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ActionBtn({
  onClick,
  colorClass,
  children,
}: {
  onClick: () => void;
  colorClass: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${colorClass}`}
    >
      {children}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}
