'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';
import { barSettingsService } from '@/lib/api/settings';

interface UseBarSettingsReturn {
  settings: BarSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (input: UpdateBarSettingsInput) => Promise<void>;
}

export function useBarSettings(): UseBarSettingsReturn {
  const [settings, setSettings] = useState<BarSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    barSettingsService
      .get()
      .then(setSettings)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateSettings = useCallback(async (input: UpdateBarSettingsInput) => {
    const updated = await barSettingsService.update(input);
    setSettings(updated);
  }, []);

  return { settings, isLoading, error, updateSettings };
}
