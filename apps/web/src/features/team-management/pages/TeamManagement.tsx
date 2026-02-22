import { useState } from 'react';
import {
  UserPlus,
  Filter,
  Eye,
  Lock,
  Unlock,
  Users,
  UserCheck,
  UserX,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { Badge } from '@/shared/ui/atoms/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/ui/atoms/Table';
import { SelectField } from '@/shared/ui/molecules/SelectField';
import { Pagination } from '@/shared/ui/molecules/Pagination';
import { SearchInput } from '@/shared/ui/molecules/SearchInput';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import { useUsers } from '../hooks';
import { usersService } from '../services';
import { UserDetailsModal } from '../components/UserDetailsModal';
import type { UserListItem } from '../types';

const ROLE_OPTIONS = [
  { value: '', label: 'Todos os cargos' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'STAFF', label: 'Equipe' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'true', label: 'Ativos' },
  { value: 'false', label: 'Inativos' },
];

function formatDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function TeamManagement() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const {
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
    clearFilters,
    loading,
    error,
    totalCount,
    refetch,
  } = useUsers();

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  const handleToggleActive = async (user: UserListItem) => {
    setTogglingId(user.id);
    try {
      await usersService.setActive(user.id, !user.isActive);
      refetch();
    } finally {
      setTogglingId(null);
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto text-center py-12 text-muted-foreground">
          Carregando usuários...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto flex items-center justify-center py-12">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erro ao carregar usuários</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button variant="outline" onClick={clearFilters}>
              Tentar novamente
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      {/* Banner full-width (fora do PageLayout para ocupar toda a largura) */}
      <div className="w-full bg-primary text-primary-foreground px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto px-10">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-2 opacity-90 hover:opacity-100"
          >
            <span className="text-lg">←</span>
            Voltar
          </button>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-[1rem] opacity-90 mt-1">
            Gerencie os usuários da equipe e suas permissões
          </p>
        </div>
      </div>

      <PageLayout className="mt-[-60px]">
        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card padding="md">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="w-8 h-8 text-primary]" aria-hidden />
              </div>
              <div className="text-2xl font-bold text-primary]">{totalCount}</div>
              Total
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
                <UserCheck className="w-8 h-8 text-success" aria-hidden />
              </div>
              <div className="text-2xl font-bold text-success">{activeCount}</div>
              Ativos
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-1">
                <UserX className="w-8 h-8 text-warning" aria-hidden />
              </div>
              <div className="text-2xl font-bold text-warning">{inactiveCount}</div>
              Inativos
            </div>
          </Card>
          <Card padding="md">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-1">
                <Shield className="w-8 h-8 text-info" aria-hidden />
              </div>
              <div className="text-2xl font-bold text-info">{adminCount}</div>
              Admins
            </div>
          </Card>
        </div>

        {/* Busca e filtros */}
        <Card padding="md" className="mb-4">
          <div className="space-y-4">
            <SearchInput
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectField
                options={ROLE_OPTIONS}
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <SelectField
                options={STATUS_OPTIONS}
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:col-span-2 lg:col-span-1"
              >
                <Filter className="w-4 h-4" aria-hidden />
                Limpar filtros
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {users.length} de {totalCount} usuários
          </p>
          <Button onClick={() => navigate('/usres/new')} size="sm">
            <UserPlus className="w-4 h-4" aria-hidden />
            Novo usuário
          </Button>
        </div>

        <Card padding="none">
          {users.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpar filtros
              </Button>
              <Button className="mt-4 ml-2" onClick={() => navigate('/users/new')}>
                <UserPlus className="w-4 h-4" aria-hidden />
                Cadastrar usuário
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="hidden sm:table-cell">Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="default"
                            className={
                              user.role === 'ADMIN'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {user.role === 'ADMIN' ? 'Administrador' : 'Equipe'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'success' : 'warning'}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedUser(user)}
                              className="p-2 rounded-lg hover:bg-accent transition-colors"
                              title="Ver dados"
                              aria-label={`Ver detalhes de ${user.name}`}
                            >
                              <Eye className="w-4 h-4" aria-hidden />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(user)}
                              disabled={togglingId === user.id}
                              className="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                              title={user.isActive ? 'Desativar' : 'Ativar'}
                              aria-label={
                                user.isActive
                                  ? `Desativar ${user.name}`
                                  : `Ativar ${user.name}`
                              }
                            >
                              {user.isActive ? (
                                <Lock className="w-4 h-4 text-primary" aria-hidden />
                              ) : (
                                <Unlock className="w-4 h-4 text-success" aria-hidden />
                              )}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="border-t border-border p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card>

        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            formatDate={formatDate}
          />
        )}
      </PageLayout>
    </>
  );
}
