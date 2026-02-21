import { ArrowLeft, Droplet } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../shared/ui/atoms/Button';
import { Card } from '../../../shared/ui/atoms/Card';
import { Alert } from '../../../shared/ui/molecules/Alert';
import { FormField } from '../../../shared/ui/molecules/FormField';
import { SelectField } from '../../../shared/ui/molecules/SelectField';
import { PageLayout } from '../../../shared/ui/templates/PageLayout';
import { useDonorById } from '../hooks';
import { donationService } from '../services';

interface DonationFormData {
  donorId: string;
  date: string;
  location: string;
}

const LOCATION_OPTIONS = [
  { value: '', label: 'Selecione o local da doação' },
  { value: 'Hemocentro São Paulo', label: 'Hemocentro São Paulo' },
  { value: 'Hemocentro Rio de Janeiro', label: 'Hemocentro Rio de Janeiro' },
  { value: 'Hemocentro Belo Horizonte', label: 'Hemocentro Belo Horizonte' },
  { value: 'Hemocentro Curitiba', label: 'Hemocentro Curitiba' },
  { value: 'Hemocentro Porto Alegre', label: 'Hemocentro Porto Alegre' },
  { value: 'Hemocentro Brasília', label: 'Hemocentro Brasília' },
  { value: 'Hemocentro Goiânia', label: 'Hemocentro Goiânia' },
  { value: 'Hemocentro São Luís', label: 'Hemocentro São Luís' },
  { value: 'Hemocentro Cuiabá', label: 'Hemocentro Cuiabá' },
  { value: 'Hemocentro Campo Grande', label: 'Hemocentro Campo Grande' },
  { value: 'Hemocentro Caxias do Sul', label: 'Hemocentro Caxias do Sul' },
  { value: 'Hemocentro Recife', label: 'Hemocentro Recife' },
  { value: 'Hemocentro João Pessoa', label: 'Hemocentro João Pessoa' },
  { value: 'Hemocentro Aracaju', label: 'Hemocentro Aracaju' },
  { value: 'Hemocentro Maceió', label: 'Hemocentro Maceió' },
  { value: 'Hemocentro Teresina', label: 'Hemocentro Teresina' },
  { value: 'Hemocentro João Pessoa', label: 'Hemocentro João Pessoa' },
  { value: 'Hemocentro João Pessoa', label: 'Hemocentro João Pessoa' },
];
export function RegisterDonationPage() {
  const { id } = useParams<{ id: string }>();
  const { donor, loading } = useDonorById(id ?? '');
  const [submitted, setSubmitted] = useState(false);

  const displayName = donor?.name ?? '';
  const email = donor?.email ?? '';
  const phone = donor?.phone ?? '';

  const navigate = useNavigate();

  const [formData, setFormData] = useState<DonationFormData>({
    donorId: id ?? '',
    date: '',
    location: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DonationFormData, string>>>(
    {},
  );

  const handleChange = (field: keyof DonationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await donationService.register(formData);
    setSubmitted(true);
    setFormData({
      donorId: id ?? '',
      date: '',
      location: '',
    });
    setTimeout(() => setSubmitted(false), 3000);
    navigate(`/donors`);
  };

  return (
    <>
      <div className="w-full bg-primary text-primary-foreground px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Registrar Doação</h1>
          </div>
          <p className="text-white/90">Registre uma nova doação de sangue</p>
        </div>
      </div>
      <PageLayout maxWidth="sm" className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden />
              Voltar
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Cadastro de Doador</h1>
            <p className="text-muted-foreground">
              Preencha seus dados para se tornar um doador de sangue
            </p>
          </div>

          {submitted && (
            <Alert
              variant="success"
              title="Cadastro realizado com sucesso!"
              message="Seus dados foram registrados. Em breve você receberá mais informações por email."
              className="mb-6"
            />
          )}

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Dados Pessoais
                </h3>
                <div className="space-y-4">
                  <FormField
                    label="Doador *"
                    placeholder="Digite seu nome completo"
                    value={displayName}
                    disabled={true}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      label="Email *"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      disabled={true}
                    />
                    <FormField
                      label="Telefone *"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Informações Médicas
                </h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      label="Data da Doação *"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      error={errors.date}
                      success={!errors.date && formData.date.length > 0}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Tipo Sanguíneo *"
                      options={LOCATION_OPTIONS}
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      error={errors.location}
                    />
                  </div>
                </div>
              </div>

              <Alert
                variant="info"
                message="Os dados fornecidos serão utilizados apenas para fins de cadastro e contato relacionado à doação de sangue."
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 sm:flex-initial"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </PageLayout>
    </>
  );
}
