import { apiClient } from '@/shared/api/client';
import type {
  UserListItem,
  GetUsersApiResponse,
  RegisterUserApiRequest,
  RegisterUserApiResponse,
  UserFormData,
  UserRole,
} from '../types';

const ROLE_TO_API: Record<UserRole, string> = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
};

const API_TO_ROLE: Record<string, UserRole> = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
};

function mapRoleFromApi(value: string): UserRole {
  return API_TO_ROLE[value] ?? 'STAFF';
}

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
  sortDirection?: string;
}

export const usersService = {
  async list(params: ListUsersParams = {}): Promise<{
    items: UserListItem[];
    totalCount: number;
  }> {
    const { data } = await apiClient.get<GetUsersApiResponse>('/users', {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        search: params.search?.trim() || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
        sort: params.sort || undefined,
        sortDirection: params.sortDirection || undefined,
      },
    });

    const items = (data.items ?? []).map((item: UserListItem) => ({
      id: item.id as string,
      name: item.name as string,
      email: item.email as string,
      role: mapRoleFromApi(item.role ?? 1),
      isActive: Boolean(item.isActive),
      createdAt: item.createdAt as string,
    }));

    return {
      items,
      totalCount: data.totalCount ?? 0,
    };
  },

  async register(formData: UserFormData): Promise<{ id: string }> {
    const body: RegisterUserApiRequest = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: ROLE_TO_API[formData.role],
    };

    const { data } = await apiClient.post<RegisterUserApiResponse>('/users', body);
    return { id: data.id };
  },

  async setActive(userId: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`/users/${userId}/active`, { isActive });
  },
};
