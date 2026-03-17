import { useState } from 'react';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { ReservationCard } from './ReservationCard';
import { formatShortDate, isToday } from '@/lib/utils/date';

type StatusFilter = 'all' | 'confirmed' | 'pending';

interface ReservationListProps {
  reservations: Reservation[];
  selectedDate: string;
  showAll: boolean;
  onToggleView: () => void;
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
  onCancel: (id: string) => void;
}

export function ReservationList({
  reservations,
  selectedDate,
  showAll,
  onToggleView,
  onUpdateStatus,
  onCancel,
}: ReservationListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const sorted = [...reservations].sort((a, b) => a.time.localeCompare(b.time));
  const visible =
    statusFilter === 'all' ? sorted : sorted.filter((r) => r.status === statusFilter);

  const pendingCount = sorted.filter((r) => r.status === 'pending').length;
  const confirmedCount = sorted.filter((r) => r.status === 'confirmed').length;

  const dateLabel = showAll
    ? 'Todas las reservas'
    : `Reservas — ${isToday(selectedDate) ? 'hoy' : formatShortDate(selectedDate)}`;

  return (
    <section>
      {/* ── Section header ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <h2 className="text-slate-900 dark:text-white font-semibold text-sm truncate">{dateLabel}</h2>
          <span className="text-slate-400 dark:text-slate-500 text-xs shrink-0">({sorted.length})</span>
          {pendingCount > 0 && (
            <span className="shrink-0 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={onToggleView}
          className="ml-auto text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          {showAll ? 'Ver fecha seleccionada' : 'Ver todas'}
        </button>
      </div>

      {/* ── Status filter tabs ── */}
      {sorted.length > 0 && (
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 scrollbar-none">
          <FilterTab active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
            Todas <TabCount n={sorted.length} />
          </FilterTab>
          <FilterTab
            active={statusFilter === 'confirmed'}
            onClick={() => setStatusFilter('confirmed')}
            activeClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
          >
            Confirmadas <TabCount n={confirmedCount} />
          </FilterTab>
          <FilterTab
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            activeClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
          >
            Pendientes <TabCount n={pendingCount} />
          </FilterTab>
        </div>
      )}

      {/* ── Empty state ── */}
      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <span className="text-3xl mb-2">🗓</span>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">Sin reservas</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-xs">
            {statusFilter !== 'all'
              ? `No hay reservas ${statusFilter === 'confirmed' ? 'confirmadas' : 'pendientes'}.`
              : showAll
              ? 'No hay ninguna reserva en el sistema.'
              : 'Sin reservas para esta fecha. Usa el botón + para añadir una.'}
          </p>
        </div>
      )}

      {/* ── Agenda list ── */}
      {visible.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
          {visible.map((r) => (
            <ReservationCard
              key={r.id}
              reservation={r}
              showDate={showAll}
              onUpdateStatus={onUpdateStatus}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function TabCount({ n }: { n: number }) {
  return <span className="ml-1 opacity-70">{n}</span>;
}

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClass?: string;
}

function FilterTab({ active, onClick, children, activeClass }: FilterTabProps) {
  const defaultActive = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white border-transparent';
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap
        ${active
          ? (activeClass ?? defaultActive)
          : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
    >
      {children}
    </button>
  );
}
