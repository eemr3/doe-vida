import { useState, useEffect } from 'react';
import type { Donor } from '../types';
import { donorsService } from '../services';

export function useDonorById(id: string): { donor: Donor | null; loading: boolean; error: Error | null } {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setDonor(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    donorsService
      .getById(id)
      .then((d) => {
        if (!cancelled) setDonor(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { donor, loading, error };
}