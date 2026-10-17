import { Component, input } from '@angular/core';
import { FaqItem } from './faq.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styles: [':host { display: contents; }'],
})
export class Faq {
  readonly items = input.required<FaqItem[]>();
}
