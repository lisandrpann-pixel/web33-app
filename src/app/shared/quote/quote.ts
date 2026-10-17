import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import { Testimonial } from './quote.model';

@Component({
  selector: 'app-quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote.html',
  styleUrl: './quote.scss',
  imports: [Avatar],
})
export class Quote {
  readonly quote = input.required<Testimonial>();
}
