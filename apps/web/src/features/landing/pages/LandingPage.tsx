import {
  Heart,
  Users,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Droplet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { ImageWithFallback } from '@/shared/ui/atoms/ImageWithFallback';

const REQUIREMENTS = [
  { icon: Calendar, text: 'Ter entre 16 e 69 anos' },
  { icon: Activity, text: 'Pesar mais de 50kg' },
  { icon: Heart, text: 'Estar em boas condições de saúde' },
  { icon: Droplet, text: 'Estar descansado e bem alimentado' },
];

const STATS = [
  { value: '1.000+', label: 'Doadores Cadastrados' },
  { value: '3.500+', label: 'Doações Realizadas' },
  { value: '10.000+', label: 'Vidas Impactadas' },
];

const BLOOD_TYPES = [
  { type: 'A+', percentage: '34%' },
  { type: 'A-', percentage: '6%' },
  { type: 'B+', percentage: '9%' },
  { type: 'B-', percentage: '2%' },
  { type: 'AB+', percentage: '3%' },
  { type: 'AB-', percentage: '1%' },
  { type: 'O+', percentage: '38%' },
  { type: 'O-', percentage: '7%' },
];

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1615461066159-fea0960485d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwbWVkaWNhbCUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzcwNDAyMTc4fDA&ixlib=rb-4.1.0&q=80&w=1080';

export function LandingPage() {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    document
      .getElementById('about')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-[var(--primary)] to-[#8B0A1F] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Doe Sangue,
                <br />
                <span className="text-red-100">Salve Vidas</span>
              </h1>
              <p className="text-xl text-red-50">
                Uma única doação pode salvar até 4 vidas. Junte-se a nós e faça
                parte dessa corrente do bem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white !text-[var(--primary)] hover:bg-red-50"
                  onClick={() => navigate('/register')}
                >
                  <Heart className="w-5 h-5" aria-hidden />
                  Quero ser doador
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={scrollToAbout}
                >
                  Saiba mais
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src={HERO_IMAGE_URL}
                alt="Doação de sangue"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Por que doar sangue?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A doação de sangue é um ato de solidariedade que pode salvar
              vidas. Conheça os benefícios e requisitos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card padding="lg" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-[var(--primary)]" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Salve vidas</h3>
                  <p className="text-muted-foreground">
                    Cada doação pode ajudar até 4 pessoas. Pacientes com câncer,
                    acidentes graves e cirurgias complexas dependem de doações
                    regulares.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-[var(--primary)]" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Checkup gratuito</h3>
                  <p className="text-muted-foreground">
                    Antes de cada doação, você passa por uma triagem completa e
                    exames que verificam sua saúde geral.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[var(--primary)]" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Comunidade solidária
                  </h3>
                  <p className="text-muted-foreground">
                    Junte-se a milhares de doadores que fazem a diferença todos
                    os dias. Seja parte dessa corrente do bem.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[var(--primary)]" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Processo rápido</h3>
                  <p className="text-muted-foreground">
                    A doação leva cerca de 10 minutos. O processo completo,
                    incluindo cadastro e lanche, dura cerca de 40 minutos.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Requisitos para doação
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {REQUIREMENTS.map((req, index) => {
                const Icon = req.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" aria-hidden />
                    </div>
                    <p className="font-medium">{req.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" onClick={() => navigate('/register')}>
                Cadastre-se agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tipos Sanguíneos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Distribuição dos tipos sanguíneos na população brasileira
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
            {BLOOD_TYPES.map((blood) => (
              <Card key={blood.type} padding="md" className="text-center">
                <div className="text-2xl font-bold text-[var(--primary)] mb-1">
                  {blood.type}
                </div>
                <div className="text-sm text-muted-foreground">
                  {blood.percentage}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[#8B0A1F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-xl text-red-50 mb-8">
            Cadastre-se agora e comece sua jornada como doador de sangue
          </p>
          <Button
            size="lg"
            variant="ghost"
            className="!bg-white !text-[var(--primary)] hover:!bg-red-50"
            onClick={() => navigate('/register')}
          >
            <Droplet className="w-5 h-5 shrink-0" aria-hidden />
            Quero ser doador
          </Button>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-white fill-white" aria-hidden />
                </div>
                <span className="text-xl font-bold">Doe Vida</span>
              </div>
              <p className="text-background/70">
                Salvando vidas através da doação de sangue
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-background/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" aria-hidden />
                  <span>(11) 3000-0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" aria-hidden />
                  <span>contato@doevida.org.br</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" aria-hidden />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="block text-background/70 hover:text-background transition-colors text-left"
                >
                  Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="block text-background/70 hover:text-background transition-colors text-left"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2026 Doe Vida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
