export interface StackChip {
  abbr: string;
  name: string;
  bg: string;
  color?: string;
}

export interface StackGroup {
  title: string;
  items: StackChip[];
}
