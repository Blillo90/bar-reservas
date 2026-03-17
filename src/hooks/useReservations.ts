'use client';

import { useState, useEffect, useCallback } from 'react';
import { Reservation, CreateReservationInput, ReservationStatus, ReservationSummary } from '@/types/reservation';
import { reservationService } from '@/lib/api/reservations';
import { todayString } from '@/lib/utils/date';

interface UseReservationsReturn {
  // Data
  allReservations: Reservation[];
  filteredReservations: Reservation[];
  summary: ReservationSummary;
  selectedDate: string;
  showAll: boolean;
  isLoading: boolean;

  // Actions
  selectDate: (date: string) => void;
  toggleShowAll: () => void;
  addReservation: (input: CreateReservationInput) => Promise<void>;
  updateStatus: (id: string, status: ReservationStatus) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
}

function computeSummary(reservations: Reservation[]): ReservationSummary {
  return reservations.reduce(
    (acc, r) => ({
      total: acc.total + 1,
      totalGuests: acc.totalGuests + r.guests,
      confirmed: acc.confirmed + (r.status === 'confirmed' ? 1 : 0),
      confirmedGuests: acc.confirmedGuests + (r.status === 'confirmed' ? r.guests : 0),
      pending: acc.pending + (r.status === 'pending' ? 1 : 0),
      pendingGuests: acc.pendingGuests + (r.status === 'pending' ? r.guests : 0),
      cancelled: acc.cancelled + (r.status === 'cancelled' ? 1 : 0),
    }),
    { total: 0, totalGuests: 0, confirmed: 0, confirmedGuests: 0, pending: 0, pendingGuests: 0, cancelled: 0 }
  );
}

export function useReservations(): UseReservationsReturn {
  const [allReservations, setAll] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    reservationService.getAll().then((data) => {
      setAll(data);
      setIsLoading(false);
    });
  }, []);

  // Filtered view: either all or by selected date (exclude cancelled from default view)
  const filteredReservations = showAll
    ? allReservations.filter((r) => r.status !== 'cancelled')
    : allReservations.filter((r) => r.date === selectedDate && r.status !== 'cancelled');

  // Summary computed from filtered view
  const summary = computeSummary(filteredReservations);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setShowAll(false);
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const addReservation = useCallback(async (input: CreateReservationInput) => {
    const created = await reservationService.create(input);
    setAll((prev) => [...prev, created]);
    setSelectedDate(input.date);
    setShowAll(false);
  }, []);

  const updateStatus = useCallback(async (id: string, status: ReservationStatus) => {
    const updated = await reservationService.update(id, { status });
    setAll((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  const cancelReservation = useCallback(async (id: string) => {
    const updated = await reservationService.cancel(id);
    setAll((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  return {
    allReservations,
    filteredReservations,
    summary,
    selectedDate,
    showAll,
    isLoading,
    selectDate,
    toggleShowAll,
    addReservation,
    updateStatus,
    cancelReservation,
  };
}
