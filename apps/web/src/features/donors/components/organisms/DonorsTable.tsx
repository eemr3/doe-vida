import { Badge } from '@/shared/ui/atoms/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/atoms/Table';
import { Droplet, Eye } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Donor } from '../../types';
import { useNavigate } from 'react-router-dom';

export interface DonorsTableProps {
  donors: Donor[];
  onViewDonor: (id: string) => void;
  onRegisterDonation: (id: string) => void;
  formatDate: (dateString: string | null) => string;
  emptyState?: ReactNode;
}

export function DonorsTable({
  donors,
  onViewDonor,
  formatDate,
  emptyState,
}: DonorsTableProps) {
  if (donors.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  if (donors.length === 0) {
    return null;
  }

  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Tipo Sanguíneo</TableHead>
            <TableHead className="hidden md:table-cell">Cidade</TableHead>
            <TableHead className="hidden lg:table-cell">Última Doação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-sm text-muted-foreground sm:hidden">
                    {donor.bloodType} • {donor.city}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {donor.bloodType}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{donor.city}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDate(donor.lastDonation ?? null)}
              </TableCell>
              <TableCell>
                <Badge variant={donor.eligible.eligible ? 'success' : 'warning'}>
                  {donor.eligible.eligible ? 'Elegível' : 'Aguardando'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDonor(donor.id)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title="Visualizar"
                    aria-label={`Ver detalhes de ${donor.name}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title="Registrar Doação"
                    aria-label={`Registrar Doação de ${donor.name}`}
                    onClick={() => navigate(`/donors/${donor.id}/register-donation`)}
                  >
                    <Droplet className="w-4 h-4 text-primary" aria-hidden />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
