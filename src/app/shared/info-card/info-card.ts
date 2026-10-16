import { Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export interface InfoCardData {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.html',
  styles: [':host { display: contents; }'],
  imports: [Icon],
})
export class InfoCard {
  readonly card = input.required<InfoCardData>();
}
