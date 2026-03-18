import { Reservation, CreateReservationInput, UpdateReservationInput } from '@/types/reservation';

// Dates relative to today for a realistic demo
const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
};

const d0 = fmt(today);
const d1 = fmt(addDays(today, 1));
const d2 = fmt(addDays(today, 2));
const d3 = fmt(addDays(today, 3));
const now = new Date().toISOString();

// Module-level mutable array — replaced by a real repository in production
let _reservations: Reservation[] = [
  {
    id: '1', reservationCode: 'RES-2024-A001', source: 'manual',
    name: 'Mesa García', guests: 4, time: '20:00', date: d0,
    status: 'confirmed', phone: '612 345 678', notes: 'Cumpleaños, pedir tarta',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
  {
    id: '2', reservationCode: 'RES-2024-A002', source: 'manual',
    name: 'Grupo Martínez', guests: 8, time: '21:30', date: d0,
    status: 'confirmed', phone: '699 112 233',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
  {
    id: '3', reservationCode: 'RES-2024-A003', source: 'whatsapp',
    name: 'López & Rodríguez', guests: 2, time: '22:00', date: d0,
    status: 'pending', notes: 'Confirmar antes de las 18h',
    createdAt: now, updatedAt: now,
  },
  {
    id: '4', reservationCode: 'RES-2024-A004', source: 'manual',
    name: 'Cena Empresa ABC', guests: 12, time: '20:30', date: d1,
    status: 'confirmed', phone: '911 000 111', notes: 'Sala privada si está disponible',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
  {
    id: '5', reservationCode: 'RES-2024-A005', source: 'instagram',
    name: 'Aniversario Ruiz', guests: 2, time: '21:00', date: d1,
    status: 'confirmed', phone: '634 567 890',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
  {
    id: '6', reservationCode: 'RES-2024-A006', source: 'whatsapp',
    name: 'Santos - Despedida', guests: 6, time: '21:00', date: d2,
    status: 'pending', phone: '677 890 123', notes: 'Decoración especial solicitada',
    createdAt: now, updatedAt: now,
  },
  {
    id: '7', reservationCode: 'RES-2024-A007', source: 'web',
    name: 'Grupo Universitario', guests: 10, time: '22:30', date: d2,
    status: 'confirmed',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
  {
    id: '8', reservationCode: 'RES-2024-A008', source: 'manual',
    name: 'Reserva Pérez', guests: 4, time: '20:00', date: d3,
    status: 'confirmed', phone: '655 321 987',
    createdAt: now, updatedAt: now, confirmedAt: now,
  },
];

// Simple in-memory CRUD — mirrors the shape of a real async repository

export const mockReservationService = {
  async getAll(): Promise<Reservation[]> {
    return [..._reservations];
  },

  async getByDate(date: string): Promise<Reservation[]> {
    return _reservations.filter((r) => r.date === date);
  },

  async getById(id: string): Promise<Reservation | null> {
    return _reservations.find((r) => r.id === id) ?? null;
  },

  async create(input: CreateReservationInput): Promise<Reservation> {
    const status = input.status ?? 'pending';
    const ts = new Date().toISOString();
    const reservation: Reservation = {
      ...input,
      id: String(Date.now()),
      reservationCode: `RES-MOCK-${Date.now()}`,
      status,
      source: input.source ?? 'manual',
      createdAt: ts,
      updatedAt: ts,
      confirmedAt: status === 'confirmed' ? ts : null,
    };
    _reservations = [..._reservations, reservation];
    return reservation;
  },

  async update(id: string, updates: UpdateReservationInput): Promise<Reservation> {
    const index = _reservations.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Reservation ${id} not found`);
    const ts = new Date().toISOString();
    const updated: Reservation = {
      ..._reservations[index],
      ...updates,
      updatedAt: ts,
      ...(updates.status === 'confirmed' && { confirmedAt: ts }),
      ...(updates.status === 'cancelled' && { cancelledAt: ts }),
    };
    _reservations = _reservations.map((r) => (r.id === id ? updated : r));
    return updated;
  },

  async cancel(id: string): Promise<Reservation> {
    return mockReservationService.update(id, { status: 'cancelled' });
  },

  async remove(id: string): Promise<void> {
    _reservations = _reservations.filter((r) => r.id !== id);
  },
};
