import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { FormField } from '@/shared/ui/molecules/FormField';
import { SelectField } from '@/shared/ui/molecules/SelectField';
import { Alert } from '@/shared/ui/molecules/Alert';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import type { DonorFormData } from '../types';
import { donorsService } from '../services';
import axios from 'axios';

const BLOOD_TYPE_OPTIONS = [
  { value: '', label: 'Selecione seu tipo sanguíneo' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
];

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

export interface RegisterDonorPageProps {
  onRegister?: (data: DonorFormData) => void;
}

const initialFormData: DonorFormData = {
  name: '',
  email: '',
  phone: '',
  bloodType: '',
  birthDate: '',
  gender: 'male',
  weight: '',
  city: '',
  lastDonationDate: '',
  lastDonationLocation: '',
};

export function RegisterDonorPage({ onRegister }: RegisterDonorPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DonorFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof DonorFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DonorFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999';
    }
    if (!formData.bloodType) newErrors.bloodType = 'Tipo sanguíneo é obrigatório';
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else {
      const age = calculateAge(formData.birthDate);
      if (age < 16 || age > 69) {
        newErrors.birthDate = 'Idade deve estar entre 16 e 69 anos';
      }
    }
    if (!formData.weight) {
      newErrors.weight = 'Peso é obrigatório';
    } else if (parseFloat(formData.weight) < 50) {
      newErrors.weight = 'Peso mínimo: 50kg';
    }
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      await donorsService.register(formData);
      onRegister?.(formData);
      setSubmitted(true);
      setFormData(initialFormData);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Não foi possível cadastrar. Tente novamente.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof DonorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
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
              <h3 className="text-lg font-semibold mb-4 text-primary">Dados Pessoais</h3>
              <div className="space-y-4">
                <FormField
                  label="Nome Completo *"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  success={!errors.name && formData.name.length > 0}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Email *"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    success={!errors.email && formData.email.length > 0}
                  />
                  <FormField
                    label="Telefone *"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    success={!errors.phone && formData.phone.length > 0}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Data de Nascimento *"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    error={errors.birthDate}
                    success={!errors.birthDate && formData.birthDate.length > 0}
                    max={maxDate}
                  />
                  <SelectField
                    label="Sexo *"
                    options={GENDER_OPTIONS}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    error={errors.gender}
                  />
                </div>
                <FormField
                  label="Cidade *"
                  placeholder="Sua cidade"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  error={errors.city}
                  success={!errors.city && formData.city.length > 0}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Informações Médicas
              </h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Tipo Sanguíneo *"
                    options={BLOOD_TYPE_OPTIONS}
                    value={formData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                    error={errors.bloodType}
                  />
                  <FormField
                    label="Peso (kg) *"
                    type="number"
                    placeholder="Ex: 70"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    error={errors.weight}
                    success={!errors.weight && formData.weight.length > 0}
                    min={0}
                    step="0.1"
                  />
                </div>
                <FormField
                  label="Data da Última Doação (opcional)"
                  type="date"
                  value={formData.lastDonationDate ?? ''}
                  onChange={(e) => handleChange('lastDonationDate', e.target.value)}
                  max={maxDate}
                />
                <FormField
                  label="Local da Última Doação (opcional)"
                  placeholder="Ex: Hemocentro São Paulo"
                  value={formData.lastDonationLocation}
                  onChange={(e) => handleChange('lastDonationLocation', e.target.value)}
                />
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

        <div className="mt-8 bg-accent/50 rounded-lg p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" aria-hidden />
            Requisitos importantes
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              Ter entre 16 e 69 anos (menores de 18 precisam de autorização dos
              responsáveis)
            </li>
            <li>Pesar no mínimo 50kg</li>
            <li>Estar em boas condições de saúde</li>
            <li>Ter dormido pelo menos 6 horas nas últimas 24 horas</li>
            <li>
              Estar alimentado (evitar alimentos gordurosos nas 3 horas que antecedem a
              doação)
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
