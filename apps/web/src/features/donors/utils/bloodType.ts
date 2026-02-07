/** API enum: APositive=0, ANegative=1, BPositive=2, BNegative=3, ABPositive=4, ABNegative=5, OPositive=6, ONegative=7 */
export const BLOOD_TYPE_TO_API: Record<string, number> = {
  'A+': 0,
  'A-': 1,
  'B+': 2,
  'B-': 3,
  'AB+': 4,
  'AB-': 5,
  'O+': 6,
  'O-': 7,
};

const API_TO_BLOOD_TYPE: Record<number, string> = {
  0: 'A+',
  1: 'A-',
  2: 'B+',
  3: 'B-',
  4: 'AB+',
  5: 'AB-',
  6: 'O+',
  7: 'O-',
};

export function bloodTypeToApi(value: string): number {
  const n = BLOOD_TYPE_TO_API[value];
  if (n === undefined) throw new Error(`Tipo sanguíneo inválido: ${value}`);
  return n;
}

export function bloodTypeFromApi(value: number): string {
  const s = API_TO_BLOOD_TYPE[value];
  if (!s) return '?';
  return s;
}