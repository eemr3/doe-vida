import { useState, useEffect } from 'react';
import { usersService } from '../services';
import type { UserListItem } from '../types';

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 350;

export interface UseUsersFilters {
  search?: string;
  role?: string;
  status?: string;
}

export function useUsers(initialFilters: UseUsersFilters = {}) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialFilters.search ?? '');
  const [filterRole, setFilterRole] = useState(initialFilters.role ?? '');
  const [filterStatus, setFilterStatus] = useState(initialFilters.status ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    usersService
      .list({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: debouncedSearchTerm.trim() || undefined,
        role: filterRole || undefined,
        status: filterStatus || undefined,
      })
      .then(({ items, totalCount: total }) => {
        if (!cancelled) {
          setUsers(items);
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
  }, [currentPage, filterRole, filterStatus, debouncedSearchTerm, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const refetch = () => {
    setRefreshKey((k) => k + 1);
  };

  return {
    users,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    itemsPerPage: ITEMS_PER_PAGE,
    clearFilters,
    loading,
    error,
    totalCount,
    refetch,
  };
}
