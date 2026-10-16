import { Component, input } from '@angular/core';

export interface FaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styles: [':host { display: contents; }'],
})
export class Faq {
  readonly items = input.required<FaqItem[]>();
}
