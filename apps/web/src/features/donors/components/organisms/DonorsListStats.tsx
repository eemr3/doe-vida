import { Card } from '@/shared/ui/atoms/Card';

export interface DonorsListStatsProps {
  totalCount: number;
  eligibleCount: number;
  ineligibleCount: number;
  newThisMonthCount: number;
}

export function DonorsListStats({
  totalCount,
  eligibleCount,
  ineligibleCount,
  newThisMonthCount,
}: DonorsListStatsProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Total de Doadores</div>
        <div className="text-2xl font-bold text-primary">{totalCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Elegíveis</div>
        <div className="text-2xl font-bold text-success">{eligibleCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Aguardando</div>
        <div className="text-2xl font-bold text-warning">{ineligibleCount}</div>
      </Card>
      <Card padding="md">
        <div className="text-sm text-muted-foreground mb-1">Novos este mês</div>
        <div className="text-2xl font-bold text-info">{newThisMonthCount}</div>
      </Card>
    </div>
  );
}
