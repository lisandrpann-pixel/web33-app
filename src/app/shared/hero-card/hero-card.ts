import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from '../avatar/avatar';
import { HeroCardData } from './hero-card.model';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.scss',
  imports: [RouterLink, Avatar],
})
export class HeroCard {
  readonly card = input.required<HeroCardData>();
}
