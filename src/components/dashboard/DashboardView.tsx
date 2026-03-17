'use client';

import { useReservations } from '@/hooks/useReservations';
import { Header } from './Header';
import { SummaryPanel } from './SummaryPanel';
import { ReservationCalendar } from '@/components/calendar/ReservationCalendar';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { ReservationList } from '@/components/reservations/ReservationList';
import { formatShortDate, isToday } from '@/lib/utils/date';

export function DashboardView() {
  const {
    allReservations,
    filteredReservations,
    summary,
    selectedDate,
    showAll,
    isLoading,
    selectDate,
    toggleShowAll,
    addReservation,
    updateStatus,
    cancelReservation,
  } = useReservations();

  const summaryDateLabel = showAll
    ? 'Todas'
    : isToday(selectedDate)
    ? 'Hoy'
    : formatShortDate(selectedDate);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header selectedDate={selectedDate} />

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── LEFT COLUMN (2/3) ── */}
            <div className="lg:col-span-2 space-y-6">
              <ReservationCalendar
                reservations={allReservations}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
              />

              <ReservationList
                reservations={filteredReservations}
                selectedDate={selectedDate}
                showAll={showAll}
                onToggleView={toggleShowAll}
                onUpdateStatus={updateStatus}
                onCancel={cancelReservation}
              />
            </div>

            {/* ── RIGHT COLUMN (1/3) ── */}
            <div className="space-y-6">
              <SummaryPanel summary={summary} dateLabel={summaryDateLabel} />

              <AllTimeStats reservations={allReservations} />

              <ReservationForm
                defaultDate={selectedDate}
                onSubmit={addReservation}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AllTimeStats({ reservations }: { reservations: { guests: number; status: string }[] }) {
  const active = reservations.filter((r) => r.status !== 'cancelled');
  const confirmed = active.filter((r) => r.status === 'confirmed');
  const pending = active.filter((r) => r.status === 'pending');
  const totalGuests = active.reduce((s, r) => s + r.guests, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Reservas activas" value={active.length} icon="📋" />
      <StatCard label="Personas totales" value={totalGuests} icon="👥" />
      <StatCard label="Confirmadas" value={confirmed.length} icon="✓" accent="emerald" />
      <StatCard label="Pendientes" value={pending.length} icon="⏳" accent={pending.length > 0 ? 'amber' : undefined} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: string;
  accent?: 'emerald' | 'amber';
}) {
  const valueColor = accent === 'emerald'
    ? 'text-emerald-400'
    : accent === 'amber'
    ? 'text-amber-400'
    : 'text-amber-400';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
      <span className="text-xl">{icon}</span>
      <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      <p className="text-slate-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Cargando reservas…</p>
    </div>
  );
}
