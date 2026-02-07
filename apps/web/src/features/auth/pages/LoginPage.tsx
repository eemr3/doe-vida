import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Droplet, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { FormField } from '@/shared/ui/molecules/FormField';
import { Alert } from '@/shared/ui/molecules/Alert';
import { AuthLayout } from '@/shared/ui/templates/AuthLayout';

/** Credenciais do usuário admin criado pelo seed da API (appsettings Seed). */
const SEED_ADMIN_EMAIL = 'admin@doevida.local';
const SEED_ADMIN_PASSWORD = 'Admin@123';

export interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onLogin(email, password);
      // Redirecionamento é feito pelo AppRoutes (handleLogin)
    } catch (err) {
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
          ? err.response.data.message
          : err instanceof Error
            ? err.message
            : 'Falha ao entrar. Tente novamente.';
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden />
        Voltar
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
          <Droplet className="w-8 h-8 text-white fill-white" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
        <p className="text-muted-foreground">
          Faça login para acessar o painel administrativo
        </p>
      </div>

      <Card padding="lg">
        {loginError && (
          <Alert
            variant="error"
            message={loginError}
            onClose={() => setLoginError('')}
            className="mb-6"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            success={!errors.email && email.length > 0}
            autoComplete="email"
          />
          <div className="relative">
            <FormField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              success={!errors.password && password.length > 0}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] p-1 rounded hover:bg-accent transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" aria-hidden />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" aria-hidden />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => window.alert('Funcionalidade em desenvolvimento')}
            >
              Esqueci minha senha
            </button>
          </div>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>

      <Card padding="md" className="mt-6 bg-info/10 border-info">
        <div className="text-sm text-center">
          <p className="font-semibold mb-2">Primeiro acesso (seed da API):</p>
          <p className="text-muted-foreground">
            <strong>Email:</strong> {SEED_ADMIN_EMAIL}
            <br />
            <strong>Senha:</strong> {SEED_ADMIN_PASSWORD}
          </p>
        </div>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-primary hover:underline font-medium"
          >
            Cadastre-se como doador
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
