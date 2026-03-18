// Core domain types — update here to evolve the data model everywhere

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export type ReservationSource = 'manual' | 'web' | 'instagram' | 'whatsapp';

export interface Reservation {
  id: string;
  reservationCode: string;
  name: string;
  guests: number;
  time: string;        // "HH:MM" 24h format
  date: string;        // "YYYY-MM-DD"
  status: ReservationStatus;
  source: ReservationSource;
  notes?: string;
  phone?: string;
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  confirmedAt?: string | null;
  cancelledAt?: string | null;
}

export type CreateReservationInput = {
  name: string;
  guests: number;
  time: string;
  date: string;
  status?: ReservationStatus;
  source?: ReservationSource;
  notes?: string;
  phone?: string;
};

export type UpdateReservationInput = Partial<CreateReservationInput>;

export interface ReservationSummary {
  total: number;
  totalGuests: number;
  confirmed: number;
  confirmedGuests: number;
  pending: number;
  pendingGuests: number;
  cancelled: number;
}
