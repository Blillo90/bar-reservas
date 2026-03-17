'use client';

import { useState, useEffect, FormEvent } from 'react';
import { BarSettings, ReservationInterval, DefaultReservationStatus, ThemePreference } from '@/types/settings';
import { Modal } from '@/components/ui/Modal';

// ── Shared input styles (mirrors ReservationForm) ─────────────────────────────

const INPUT_CLASS =
  'w-full min-w-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors';

const SELECT_CLASS = INPUT_CLASS;

// ── Props ─────────────────────────────────────────────────────────────────────

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: BarSettings;
  onSave: (updated: Partial<BarSettings>) => Promise<void>;
  isDark: boolean;
  onToggleTheme: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SettingsModal({
  open,
  onClose,
  settings,
  onSave,
  isDark,
  onToggleTheme,
}: SettingsModalProps) {
  const [form, setForm] = useState<BarSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync form when settings prop changes (e.g. after external reset)
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'reservationInterval' || name === 'maxCapacity'
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Configuración">
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-6">

        {/* ── Datos del bar ──────────────────────────────────────────────── */}
        <Section title="Datos del bar" icon="🏠">
          <Field label="Nombre del bar">
            <input
              name="businessName"
              type="text"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Mi Bar"
              className={INPUT_CLASS}
              autoComplete="off"
            />
          </Field>
          <Field label="Teléfono de contacto">
            <input
              name="businessPhone"
              type="tel"
              value={form.businessPhone}
              onChange={handleChange}
              placeholder="612 345 678"
              className={INPUT_CLASS}
            />
          </Field>
        </Section>

        {/* ── Horario ────────────────────────────────────────────────────── */}
        <Section title="Horario" icon="🕐">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Apertura">
              <input
                name="openingTime"
                type="time"
                value={form.openingTime}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Cierre">
              <input
                name="closingTime"
                type="time"
                value={form.closingTime}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Intervalo entre reservas">
            <select
              name="reservationInterval"
              value={form.reservationInterval}
              onChange={handleChange}
              className={SELECT_CLASS}
            >
              {([15, 30, 60] as ReservationInterval[]).map((v) => (
                <option key={v} value={v}>
                  {v} minutos
                </option>
              ))}
            </select>
          </Field>
        </Section>

        {/* ── Reservas ───────────────────────────────────────────────────── */}
        <Section title="Reservas" icon="📋">
          <Field label="Estado por defecto de nuevas reservas">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: 'confirmed', label: 'Confirmada', dot: 'bg-emerald-500', active: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
                  { value: 'pending',   label: 'Pendiente',  dot: 'bg-amber-500',   active: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
                ] as { value: DefaultReservationStatus; label: string; dot: string; active: string }[]
              ).map(({ value, label, dot, active }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, defaultReservationStatus: value }))}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    form.defaultReservationStatus === value
                      ? active
                      : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${dot} inline-block`} />
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* ── Capacidad ──────────────────────────────────────────────────── */}
        <Section title="Capacidad" icon="👥">
          <Field label="Capacidad máxima del local (personas)">
            <input
              name="maxCapacity"
              type="number"
              min={1}
              max={9999}
              value={form.maxCapacity}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </Field>
          <p className="text-xs text-slate-400 dark:text-slate-500 -mt-1">
            Se mostrará un aviso cuando el total de personas de un día supere este valor.
          </p>
        </Section>

        {/* ── Apariencia ─────────────────────────────────────────────────── */}
        <Section title="Apariencia" icon="🎨">
          <Field label="Modo de color">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
              </span>
              <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />
            </div>
          </Field>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="pt-2 flex flex-col gap-2">
          {saved && (
            <p className="text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-3 py-2 text-center">
              ✓ Configuración guardada
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>

      </form>
    </Modal>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-700/60">
        <span className="text-base leading-none">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function ThemeToggleButton({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer bg-slate-200 dark:bg-amber-500"
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
