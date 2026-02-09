import { UserPlus, Filter } from 'lucide-react';
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

const ROLE_OPTIONS = [
  { value: '', label: 'Todos os perfis' },
  { value: 'Admin', label: 'Administrador' },
  { value: 'Staff', label: 'Equipe' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
];

function formatDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function UsersListPage() {
  const navigate = useNavigate();
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
  } = useUsers();

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
    <PageLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Usuários do sistema</h1>
            <p className="text-muted-foreground">
              {searchTerm.trim()
                ? `${totalCount} usuário(s) encontrado(s)`
                : `${totalCount} usuário(s) no total`}
            </p>
          </div>
          <Button onClick={() => navigate('/users/new')}>
            <UserPlus className="w-4 h-4" aria-hidden />
            Novo usuário
          </Button>
        </div>

        <Card padding="md">
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
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={
                            user.role === 'Admin'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted-foreground/20 text-foreground'
                          }
                        >
                          {user.role === 'Admin' ? 'Administrador' : 'Equipe'}
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Total de usuários</div>
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Ativos</div>
          <div className="text-2xl font-bold text-[var(--success)]">
            {users.filter((u) => u.isActive).length}
          </div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Inativos</div>
          <div className="text-2xl font-bold text-[var(--warning)]">
            {users.filter((u) => !u.isActive).length}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
