'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks/useReservations';
import { useTheme } from '@/hooks/useTheme';
import { useBarSettings } from '@/hooks/useBarSettings';
import { Header } from './Header';
import { SummaryPanel } from './SummaryPanel';
import { ReservationCalendar } from '@/components/calendar/ReservationCalendar';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { ReservationList } from '@/components/reservations/ReservationList';
import { Modal } from '@/components/ui/Modal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { formatShortDate, isToday } from '@/lib/utils/date';

export function DashboardView() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { settings, updateSettings } = useBarSettings();
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false); // mobile collapsible

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

  async function handleAdd(input: Parameters<typeof addReservation>[0]) {
    await addReservation(input);
    setAddOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header
        selectedDate={selectedDate}
        isDark={isDark}
        businessName={settings?.businessName}
        onToggleTheme={toggleTheme}
        onAddReservation={() => setAddOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 pb-24 sm:pb-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            {/* ── MAIN COLUMN (calendar + list) ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Calendar — always first and visible */}
              <ReservationCalendar
                reservations={allReservations}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
              />

              {/* Stats — mobile only, collapsible, placed BETWEEN calendar and list */}
              <div className="lg:hidden">
                <button
                  onClick={() => setStatsOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    Resumen del día
                    {summary.pending > 0 && (
                      <span className="text-xs bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-semibold">
                        {summary.pending} pendiente{summary.pending > 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                  <ChevronIcon open={statsOpen} />
                </button>

                {statsOpen && (
                  <div className="mt-2 space-y-3">
                    <SummaryPanel
                      summary={summary}
                      dateLabel={summaryDateLabel}
                      maxCapacity={settings?.maxCapacity}
                    />
                  </div>
                )}
              </div>

              {/* Reservation list — second priority */}
              <ReservationList
                reservations={filteredReservations}
                selectedDate={selectedDate}
                showAll={showAll}
                onToggleView={toggleShowAll}
                onUpdateStatus={updateStatus}
                onCancel={cancelReservation}
              />
            </div>

            {/* ── SIDEBAR (desktop only) ── */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4">
              <SummaryPanel
                summary={summary}
                dateLabel={summaryDateLabel}
                maxCapacity={settings?.maxCapacity}
              />
              <AllTimeStats reservations={allReservations} />
            </div>
          </div>
        )}
      </main>

      {/* ── FAB — mobile only ── */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Nueva reserva"
        className="
          lg:hidden fixed bottom-6 right-5 z-40
          w-14 h-14 rounded-full
          bg-amber-500 hover:bg-amber-400
          shadow-xl shadow-amber-500/40
          flex items-center justify-center
          text-slate-900 text-2xl font-bold
          transition-transform active:scale-95 cursor-pointer
        "
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* ── New reservation modal (mobile sheet + desktop dialog) ── */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nueva Reserva">
        <ReservationForm
          defaultDate={selectedDate}
          settings={settings ?? undefined}
          onSubmit={handleAdd}
        />
      </Modal>

      {/* ── Settings modal ── */}
      {settings && (
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={updateSettings}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

// ── Sidebar all-time stats ────────────────────────────────────────────────────

function AllTimeStats({ reservations }: { reservations: { guests: number; status: string }[] }) {
  const active = reservations.filter((r) => r.status !== 'cancelled');
  const confirmed = active.filter((r) => r.status === 'confirmed');
  const pending = active.filter((r) => r.status === 'pending');
  const totalGuests = active.reduce((s, r) => s + r.guests, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Reservas activas" value={active.length} icon="📋" />
      <StatCard label="Personas totales" value={totalGuests} icon="👥" />
      <StatCard label="Confirmadas" value={confirmed.length} icon="✓" color="emerald" />
      <StatCard
        label="Pendientes"
        value={pending.length}
        icon="⏳"
        color={pending.length > 0 ? 'amber' : undefined}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color?: 'emerald' | 'amber';
}) {
  const valueColor =
    color === 'emerald'
      ? 'text-emerald-500 dark:text-emerald-400'
      : color === 'amber'
      ? 'text-amber-500 dark:text-amber-400'
      : 'text-amber-500 dark:text-amber-400';

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
      <span className="text-xl">{icon}</span>
      <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">Cargando reservas…</p>
    </div>
  );
}
