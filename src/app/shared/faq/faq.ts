import { Component, input } from '@angular/core';
import { FaqItem } from './faq.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  readonly items = input.required<FaqItem[]>();
}
