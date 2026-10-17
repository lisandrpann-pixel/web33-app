import { Component, input } from '@angular/core';
import { Testimonial } from './quote.model';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.html',
  styleUrl: './quote.scss',
})
export class Quote {
  readonly quote = input.required<Testimonial>();
}
