/**
 * Bar settings service layer.
 *
 * Consumers import `barSettingsService`. To migrate to a real backend
 * (Supabase, REST API, etc.) replace only the import below:
 *
 *   import { supabaseBarSettingsService } from './supabase-settings';
 *   export const barSettingsService = supabaseBarSettingsService;
 */

import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';
import { mockBarSettingsService } from '@/lib/mock/settings.mock';

export interface IBarSettingsService {
  get(): Promise<BarSettings>;
  update(input: UpdateBarSettingsInput): Promise<BarSettings>;
  reset(): Promise<BarSettings>;
}

// Active service — replace this line to switch backend
export const barSettingsService: IBarSettingsService = mockBarSettingsService;
