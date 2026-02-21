import { Badge } from '@/shared/ui/atoms/Badge';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { CardContent } from '@/shared/ui/molecules/CardContent';
import { CardHeader } from '@/shared/ui/molecules/CardHeader';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Droplet,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDonorById } from '../hooks';

function formatDateLong(dateString: string | null): string {
  if (!dateString) return 'Não informado';

  const date = new Date(dateString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const localDate = new Date(year, month, day);

  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function DonorDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { donor, loading, error } = useDonorById(id ?? '');

  if (loading) {
    return (
      <PageLayout maxWidth="lg" className="py-8">
        <div className="max-w-5xl mx-auto text-center py-12 text-muted-foreground">
          Carregando...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout maxWidth="lg" className="py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <Card padding="lg" className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erro ao carregar doador</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => navigate('/donors')}>Voltar para lista</Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Doador não encontrado</h2>
          <Button onClick={() => navigate('/donors')}>Voltar para lista</Button>
        </Card>
      </div>
    );
  }

  const getDaysSinceLastDonation = (): number | null => {
    if (!donor.lastDonation) return null;

    const last = new Date(donor.lastDonation);
    const today = new Date();

    const lastUTC = Date.UTC(
      last.getUTCFullYear(),
      last.getUTCMonth(),
      last.getUTCDate(),
    );

    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );

    return Math.floor((todayUTC - lastUTC) / (1000 * 60 * 60 * 24));
  };

  const getEligibilityInfo = () => {
    if (!donor.lastDonation) {
      return {
        title: 'Pronto para doar',
        message: 'Este doador nunca realizou uma doação e está elegível para doar.',
        icon: CheckCircle,
        variant: 'success' as const,
      };
    }
    if (donor.eligible) {
      return {
        title: 'Elegível para doação',
        message: `Tempo de espera já foi cumprido. Próxima doação possível: ${formatDateLong(donor.nextDonationDate)}`,
        icon: CheckCircle,
        variant: 'success' as const,
      };
    }
    const daysSince = getDaysSinceLastDonation();
    const daysRemaining = donor.nextDonationDate
      ? Math.ceil(
          (new Date(donor.nextDonationDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
    return {
      title: 'Aguardando período de intervalo',
      message: `Última doação há ${daysSince} dias. Aguarde até ${formatDateLong(donor.nextDonationDate)} (${daysRemaining} dias restantes)`,
      icon: Clock,
      variant: 'warning' as const,
    };
  };

  const eligibilityInfo = getEligibilityInfo();
  const EligibilityIcon = eligibilityInfo.icon;

  return (
    <PageLayout maxWidth="lg" className="py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/donors')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden />
            Voltar para lista
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{donor.name}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {donor.bloodType}
                </Badge>
                <Badge variant={donor.eligible ? 'success' : 'warning'}>
                  {donor.eligible ? 'Elegível' : 'Aguardando'}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Droplet className="w-4 h-4" aria-hidden />
              Registrar Doação
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <CardHeader title="Dados Pessoais" />
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: 'Email', value: donor.email },
                    { icon: Phone, label: 'Telefone', value: donor.phone },
                    { icon: MapPin, label: 'Cidade', value: donor.city },
                    {
                      icon: Calendar,
                      label: 'Idade',
                      value:
                        donor.age != null
                          ? `${donor.age} anos`
                          : donor.birthDate
                            ? `${calculateAge(donor.birthDate)} anos`
                            : '—',
                    },
                    { icon: Activity, label: 'Peso', value: `${donor.weight} kg` },
                    {
                      icon: Droplet,
                      label: 'Tipo Sanguíneo',
                      value: donor.bloodType,
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="font-medium wrap-break-word">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card padding="lg">
              <CardHeader
                title="Histórico de Doações"
                subtitle={`${donor.donationHistory.length} doação(ões) registrada(s)`}
              />
              <CardContent>
                {donor.donationHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplet className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden />
                    <p>Nenhuma doação registrada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donor.donationHistory.map((donation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                      >
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                          <Droplet
                            className="w-5 h-5 text-primary-foreground fill-primary-foreground"
                            aria-hidden
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{donation.location}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateLong(donation.dateDonation)}
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge variant="info" className="shrink-0">
                            Mais recente
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              padding="lg"
              className={`border-2 ${
                eligibilityInfo.variant === 'success'
                  ? 'border-success'
                  : 'border-warning'
              }`}
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    eligibilityInfo.variant === 'success'
                      ? 'bg-success text-success-foreground'
                      : 'bg-warning text-warning-foreground'
                  }`}
                >
                  <EligibilityIcon className="w-8 h-8" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold mb-2">{eligibilityInfo.title}</h3>
                <p className="text-sm text-muted-foreground">{eligibilityInfo.message}</p>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Estatísticas" />
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Total de doações
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {donor.donationHistory.length}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">
                      Última doação
                    </div>
                    <div className="font-medium">
                      {formatDateLong(donor.lastDonation ?? null)}
                    </div>
                    {donor.lastDonation != null && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Há {getDaysSinceLastDonation()} dias
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">
                      Cadastro realizado
                    </div>
                    <div className="font-medium">
                      {donor.registrationDate
                        ? formatDateLong(donor.registrationDate)
                        : '—'}
                    </div>
                  </div>
                  {donor.nextDonationDate != null && (
                    <div className="pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground mb-1">
                        Próxima doação possível
                      </div>
                      <div className="font-medium">
                        {formatDateLong(donor.nextDonationDate)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card padding="md" className="bg-info/10 border-info">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-info shrink-0 mt-0.5" aria-hidden />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Intervalo entre doações</h4>
                  <p className="text-sm text-muted-foreground">
                    Homens: 60 dias (máx. 4x/ano)
                    <br />
                    Mulheres: 90 dias (máx. 3x/ano)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
