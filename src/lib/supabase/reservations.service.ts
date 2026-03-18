import { supabase } from './client';
import {
  Reservation,
  CreateReservationInput,
  UpdateReservationInput,
  ReservationStatus,
} from '@/types/reservation';
import type { IReservationService } from '@/lib/api/reservations';

// ---------------------------------------------------------------------------
// DB row shape (snake_case from Postgres)
// ---------------------------------------------------------------------------
interface ReservationRow {
  id: string;
  reservation_code: string;
  name: string;
  phone: string | null;
  guests: number;
  notes: string | null;
  date: string;        // "YYYY-MM-DD"
  time: string;        // "HH:MM:SS" — trimmed to "HH:MM" on mapping
  status: ReservationStatus;
  source: string;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------
function toReservation(row: ReservationRow): Reservation {
  return {
    id:              row.id,
    reservationCode: row.reservation_code,
    name:            row.name,
    phone:           row.phone ?? undefined,
    guests:          row.guests,
    notes:           row.notes ?? undefined,
    date:            row.date,
    time:            row.time.slice(0, 5),   // "HH:MM:SS" → "HH:MM"
    status:          row.status,
    source:          row.source as Reservation['source'],
    createdAt:       row.created_at,
    updatedAt:       row.updated_at,
    confirmedAt:     row.confirmed_at,
    cancelledAt:     row.cancelled_at,
  };
}

function generateReservationCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-${year}-${rand}`;
}

function throwOnError<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('No data returned');
  return data;
}

// ---------------------------------------------------------------------------
// Lifecycle timestamp helpers: set confirmed_at / cancelled_at automatically
// ---------------------------------------------------------------------------
function lifecycleTimestamps(status?: ReservationStatus): Record<string, string | null> {
  if (status === 'confirmed') return { confirmed_at: new Date().toISOString() };
  if (status === 'cancelled') return { cancelled_at: new Date().toISOString() };
  return {};
}

// ---------------------------------------------------------------------------
// Supabase implementation of IReservationService
// ---------------------------------------------------------------------------
export const supabaseReservationService: IReservationService = {
  async getAll(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    return throwOnError(data, error).map(toReservation);
  },

  async getByDate(date: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });

    return throwOnError(data, error).map(toReservation);
  },

  async getById(id: string): Promise<Reservation | null> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? toReservation(data) : null;
  },

  async create(input: CreateReservationInput): Promise<Reservation> {
    const status = input.status ?? 'pending';
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        reservation_code: generateReservationCode(),
        name:             input.name,
        phone:            input.phone ?? null,
        guests:           input.guests,
        notes:            input.notes ?? null,
        date:             input.date,
        time:             input.time,
        status,
        source:           input.source ?? 'manual',
        ...lifecycleTimestamps(status),
      })
      .select()
      .single();

    return toReservation(throwOnError(data, error));
  },

  async update(id: string, updates: UpdateReservationInput): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .update({
        ...(updates.name     !== undefined && { name:   updates.name }),
        ...(updates.phone    !== undefined && { phone:  updates.phone }),
        ...(updates.guests   !== undefined && { guests: updates.guests }),
        ...(updates.notes    !== undefined && { notes:  updates.notes }),
        ...(updates.date     !== undefined && { date:   updates.date }),
        ...(updates.time     !== undefined && { time:   updates.time }),
        ...(updates.status   !== undefined && { status: updates.status }),
        ...(updates.source   !== undefined && { source: updates.source }),
        ...lifecycleTimestamps(updates.status),
      })
      .eq('id', id)
      .select()
      .single();

    return toReservation(throwOnError(data, error));
  },

  async cancel(id: string): Promise<Reservation> {
    return supabaseReservationService.update(id, { status: 'cancelled' });
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
