import { Users } from 'lucide-react';
import { Card } from '@/shared/ui/atoms/Card';
import { PageLayout } from '@/shared/ui/templates/PageLayout';

export function UsersPlaceholderPage() {
  return (
    <PageLayout maxWidth="lg" className="py-8">
      <div className="max-w-xl mx-auto text-center">
        <Card padding="lg">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" aria-hidden />
          <h1 className="text-xl font-bold mb-2">Usuários do sistema</h1>
          <p className="text-muted-foreground">
            Gestão de funcionários e administradores em breve. Aqui você poderá listar, criar e
            desativar usuários.
          </p>
        </Card>
      </div>
    </PageLayout>
  );
}
