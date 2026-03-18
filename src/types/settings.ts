// Bar settings — mirrors the bar_settings table (single-row config)

export type ReservationInterval = 15 | 30 | 60;
export type DefaultReservationStatus = 'confirmed' | 'pending';
export type ThemePreference = 'light' | 'dark';

export interface BarSettings {
  id: number;
  businessName: string;
  address?: string;
  businessPhone?: string;
  email?: string;
  maxCapacity: number;
  maxGuestsPerReservation: number;
  openingTime: string;          // "HH:MM" 24h
  closingTime: string;          // "HH:MM" 24h
  reservationInterval: number;  // minutes between available slots
  openMonday: boolean;
  openTuesday: boolean;
  openWednesday: boolean;
  openThursday: boolean;
  openFriday: boolean;
  openSaturday: boolean;
  openSunday: boolean;
  defaultReservationStatus: DefaultReservationStatus;
  themePreference: ThemePreference;
  updatedAt: string;
}

export type UpdateBarSettingsInput = Partial<Omit<BarSettings, 'id' | 'updatedAt'>>;
