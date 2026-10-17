import { Component, input } from '@angular/core';
import { IconName } from './icon.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(22);
  readonly strokeWidth = input(2);
}
