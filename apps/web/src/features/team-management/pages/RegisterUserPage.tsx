import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { FormField } from '@/shared/ui/molecules/FormField';
import { SelectField } from '@/shared/ui/molecules/SelectField';
import { Alert } from '@/shared/ui/molecules/Alert';
import { PageLayout } from '@/shared/ui/templates/PageLayout';
import type { UserFormData, UserRole } from '../types';
import { usersService } from '../services';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'STAFF', label: 'Equipe' },
  { value: 'ADMIN', label: 'Administrador' },
];

const initialFormData: UserFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'STAFF',
};

/** Validação de senha: mínimo 6 caracteres, ao menos uma maiúscula, uma minúscula e um número. */
function validatePassword(password: string): string | null {
  if (password.length < 6) return 'A senha deve ter no mínimo 6 caracteres.';
  if (!/[A-Z]/.test(password)) return 'A senha deve conter ao menos uma letra maiúscula.';
  if (!/[a-z]/.test(password)) return 'A senha deve conter ao menos uma letra minúscula.';
  if (!/\d/.test(password)) return 'A senha deve conter ao menos um número.';
  return null;
}

export function RegisterUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido.';
    }
    const pwdError = validatePassword(formData.password);
    if (pwdError) newErrors.password = pwdError;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      await usersService.register(formData);
      setSubmitted(true);
      setFormData(initialFormData);
      setTimeout(() => {
        setSubmitted(false);
        navigate('/team-management');
      }, 1500);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Não foi possível cadastrar o usuário. Tente novamente.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <PageLayout maxWidth="sm" className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/team-management')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            aria-label="Voltar para lista de usuários"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden />
            Voltar
          </button>
          <h1 className="text-3xl font-bold mb-2">Cadastro de usuário</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar um novo usuário (equipe ou administrador).
          </p>
        </div>

        {submitted && (
          <Alert
            variant="success"
            title="Usuário cadastrado com sucesso!"
            message="Redirecionando para a lista de usuários."
            className="mb-6"
          />
        )}

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Dados do usuário
              </h3>
              <div className="space-y-4">
                <FormField
                  label="Nome completo *"
                  placeholder="Nome do usuário"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  success={!errors.name && formData.name.length > 0}
                />
                <FormField
                  label="E-mail *"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  success={!errors.email && formData.email.length > 0}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Senha *"
                    type="password"
                    placeholder="Mín. 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={errors.password}
                    success={!errors.password && formData.password.length >= 6}
                  />
                  <FormField
                    label="Confirmar senha *"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    success={
                      !errors.confirmPassword &&
                      formData.confirmPassword.length > 0 &&
                      formData.password === formData.confirmPassword
                    }
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Perfil *"
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value as UserRole)}
                    error={errors.role}
                  />
                  {/* <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Usuário ativo</span>
                    </label>
                  </div> */}
                </div>
              </div>
            </div>

            <Alert
              variant="info"
              message="A senha deve ter no mínimo 6 caracteres, com letra maiúscula, minúscula e número."
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/users')}
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
                {loading ? 'Cadastrando...' : 'Cadastrar usuário'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
