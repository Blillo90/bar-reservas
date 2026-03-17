'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarSettings, UpdateBarSettingsInput } from '@/types/settings';
import { barSettingsService } from '@/lib/api/settings';

interface UseBarSettingsReturn {
  settings: BarSettings | null;
  isLoading: boolean;
  updateSettings: (input: UpdateBarSettingsInput) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export function useBarSettings(): UseBarSettingsReturn {
  const [settings, setSettings] = useState<BarSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    barSettingsService.get().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = useCallback(async (input: UpdateBarSettingsInput) => {
    const updated = await barSettingsService.update(input);
    setSettings(updated);
  }, []);

  const resetSettings = useCallback(async () => {
    const defaults = await barSettingsService.reset();
    setSettings(defaults);
  }, []);

  return { settings, isLoading, updateSettings, resetSettings };
}
