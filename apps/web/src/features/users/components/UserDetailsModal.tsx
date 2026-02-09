import { X, Mail, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { Badge } from '@/shared/ui/atoms/Badge';
import type { UserListItem } from '../types';

export interface UserDetailsModalProps {
  user: UserListItem;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

export function UserDetailsModal({ user, onClose, formatDate }: UserDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-details-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <h2 id="user-details-title" className="text-xl font-semibold text-foreground">
            Detalhes do Usuário
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-lg font-bold text-foreground">{user.name}</p>
            <Badge
              variant="default"
              className={
                user.role === 'Admin'
                  ? 'bg-primary text-primary-foreground mt-1'
                  : 'bg-muted text-muted-foreground mt-1'
              }
            >
              {user.role === 'Admin' ? 'Administrador' : 'Equipe'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden />
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={user.isActive ? 'success' : 'warning'}>
                {user.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden />
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
