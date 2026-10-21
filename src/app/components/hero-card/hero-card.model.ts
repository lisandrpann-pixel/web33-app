export interface HeroCardRow {
  label: string;
  value: string;
  badge?: boolean;
}

export interface HeroCardData {
  title?: string;
  note?: string;
  person?: { name: string; role: string };
  rows: HeroCardRow[];
  button: { label: string; route: string; fragment?: string };
  hint: string;
}
