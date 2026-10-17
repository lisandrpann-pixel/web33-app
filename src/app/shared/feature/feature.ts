import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { FeatureItem } from './feature.model';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
  imports: [Icon],
})
export class Feature {
  readonly feature = input.required<FeatureItem>();
}
