import { useState, useEffect, useMemo } from 'react';
import { donorsService } from '../services';
import type { Donor } from '../types';

export interface UseDonorsFilters {
  search?: string;
  city?: string;
  bloodType?: string;
  eligibility?: 'eligible' | 'ineligible' | '';
}

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

export function useDonors(initialFilters: UseDonorsFilters = {}) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    initialFilters.search ?? '',
  );
  const [filterCity, setFilterCity] = useState(initialFilters.city ?? '');
  const [filterBloodType, setFilterBloodType] = useState(initialFilters.bloodType ?? '');
  const [filterEligibility, setFilterEligibility] = useState<
    'eligible' | 'ineligible' | ''
  >(initialFilters.eligibility ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    donorsService
      .list({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        city: filterCity || undefined,
        bloodType: filterBloodType || undefined,
        eligible:
          filterEligibility === 'eligible'
            ? true
            : filterEligibility === 'ineligible'
              ? false
              : undefined,
        search: debouncedSearchTerm.trim() || undefined,
      })
      .then(({ items, totalCount: total }) => {
        if (!cancelled) {
          setDonors(items);
          setTotalCount(total);
        }
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
  }, [currentPage, filterCity, filterBloodType, filterEligibility, debouncedSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const paginatedDonors = donors; // API já retorna página filtrada por search + outros filtros

  const cities = useMemo(() => {
    const unique = Array.from(new Set(donors.map((d) => d.city).filter(Boolean))).sort();
    return [
      { value: '', label: 'Todas as cidades' },
      ...unique.map((c) => ({ value: c, label: c })),
    ];
  }, [donors]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCity('');
    setFilterBloodType('');
    setFilterEligibility('');
    setCurrentPage(1);
  };

  return {
    donors,
    paginatedDonors,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filterCity,
    setFilterCity,
    filterBloodType,
    setFilterBloodType,
    filterEligibility,
    setFilterEligibility,
    itemsPerPage: ITEMS_PER_PAGE,
    cities,
    clearFilters,
    loading,
    error,
    totalCount,
  };
}
