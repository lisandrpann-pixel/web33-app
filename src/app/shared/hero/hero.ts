import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroCard, HeroCardData } from '../hero-card/hero-card';
import { Icon } from '../icon/icon';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink, Icon, HeroCard],
})
export class Hero {
  readonly hero = input.required<HeroData>();

  protected readonly headingHtml = computed(() =>
    this.hero()
      .titleParts.map((part) =>
        part.accent
          ? `<em class="hero__accent">${escapeHtml(part.text)}</em>`
          : escapeHtml(part.text),
      )
      .join(''),
  );
}
