/** Resposta do POST /api/auth/login */
export interface AuthLoginApiResponse {
  token: string;
  expiresAt: string;
  user: AuthUserApi;
}

export interface AuthUserApi {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
