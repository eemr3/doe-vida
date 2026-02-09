import { Filter } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { SelectField } from '@/shared/ui/molecules/SelectField';
import { SearchInput } from '@/shared/ui/molecules/SearchInput';

export interface SelectOption {
  value: string;
  label: string;
}

const BLOOD_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const ELIGIBILITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Todos' },
  { value: 'eligible', label: 'Elegíveis' },
  { value: 'ineligible', label: 'Não elegíveis' },
];

export interface DonorsListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCity: string;
  onCityChange: (value: string) => void;
  filterBloodType: string;
  onBloodTypeChange: (value: string) => void;
  filterEligibility: string;
  onEligibilityChange: (value: string) => void;
  cityOptions: SelectOption[];
  onClearFilters: () => void;
}

export function DonorsListFilters({
  searchTerm,
  onSearchChange,
  filterCity,
  onCityChange,
  filterBloodType,
  onBloodTypeChange,
  filterEligibility,
  onEligibilityChange,
  cityOptions,
  onClearFilters,
}: DonorsListFiltersProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        <SearchInput
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SelectField
            options={cityOptions}
            value={filterCity}
            onChange={(e) => onCityChange(e.target.value)}
          />
          <SelectField
            options={BLOOD_TYPE_OPTIONS}
            value={filterBloodType}
            onChange={(e) => onBloodTypeChange(e.target.value)}
          />
          <SelectField
            options={ELIGIBILITY_OPTIONS}
            value={filterEligibility}
            onChange={(e) => onEligibilityChange(e.target.value)}
          />
          <Button variant="outline" onClick={onClearFilters} className="w-full">
            <Filter className="w-4 h-4" aria-hidden />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </Card>
  );
}
