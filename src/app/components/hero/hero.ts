import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroCard } from '../hero-card/hero-card';
import { Icon } from '../icon/icon';
import { HeroData } from './hero.model';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  imports: [RouterLink, Icon, HeroCard],
})
export class Hero {
  readonly hero = input.required<HeroData>();
}
