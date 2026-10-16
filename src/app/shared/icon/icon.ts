import { Component, input } from '@angular/core';

export type IconName =
  | 'check'
  | 'clock'
  | 'shield'
  | 'laptop'
  | 'chart'
  | 'chat'
  | 'play'
  | 'window'
  | 'bulb'
  | 'graduation'
  | 'code'
  | 'sun'
  | 'moon'
  | 'mail'
  | 'telegram';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(22);
  readonly strokeWidth = input(2);
}
