import { apiClient } from '@/shared/api/client';
import type { AuthLoginApiResponse, AuthUser } from '../types/auth';

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: AuthUser }> {
    const { data } = await apiClient.post<AuthLoginApiResponse>(`/auth/login`, {
      email: email.trim(),
      password: password,
    });
    return {
      token: data.access_token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      },
    };
  },
};
