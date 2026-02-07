import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Droplet,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { CardHeader } from '@/shared/ui/molecules/CardHeader';
import { CardContent } from '@/shared/ui/molecules/CardContent';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import { donorsService } from '@/features/donors/services';

export interface DashboardStats {
  totalDonors: number;
  eligibleCount: number;
  newThisMonth: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [recentDonors, setRecentDonors] = useState<{ id: string; name: string; city: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      donorsService.list({ page: 1, pageSize: 1 }),
      donorsService.list({ page: 1, pageSize: 1, eligible: true }),
      donorsService.list({ page: 1, pageSize: 200 }),
      donorsService.list({ page: 1, pageSize: 5 }),
    ])
      .then(([totalRes, eligibleRes, forNewMonthRes, recentRes]) => {
        if (cancelled) return;
        const now = new Date();
        const newThisMonth = forNewMonthRes.items.filter((d) => {
          if (!d.registrationDate) return false;
          const reg = new Date(d.registrationDate);
          return reg.getMonth() === now.getMonth() && reg.getFullYear() === now.getFullYear();
        }).length;
        setStats({
          totalDonors: totalRes.totalCount,
          eligibleCount: eligibleRes.totalCount,
          newThisMonth,
        });
        setRecentDonors(
          recentRes.items.map((d) => ({ id: d.id, name: d.name, city: d.city }))
        );
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

  if (loading && !stats) {
    return (
      <PageLayout maxWidth="lg" className="py-8">
        <div className="max-w-5xl mx-auto text-center py-12 text-muted-foreground">
          Carregando dashboard...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout maxWidth="lg" className="py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
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

  const s = stats ?? { totalDonors: 0, eligibleCount: 0, newThisMonth: 0 };

  const statCards: Array<{
    title: string;
    value: number;
    icon: typeof Users;
    valueClass: string;
    iconBgClass: string;
    iconClass: string;
    description: string;
  }> = [
    {
      title: 'Total de doadores',
      value: s.totalDonors,
      icon: Users,
      valueClass: 'text-primary',
      iconBgClass: 'bg-primary/10',
      iconClass: 'text-primary',
      description: 'Cadastrados no sistema',
    },
    {
      title: 'Elegíveis para doar',
      value: s.eligibleCount,
      icon: UserCheck,
      valueClass: 'text-success',
      iconBgClass: 'bg-success/10',
      iconClass: 'text-success',
      description: 'Podem doar agora',
    },
    {
      title: 'Novos este mês',
      value: s.newThisMonth,
      icon: Calendar,
      valueClass: 'text-info',
      iconBgClass: 'bg-info/10',
      iconClass: 'text-info',
      description: 'Cadastros no mês atual',
    },
  ];

  return (
    <PageLayout maxWidth="lg" className="py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos doadores e ações rápidas.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {statCards.map(({ title, value, icon: Icon, valueClass, iconBgClass, iconClass, description }) => (
            <Card key={title} padding="lg" className="border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{title}</p>
                  <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}
                >
                  <Icon className={`w-6 h-6 ${iconClass}`} aria-hidden />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card padding="lg">
            <CardHeader title="Ações rápidas" />
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-between"
                onClick={() => navigate('/donors')}
              >
                Ver lista de doadores
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="w-4 h-4" aria-hidden />
                Cadastrar novo doador
              </Button>
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader
              title="Alguns doadores"
              subtitle="Primeiros da lista"
            />
            <CardContent>
              {recentDonors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Nenhum doador cadastrado ainda.
                </p>
              ) : (
                <ul className="space-y-2">
                  {recentDonors.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/donors/${d.id}`)}
                        className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Droplet className="w-4 h-4 text-primary" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium block truncate">{d.name}</span>
                          <span className="text-sm text-muted-foreground">{d.city}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => navigate('/donors')}
              >
                Ver todos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
