/**
 * Bar settings service layer.
 *
 * Consumers import `barSettingsService`. To swap backend, change the import below.
 */

import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';
import { barSettingsService as supabaseBarSettingsService } from '@/lib/supabase/settings.service';

export interface IBarSettingsService {
  get(): Promise<BarSettings>;
  update(input: UpdateBarSettingsInput): Promise<BarSettings>;
}

// Active service — Supabase
export const barSettingsService: IBarSettingsService = supabaseBarSettingsService;
