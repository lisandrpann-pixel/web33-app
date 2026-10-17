import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { InfoCardData } from './info-card.model';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.html',
  styles: [':host { display: contents; }'],
  imports: [Icon],
})
export class InfoCard {
  readonly card = input.required<InfoCardData>();
}
