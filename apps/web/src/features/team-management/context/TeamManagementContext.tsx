import { createContext, useContext } from 'react';
import type { UserListItem } from '../types';

interface TeamManagementContextProps {
  users: UserListItem[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string | '';
  setFilterRole: (role: string | '') => void;
  filterStatus: string | '';
  setFilterStatus: (status: string | '') => void;
  clearFilters: () => void;
  loading: boolean;
  error: Error | null;
  totalCount: number;
  refetch: () => void;
  selectedUser: UserListItem | null;
  setSelectedUser: (user: UserListItem | null) => void;
  togglingId: string | null;
  handleToggleActive: (user: UserListItem) => Promise<void>;
  adminCount: number;
  activeCount: number;
  inactiveCount: number;
}

const TeamManagementContext = createContext<TeamManagementContextProps | null>(null);

export function useTeamManagement() {
  const ctx = useContext(TeamManagementContext);
  if (!ctx) throw new Error('useTeamManagement must be used within TeamManagementLayout');
  return ctx;
}

export { TeamManagementContext };
