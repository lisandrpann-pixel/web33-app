import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroCardRow {
  label: string;
  value: string;
  badge?: boolean;
}

export interface HeroCardData {
  title?: string;
  note?: string;
  person?: { name: string; role: string; initial: string };
  rows: HeroCardRow[];
  button: { label: string; route: string; fragment?: string };
  hint: string;
}

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class HeroCard {
  readonly card = input.required<HeroCardData>();
}
