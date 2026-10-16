import { Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export interface FeatureItem {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-feature',
  templateUrl: './feature.html',
  styles: [':host { display: contents; }'],
  imports: [Icon],
})
export class Feature {
  readonly feature = input.required<FeatureItem>();
}
