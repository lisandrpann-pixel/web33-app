import { Component, input } from '@angular/core';
import { Testimonial } from './quote.model';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.html',
  styles: [':host { display: contents; }'],
})
export class Quote {
  readonly quote = input.required<Testimonial>();
}
