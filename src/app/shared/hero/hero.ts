import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroCard } from '../hero-card/hero-card';
import { Icon } from '../icon/icon';
import { HeroData } from './hero.model';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
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
