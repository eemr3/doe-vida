import { Filter, Eye, Edit, Download, UserPlus } from 'lucide-react';
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
import { useDonors } from '../hooks';

const BLOOD_TYPE_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const ELIGIBILITY_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'eligible', label: 'Elegíveis' },
  { value: 'ineligible', label: 'Não elegíveis' },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Nunca';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

export function DonorsListPage() {
  const navigate = useNavigate();
  const {
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
    cities,
    clearFilters,
    loading,
    error,
    totalCount,
  } = useDonors();

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Tipo Sanguíneo',
      'Cidade',
      'Última Doação',
      'Elegível',
    ];
    const rows = donors.map((d) => [
      d.name,
      d.email,
      d.phone,
      d.bloodType,
      d.city,
      formatDate(d.lastDonation),
      d.eligible ? 'Sim' : 'Não',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'doadores.csv';
    link.click();
  };

  const newThisMonth = donors.filter((d) => {
    if (!d.registrationDate) return false;
    const reg = new Date(d.registrationDate);
    if (Number.isNaN(reg.getTime())) return false;
    const now = new Date();
    return reg.getMonth() === now.getMonth() && reg.getFullYear() === now.getFullYear();
  }).length;

  if (loading && donors.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto text-center py-12 text-muted-foreground">
          Carregando doadores...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto flex items-center justify-center py-12">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erro ao carregar doadores</h2>
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
            <h1 className="text-3xl font-bold mb-2">Lista de Doadores</h1>
            <p className="text-muted-foreground">
              {searchTerm.trim()
                ? `${totalCount} doador(es) encontrado(s)`
                : `${totalCount} doador(es) no total`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4" aria-hidden />
              Exportar
            </Button>
            <Button onClick={() => navigate('/register')}>
              <UserPlus className="w-4 h-4" aria-hidden />
              Novo Doador
            </Button>
          </div>
        </div>

        <Card padding="md">
          <div className="space-y-4">
            <SearchInput
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectField
                options={cities}
                value={filterCity}
                onChange={(e) => {
                  setFilterCity(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <SelectField
                options={BLOOD_TYPE_OPTIONS}
                value={filterBloodType}
                onChange={(e) => {
                  setFilterBloodType(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <SelectField
                options={ELIGIBILITY_OPTIONS}
                value={filterEligibility}
                onChange={(e) => {
                  setFilterEligibility(e.target.value as 'eligible' | 'ineligible' | '');
                  setCurrentPage(1);
                }}
              />
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <Filter className="w-4 h-4" aria-hidden />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        {paginatedDonors.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground">Nenhum doador encontrado</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo Sanguíneo</TableHead>
                    <TableHead className="hidden md:table-cell">Cidade</TableHead>
                    <TableHead className="hidden lg:table-cell">Última Doação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {donor.bloodType} • {donor.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{donor.city}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(donor.lastDonation)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={donor.eligible ? 'success' : 'warning'}>
                          {donor.eligible ? 'Elegível' : 'Aguardando'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/donors/${donor.id}`)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title="Visualizar"
                            aria-label={`Ver detalhes de ${donor.name}`}
                          >
                            <Eye className="w-4 h-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title="Editar"
                            aria-label={`Editar ${donor.name}`}
                          >
                            <Edit className="w-4 h-4" aria-hidden />
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Total de Doadores</div>
          <div className="text-2xl font-bold text-[primry)]">{totalCount}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Elegíveis</div>
          <div className="text-2xl font-bold text-[succss)]">
            {donors.filter((d) => d.eligible).length}
          </div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Aguardando</div>
          <div className="text-2xl font-bold text-[warnng)]">
            {donors.filter((d) => !d.eligible).length}
          </div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-muted-foreground mb-1">Novos este mês</div>
          <div className="text-2xl font-bold text-info">{newThisMonth}</div>
        </Card>
      </div>
    </PageLayout>
  );
}
