-- =============================================================================
-- Bar Reservas — Supabase SQL Schema
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to run on a fresh project; use migrations for existing databases.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

-- pgcrypto: used for gen_random_uuid() (available by default on Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

CREATE TYPE reservation_status AS ENUM ('confirmed', 'pending', 'cancelled');

CREATE TYPE reservation_source AS ENUM ('manual', 'web', 'instagram', 'whatsapp');


-- ---------------------------------------------------------------------------
-- Trigger helper: auto-update updated_at on every UPDATE
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- =============================================================================
-- TABLE: reservations
-- =============================================================================

CREATE TABLE reservations (
  -- ── Identity ──────────────────────────────────────────────────────────────
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Unique human-readable code for confirmation links / customer lookups
  -- e.g. "RES-2024-A3F7"
  reservation_code  TEXT          NOT NULL UNIQUE,

  -- ── Guest info (existing fields, unchanged names) ─────────────────────────
  name              TEXT          NOT NULL,
  phone             TEXT,
  guests            SMALLINT      NOT NULL CHECK (guests > 0),
  notes             TEXT,

  -- ── Scheduling (existing fields, unchanged names) ─────────────────────────
  -- Stored as separate DATE + TIME so queries by date are simple and indexed.
  -- The frontend already sends "YYYY-MM-DD" and "HH:MM" strings — these map 1:1.
  date              DATE          NOT NULL,
  time              TIME          NOT NULL,

  -- ── Status & lifecycle ────────────────────────────────────────────────────
  status            reservation_status  NOT NULL DEFAULT 'pending',

  -- New: origin of the reservation
  source            reservation_source  NOT NULL DEFAULT 'manual',

  -- ── Timestamps ────────────────────────────────────────────────────────────
  -- created_at maps to the existing `createdAt` field (camelCase in TS).
  -- Column name uses snake_case (Supabase convention); the service layer
  -- will handle the mapping.
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),

  -- Set when status transitions to 'confirmed' / 'cancelled'.
  -- NULL until that event occurs.
  confirmed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ
);

-- ── Trigger: keep updated_at current ──────────────────────────────────────
CREATE TRIGGER reservations_set_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────────────────

-- Most common query: fetch reservations for a given day
CREATE INDEX idx_reservations_date
  ON reservations (date);

-- Dashboard: fetch + sort by date and time together
CREATE INDEX idx_reservations_date_time
  ON reservations (date, time);

-- Status filters (confirmed / pending / cancelled views)
CREATE INDEX idx_reservations_status
  ON reservations (status);

-- Phone lookup (duplicate check, customer search)
CREATE INDEX idx_reservations_phone
  ON reservations (phone)
  WHERE phone IS NOT NULL;

-- Confirmation link lookup (expected to be rare but must be instant)
-- UNIQUE already creates an index; this entry is just for documentation.
-- No need to add a separate one.


-- =============================================================================
-- TABLE: bar_settings
-- =============================================================================
-- Single-row configuration table.
-- Enforced by the CHECK constraint and the seed row below.
-- The app always reads/writes the row with id = 1.

CREATE TABLE bar_settings (
  -- ── Identity ──────────────────────────────────────────────────────────────
  id                SMALLINT      PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  -- ── Bar identity ──────────────────────────────────────────────────────────
  business_name     TEXT          NOT NULL DEFAULT 'Mi Bar',
  address           TEXT,
  business_phone    TEXT,
  email             TEXT,

  -- ── Capacity ──────────────────────────────────────────────────────────────
  max_capacity      SMALLINT      NOT NULL DEFAULT 50  CHECK (max_capacity > 0),
  max_guests_per_reservation
                    SMALLINT      NOT NULL DEFAULT 20  CHECK (max_guests_per_reservation > 0),

  -- ── Operating hours ───────────────────────────────────────────────────────
  -- Stored as TIME so the app can do arithmetic without string parsing.
  opening_time      TIME          NOT NULL DEFAULT '13:00',
  closing_time      TIME          NOT NULL DEFAULT '23:30',

  -- ── Slot configuration ────────────────────────────────────────────────────
  -- Interval between available booking slots, in minutes (e.g. 30 = every half hour)
  reservation_interval
                    SMALLINT      NOT NULL DEFAULT 30  CHECK (reservation_interval > 0),

  -- ── Operating days ────────────────────────────────────────────────────────
  -- Boolean flags per weekday (ISO: Monday = index 0)
  open_monday       BOOLEAN       NOT NULL DEFAULT true,
  open_tuesday      BOOLEAN       NOT NULL DEFAULT true,
  open_wednesday    BOOLEAN       NOT NULL DEFAULT true,
  open_thursday     BOOLEAN       NOT NULL DEFAULT true,
  open_friday       BOOLEAN       NOT NULL DEFAULT true,
  open_saturday     BOOLEAN       NOT NULL DEFAULT true,
  open_sunday       BOOLEAN       NOT NULL DEFAULT false,

  -- ── Reservation defaults ──────────────────────────────────────────────────
  default_reservation_status
                    TEXT          NOT NULL DEFAULT 'pending',
  theme_preference  TEXT          NOT NULL DEFAULT 'light',

  -- ── Timestamps ────────────────────────────────────────────────────────────
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── Trigger: keep updated_at current ──────────────────────────────────────
CREATE TRIGGER bar_settings_set_updated_at
  BEFORE UPDATE ON bar_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ── Seed: ensure the single settings row always exists ────────────────────
INSERT INTO bar_settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Enable RLS on both tables so that only authenticated requests (service role
-- or authenticated users) can read/write data. Public anon access is blocked
-- until policies are explicitly added.

ALTER TABLE reservations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_settings  ENABLE ROW LEVEL SECURITY;

-- ── Policy: service role bypasses RLS (Supabase default behaviour) ──────────
-- The backend (Node/Express) will use the service_role key and is therefore
-- not restricted by these policies. This is intentional.

-- ── Optional: allow authenticated users full access (uncomment if needed) ───
-- CREATE POLICY "authenticated_full_access" ON reservations
--   FOR ALL TO authenticated USING (true) WITH CHECK (true);
--
-- CREATE POLICY "authenticated_full_access" ON bar_settings
--   FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =============================================================================
-- COMMENTS (documentation inside the DB)
-- =============================================================================

COMMENT ON TABLE  reservations                   IS 'Bar table reservations made through any channel.';
COMMENT ON COLUMN reservations.reservation_code  IS 'Short unique code for confirmation URLs. Format: RES-YYYY-XXXX.';
COMMENT ON COLUMN reservations.source            IS 'Channel through which the reservation was made.';
COMMENT ON COLUMN reservations.confirmed_at      IS 'Timestamp set when status changes to confirmed. NULL until then.';
COMMENT ON COLUMN reservations.cancelled_at      IS 'Timestamp set when status changes to cancelled. NULL until then.';
COMMENT ON COLUMN reservations.date              IS 'Reservation date. Stored as DATE; matches YYYY-MM-DD string from frontend.';
COMMENT ON COLUMN reservations.time              IS 'Reservation time. Stored as TIME; matches HH:MM string from frontend.';

COMMENT ON TABLE  bar_settings                        IS 'Single-row table with bar configuration. Always use id = 1.';
COMMENT ON COLUMN bar_settings.reservation_interval   IS 'Interval in minutes between bookable time slots.';
COMMENT ON COLUMN bar_settings.default_reservation_status IS 'Default status assigned to new reservations (pending or confirmed).';
COMMENT ON COLUMN bar_settings.theme_preference       IS 'UI theme preference: light or dark.';
