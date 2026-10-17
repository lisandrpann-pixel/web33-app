import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroCardData } from './hero-card.model';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.html',
  styles: [':host { display: contents; }'],
  imports: [RouterLink],
})
export class HeroCard {
  readonly card = input.required<HeroCardData>();
}
