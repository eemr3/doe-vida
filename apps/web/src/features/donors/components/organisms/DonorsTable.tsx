import type { ReactNode } from 'react';
import { Eye, Edit } from 'lucide-react';
import { Badge } from '@/shared/ui/atoms/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/ui/atoms/Table';
import type { Donor } from '../../types';

export interface DonorsTableProps {
  donors: Donor[];
  onViewDonor: (id: string) => void;
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
                {formatDate(donor.lastDonation)}
              </TableCell>
              <TableCell>
                <Badge variant={donor.eligible ? 'success' : 'warning'}>
                  {donor.eligible ? 'Elegível' : 'Aguardando'}
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
                    title="Editar"
                    aria-label={`Editar ${donor.name}`}
                  >
                    <Edit className="w-4 h-4" aria-hidden />
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
