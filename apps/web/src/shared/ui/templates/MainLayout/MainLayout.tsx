import type { ReactNode } from 'react';
import { Navbar } from '@/shared/ui/organisms/Navbar';
import { ToastContainer } from '@/shared/ui/molecules/Alert';
import type { ToastProps } from '@/shared/ui/molecules/Alert';

export interface MainLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  navbarMenuOpen?: boolean;
  onNavbarMenuClick?: () => void;
  isAdmin?: boolean;
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
  currentPage?: string;
  userRole?: string;
  toasts?: ToastProps[];
  onRemoveToast?: (id: string) => void;
}

export function MainLayout({
  children,
  showNavbar = true,
  navbarMenuOpen = false,
  onNavbarMenuClick,
  isAdmin = false,
  onNavigate,
  onLogoClick,
  currentPage,
  userRole,
  toasts = [],
  onRemoveToast,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && (
        <Navbar
          onMenuClick={onNavbarMenuClick}
          menuOpen={navbarMenuOpen}
          isAdmin={isAdmin}
          onNavigate={onNavigate}
          onLogoClick={onLogoClick}
          currentPage={currentPage}
          userRole={userRole}
        />
      )}
      <main>{children}</main>
      {onRemoveToast != null && toasts.length > 0 && (
        <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
      )}
    </div>
  );
}
