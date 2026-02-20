import { Download, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import { Pagination } from '@/shared/ui/molecules/Pagination';
import { DonorsListFilters, DonorsTable, DonorsListStats } from '../components/organisms';
import { useDonors } from '../hooks';

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCityChange = (value: string) => {
    setFilterCity(value);
    setCurrentPage(1);
  };

  const handleBloodTypeChange = (value: string) => {
    setFilterBloodType(value);
    setCurrentPage(1);
  };

  const handleEligibilityChange = (value: string) => {
    setFilterEligibility(value as 'eligible' | 'ineligible' | '');
    setCurrentPage(1);
  };

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

        <DonorsListFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCity={filterCity}
          onCityChange={handleCityChange}
          filterBloodType={filterBloodType}
          onBloodTypeChange={handleBloodTypeChange}
          filterEligibility={filterEligibility}
          onEligibilityChange={handleEligibilityChange}
          cityOptions={cities}
          onClearFilters={clearFilters}
        />
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
            <DonorsTable
              donors={paginatedDonors}
              onViewDonor={(id) => navigate(`/donors/${id}`)}
              onRegisterDonation={(id) => navigate(`/donors/${id}/register-donation`)}
              formatDate={formatDate}
            />
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

      <div className="mt-8">
        <DonorsListStats
          totalCount={totalCount}
          eligibleCount={donors.filter((d) => d.eligible).length}
          ineligibleCount={donors.filter((d) => !d.eligible).length}
          newThisMonthCount={newThisMonth}
        />
      </div>
    </PageLayout>
  );
}
