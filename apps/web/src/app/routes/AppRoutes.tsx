import { Navigate, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { MainLayout } from '@/shared/ui/templates/MainLayout';
import { LandingPage } from '@/features/landing/pages';
import { LoginPage } from '@/features/auth/pages';
import {
  RegisterDonorPage,
  DonorsListPage,
  DonorDetailsPage,
  RegisterDonationPage,
} from '@/features/donors/pages';
import { DashboardPage } from '@/features/dashboard/pages';
import { UsersListPage, RegisterUserPage } from '@/features/users/pages';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { setOnUnauthorized } from '@/shared/api/client';
import type { DonorFormData } from '@/features/donors/types';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function pathToNavPage(path: string): string {
  if (path === '/') return 'landing';
  if (path === '/dashboard') return 'dashboard';
  if (path === '/users' || path.startsWith('/users/')) return 'users';
  if (path.startsWith('/donors/') && path !== '/donors') return 'donor-details';
  const map: Record<string, string> = {
    '/register': 'register',
    '/login': 'login',
    '/donors': 'donors-list',
  };
  return map[path] ?? 'landing';
}

export function AppRoutes() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, login, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      navigate('/login', { replace: true });
    });
    return () => setOnUnauthorized(null);
  }, [logout, navigate]);

  const handleLogoClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate]);

  const handleNavigate = useCallback(
    (page: string) => {
      if (page === 'landing' && isAuthenticated) {
        logout();
      }
      const pathMap: Record<string, string> = {
        landing: '/',
        register: '/register',
        login: '/login',
        'donors-list': '/donors',
        dashboard: '/dashboard',
        users: '/users',
      };
      const path = pathMap[page] ?? '/';
      navigate(path);
      setMenuOpen(false);
      window.scrollTo(0, 0);
    },
    [isAuthenticated, logout, navigate],
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login(email, password);
      addToast({
        variant: 'success',
        title: 'Login realizado!',
        message: 'Bem-vindo ao painel administrativo.',
      });
      navigate('/dashboard');
    },
    [login, addToast, navigate],
  );

  const handleRegister = useCallback(
    (data: DonorFormData) => {
      addToast({
        variant: 'success',
        title: 'Cadastro realizado!',
        message: `${data.name} foi cadastrado com sucesso.`,
      });
    },
    [addToast],
  );

  const showNavbar = currentPath !== '/login';
  const currentPage = pathToNavPage(currentPath);

  return (
    <MainLayout
      showNavbar={showNavbar}
      navbarMenuOpen={menuOpen}
      onNavbarMenuClick={() => setMenuOpen(!menuOpen)}
      isAdmin={isAuthenticated}
      onNavigate={handleNavigate}
      onLogoClick={handleLogoClick}
      currentPage={currentPage}
      userRole={user?.role}
      toasts={toasts}
      onRemoveToast={removeToast}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<RegisterDonorPage onRegister={handleRegister} />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/donors"
          element={
            <RequireAuth>
              <DonorsListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/donors/:id"
          element={
            <RequireAuth>
              <DonorDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAdmin>
              <UsersListPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/users/new"
          element={
            <RequireAdmin>
              <RegisterUserPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/donors/:id/register-donation"
          element={
            <RequireAuth>
              <RegisterDonationPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
