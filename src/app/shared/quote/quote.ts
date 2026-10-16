import { Component, input } from '@angular/core';

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  initial: string;
}

@Component({
  selector: 'app-quote',
  templateUrl: './quote.html',
  styles: [':host { display: contents; }'],
})
export class Quote {
  readonly quote = input.required<Testimonial>();
}
