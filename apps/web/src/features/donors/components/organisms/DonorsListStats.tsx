import { Card } from '@/shared/ui/atoms/Card';
import { DonorStatsDto } from '../../types/donor';

export interface DonorsListStatsProps {
  stats: DonorStatsDto;
}

export function DonorsListStats({ stats }: DonorsListStatsProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Total de Doadores</div>
        <div className="text-2xl font-bold text-primary">{stats.totalCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Elegíveis</div>
        <div className="text-2xl font-bold text-success">{stats.eligibleCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Aguardando</div>
        <div className="text-2xl font-bold text-warning">{stats.waitingCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Novos este mês</div>
        <div className="text-2xl font-bold text-info">{stats.newThisMonthCount}</div>
      </Card>
    </div>
  );
}
