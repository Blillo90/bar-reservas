import { ReservationSummary } from '@/types/reservation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface StatRowProps {
  label: string;
  value: number | string;
  accent?: boolean;
  sub?: string;
  colorClass?: string;
}

function StatRow({ label, value, accent = false, sub, colorClass }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/60 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="text-right">
        <span className={`font-bold text-lg leading-none ${colorClass ?? (accent ? 'text-amber-400' : 'text-white')}`}>
          {value}
        </span>
        {sub && <span className="text-slate-500 text-xs ml-1">{sub}</span>}
      </div>
    </div>
  );
}

interface SummaryPanelProps {
  summary: ReservationSummary;
  dateLabel: string;
}

export function SummaryPanel({ summary, dateLabel }: SummaryPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <h2 className="text-white font-semibold text-sm">Resumen</h2>
          <span className="ml-auto text-slate-500 text-xs">{dateLabel}</span>
        </div>
      </CardHeader>

      <CardBody className="py-1">
        <StatRow label="Total reservas" value={summary.total} accent />
        <StatRow label="Total personas" value={summary.totalGuests} sub="pax" />

        {/* Confirmed block */}
        <StatRow
          label="Confirmadas"
          value={summary.confirmed}
          colorClass="text-emerald-400"
          sub={summary.confirmedGuests > 0 ? `${summary.confirmedGuests} pax` : undefined}
        />

        {/* Pending block */}
        <StatRow
          label="Pendientes"
          value={summary.pending}
          colorClass={summary.pending > 0 ? 'text-amber-400' : 'text-white'}
          sub={summary.pendingGuests > 0 ? `${summary.pendingGuests} pax` : undefined}
        />

        {summary.cancelled > 0 && (
          <StatRow label="Canceladas" value={summary.cancelled} colorClass="text-rose-400" />
        )}
      </CardBody>

      {/* Distribution bar */}
      {summary.total > 0 && (
        <div className="px-5 pb-4">
          <p className="text-slate-500 text-xs mb-2">Distribución</p>
          <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
            {summary.confirmed > 0 && (
              <div
                className="bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(summary.confirmed / summary.total) * 100}%` }}
              />
            )}
            {summary.pending > 0 && (
              <div
                className="bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${(summary.pending / summary.total) * 100}%` }}
              />
            )}
            {summary.cancelled > 0 && (
              <div
                className="bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${(summary.cancelled / summary.total) * 100}%` }}
              />
            )}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Confirmadas
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Pendientes
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
