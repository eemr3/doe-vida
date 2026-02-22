/** Papel do usuário no sistema (espelha enum da API). */
export type UserRole = 'ADMIN' | 'STAFF';

/** Item de usuário na listagem (resposta da API GET /api/users). */
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

/** Resposta paginada da API GET /api/users. */
export interface GetUsersApiResponse {
  items: UserListItem[];
  totalCount: number;
}

/** Payload para cadastro de usuário (POST /api/users). */
export interface RegisterUserApiRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

/** Resposta do cadastro (POST /api/users). */
export interface RegisterUserApiResponse {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: number;
  createdAt: string;
}

/** Dados do formulário de cadastro de usuário (ADMIN). */
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}
