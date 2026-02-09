import { Menu, X, Droplet } from 'lucide-react';
import { cn } from '@/shared/ui/utils/cn';

export interface NavItem {
  label: string;
  value: string;
}

export interface NavbarProps {
  onMenuClick?: () => void;
  menuOpen?: boolean;
  isAdmin?: boolean;
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
  currentPage?: string;
  /** Role do usuário (Admin, Staff); usado para mostrar 'Usuários' só para Admin. */
  userRole?: string;
}

const publicNavItems: NavItem[] = [
  { label: 'Início', value: 'landing' },
  { label: 'Sobre', value: 'about' },
  { label: 'Quero Doar', value: 'register' },
  { label: 'Login', value: 'login' },
];

function getAdminNavItems(userRole?: string): NavItem[] {
  const base: NavItem[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Doadores', value: 'donors-list' },
  ];
  if (userRole === 'Admin') {
    base.push({ label: 'Equipe', value: 'users' });
  }
  base.push({ label: 'Sair', value: 'landing' });
  return base;
}

export function Navbar({
  onMenuClick,
  menuOpen = false,
  isAdmin = false,
  onNavigate,
  onLogoClick,
  currentPage,
  userRole,
}: NavbarProps) {
  const navItems = isAdmin ? getAdminNavItems(userRole) : publicNavItems;
  const handleLogoClick = onLogoClick ?? (() => onNavigate?.('landing'));

  return (
    <nav
      className="bg-card border-b border-border sticky top-0 z-40 shadow-sm"
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label={isAdmin ? 'Ir para o painel' : 'Ir para início'}
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Droplet
                className="w-6 h-6 text-primary-foreground fill-primary-foreground"
                aria-hidden
              />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Doe Vida
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6" role="menubar">
            {navItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onNavigate?.(item.value)}
                role="menuitem"
                className={cn(
                  'transition-colors',
                  currentPage === item.value
                    ? 'text-primary font-semibold'
                    : 'text-foreground hover:text-primary',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-6 h-6" aria-hidden />
            ) : (
              <Menu className="w-6 h-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card" role="menu">
          <div className="px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onNavigate?.(item.value);
                  onMenuClick?.();
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                  currentPage === item.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
