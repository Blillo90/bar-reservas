-- =============================================================================
-- RLS Policies — Temporary permissive access (no auth yet)
-- =============================================================================
-- TODO: Replace with proper auth-based policies when authentication is added.
-- For now this is an internal admin dashboard with no public exposure.
-- =============================================================================

-- reservations: allow full access to anon role
CREATE POLICY "anon_full_access" ON reservations
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- bar_settings: allow full access to anon role
CREATE POLICY "anon_full_access" ON bar_settings
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);
