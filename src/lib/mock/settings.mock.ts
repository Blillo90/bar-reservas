/**
 * Mock settings repository backed by localStorage.
 * No longer the active service — kept for fallback/testing purposes.
 * Active service: src/lib/supabase/settings.service.ts
 */

import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';

const STORAGE_KEY = 'bar-settings';

const DEFAULT_SETTINGS: BarSettings = {
  id: 1,
  businessName: 'Bar Reservas',
  businessPhone: '',
  address: undefined,
  email: undefined,
  openingTime: '13:00',
  closingTime: '23:30',
  reservationInterval: 30,
  maxCapacity: 60,
  maxGuestsPerReservation: 20,
  openMonday: true,
  openTuesday: true,
  openWednesday: true,
  openThursday: true,
  openFriday: true,
  openSaturday: true,
  openSunday: false,
  defaultReservationStatus: 'confirmed',
  themePreference: 'dark',
  updatedAt: new Date().toISOString(),
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
    const updated: BarSettings = { ...current, ...input, updatedAt: new Date().toISOString() };
    save(updated);
    return updated;
  },
};
