/**
 * Mock settings repository backed by localStorage.
 *
 * Drop-in replacement path:
 *   import { supabaseSettingsService } from './supabase-settings';
 *   export const barSettingsService = supabaseSettingsService;
 *
 * The interface IBarSettingsService in src/lib/api/settings.ts defines the
 * contract — swap the implementation without touching any consumer.
 */

import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';

const STORAGE_KEY = 'bar-settings';

const DEFAULT_SETTINGS: BarSettings = {
  businessName: 'Bar Reservas',
  businessPhone: '',
  openingTime: '13:00',
  closingTime: '23:30',
  reservationInterval: 30,
  defaultReservationStatus: 'confirmed',
  maxCapacity: 60,
  themePreference: 'system',
};

function load(): BarSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function save(settings: BarSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch { /* ignore quota errors */ }
}

export const mockBarSettingsService = {
  async get(): Promise<BarSettings> {
    return load();
  },

  async update(input: UpdateBarSettingsInput): Promise<BarSettings> {
    const current = load();
    const updated: BarSettings = { ...current, ...input };
    save(updated);
    return updated;
  },

  async reset(): Promise<BarSettings> {
    save({ ...DEFAULT_SETTINGS });
    return { ...DEFAULT_SETTINGS };
  },
};
