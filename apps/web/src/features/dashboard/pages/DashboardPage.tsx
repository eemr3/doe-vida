import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Droplet,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import { donorsService } from '@/features/donors/services';
import type { Donor } from '@/features/donors/types';

const CHART_COLORS = [
  '#C41E3A',
  '#DC2626',
  '#EF4444',
  '#F87171',
  '#FCA5A5',
  '#FECACA',
  '#FEE2E2',
  '#FFF1F2',
];
// {
//   "id": "56df0e72-dbf4-4fad-a184-4ec51a47cbad",
//   "name": "Emersaon Moreira",
//   "email": "eemr3@yahoo.com.br",
//   "phone": "61998673265",
//   "dateOfBirth": "1976-07-26T00:00:00.000Z",
//   "city": "Anápolis-GO",
//   "bloodType": 0,
//   "weight": "70.80",
//   "createdAt": "2026-02-18T04:30:56.528Z",
//   "donations": [
//       {
//           "id": "e3fe4c45-ab84-449a-9c41-0ede015a022c",
//           "donorId": "56df0e72-dbf4-4fad-a184-4ec51a47cbad",
//           "dateDonation": "2025-05-15T00:00:00.000Z",
//           "location": "Emocentro de Anápolis - GO"
//       }
//   ]
// }
export function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      donorsService.list({ page: 1, pageSize: 1 }),
      donorsService.list({ page: 1, pageSize: 1, eligible: true }),
      donorsService.list({ page: 1, pageSize: 500 }),
    ])
      .then(([totalRes, eligibleRes, listRes]) => {
        const eligibleCount = eligibleRes.items.filter((d) => d.eligible === true).length;
        if (cancelled) return;
        setTotalCount(totalRes.totalCount);
        setEligibleCount(eligibleCount);
        setDonors(listRes.items);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && donors.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto text-center py-12 text-muted-foreground">
          Carregando dashboard...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erro ao carregar dados</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const now = new Date();
  const newThisMonth = donors.filter((d) => {
    if (!d.registrationDate) return false;
    const reg = new Date(d.registrationDate);
    return reg.getMonth() === now.getMonth() && reg.getFullYear() === now.getFullYear();
  }).length;

  const totalDonations = donors.reduce(
    (sum, d) => sum + (d.donationHistory?.length ?? 0),
    0,
  );

  const upcomingCount = donors.filter((d) => d.nextDonationDate).length;

  const bloodTypeStats = donors.reduce<Record<string, number>>((acc, d) => {
    const t = d.bloodType || '?';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const bloodTypeData = Object.entries(bloodTypeStats).map(([name, value]) => ({
    name,
    value,
  }));

  const cityStats = donors.reduce<Record<string, number>>((acc, d) => {
    const c = d.city || 'Outros';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const cityData = Object.entries(cityStats)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentDonations = donors
    .filter((d) => d.lastDonation)
    .sort((a, b) => {
      const da = a.lastDonation ? new Date(a.lastDonation).getTime() : 0;
      const db = b.lastDonation ? new Date(b.lastDonation).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  const monthlyDonations = [
    { month: 'Set', donations: 0 },
    { month: 'Out', donations: 0 },
    { month: 'Nov', donations: 0 },
    { month: 'Dez', donations: 0 },
    { month: 'Jan', donations: 0 },
    { month: 'Fev', donations: 0 },
  ];

  const firstTimeDonorsCount = donors.filter((d) => !d.lastDonation).length;

  return (
    <>
      {/* Header full-width (como no prototype) */}
      <div className="w-full bg-primary text-primary-foreground px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-white/90">Visão geral do sistema de doação de sangue</p>
        </div>
      </div>

      <PageLayout maxWidth="7xl" className="py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 4 cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="lg" className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total de Doadores</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {totalCount}
                  </h3>
                  {newThisMonth > 0 && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />+{newThisMonth} este mês
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary" aria-hidden />
                </div>
              </div>
            </Card>

            <Card padding="lg" className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total de Doações</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {totalDonations}
                  </h3>
                  <p className="text-xs text-muted-foreground">Registradas no sistema</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Droplet className="w-6 h-6 text-primary" aria-hidden />
                </div>
              </div>
            </Card>

            <Card padding="lg" className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Doadores Elegíveis</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {eligibleCount}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {totalCount > 0
                      ? `${Math.round((eligibleCount / totalCount) * 100)}% do total`
                      : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6 text-success" aria-hidden />
                </div>
              </div>
            </Card>

            <Card padding="lg" className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Próximas Doações</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {upcomingCount}
                  </h3>
                  <p className="text-xs text-info">Com data prevista</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-info" aria-hidden />
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="font-semibold text-lg mb-6">
                Distribuição de Tipos Sanguíneos
              </h3>
              {bloodTypeData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Sem dados de doadores
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bloodTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }: { name: string; percent: number }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {bloodTypeData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card padding="lg">
              <h3 className="font-semibold text-lg mb-6">Doações nos Últimos 6 Meses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top 5 Cidades + Doações Recentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="font-semibold text-lg mb-6">Top 5 Cidades</h3>
              {cityData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                  Sem dados
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={cityData}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" />
                    <YAxis dataKey="city" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Doações Recentes</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/donors')}>
                  Ver todas
                </Button>
              </div>
              <div className="space-y-4">
                {recentDonations.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Nenhuma doação recente registrada.
                  </p>
                ) : (
                  recentDonations.map((donor) => (
                    <button
                      key={donor.id}
                      type="button"
                      onClick={() => navigate(`/donors/${donor.id}`)}
                      className="flex items-start gap-3 p-3 w-full text-left hover:bg-accent rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Droplet className="w-5 h-5 text-primary" aria-hidden />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{donor.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {donor.bloodType}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {donor.lastDonation
                              ? new Date(donor.lastDonation).toLocaleDateString('pt-BR')
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Alertas e Ações Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card padding="lg" className="border-l-4 border-l-warning bg-warning/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-warning" aria-hidden />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Alerta de Estoque</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tipos AB- e O- estão com estoque baixo
                  </p>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border-l-4 border-l-info bg-info/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-info" aria-hidden />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Campanhas Ativas</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    2 campanhas de doação em andamento
                  </p>
                  <Button variant="outline" size="sm">
                    Gerenciar
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border-l-4 border-l-success bg-success/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-success" aria-hidden />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Novos Cadastros</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {firstTimeDonorsCount} doador(es) aguardando primeira doação
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/donors')}>
                    Ver lista
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Ações principais */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate('/donors')}>
              <Users className="w-4 h-4" aria-hidden />
              Ver Todos os Doadores
            </Button>
            <Button variant="outline" onClick={() => navigate('/users')}>
              <Activity className="w-4 h-4" aria-hidden />
              Gerenciar Equipe
            </Button>
            <Button variant="outline" onClick={() => navigate('/register')}>
              <Droplet className="w-4 h-4" aria-hidden />
              Cadastrar Doador
            </Button>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
