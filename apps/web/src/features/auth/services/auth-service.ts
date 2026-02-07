import { apiClient } from '@/shared/api/client';
import type { AuthLoginApiResponse, AuthUser } from '../types/auth';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const { data } = await apiClient.post<AuthLoginApiResponse>('/api/auth/login', {
      email: email.trim(),
      password: password,
    });
    return {
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      },
    };
  },
};
