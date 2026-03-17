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

  // Sort by time, then apply status filter
  const sorted = [...reservations].sort((a, b) => a.time.localeCompare(b.time));
  const visible = statusFilter === 'all'
    ? sorted
    : sorted.filter((r) => r.status === statusFilter);

  const pendingCount = sorted.filter((r) => r.status === 'pending').length;

  const dateLabel = showAll
    ? 'Todas las reservas'
    : `Reservas del ${isToday(selectedDate) ? 'hoy' : formatShortDate(selectedDate)}`;

  return (
    <section>
      {/* Section header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <h2 className="text-white font-semibold">{dateLabel}</h2>
          <span className="text-slate-500 text-sm">({sorted.length})</span>
          {/* Pending alert badge */}
          {pendingCount > 0 && (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <button
          onClick={onToggleView}
          className="ml-auto text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors cursor-pointer"
        >
          {showAll ? 'Ver fecha seleccionada' : 'Ver todas'}
        </button>
      </div>

      {/* Status filter tabs — only show when there are reservations */}
      {sorted.length > 0 && (
        <div className="flex gap-1.5 mb-4">
          <FilterTab active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
            Todas ({sorted.length})
          </FilterTab>
          <FilterTab
            active={statusFilter === 'confirmed'}
            onClick={() => setStatusFilter('confirmed')}
            activeClass="bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
          >
            Confirmadas ({sorted.filter((r) => r.status === 'confirmed').length})
          </FilterTab>
          <FilterTab
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            activeClass="bg-amber-500/15 text-amber-400 border-amber-500/40"
          >
            Pendientes ({pendingCount})
          </FilterTab>
        </div>
      )}

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 bg-slate-800 border border-slate-700 rounded-xl text-center">
          <span className="text-4xl mb-3">🗓</span>
          <p className="text-slate-300 font-medium">Sin reservas</p>
          <p className="text-slate-500 text-sm mt-1">
            {statusFilter !== 'all'
              ? `No hay reservas ${statusFilter === 'confirmed' ? 'confirmadas' : 'pendientes'} para esta vista.`
              : showAll
              ? 'No hay ninguna reserva en el sistema.'
              : 'No hay reservas para esta fecha. Añade una desde el formulario.'}
          </p>
        </div>
      )}

      {/* Cards grid */}
      {visible.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

// ── Filter tab ────────────────────────────────────────────────────────────────

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClass?: string;
}

function FilterTab({ active, onClick, children, activeClass }: FilterTabProps) {
  const defaultActive = 'bg-slate-700 text-white border-slate-500';
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer
        ${active
          ? (activeClass ?? defaultActive)
          : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-300'
        }`}
    >
      {children}
    </button>
  );
}
