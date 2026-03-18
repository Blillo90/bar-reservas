import { supabase } from './client';
import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';

// ---------------------------------------------------------------------------
// DB row shape (snake_case from Postgres)
// ---------------------------------------------------------------------------
interface BarSettingsRow {
  id: number;
  business_name: string;
  address: string | null;
  business_phone: string | null;
  email: string | null;
  max_capacity: number;
  max_guests_per_reservation: number;
  opening_time: string;
  closing_time: string;
  reservation_interval: number;
  open_monday: boolean;
  open_tuesday: boolean;
  open_wednesday: boolean;
  open_thursday: boolean;
  open_friday: boolean;
  open_saturday: boolean;
  open_sunday: boolean;
  default_reservation_status: string;
  theme_preference: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------
function toBarSettings(row: BarSettingsRow): BarSettings {
  return {
    id:                        row.id,
    businessName:              row.business_name,
    address:                   row.address ?? undefined,
    businessPhone:             row.business_phone ?? undefined,
    email:                     row.email ?? undefined,
    maxCapacity:               row.max_capacity,
    maxGuestsPerReservation:   row.max_guests_per_reservation,
    openingTime:               row.opening_time.slice(0, 5),
    closingTime:               row.closing_time.slice(0, 5),
    reservationInterval:       row.reservation_interval,
    openMonday:                row.open_monday,
    openTuesday:               row.open_tuesday,
    openWednesday:             row.open_wednesday,
    openThursday:              row.open_thursday,
    openFriday:                row.open_friday,
    openSaturday:              row.open_saturday,
    openSunday:                row.open_sunday,
    defaultReservationStatus:  row.default_reservation_status as BarSettings['defaultReservationStatus'],
    themePreference:           row.theme_preference as BarSettings['themePreference'],
    updatedAt:                 row.updated_at,
  };
}

function toRow(input: UpdateBarSettingsInput): Partial<BarSettingsRow> {
  const row: Partial<BarSettingsRow> = {};
  if (input.businessName              !== undefined) row.business_name              = input.businessName;
  if (input.address                   !== undefined) row.address                   = input.address ?? null;
  if (input.businessPhone             !== undefined) row.business_phone             = input.businessPhone ?? null;
  if (input.email                     !== undefined) row.email                     = input.email ?? null;
  if (input.maxCapacity               !== undefined) row.max_capacity               = input.maxCapacity;
  if (input.maxGuestsPerReservation   !== undefined) row.max_guests_per_reservation = input.maxGuestsPerReservation;
  if (input.openingTime               !== undefined) row.opening_time               = input.openingTime;
  if (input.closingTime               !== undefined) row.closing_time               = input.closingTime;
  if (input.reservationInterval       !== undefined) row.reservation_interval       = input.reservationInterval;
  if (input.openMonday                !== undefined) row.open_monday                = input.openMonday;
  if (input.openTuesday               !== undefined) row.open_tuesday               = input.openTuesday;
  if (input.openWednesday             !== undefined) row.open_wednesday             = input.openWednesday;
  if (input.openThursday              !== undefined) row.open_thursday              = input.openThursday;
  if (input.openFriday                !== undefined) row.open_friday                = input.openFriday;
  if (input.openSaturday              !== undefined) row.open_saturday              = input.openSaturday;
  if (input.openSunday                !== undefined) row.open_sunday                = input.openSunday;
  if (input.defaultReservationStatus  !== undefined) row.default_reservation_status = input.defaultReservationStatus;
  if (input.themePreference           !== undefined) row.theme_preference           = input.themePreference;
  return row;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
export const barSettingsService = {
  async get(): Promise<BarSettings> {
    const { data, error } = await supabase
      .from('bar_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw new Error(error.message);
    return toBarSettings(data);
  },

  async update(input: UpdateBarSettingsInput): Promise<BarSettings> {
    const { data, error } = await supabase
      .from('bar_settings')
      .update(toRow(input))
      .eq('id', 1)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toBarSettings(data);
  },
};
