// Bar settings domain types

export type ReservationInterval = 15 | 30 | 60;
export type DefaultReservationStatus = 'confirmed' | 'pending';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface BarSettings {
  // Bar identity
  businessName: string;
  businessPhone: string;

  // Schedule
  openingTime: string;   // "HH:MM" 24h
  closingTime: string;   // "HH:MM" 24h
  reservationInterval: ReservationInterval; // minutes between available slots

  // Reservations
  defaultReservationStatus: DefaultReservationStatus;

  // Capacity
  maxCapacity: number; // total guests at any given time

  // Appearance
  themePreference: ThemePreference;
}

export type UpdateBarSettingsInput = Partial<BarSettings>;
