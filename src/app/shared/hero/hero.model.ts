import { HeroCardData } from '../hero-card/hero-card.model';

export interface HeroTitlePart {
  text: string;
  accent?: boolean;
}

export interface HeroAction {
  label: string;
  route: string;
  fragment?: string;
  variant: 'primary' | 'ghost';
}

export interface HeroData {
  eyebrow: string;
  titleParts: HeroTitlePart[];
  lead: string;
  actions: HeroAction[];
  note?: string;
  trust: string[];
  card: HeroCardData;
}
